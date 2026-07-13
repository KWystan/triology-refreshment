/**
 * Menu validation schemas.
 *
 * Plain JS schema functions — no schema library.
 * Used with validate({ body: schemaFn }) in routes.
 */

/** Category creation/update schema */
export function categorySchema(data) {
  const errors = [];
  if (!data.label || typeof data.label !== 'string' || data.label.trim().length === 0) {
    errors.push({ field: 'label', message: 'Category label is required' });
  }
  if (data.order !== undefined && (typeof data.order !== 'number' || data.order < 0)) {
    errors.push({ field: 'order', message: 'Order must be a non-negative number' });
  }
  if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5)) {
    errors.push({ field: 'rating', message: 'Rating must be between 0 and 5' });
  }
  if (data.image && typeof data.image !== 'string') {
    errors.push({ field: 'image', message: 'Image must be a URL string' });
  }
  return { valid: errors.length === 0, errors };
}

/** Item creation/update schema (partial updates allowed) */
export function itemSchema(data) {
  const errors = [];
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Item name is required' });
  }
  if (!data.categoryId || typeof data.categoryId !== 'string') {
    errors.push({ field: 'categoryId', message: 'Category ID is required' });
  }
  if (data.price !== undefined && data.price !== null && (typeof data.price !== 'number' || data.price < 0)) {
    errors.push({ field: 'price', message: 'Price must be a non-negative number' });
  }
  if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5)) {
    errors.push({ field: 'rating', message: 'Rating must be between 0 and 5' });
  }
  if (data.variants && !Array.isArray(data.variants)) {
    errors.push({ field: 'variants', message: 'Variants must be an array' });
  }
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push({ field: 'tags', message: 'Tags must be an array' });
  }
  if (data.image && typeof data.image !== 'string') {
    errors.push({ field: 'image', message: 'Image must be a URL string' });
  }
  return { valid: errors.length === 0, errors };
}
