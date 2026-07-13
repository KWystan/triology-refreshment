/**
 * Auth controller — signup, login, OAuth, logout, refresh, me.
 *
 * Security model (following the spec):
 *   - OAuth 2.0 Authorization Code flow with PKCE (never Implicit)
 *   - 1-hour access tokens + rotated refresh tokens persisted to disk
 *   - httpOnly, Secure, SameSite=Strict cookies (Secure omitted in dev)
 *   - bcrypt/argon2 handled by Supabase Auth
 *   - Generic error messages only ("invalid email or password")
 *   - Rate limiting handled separately (helmet or express-rate-limit)
 *   - Email verification required before full account activation
 *
 * ══════════════════════════════════════════════════════════════
 * Refresh tokens are persisted to a JSON file (sessions.json)
 * so they survive server restarts during development. In
 * production, swap this for a database table.
 * ══════════════════════════════════════════════════════════════
 */
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { supabaseAdmin, supabaseAnon } from '../config/supabase.js';
import { env } from '../config/env.js';

/* ─── Constants ─────────────────────────────────────────────── */
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/* ─── Persistent refresh token store (disk-backed) ─────────── */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSIONS_PATH = path.resolve(__dirname, '..', '..', 'sessions.json');

/** @type {Map<string, { userId: string, email: string, expiresAt: number, supersededBy: string|null }>} */
const refreshTokens = new Map();

function loadSessions() {
  try {
    if (fs.existsSync(SESSIONS_PATH)) {
      const raw = fs.readFileSync(SESSIONS_PATH, 'utf-8');
      const data = JSON.parse(raw);
      const now = Date.now();
      for (const [key, val] of Object.entries(data)) {
        if (val.expiresAt > now) {
          refreshTokens.set(key, val);
        }
      }
    }
  } catch {
    // Corrupted file — start fresh
  }
}

function saveSessions() {
  try {
    const obj = Object.fromEntries(refreshTokens.entries());
    fs.writeFileSync(SESSIONS_PATH, JSON.stringify(obj, null, 2), 'utf-8');
  } catch {
    // Non-critical — next boot loads stale data if write fails
  }
}

// Load existing sessions on boot
loadSessions();

/* ─── Cookie helpers ────────────────────────────────────────── */

/** Cookie options for access token (1 hour, Path=/) */
function accessCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 1000, // 1 hour
  };
}

/** Cookie options for refresh token (7 days, Path=/api/auth) */
function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
  };
}

/* ─── JWT helpers ───────────────────────────────────────────── */

/** Sign an app-level access token */
function signAccessToken(userId, email, avatarUrl = null) {
  return jwt.sign(
    { sub: userId, email, avatar_url: avatarUrl, role: 'user', type: 'access' },
    env.SESSION_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
}

/** Generate a cryptographically random refresh token */
function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

/** Store a refresh token in the persistent store */
function storeRefreshToken(token, userId, email, avatarUrl = null) {
  refreshTokens.set(token, {
    userId,
    email,
    avatar_url: avatarUrl,
    expiresAt: Date.now() + REFRESH_TOKEN_EXPIRY_MS,
    supersededBy: null,
  });
  saveSessions();
}

/** Set both auth cookies on the response */
function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, accessCookieOptions());
  res.cookie('refresh_token', refreshToken, refreshCookieOptions());
}

/** Clear both auth cookies */
function clearAuthCookies(res) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/api/auth' });
}

/* ─── OAuth PKCE helpers ────────────────────────────────────── */

/** @type {Map<string, { codeVerifier: string, provider: string, expiresAt: number }>} */
const oauthStates = new Map();
const OAUTH_STATE_EXPIRY_MS = 10 * 60 * 1000; // 10 min

function base64URLEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateCodeVerifier() {
  return base64URLEncode(crypto.randomBytes(32));
}

function generateCodeChallenge(verifier) {
  return base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
}

/* ─── Database helpers ─────────────────────────────────────── */

