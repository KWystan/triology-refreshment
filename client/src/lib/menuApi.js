/**
 * Menu API client — CRUD operations for menu categories and items.
 *
 * All functions call the Express backend at /api/menu/*.
 * Admin-only write operations require an active admin session (cookies sent automatically).
 */
import { api } from './api';

/* ─── Categories ─────────────────────────────────────────── */

/** GET /api/menu/categories — list all categories */
export async function fetchCategories() {
  const res = await api.get('/menu/categories');
  return res.data;
}

/** POST /api/menu/categories — create a category (admin) */
export async function createCategory(data) {
  const res = await api.post('/menu/categories', data);
  return res.data;
}

/** PUT /api/menu/categories/:id — update a category (admin) */
export async function updateCategory(id, data) {
  const res = await api.put(`/menu/categories/${id}`, data);
  return res.data;
}

/** DELETE /api/menu/categories/:id — delete a category and its items (admin) */
export async function deleteCategory(id) {
  const res = await api.delete(`/menu/categories/${id}`);
  return res.data;
}

/* ─── Items ──────────────────────────────────────────────── */

/** GET /api/menu/items — list all items, optionally filtered by category */
export async function fetchItems(categoryId) {
  const params = categoryId ? `?categoryId=${categoryId}` : '';
  const res = await api.get(`/menu/items${params}`);
  return res.data;
}

/** GET /api/menu/items/:id — single item */
export async function fetchItem(id) {
  const res = await api.get(`/menu/items/${id}`);
  return res.data;
}

/** POST /api/menu/items — create an item (admin) */
export async function createItem(data) {
  const res = await api.post('/menu/items', data);
  return res.data;
}

/** PUT /api/menu/items/:id — update an item (admin) */
export async function updateItem(id, data) {
  const res = await api.put(`/menu/items/${id}`, data);
  return res.data;
}

/** DELETE /api/menu/items/:id — delete an item (admin) */
export async function deleteItem(id) {
  const res = await api.delete(`/menu/items/${id}`);
  return res.data;
}

/* ─── Image Upload ───────────────────────────────────────── */

/**
 * POST /api/menu/upload — upload an image to Cloudinary (admin)
 * @param {File} file — image file from an <input type="file">
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/menu/upload', {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    const err = new Error(body.message || 'Failed to upload image');
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return res.json();
}
