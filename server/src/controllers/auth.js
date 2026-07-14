/**
 * Auth controller — signup, login, logout, refresh, me.
 *
 * Uses Firebase Auth (Admin SDK + REST API) for user management.
 * Session management uses app-level JWT access tokens + rotated
 * refresh tokens as httpOnly cookies.
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
import { firebaseAuth } from '../config/firebase.js';
import { env } from '../config/env.js';

/* ─── Constants ─────────────────────────────────────────────── */
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const FIREBASE_SIGN_IN_URL =
  `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE_WEB_API_KEY}`;

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
function signAccessToken(userId, email) {
  return jwt.sign(
    { sub: userId, email, role: 'user', type: 'access' },
    env.SESSION_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
}

/** Generate a cryptographically random refresh token */
function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

/** Store a refresh token in the persistent store */
function storeRefreshToken(token, userId, email) {
  refreshTokens.set(token, {
    userId,
    email,
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

/* ═══════════════════════════════════════════════════════════════
   Handlers
   ═══════════════════════════════════════════════════════════════ */

/**
 * POST /api/auth/signup
 * Body: { email, password }
 *
 * Creates a Firebase Auth user via the Admin SDK.
 * Returns a success message — email verification may be required.
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

    const userRecord = await firebaseAuth.createUser({
      email,
      password,
    });

    res.status(201).json({
      data: {
        user: { id: userRecord.uid, email: userRecord.email },
        message: 'Account created! Check your email to verify.',
      },
    });
  } catch (err) {
    // Firebase errors — surface the message but keep it generic
    if (err.code === 'auth/email-already-exists') {
      return res.status(409).json({
        error: { message: 'An account with this email already exists.' },
      });
    }
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 *
 * Authenticates via the Firebase Auth REST API, verifies the
 * returned ID token with the Admin SDK, then issues app-level
 * session cookies.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: { message: 'Email and password are required.' },
      });
    }

    // Sign in via Firebase Auth REST API
    const signInRes = await fetch(FIREBASE_SIGN_IN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const signInData = await signInRes.json();

    if (!signInRes.ok) {
      // Generic message — never confirm whether the email exists
      return res.status(401).json({
        error: { message: 'Invalid email or password.' },
      });
    }

    const idToken = signInData.idToken;
    if (!idToken) {
      return res.status(500).json({
        error: { message: 'Authentication failed. Please try again.' },
      });
    }

    // Verify the ID token with the Admin SDK
    const decoded = await firebaseAuth.verifyIdToken(idToken);
    const userId = decoded.uid;
    const userEmail = decoded.email || email;

    // Issue app-level session
    const accessToken = signAccessToken(userId, userEmail);
    const refreshToken = generateRefreshToken();
    storeRefreshToken(refreshToken, userId, userEmail);
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
    console.log('[auth/refresh] refresh_token cookie:', token ? 'PRESENT' : 'MISSING');

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
    const newAccessToken = signAccessToken(stored.userId, stored.email);
    const newRefreshToken = generateRefreshToken();
    stored.supersededBy = newRefreshToken;
    storeRefreshToken(newRefreshToken, stored.userId, stored.email);
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ data: { message: 'Session refreshed.' } });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns the current user from the access token cookie.
 */
export async function me(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    console.log('[auth/me] access_token cookie:', token ? 'PRESENT' : 'MISSING');

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

    const isAdmin = !!env.ADMIN_EMAIL && payload.email === env.ADMIN_EMAIL;

    res.json({
      data: {
        user: {
          id: payload.sub,
          email: payload.email,
          avatar_url: null,
          full_name: null,
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
// Periodically purge expired refresh tokens
const CLEANUP_INTERVAL = 15 * 60 * 1000; // 15 min
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [key, val] of refreshTokens) {
    if (val.expiresAt < now) { refreshTokens.delete(key); changed = true; }
  }
  if (changed) saveSessions();
}, CLEANUP_INTERVAL);
