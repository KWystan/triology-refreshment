/**
 * Menu CRUD controllers — categories and items backed by Firestore.
 *
 * Categories collection: menu_categories
 * Items collection:     menu_items (referenced by categoryId)
 */
import { firestore } from '../config/firebase.js';

/* ─── Helpers ─────────────────────────────────────────────── */

const CATS_COL = 'menu_categories';
const ITEMS_COL = 'menu_items';

/** Format a Firestore doc snapshot to a plain object with id */
function formatDoc(doc) {
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/** Format a QuerySnapshot to an array of objects */
function formatDocs(snapshot) {
  const results = [];
  snapshot.forEach((doc) => results.push(formatDoc(doc)));
  return results.filter(Boolean);
}

/**
 * Run a Firestore query with a fallback when composite indexes are missing.
 * Firestore throws FAILED_PRECONDITION (code 9) when a composite index is
 * needed but doesn't exist. This helper tries the ordered query first and
 * falls back to an unordered query if the index is missing.
 */
async function queryItems(field, value, orderField = 'order') {
  try {
    const snapshot = await firestore
      .collection(ITEMS_COL)
      .where(field, '==', value)
      .orderBy(orderField, 'asc')
      .get();
    return formatDocs(snapshot);
  } catch (err) {
    if (err.code === 9) {
      // Composite index missing — fall back to unordered query
      console.warn(
        `[menu] Firestore composite index missing for ${field}+${orderField}. ` +
          'Create it at: ' +
          `https://console.firebase.google.com/v1/r/project/triology-f35e8/firestore/indexes`,
      );
      const snapshot = await firestore
        .collection(ITEMS_COL)
        .where(field, '==', value)
        .get();
      return formatDocs(snapshot);
    }
    console.error('[menu] queryItems raw error:', err.message, '(code:', err.code, ')');
    throw err;
  }
}

/* ─── Categories ──────────────────────────────────────────── */

/** GET /api/menu/categories — list all categories, ordered */
export async function getCategories(req, res) {
  try {
    const snapshot = await firestore
      .collection(CATS_COL)
      .orderBy('order', 'asc')
      .get();
    const categories = formatDocs(snapshot);
    res.json({ data: categories });
  } catch (err) {
    console.error('[menu] getCategories error:', err.message, '(code:', err.code, ')');
    res.status(500).json({ error: { message: 'Failed to fetch categories' } });
  }
}

/** GET /api/menu/categories/:id — single category with its items */
export async function getCategory(req, res) {
  try {
    const { id } = req.params;
    const catDoc = await firestore.collection(CATS_COL).doc(id).get();
    if (!catDoc.exists) {
      return res.status(404).json({ error: { message: 'Category not found' } });
    }
    const category = formatDoc(catDoc);

    const items = await queryItems('categoryId', id);

    res.json({ data: { ...category, items } });
  } catch (err) {
    console.error('[menu] getCategory error:', err.message, '(code:', err.code, ')');
    res.status(500).json({ error: { message: 'Failed to fetch category' } });
  }
}

/** POST /api/menu/categories — create a category */
export async function createCategory(req, res) {
  try {
    const { id, label, layout, categoryImage, priceNote, note, order } = req.body;
    const docId = id || label?.toLowerCase().replace(/\s+/g, '-');

    const now = new Date();
    await firestore.collection(CATS_COL).doc(docId).set({
      id: docId,
      label,
      layout: layout || 'compact-card',
      categoryImage: categoryImage || null,
      priceNote: priceNote || null,
      note: note || null,
      order: order ?? 99,
      createdAt: now,
      updatedAt: now,
    });

    const created = await firestore.collection(CATS_COL).doc(docId).get();
    res.status(201).json({ data: formatDoc(created) });
  } catch (err) {
    const msg = err.code === 6 ? 'Category already exists' : 'Failed to create category';
    res.status(err.code === 6 ? 409 : 500).json({ error: { message: msg } });
  }
}

/** PUT /api/menu/categories/:id — update a category */
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { label, layout, categoryImage, priceNote, note, order } = req.body;
    const updateData = { updatedAt: new Date() };
    if (label !== undefined) updateData.label = label;
    if (layout !== undefined) updateData.layout = layout;
    if (categoryImage !== undefined) updateData.categoryImage = categoryImage;
    if (priceNote !== undefined) updateData.priceNote = priceNote;
    if (note !== undefined) updateData.note = note;
    if (order !== undefined) updateData.order = order;

    await firestore.collection(CATS_COL).doc(id).update(updateData);
    const updated = await firestore.collection(CATS_COL).doc(id).get();
    if (!updated.exists) {
      return res.status(404).json({ error: { message: 'Category not found' } });
    }
    res.json({ data: formatDoc(updated) });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to update category' } });
  }
}