/** Upsert a user row into public.users after login / signup / OAuth */
async function upsertUser({ id, email, avatarUrl, fullName }) {
  try {
    await supabaseAdmin.from('users').upsert(
      {
        id,
        email,
        avatar_url: avatarUrl || null,
        full_name: fullName || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id', ignoreDuplicates: false },
    );
  } catch {
    // Non-critical — the Supabase Auth trigger handles creation too
  }
}

/* ═══════════════════════════════════════════════════════════════
   Handlers
   ═══════════════════════════════════════════════════════════════ */

/**
 * POST /api/auth/signup
 * Body: { email, password }
 */
export async function signup(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required.' },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: { message: 'Password must be at least 8 characters.' },
      });
    }

    const { data, error } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${env.CLIENT_ORIGIN}/`,
      },
    });

    if (error) {
      return res.status(400).json({
        error: { message: 'Unable to create account. Please try again.' },
      });
    }

    // Upsert user into public.users (the Supabase trigger also handles this)
    if (data?.user) {
      await upsertUser({
        id: data.user.id,
        email: data.user.email,
        avatarUrl: data.user?.user_metadata?.avatar_url,
        fullName: data.user?.user_metadata?.full_name,
      });
    }

    // If email confirmation is required, Supabase sends a verification email.
    // The user will need to verify before they can log in.
    res.status(201).json({
      data: {
        user: data?.user
          ? { id: data.user.id, email: data.user.email }
          : null,
        message: data?.user?.identities?.length
          ? 'Account created! Check your email to verify.'
          : 'Account created!',
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * On success, sets httpOnly cookies (access_token + refresh_token)
 * and returns user info (no tokens in body).
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required.' },
      });
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.session) {
      // Generic message — never confirm whether the email exists
      return res.status(401).json({
        error: { message: 'Invalid email or password.' },
      });
    }

    const userId = data.user?.id;
    const userEmail = data.user?.email;

    if (!userId) {
      return res.status(500).json({
        error: { message: 'Authentication failed. Please try again.' },
      });
    }

    // Upsert user into public.users
    await upsertUser({
      id: userId,
      email: userEmail,
      avatarUrl: data.user?.user_metadata?.avatar_url,
      fullName: data.user?.user_metadata?.full_name,
    });

    // Issue app-level session
    const avatarUrl = data.user?.user_metadata?.avatar_url || null;
    const accessToken = signAccessToken(userId, userEmail, avatarUrl);
    const refreshToken = generateRefreshToken();
    storeRefreshToken(refreshToken, userId, userEmail, avatarUrl);
    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      data: {
        user: { id: userId, email: userEmail },
        message: 'Signed in successfully.',
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Clears cookies and invalidates the refresh token.
 */
export async function logout(_req, res, next) {
  try {
    const token = _req.cookies?.refresh_token;
    if (token && refreshTokens.has(token)) {
      refreshTokens.delete(token);
      saveSessions();
    }

    clearAuthCookies(res);
    res.json({ data: { message: 'Signed out.' } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Rotates the refresh token on every use.
 * Detects and rejects reuse of a superseded token (theft signal).
 *
 * Cookie read: refresh_token
 */
export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refresh_token;

    if (!token) {
      return res.status(401).json({
        error: { message: 'No session found. Please sign in.' },
      });
    }

    const stored = refreshTokens.get(token);

    // Token not found or expired
    if (!stored || stored.expiresAt < Date.now()) {
      refreshTokens.delete(token);
      saveSessions();
      clearAuthCookies(res);
      return res.status(401).json({
        error: { message: 'Session expired. Please sign in again.' },
      });
    }

    // Token has been superseded — someone may have stolen it
    if (stored.supersededBy) {
      // Revoke the entire token family (theft signal)
      for (const [key, val] of refreshTokens) {
        if (val.userId === stored.userId) {
          refreshTokens.delete(key);
        }
      }
      saveSessions();
      clearAuthCookies(res);
      return res.status(401).json({
        error: { message: 'Session revoked. Please sign in again.' },
      });
    }

    // Invalidate old token and issue new pair
    const newAccessToken = signAccessToken(stored.userId, stored.email, stored.avatar_url);
    const newRefreshToken = generateRefreshToken();
    stored.supersededBy = newRefreshToken;
    storeRefreshToken(newRefreshToken, stored.userId, stored.email, stored.avatar_url);
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ data: { message: 'Session refreshed.' } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/oauth/:provider
 * Initiates OAuth 2.0 Authorization Code flow with PKCE.
 *
 * URL params: provider — 'google' | 'facebook'
 *
 * Redirects the user to the provider's authorization page.
 */
export async function oauthInit(req, res, next) {
  try {
    const { provider } = req.params;

    if (provider !== 'google') {
      return res.status(400).json({
        error: { message: 'Unsupported provider. Only "google" is available.' },
      });
    }

    // Generate PKCE challenge + state
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = crypto.randomBytes(24).toString('hex');

    // Store state → verifier mapping (validated on callback)
    oauthStates.set(state, {
      codeVerifier,
      provider,
      expiresAt: Date.now() + OAUTH_STATE_EXPIRY_MS,
    });

    // Set the state in a cookie so it survives the OAuth redirect loop.
    // SameSite=Lax ensures the browser sends it on the cross-site GET
    // navigation from Supabase back to our callback URL.
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: env.isProd,
      sameSite: 'lax',
      path: '/api/auth/oauth/callback',
      maxAge: OAUTH_STATE_EXPIRY_MS,
    });

    // Build Supabase OAuth URL
    // NOTE: We don't pass our own `state` to Supabase — it has its own
    // internal state management for the OAuth flow. Passing a custom
    // `state` would conflict with Supabase's tracking.
    const params = new URLSearchParams({
      provider,
      redirect_to: `${env.CLIENT_ORIGIN}/api/auth/oauth/callback`,
      code_challenge: codeChallenge,
      code_challenge_method: 's256',
    });

    const redirectUrl = `${env.SUPABASE_URL}/auth/v1/authorize?${params.toString()}`;

    // Validate the provider is enabled by checking Supabase's response.
    // Node.js native fetch (18+) returns status 0 with type "opaqueredirect"
    // when redirect: 'manual' is set — NOT 302/303 like browser fetch.
    const validateRes = await fetch(redirectUrl, { method: 'GET', redirect: 'manual' });
    const isRedirect = validateRes.status === 0 || validateRes.status === 302 || validateRes.status === 303;
    if (!isRedirect) {
      // Provider not enabled — clean up state and return a friendly error
      oauthStates.delete(state);
      res.clearCookie('oauth_state', { path: '/api/auth/oauth/callback' });
      // Read the response body for a useful error message.
      // If status is 0 (unexpected opaque redirect), body will be empty
      // so we fall through to the generic message.
      const body = validateRes.status !== 0 ? await validateRes.text().catch(() => '') : '';
      const detail = body.includes('not enabled')
        ? `"${provider}" login is not enabled in your Supabase project. Go to Authentication → Providers and enable it.`
        : `"${provider}" login returned an error (${validateRes.status}). Check your Supabase Auth configuration.`;
      return res.status(400).json({ error: { message: detail } });
    }

    // Clean up stale states
    for (const [key, val] of oauthStates) {
      if (val.expiresAt < Date.now()) oauthStates.delete(key);
    }

    res.json({ data: { url: redirectUrl } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/oauth/callback
 * OAuth callback endpoint.
 *
 * Query params: code, state (Supabase's own state)
 * Cookie (read): oauth_state (our CSRF state)
 *
 * Our CSRF state is carried through the OAuth redirect loop via a cookie
 * (set by oauthInit). We rely on PKCE for CSRF protection; the cookie
 * just lets us look up which code_verifier to use.
 */
export async function oauthCallback(req, res) {
  try {
    const { code } = req.query;
    const ourState = req.cookies?.oauth_state;

    if (!code || !ourState) {
      return res.redirect(`${env.CLIENT_ORIGIN}/?error=oauth_failed`);
    }

    // Clear the state cookie immediately (one-time use)
    res.clearCookie('oauth_state', { path: '/api/auth/oauth/callback' });

    // Validate our CSRF state parameter
    const stored = oauthStates.get(ourState);
    if (!stored || stored.expiresAt < Date.now()) {
      oauthStates.delete(ourState);
      return res.redirect(`${env.CLIENT_ORIGIN}/?error=oauth_failed`);
    }
    oauthStates.delete(ourState);

    // Exchange authorization code + PKCE verifier for Supabase session
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier: stored.codeVerifier,
      redirect_uri: `${env.CLIENT_ORIGIN}/api/auth/oauth/callback`,
    });

    const tokenRes = await fetch(
      `${env.SUPABASE_URL}/auth/v1/token?grant_type=authorization_code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': env.SUPABASE_PUBLISHABLE_KEY,
        },
        body: tokenParams.toString(),
      },
    );

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData?.user?.id) {
      // Log the detailed Supabase error for debugging
      console.error('[oauth] Token exchange failed:', {
        status: tokenRes.status,
        error: tokenData.error,
        error_description: tokenData.error_description,
        msg: tokenData.msg,
      });
      return res.redirect(`${env.CLIENT_ORIGIN}/?error=oauth_failed`);
    }

    // Upsert user into public.users
    await upsertUser({
      id: tokenData.user.id,
      email: tokenData.user.email,
      avatarUrl: tokenData.user?.user_metadata?.avatar_url,
      fullName: tokenData.user?.user_metadata?.full_name,
    });

    // Issue app-level session
    const userId = tokenData.user.id;
    const userEmail = tokenData.user.email;
    const avatarUrl = tokenData.user?.user_metadata?.avatar_url || null;
    const accessToken = signAccessToken(userId, userEmail, avatarUrl);
    const refreshToken = generateRefreshToken();
    storeRefreshToken(refreshToken, userId, userEmail, avatarUrl);
    setAuthCookies(res, accessToken, refreshToken);

    // Clean stale OAuth states
    for (const [key, val] of oauthStates) {
      if (val.expiresAt < Date.now()) oauthStates.delete(key);
    }

    // Redirect to frontend with success flag
    res.redirect(`${env.CLIENT_ORIGIN}/?auth=success`);
  } catch (err) {
    // On error, redirect to frontend with error flag
    console.error('[oauth] Callback exception:', err?.message || err);
    res.redirect(`${env.CLIENT_ORIGIN}/?error=oauth_failed`);
  }
}

