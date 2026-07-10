import { Router } from 'express';
import { getHealth } from '../controllers/health.js';
import { authRouter } from './auth.js';

const router = Router();

// ─── Health ─────────────────────────────────────────────────
router.get('/health', getHealth);

// ─── Auth ────────────────────────────────────────────────────
router.use('/auth', authRouter);

// ─── API v1 mount point ─────────────────────────────────────
// import { apiV1Router } from './v1.js';
// router.use('/v1', apiV1Router);

export { router as apiRouter };
