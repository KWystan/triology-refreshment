/**
 * CategoryEditorModal — create or edit a menu category.
 *
 * Props:
 *   category  — existing category to edit, or null for create
 *   onClose   — () => void
 *   onSaved   — (category) => void
 *   onDeleted — (categoryId) => void
 */
import { useState, useEffect, useCallback } from 'react';
import { createCategory, updateCategory, deleteCategory } from '../../lib/menuApi';
import ImageUploadField from './ImageUploadField';

const LAYOUT_OPTIONS = [
  { value: 'compact-square', label: 'Compact Square (Halo-Halo)' },
  { value: 'rice-card', label: 'Rice Card' },
  { value: 'circular', label: 'Circular (Breakfast)' },
  { value: 'compact-card', label: 'Compact Card (Pasta)' },
  { value: 'platter-grid', label: 'Platter Grid' },
  { value: 'horizontal-list', label: 'Horizontal List' },
  { value: 'horizontal-card', label: 'Horizontal Card' },
];

export default function CategoryEditorModal({ category, onClose, onSaved, onDeleted }) {
  const isEditing = !!category;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    label: '',
    id: '',
    layout: 'compact-card',
    priceNote: '',
    note: '',
    order: 99,
    categoryImage: '',
  });

  useEffect(() => {
    if (category) {
      setForm({
        label: category.label || '',
        id: category.id || '',
        layout: category.layout || 'compact-card',
        priceNote: category.priceNote || '',
        note: category.note || '',
        order: category.order ?? 99,
        categoryImage: category.categoryImage || '',
      });
    }
  }, [category]);

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

  // Error persists until the user changes a field or closes the modal
  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Item count for the delete confirmation warning
  const itemCount = isEditing ? (category.items?.length || 0) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.label.trim()) {
      setError('Category label is required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        label: form.label.trim(),
        layout: form.layout,
        priceNote: form.priceNote || undefined,
        note: form.note || undefined,
        order: form.order,
        categoryImage: form.categoryImage || undefined,
      };

      let result;
      if (isEditing) {
        result = await updateCategory(category.id, payload);
      } else {
        payload.id = form.id.trim() || form.label.toLowerCase().replace(/\s+/g, '-');
        result = await createCategory(payload);
      }
      onSaved(result.data);
    } catch (err) {
      setError(err.message || 'Failed to save category');
      // Map server field-level errors to inline field errors
      const serverErrors = err.body?.error?.errors;
      if (serverErrors && Array.isArray(serverErrors)) {
        const fe = {};
        serverErrors.forEach((e) => {
          if (e.field) fe[e.field] = e.message;
        });
        setFieldErrors(fe);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!category?.id) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteCategory(category.id);
      onDeleted(category.id);
    } catch (err) {
      setError(err.message || 'Failed to delete category');
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="aem-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="aem-modal">
        <div className="aem-header">
          <h2 className="aem-title">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
          <button className="aem-close" onClick={onClose} aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="aem-form">
          {error && <div className="aem-error">{error}</div>}

          <div className="aem-field">
            <label className="aem-label">Label <span className="aem-req">*</span></label>
            <input
              className={`aem-input${fieldErrors.label ? ' aem-input-error' : ''}`}
              type="text"
              value={form.label}
              onChange={handleChange('label')}
              placeholder="e.g. Halo-Halo Overloads"
              required
            />
            {fieldErrors.label && <span className="aem-field-error">{fieldErrors.label}</span>}
            <span className="aem-hint">This is the category name customers see.</span>
          </div>

          {!isEditing && (
            <div className="aem-field">
              <label className="aem-label">ID (URL slug)</label>
              <input
                className="aem-input"
                type="text"
                value={form.id}
                onChange={handleChange('id')}
                placeholder="Auto-generated from label if empty"
              />
              <span className="aem-hint">Leave blank — we&rsquo;ll create it from the label.</span>
            </div>
          )}

          <div className="aem-field">
            <label className="aem-label">Layout</label>
            <select className="aem-input" value={form.layout} onChange={handleChange('layout')}>
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="aem-row">
            <div className="aem-field">
              <label className="aem-label">Price Note</label>
              <input
                className="aem-input"
                type="text"
                value={form.priceNote}
                onChange={handleChange('priceNote')}
                placeholder="e.g. ₱89 Reg / ₱109 Big"
              />
            </div>
            <div className="aem-field">
              <label className="aem-label">Order</label>
              <input
                className="aem-input"
                type="number"
                value={form.order}
                onChange={handleChange('order')}
                min="0"
              />
            </div>
          </div>

          <div className="aem-field">
            <label className="aem-label">Note</label>
            <input
              className="aem-input"
              type="text"
              value={form.note}
              onChange={handleChange('note')}
              placeholder="e.g. All include a drink"
            />
          </div>

          <ImageUploadField
            value={form.categoryImage}
            onChange={(url) => setForm((prev) => ({ ...prev, categoryImage: url }))}
            label="Category Image"
          />

          <div className="aem-actions">
            <button type="button" className="aem-btn aem-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="aem-btn aem-btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>

        {isEditing && (
          <div className="aem-delete-section">
            {showConfirm ? (
              <div className="aem-confirm">
                <p className="aem-confirm-text">
                  Delete <strong>&ldquo;{category.label}&rdquo;</strong>?
                  {itemCount > 0
                    ? <> This will also permanently delete <strong>{itemCount}</strong> item{itemCount !== 1 ? 's' : ''} inside it. This cannot be undone.</>
                    : <> This cannot be undone.</>}
                </p>
                <div className="aem-confirm-actions">
                  <button
                    className="aem-btn aem-btn-secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="aem-btn aem-btn-danger"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Category'}
                  </button>
                </div>
              </div>
            ) : (
              <button className="aem-delete-link" onClick={() => setShowConfirm(true)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                Delete this category
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        .aem-overlay {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
        }
        .aem-modal {
          background: var(--color-surface-container-lowest);
          border-radius: var(--radius-2xl);
          width: 100%; max-width: 520px;
          max-height: 90vh; overflow-y: auto;
          box-shadow: var(--shadow-xl);
        }
        .aem-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--color-outline-variant);
        }
        .aem-title {
          font-family: var(--font-headline);
          font-size: 1.125rem; font-weight: 700;
          color: var(--color-on-surface);
          margin: 0;
        }
        .aem-close {
          background: none; border: none; cursor: pointer;
          color: var(--color-on-surface-variant);
          padding: 4px; border-radius: var(--radius-full);
          display: flex;
        }
        .aem-close:hover { background: var(--color-surface-container); }
        .aem-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .aem-error {
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          padding: 0.75rem; border-radius: var(--radius-lg);
          font-size: 0.8125rem;
        }
        .aem-field { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; }
        .aem-label {
          font-size: 0.8125rem; font-weight: 600;
          color: var(--color-on-surface-variant);
        }
        .aem-req { color: var(--color-error); margin-left: 2px; }
        .aem-hint {
          font-size: 0.75rem;
          color: var(--color-outline);
          font-style: italic;
          margin-top: 0.125rem;
        }
        .aem-input {
          padding: 0.625rem 0.75rem;
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: var(--color-surface-container-lowest);
          color: var(--color-on-surface);
          font-family: inherit;
        }
        .aem-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px var(--color-primary-container);
        }
        .aem-row { display: flex; gap: 1rem; }
        .aem-input-error {
          border-color: var(--color-error) !important;
          box-shadow: 0 0 0 2px var(--color-error-container) !important;
        }
        .aem-field-error {
          font-size: 0.75rem;
          color: var(--color-error);
          font-weight: 500;
          margin-top: 0.125rem;
        }
        .aem-actions {
          display: flex; gap: 0.75rem; justify-content: flex-end;
          padding-top: 0.5rem;
        }
        .aem-btn {
          padding: 0.625rem 1.25rem;
          border-radius: var(--radius-lg);
          font-size: 0.875rem; font-weight: 600;
          cursor: pointer; border: none;
          transition: opacity 0.15s;
        }
        .aem-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .aem-btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
        .aem-btn-secondary {
          background: var(--color-surface-container);
          color: var(--color-on-surface);
        }
        .aem-btn-danger {
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          border: 1px solid var(--color-error);
        }
        .aem-delete-section {
          padding: 1rem 1.5rem 1.5rem;
          border-top: 1px solid var(--color-outline-variant);
        }
        .aem-delete-link {
          display: inline-flex; align-items: center; gap: 0.375rem;
          background: none; border: none; cursor: pointer;
          color: var(--color-error); font-size: 0.8125rem; font-weight: 600;
          padding: 0.25rem 0;
        }
        .aem-delete-link:hover { opacity: 0.8; }
        .aem-confirm-text {
          font-size: 0.875rem; color: var(--color-on-surface);
          margin-bottom: 0.75rem; line-height: 1.5;
        }
        .aem-confirm-actions { display: flex; gap: 0.75rem; }
      `}</style>
    </div>
  );
}
