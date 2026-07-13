/**
 * ItemEditorModal — create or edit a menu item.
 *
 * Props:
 *   item       — existing item to edit, or null for create
 *   categories — full categories array (for categoryId dropdown)
 *   onClose    — () => void
 *   onSaved    — (item) => void
 *   onDeleted  — (itemId) => void
 */
import { useState, useEffect, useCallback } from 'react';
import { createItem, updateItem, deleteItem } from '../../lib/menuApi';
import ImageUploadField from './ImageUploadField';

export default function ItemEditorModal({ item, categories, onClose, onSaved, onDeleted }) {
  const isEditing = !!item;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: '',
    id: '',
    categoryId: categories?.[0]?.id || '',
    price: '',
    description: '',
    rating: '',
    badge: '',
    isBestSeller: false,
    serves: '',
    prepTime: '',
    tags: '',
    note: '',
    image: '',
    images: [],
    order: 99,
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        id: item.id || '',
        categoryId: item.categoryId || categories?.[0]?.id || '',
        price: item.price ?? '',
        description: item.description || '',
        rating: item.rating ?? '',
        badge: item.badge || '',
        isBestSeller: item.isBestSeller || false,
        serves: item.serves || '',
        prepTime: item.prepTime || '',
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        note: item.note || '',
        image: item.image || '',
        images: Array.isArray(item.images) ? item.images : [],
        order: item.order ?? 99,
      });
    }
  }, [item, categories]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Auto-dismiss error after 10s so a stale network error doesn't linger
  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 10000);
    return () => clearTimeout(t);
  }, [error]);

  const set = (field) => (e) => {
    const value = e.target.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value))
      : e.target.type === 'checkbox' ? e.target.checked
      : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('Item name is required.');
      return;
    }
    if (!form.categoryId) {
      setError('Category is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        categoryId: form.categoryId,
        price: form.price !== '' ? form.price : undefined,
        description: form.description || undefined,
        rating: form.rating !== '' ? form.rating : undefined,
        badge: form.badge || undefined,
        isBestSeller: form.isBestSeller,
        serves: form.serves || undefined,
        prepTime: form.prepTime || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        note: form.note || undefined,
        image: form.image || undefined,
        images: form.images.length > 0 ? form.images : (form.image ? [form.image] : undefined),
        order: form.order,
      };

      let result;
      if (isEditing) {
        result = await updateItem(item.id, payload);
      } else {
        payload.id = form.id.trim() || form.name.toLowerCase().replace(/\s+/g, '-');
        result = await createItem(payload);
      }
      onSaved(result.data);
    } catch (err) {
      setError(err.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item?.id) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteItem(item.id);
      onDeleted(item.id);
    } catch (err) {
      setError(err.message || 'Failed to delete item');
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="iem-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="iem-modal">
        <div className="iem-header">
          <h2 className="iem-title">{isEditing ? 'Edit Item' : 'Add Item'}</h2>
          <button className="iem-close" onClick={onClose} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="iem-form">
          {error && <div className="iem-error">{error}</div>}

          <div className="iem-row">
            <div className="iem-field" style={{ flex: 2 }}>
              <label className="iem-label">Name <span className="iem-req">*</span></label>
              <input className="iem-input" type="text" value={form.name} onChange={set('name')} placeholder="Item name" required />
              <span className="iem-hint">The dish name shown to customers.</span>
            </div>
            <div className="iem-field">
              <label className="iem-label">Price (₱)</label>
              <input className="iem-input" type="number" value={form.price} onChange={set('price')} min="0" step="1" placeholder="0" />
              <span className="iem-hint">Leave blank if price varies by size.</span>
            </div>
          </div>

          {!isEditing && (
            <div className="iem-field">
              <label className="iem-label">ID (URL slug)</label>
              <input className="iem-input" type="text" value={form.id} onChange={set('id')} placeholder="Auto-generated from name if empty" />
              <span className="iem-hint">Leave blank — we&rsquo;ll create it from the name.</span>
            </div>
          )}

          <div className="iem-field">
            <label className="iem-label">Category <span className="iem-req">*</span></label>
            <select className="iem-input" value={form.categoryId} onChange={set('categoryId')} required>
              <option value="">— Select category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
            <span className="iem-hint">Choose which section this item belongs to.</span>
          </div>

          <div className="iem-field">
            <label className="iem-label">Description</label>
            <textarea className="iem-input iem-textarea" value={form.description} onChange={set('description')} placeholder="Item description" rows={3} />
          </div>

          <div className="iem-row">
            <div className="iem-field">
              <label className="iem-label">Rating (0–5)</label>
              <input className="iem-input" type="number" value={form.rating} onChange={set('rating')} min="0" max="5" step="0.1" />
            </div>
            <div className="iem-field">
              <label className="iem-label">Badge</label>
              <input className="iem-input" type="text" value={form.badge} onChange={set('badge')} placeholder="e.g. Best Seller" />
            </div>
          </div>

          <div className="iem-row">
            <div className="iem-field">
              <label className="iem-label">Serves</label>
              <input className="iem-input" type="text" value={form.serves} onChange={set('serves')} placeholder="e.g. 1 person" />
            </div>
            <div className="iem-field">
              <label className="iem-label">Prep Time</label>
              <input className="iem-input" type="text" value={form.prepTime} onChange={set('prepTime')} placeholder="e.g. ~5 mins" />
            </div>
            <div className="iem-field">
              <label className="iem-label">Order</label>
              <input className="iem-input" type="number" value={form.order} onChange={set('order')} min="0" />
            </div>
          </div>

          <div className="iem-row">
            <div className="iem-field">
              <label className="iem-label">Tags (comma-separated)</label>
              <input className="iem-input" type="text" value={form.tags} onChange={set('tags')} placeholder="#halohalo, #ube" />
            </div>
            <div className="iem-field">
              <label className="iem-label">Note</label>
              <input className="iem-input" type="text" value={form.note} onChange={set('note')} placeholder="e.g. Available w/ drink upgrade" />
            </div>
          </div>

          <ImageUploadField
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            label="Item Image (main)"
          />

          {/* Gallery images — additional photos for the carousel */}
          <div className="iem-field">
            <label className="iem-label">Gallery Images (for carousel)</label>
            {form.images.length > 0 && (
              <div className="iem-gallery-previews">
                {form.images.map((url, i) => (
                  <div key={i} className="iem-gallery-chip">
                    <img src={url} alt={`Gallery ${i + 1}`} className="iem-gallery-thumb" />
                    <button
                      type="button"
                      className="iem-gallery-remove"
                      onClick={() => setForm((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, idx) => idx !== i),
                      }))}
                      aria-label="Remove image"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <ImageUploadField
              value=""
              onChange={(url) => {
                if (url) {
                  setForm((prev) => ({
                    ...prev,
                    images: [...prev.images, url],
                  }));
                }
              }}
              label=""
            />
            <span className="iem-hint">Upload additional photos shown in the product carousel</span>
          </div>

          <label className="iem-checkbox">
            <input type="checkbox" checked={form.isBestSeller} onChange={set('isBestSeller')} />
            <span>Best Seller</span>
          </label>

          <div className="iem-actions">
            <button type="button" className="iem-btn iem-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="iem-btn iem-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>

        {isEditing && (
          <div className="iem-delete-section">
            {showConfirm ? (
              <div className="iem-confirm">
                <p className="iem-confirm-text">Delete "{item.name}"? This cannot be undone.</p>
                <div className="iem-confirm-actions">
                  <button className="iem-btn iem-btn-secondary" onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className="iem-btn iem-btn-danger" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete Item'}
                  </button>
                </div>
              </div>
            ) : (
              <button className="iem-delete-link" onClick={() => setShowConfirm(true)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                Delete this item
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .iem-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .iem-modal {
          background: var(--color-surface-container-lowest);
          border-radius: var(--radius-2xl);
          width: 100%; max-width: 600px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: var(--shadow-xl);
        }
        .iem-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-outline-variant);
        }
        .iem-title {
          font-family: var(--font-headline);
          font-size: 1.125rem; font-weight: 700;
          color: var(--color-on-surface);
          margin: 0;
        }
        .iem-close {
          background: none; border: none; cursor: pointer;
          color: var(--color-on-surface-variant);
          padding: 4px; border-radius: var(--radius-full);
          display: flex;
        }
        .iem-close:hover { background: var(--color-surface-container); }
        .iem-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .iem-error {
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          padding: 0.75rem; border-radius: var(--radius-lg);
          font-size: 0.8125rem;
        }
        .iem-field { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; }
        .iem-label {
          font-size: 0.8125rem; font-weight: 600;
          color: var(--color-on-surface-variant);
        }
        .iem-req { color: var(--color-error); margin-left: 2px; }
        .iem-hint {
          font-size: 0.75rem;
          color: var(--color-outline);
          font-style: italic;
          margin-top: 0.125rem;
        }
        .iem-input {
          padding: 0.625rem 0.75rem;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: var(--color-surface-container-lowest);
          color: var(--color-on-surface);
          font-family: inherit;
        }
        .iem-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-container);
        }
        .iem-textarea { resize: vertical; min-height: 60px; }
        .iem-row { display: flex; gap: 1rem; }
        .iem-hint {
          font-size: 0.75rem;
          color: var(--color-outline);
          font-style: italic;
          margin-top: 0.125rem;
        }
        .iem-gallery-previews {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .iem-gallery-chip {
          position: relative;
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-outline-variant);
        }
        .iem-gallery-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .iem-gallery-remove {
          position: absolute;
          top: 1px;
          right: 1px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.6);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          opacity: 0;
          transition: opacity 0.15s;
        }
        .iem-gallery-chip:hover .iem-gallery-remove {
          opacity: 1;
        }
        @media (max-width: 480px) { .iem-row { flex-direction: column; gap: 0.75rem; } }
        .iem-checkbox {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.875rem; font-weight: 600;
          color: var(--color-on-surface);
          cursor: pointer;
        }
        .iem-checkbox input { width: 18px; height: 18px; cursor: pointer; }
        .iem-actions {
          display: flex; gap: 0.75rem; justify-content: flex-end;
          padding-top: 0.5rem;
        }
        .iem-btn {
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius-lg);
          font-size: 0.875rem; font-weight: 600;
          cursor: pointer; border: none;
          transition: opacity 0.15s;
        }
        .iem-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .iem-btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
        .iem-btn-secondary { background: var(--color-surface-container); color: var(--color-on-surface); }
        .iem-btn-danger { background: var(--color-error); color: var(--color-on-error); }
        .iem-delete-section {
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid var(--color-outline-variant);
        }
        .iem-delete-link {
          display: inline-flex; align-items: center; gap: 0.375rem;
          background: none; border: none; cursor: pointer;
          color: var(--color-error); font-size: 0.8125rem; font-weight: 600;
          padding: 0.25rem 0;
        }
        .iem-delete-link:hover { opacity: 0.8; }
        .iem-confirm-text {
          font-size: 0.875rem; color: var(--color-on-surface);
          margin-bottom: 0.75rem; line-height: 1.5;
        }
        .iem-confirm-actions { display: flex; gap: 0.75rem; }
      `}</style>
    </div>
  );
}
