/**
 * requireAuth — middleware that verifies a Firebase ID token from
 * the Authorization header using the Firebase Admin SDK.
 *
 * Usage:
 *   import { requireAuth } from '../middleware/auth.js';
 *   router.get('/items', requireAuth, handler);
 *
 * On success, sets `req.user` (decoded claims) and `req.token` (raw JWT).
 * Sends 401 on missing/invalid credentials.
 */
import { firebaseAuth } from '../config/firebase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: { message: 'No authorization token provided.' },
      });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({
        error: { message: 'No authorization token provided.' },
      });
    }

    let decoded;
    try {
      decoded = await firebaseAuth.verifyIdToken(token);
    } catch (err) {
      return res.status(401).json({
        error: { message: err.message || 'Invalid or expired token.' },
      });
    }

    req.user = {
      id: decoded.uid,
      email: decoded.email,
      email_verified: decoded.email_verified,
      ...decoded,
    };
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
}