/** DELETE /api/menu/categories/:id — delete a category and its items */
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Delete all items in the category
    const itemsSnapshot = await firestore
      .collection(ITEMS_COL)
      .where('categoryId', '==', id)
      .get();

    const batch = firestore.batch();
    itemsSnapshot.forEach((doc) => batch.delete(doc.ref));
    batch.delete(firestore.collection(CATS_COL).doc(id));
    await batch.commit();

    res.json({ data: { message: 'Category deleted' } });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to delete category' } });
  }
}

/* ─── Items ───────────────────────────────────────────────── */

/** GET /api/menu/items — list all items, optionally filtered by category */
export async function getItems(req, res) {
  try {
    const { categoryId } = req.query;
    let items;
    if (categoryId) {
      items = await queryItems('categoryId', categoryId);
    } else {
      const snapshot = await firestore.collection(ITEMS_COL).orderBy('order', 'asc').get();
      items = formatDocs(snapshot);
    }
    res.json({ data: items });
  } catch (err) {
    console.error('[menu] getItems error:', err.message, '(code:', err.code, ')');
    res.status(500).json({ error: { message: 'Failed to fetch items' } });
  }
}

/** GET /api/menu/items/:id — single item */
export async function getItem(req, res) {
  try {
    const { id } = req.params;
    const doc = await firestore.collection(ITEMS_COL).doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: { message: 'Item not found' } });
    }
    res.json({ data: formatDoc(doc) });
  } catch (err) {
    console.error('[menu] getItem error:', err.message, '(code:', err.code, ')');
    res.status(500).json({ error: { message: 'Failed to fetch item' } });
  }
}

/** POST /api/menu/items — create an item */
export async function createItem(req, res) {
  try {
    const {
      id, name, categoryId, image, images, price, variants,
      tags, badge, isBestSeller, note, rating, description,
      serves, prepTime,
    } = req.body;

    const docId = id || name?.toLowerCase().replace(/\s+/g, '-');

    // Verify category exists
    const catDoc = await firestore.collection(CATS_COL).doc(categoryId).get();
    if (!catDoc.exists) {
      return res.status(400).json({ error: { message: `Category '${categoryId}' not found` } });
    }

    const now = new Date();
    await firestore.collection(ITEMS_COL).doc(docId).set({
      id: docId,
      categoryId,
      name,
      image: image || null,
      images: images || [],
      price: price || null,
      variants: variants || [],
      tags: tags || [],
      badge: badge || null,
      isBestSeller: isBestSeller || false,
      note: note || null,
      rating: rating || null,
      description: description || '',
      serves: serves || null,
      prepTime: prepTime || null,
      order: 99,
      createdAt: now,
      updatedAt: now,
    });

    const created = await firestore.collection(ITEMS_COL).doc(docId).get();
    res.status(201).json({ data: formatDoc(created) });
  } catch (err) {
    const msg = err.code === 6 ? 'Item already exists' : 'Failed to create item';
    res.status(err.code === 6 ? 409 : 500).json({ error: { message: msg } });
  }
}

/** PUT /api/menu/items/:id — update an item */
export async function updateItem(req, res) {
  try {
    const { id } = req.params;
    const updateData = { updatedAt: new Date() };

    const fields = [
      'name', 'categoryId', 'image', 'images', 'price', 'variants',
      'tags', 'badge', 'isBestSeller', 'note', 'rating',
      'description', 'serves', 'prepTime', 'order',
    ];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    await firestore.collection(ITEMS_COL).doc(id).update(updateData);
    const updated = await firestore.collection(ITEMS_COL).doc(id).get();
    if (!updated.exists) {
      return res.status(404).json({ error: { message: 'Item not found' } });
    }
    res.json({ data: formatDoc(updated) });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to update item' } });
  }
}

/** DELETE /api/menu/items/:id — delete an item */
export async function deleteItem(req, res) {
  try {
    const { id } = req.params;
    const doc = await firestore.collection(ITEMS_COL).doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: { message: 'Item not found' } });
    }
    await firestore.collection(ITEMS_COL).doc(id).delete();
    res.json({ data: { message: 'Item deleted' } });
  } catch (err) {
    res.status(500).json({ error: { message: 'Failed to delete item' } });
  }
}

/* ─── Upload image to Cloudinary ─────────────────────────── */

import cloudinary from '../config/cloudinary.js';

/** POST /api/menu/upload — upload image to Cloudinary, return URL */
export async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: { message: 'No file uploaded' } });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'triology/menu',
          use_filename: true,
          unique_filename: false,
          overwrite: true,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        },
      );
      stream.end(req.file.buffer);
    });

    res.json({ data: { url: result.secure_url, publicId: result.public_id } });
  } catch (err) {
    console.error('[Upload]', err.message || err);
    res.status(500).json({ error: { message: err.message || 'Failed to upload image' } });
  }
}
