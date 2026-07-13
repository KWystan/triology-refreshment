/**
 * Admin authorization middleware.
 *
 * Supports two auth methods:
 *   1. Supabase JWT from the Authorization header (via requireAuth)
 *   2. App-level JWT from the access_token cookie (via SESSION_SECRET)
 *
 * The admin email is set via ADMIN_EMAIL in server/.env.
 *
 * Usage:
 *   import { requireAdmin } from '../middleware/adminAuth.js';
 *   router.post('/items', requireAdmin, handler);
 */
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Extract the user email from the app-level access_token cookie.
 * Returns null if no valid cookie is present.
 */
function getUserFromCookie(req) {
  const token = req.cookies?.access_token;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, env.SESSION_SECRET);
    return payload.email || null;
  } catch {
    return null;
  }
}

/**
 * Express middleware: authenticates the request, then checks
 * if the user's email matches the configured ADMIN_EMAIL.
 *
 * First tries the app-level cookie (for browser/API clients using
 * cookie-based auth), then falls back to Supabase JWT Auth header.
 */
export async function requireAdmin(req, res, next) {
  // 1) Try app-level JWT from cookie first
  const cookieEmail = getUserFromCookie(req);
  if (cookieEmail) {
    if (cookieEmail === env.ADMIN_EMAIL) {
      req.user = { email: cookieEmail };
      return next();
    }
    return res.status(403).json({ error: { message: 'Admin access required' } });
  }

  // 2) Fall back to Supabase JWT from Authorization header
  const { requireAuth } = await import('./auth.js');
  await requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (!req.user) {
      return res.status(401).json({ error: { message: 'Authentication required' } });
    }

    const userEmail = req.user.email;
    if (!userEmail || userEmail !== env.ADMIN_EMAIL) {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    next();
  });
}
