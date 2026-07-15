/**
 * Content API client — business info and bundles from the Express backend.
 */
import { api } from './api';

/* ═══════════════════════════════════════════════════════════════════
   Business
   ═══════════════════════════════════════════════════════════════════ */

/** GET /api/content/business — business info, venue, nav */
export async function fetchBusiness() {
  const res = await api.get('/content/business');
  return res.data;
}

/* ═══════════════════════════════════════════════════════════════════
   Bundles
   ═══════════════════════════════════════════════════════════════════ */

/** GET /api/content/bundles — bundles, features, filter tabs */
export async function fetchBundles() {
  const res = await api.get('/content/bundles');
  return res.data;
}
