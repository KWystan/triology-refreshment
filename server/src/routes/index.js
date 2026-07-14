import { Router } from 'express';
import { getHealth } from '../controllers/health.js';
import { authRouter } from './auth.js';

const router = Router();

// ─── Health ─────────────────────────────────────────────────
router.get('/health', getHealth);

// ─── Auth ────────────────────────────────────────────────────
router.use('/auth', authRouter);

// ─── Menu CRUD ─────────────────────────────────────────────
import { menuRouter } from './menu.js';
router.use('/menu', menuRouter);

// ─── Content (business info, bundles) ──────────────────────
import { contentRouter } from './content.js';
router.use('/content', contentRouter);

export { router as apiRouter };
