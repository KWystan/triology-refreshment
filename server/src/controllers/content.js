/**
 * Content controller — business info and bundles served from Firestore.
 *
 * Collections:
 *   site_content — stores business info, bundles, features, filter tabs
 *     Document 'business': business info + venue + nav
 *     Document 'bundles': party pack bundles array
 *     Document 'bundle_features': features array
 *     Document 'menu_filter_tabs': filter tabs array
 */
import { firestore } from '../config/firebase.js';

const COL = 'site_content';

/**
 * GET /api/content/business
 * Returns business info, venue data, and navigation links.
 */
export async function getBusiness(req, res) {
  try {
    const doc = await firestore.collection(COL).doc('business').get();
    if (!doc.exists) {
      return res.status(404).json({ error: { message: 'Business info not found' } });
    }
    res.json({ data: doc.data() });
  } catch (err) {
    console.error('[content] getBusiness:', err.message);
    res.status(500).json({ error: { message: 'Failed to fetch business info' } });
  }
}

/**
 * GET /api/content/bundles
 * Returns bundles array, features array, and filter tabs.
 */
export async function getBundles(req, res) {
  try {
    const [bundlesDoc, featuresDoc, filterTabsDoc] = await Promise.all([
      firestore.collection(COL).doc('bundles').get(),
      firestore.collection(COL).doc('bundle_features').get(),
      firestore.collection(COL).doc('menu_filter_tabs').get(),
    ]);

    res.json({
      data: {
        bundles: bundlesDoc.exists ? bundlesDoc.data().items || [] : [],
        features: featuresDoc.exists ? featuresDoc.data().items || [] : [],
        filterTabs: filterTabsDoc.exists ? filterTabsDoc.data().items || [] : [],
      },
    });
  } catch (err) {
    console.error('[content] getBundles:', err.message);
    res.status(500).json({ error: { message: 'Failed to fetch bundles' } });
  }
}
