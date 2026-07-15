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
  oauthGoogleInit,
  oauthGoogleCallback,
} from '../controllers/auth.js';

const router = Router();

// ─── Email/password ──────────────────────────────────────────
router.post('/signup', signup);       // Create account
router.post('/login', login);         // Sign in

// ─── Session ──────────────────────────────────────────────────
router.post('/logout', logout);       // Sign out (clear cookies)
router.post('/refresh', refresh);     // Rotate refresh token
router.get('/me', me);                // Current user info

// ─── Google OAuth ────────────────────────────────────────────
router.get('/oauth/google', oauthGoogleInit);                 // Start OAuth flow
router.get('/oauth/google/callback', oauthGoogleCallback);    // Handle callback

export { router as authRouter };
