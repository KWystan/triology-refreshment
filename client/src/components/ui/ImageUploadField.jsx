/**
 * ImageUploadField — file picker that uploads to Cloudinary and returns the URL.
 *
 * Props:
 *   value    — current image URL (string)
 *   onChange — (url: string) => void, called after successful upload or clear
 *   label    — field label text
 *   accept   — accepted MIME types (default "image/*")
 */
import { useState, useRef } from 'react';
import { uploadImage } from '../../lib/menuApi';

export default function ImageUploadField({ value, onChange, label = 'Image', accept = 'image/*' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (defensive — accept attr should handle this but
    // some mobile browsers bypass it)
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      onChange(result.data.url);
    } catch (err) {
      setError(err.message || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="iuf-container">
      <label className="iuf-label">{label}</label>

      {/* Preview when an image exists */}
      {value ? (
        <div className="iuf-preview-wrap">
          <img
            src={value}
            alt="Upload preview"
            className="iuf-preview"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="iuf-preview-actions">
            <button
              type="button"
              className="iuf-btn iuf-btn-change"
              onClick={() => inputRef.current?.click()}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>sync</span>
              Change
            </button>
            <button
              type="button"
              className="iuf-btn iuf-btn-remove"
              onClick={handleRemove}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Upload area — clickable */
        <div
          className={`iuf-dropzone${uploading ? ' iuf-uploading' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!uploading) inputRef.current?.click();
            }
          }}
        >
          {uploading ? (
            <div className="iuf-uploading-state">
              <span className="material-symbols-outlined iuf-spinner">sync</span>
              <span>Uploading…</span>
            </div>
          ) : (
            <div className="iuf-dropzone-content">
              <span className="material-symbols-outlined iuf-upload-icon">add_photo_alternate</span>
              <span className="iuf-dropzone-text">
                Tap to choose a photo
              </span>
              <span className="iuf-dropzone-hint">
                From your desktop or phone gallery
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFile}
        capture="environment"
      />

      {/* Error message */}
      {error && <div className="iuf-error">{error}</div>}

      <style>{`
        .iuf-container {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
        }
        .iuf-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }
        .iuf-dropzone {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 120px;
          border: 2px dashed var(--color-outline-variant);
          border-radius: var(--radius-xl);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
          padding: 1rem;
          background: var(--color-surface-container-lowest);
        }
        .iuf-dropzone:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-container);
        }
        .iuf-dropzone:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
        .iuf-dropzone.iuf-uploading {
          border-color: var(--color-primary);
          cursor: not-allowed;
          opacity: 0.7;
        }
        .iuf-dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
          text-align: center;
        }
        .iuf-upload-icon {
          font-size: 32px !important;
          color: var(--color-primary);
        }
        .iuf-dropzone-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }
        .iuf-dropzone-hint {
          font-size: 0.75rem;
          color: var(--color-on-surface-variant);
        }
        .iuf-uploading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary);
          font-size: 0.875rem;
          font-weight: 600;
        }
        .iuf-spinner {
          font-size: 28px !important;
          animation: iuf-spin 1s linear infinite;
        }
        @keyframes iuf-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .iuf-preview-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .iuf-preview {
          width: 100%;
          max-height: 200px;
          object-fit: cover;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-outline-variant);
        }
        .iuf-preview-actions {
          display: flex;
          gap: 0.5rem;
        }
        .iuf-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-lg);
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid var(--color-outline-variant);
          transition: opacity 0.15s;
        }
        .iuf-btn:hover { opacity: 0.8; }
        .iuf-btn-change {
          background: var(--color-surface-container);
          color: var(--color-on-surface);
        }
        .iuf-btn-remove {
          background: transparent;
          color: var(--color-error);
          border-color: var(--color-error);
        }
        .iuf-error {
          background: var(--color-error-container);
          color: var(--color-on-error-container);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-lg);
          font-size: 0.8125rem;
        }
      `}</style>
    </div>
  );
}
