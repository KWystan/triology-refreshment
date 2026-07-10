/**
 * Auth routes — login, signup, OAuth, logout, refresh, me.
 *
 * All mounted at /api/auth/* via routes/index.js.
 */
import { Router } from 'express';
import {
  signup,
  login,
  logout,
  refresh,
  oauthInit,
  oauthCallback,
  me,
} from '../controllers/auth.js';

const router = Router();

// ─── Email/password ──────────────────────────────────────────
router.post('/signup', signup);       // Create account
router.post('/login', login);         // Sign in

// ─── OAuth ────────────────────────────────────────────────────
router.get('/oauth/callback', oauthCallback); // OAuth callback handler — MUST be before :provider
router.get('/oauth/:provider', oauthInit);   // Start OAuth flow

// ─── Session ──────────────────────────────────────────────────
router.post('/logout', logout);       // Sign out (clear cookies)
router.post('/refresh', refresh);     // Rotate refresh token
router.get('/me', me);                // Current user info

export { router as authRouter };
