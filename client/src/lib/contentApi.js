/**
 * Content API client — business info and bundles.
 *
 * All functions call the Express backend at /api/content/*.
 */
import { api } from './api';

/** GET /api/content/business — business info, venue, nav */
export async function fetchBusiness() {
  const res = await api.get('/content/business');
  return res.data;
}

/** GET /api/content/bundles — bundles, features, filter tabs */
export async function fetchBundles() {
  const res = await api.get('/content/bundles');
  return res.data;
}
