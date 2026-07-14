/**
 * Auth routes — login, signup, logout, refresh, me.
 *
 * All mounted at /api/auth/* via routes/index.js.
 */
import { Router } from 'express';
import {
  signup,
  login,
  logout,
  refresh,
  me,
} from '../controllers/auth.js';

const router = Router();

// ─── Email/password ──────────────────────────────────────────
router.post('/signup', signup);       // Create account
router.post('/login', login);         // Sign in

// ─── Session ──────────────────────────────────────────────────
router.post('/logout', logout);       // Sign out (clear cookies)
router.post('/refresh', refresh);     // Rotate refresh token
router.get('/me', me);                // Current user info

export { router as authRouter };
