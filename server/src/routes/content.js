/**
 * Content routes — business info and bundles API.
 *
 * GET /api/content/business  — business info, venue, nav
 * GET /api/content/bundles   — bundles, features, filter tabs
 */
import { Router } from 'express';
import { getBusiness, getBundles } from '../controllers/content.js';

export const contentRouter = Router();

contentRouter.get('/business', getBusiness);
contentRouter.get('/bundles', getBundles);
