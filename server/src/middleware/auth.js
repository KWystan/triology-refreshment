import { extractCredentials, verifyAuth } from '@supabase/server/core';
import { env } from '../config/env.js';

let cachedJwks = null;

async function getJwks() {
  if (cachedJwks) return cachedJwks;
  try {
    const res = await fetch(
      env.SUPABASE_JWKS_URL ||
        `${env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
    );
    if (!res.ok) return null;
    cachedJwks = await res.json();
    return cachedJwks;
  } catch {
    return null;
  }
}

/**
 * Express middleware that verifies the Supabase JWT from the
 * Authorization header and attaches a Supabase client to `req`.
 *
 * Usage:
 *   import { requireAuth } from '../middleware/auth.js';
 *   router.get('/items', requireAuth, handler);
 *
 * On success, sets `req.supabase`, `req.user`, and `req.authMode`.
 * Sends 401 on missing/invalid credentials.
 */
export async function requireAuth(req, res, next) {
  try {
    // Build a minimal Web API Request-like object for extractCredentials
    const webReq = new Request(`http://localhost${req.url}`, {
      method: req.method,
      headers: Object.entries(req.headers).reduce((acc, [k, v]) => {
        acc[k] = Array.isArray(v) ? v.join(', ') : v;
        return acc;
      }, {}),
    });

    const { data: credentials, error: extractError } =
      await extractCredentials(webReq, {
        env: {
          url: env.SUPABASE_URL,
          publishableKeys: { default: env.SUPABASE_PUBLISHABLE_KEY },
          secretKeys: { default: env.SUPABASE_SECRET_KEY },
        },
      });

    if (extractError || !credentials) {
      return res.status(401).json({
        error: { message: extractError?.message || 'No credentials provided' },
      });
    }

    const jwks = await getJwks();
    const { data: auth, error: authError } = await verifyAuth(credentials, {
      auth: 'user',
      env: {
        url: env.SUPABASE_URL,
        publishableKeys: { default: env.SUPABASE_PUBLISHABLE_KEY },
        secretKeys: { default: env.SUPABASE_SECRET_KEY },
        jwks,
      },
    });

    if (authError || !auth) {
      return res.status(401).json({
        error: { message: authError?.message || 'Authentication failed' },
      });
    }

    req.authMode = auth.authMode;
    req.user = auth.userClaims;
    req.token = auth.token;

    next();
  } catch (err) {
    next(err);
  }
}
