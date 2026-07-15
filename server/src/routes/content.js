/**
 * Content routes — business info and bundles API.
 *
 * GET  /api/content/business  — business info, venue, nav (public)
 * PUT  /api/content/business  — update business info (admin)
 * GET  /api/content/bundles   — bundles, features, filter tabs (public)
 */
import { Router } from 'express';
import { requireAdmin } from '../middleware/adminAuth.js';
import {
  getBusiness,
  updateBusiness,
  getBundles,
} from '../controllers/content.js';

export const contentRouter = Router();

contentRouter.get('/business', getBusiness);
contentRouter.put('/business', requireAdmin, updateBusiness);
contentRouter.get('/bundles', getBundles);
