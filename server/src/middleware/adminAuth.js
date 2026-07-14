/**
 * Admin authorization middleware.
 *
 * Verifies the app-level JWT from the access_token cookie and
 * checks that the user's email matches the configured ADMIN_EMAIL.
 *
 * Usage:
 *   import { requireAdmin } from '../middleware/adminAuth.js';
 *   router.post('/items', requireAdmin, handler);
 */
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Express middleware: reads the access_token cookie, verifies the
 * app-level JWT, and checks if the user's email matches ADMIN_EMAIL.
 */
export function requireAdmin(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(401).json({ error: { message: 'Authentication required.' } });
  }

  let payload;
  try {
    payload = jwt.verify(token, env.SESSION_SECRET);
  } catch {
    return res.status(401).json({ error: { message: 'Session expired. Please sign in again.' } });
  }

  const userEmail = payload.email;
  if (!userEmail || userEmail !== env.ADMIN_EMAIL) {
    return res.status(403).json({ error: { message: 'Admin access required.' } });
  }

  req.user = { id: payload.sub, email: userEmail };
  next();
}