/**
 * GET /api/auth/me
 * Returns the current user from the access token cookie.
 */
export async function me(req, res, next) {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        error: { message: 'Not authenticated.' },
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, env.SESSION_SECRET);
    } catch {
      // Token expired or invalid — client should try refreshing
      return res.status(401).json({
        error: { message: 'Session expired.' },
      });
    }

    // Fetch extended profile from public.users
    let profile = {};
    try {
      const { data: row } = await supabaseAdmin
        .from('users')
        .select('full_name, avatar_url')
        .eq('id', payload.sub)
        .maybeSingle();
      if (row) profile = row;
    } catch {
      // Fallback: just use what's in the token
    }

    const isAdmin = !!env.ADMIN_EMAIL && payload.email === env.ADMIN_EMAIL;

    res.json({
      data: {
        user: {
          id: payload.sub,
          email: payload.email,
          avatar_url: profile.avatar_url || payload.avatar_url || null,
          full_name: profile.full_name || null,
          role: payload.role,
          isAdmin,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

/* ─── Rate-limit cleanup ─────────────────────────────────────── */
// Periodically purge expired refresh tokens and OAuth states
const CLEANUP_INTERVAL = 15 * 60 * 1000; // 15 min
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [key, val] of refreshTokens) {
    if (val.expiresAt < now) { refreshTokens.delete(key); changed = true; }
  }
  if (changed) saveSessions();
  for (const [key, val] of oauthStates) {
    if (val.expiresAt < now) oauthStates.delete(key);
  }
}, CLEANUP_INTERVAL);
