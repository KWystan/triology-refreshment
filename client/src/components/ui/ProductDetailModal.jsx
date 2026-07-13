/**
 * ProductDetailModal — landscape product detail with image carousel,
 * badge, rating, description, tags, serving info, and favorites.
 *
 * Props:
 *   item              — product item object
 *   categoryLabel     — category name string
 *   categoryPriceNote — optional category-level price note (e.g. "₱89 Reg / ₱109 Big")
 *   onClose           — () => void
 *   onAddToCart       — (item) => void
 *   isFavorited       — boolean
 *   onToggleFavorite  — (item) => void
 */
import { useState, useEffect, useCallback } from 'react';
import Icon from './Icon';

/* ─── Price formatting ─────────────────────────────────────── */
function formatPrice(item, categoryPriceNote) {
  if (item.price != null) return `₱${item.price}`;
  if (item.variants && item.variants.length > 0) {
    const prices = item.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₱${min}` : `₱${min} – ₱${max}`;
  }
  return categoryPriceNote || '';
}

/* ─── Star rating renderer ─────────────────────────────────── */
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= full) stars.push('star');
    else if (i === full + 1 && half) stars.push('star_half');
    else stars.push('star_outline');
  }
  return (
    <div className="pdm-stars">
      {stars.map((s, i) => (
        <span
          key={i}
          className="material-symbols-outlined pdm-star-icon"
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 300" }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Product Detail Modal
   ═══════════════════════════════════════════════════════════════ */
export default function ProductDetailModal({
  item,
  categoryLabel,
  categoryPriceNote,
  onClose,
  onAddToCart,
  isFavorited = false,
  onToggleFavorite,
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const images = item.images?.length
    ? item.images
    : item.image
      ? [item.image]
      : [];

  const displayPrice = item.displayPrice || formatPrice(item, categoryPriceNote);

  /* ─── Keyboard navigation ─────────────────────────────── */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')
        setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === 'ArrowRight')
        setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0));
    },
    [onClose, images.length],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleAdd = () => {
    setAdded(true);
    onAddToCart(item);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pdm-overlay" onClick={handleBackdrop}>
      <div className="pdm-modal" role="dialog" aria-label={item.name} aria-modal="true">

        {/* ═══════════════════════════════════════════════════════
            Left — Image carousel
            ═══════════════════════════════════════════════════════ */}
        <div className="pdm-image-col">
          <div className="pdm-carousel">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${item.name} ${i + 1}`}
                className="pdm-carousel-img"
                loading="lazy"
                style={{ display: i === imgIndex ? 'block' : 'none' }}
              />
            ))}
            {images.length > 1 && (
              <>
                <button
                  className="pdm-arrow pdm-arrow-left btn-interact"
                  onClick={() => setImgIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
                  aria-label="Previous image"
                >
                  <Icon name="chevron_left" size={22} />
                </button>
                <button
                  className="pdm-arrow pdm-arrow-right btn-interact"
                  onClick={() => setImgIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
                  aria-label="Next image"
                >
                  <Icon name="chevron_right" size={22} />
                </button>
                <div className="pdm-dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`pdm-dot${i === imgIndex ? ' pdm-dot-active' : ''}`}
                      onClick={() => setImgIndex(i)}
                      aria-label={`Image ${i + 1} of ${images.length}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            Right — Product details
            ═══════════════════════════════════════════════════════ */}
        <div className="pdm-details-col">
          {/* ── Top bar ──────────────────────────────────── */}
          <div className="pdm-topbar">
            <button className="pdm-icon-btn" onClick={onClose} aria-label="Close">
              <Icon name="close" size={22} />
            </button>
            {onToggleFavorite && (
              <button
                className="pdm-icon-btn"
                onClick={() => onToggleFavorite(item)}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    fontVariationSettings: `'FILL' ${isFavorited ? 1 : 0}, 'wght' 400`,
                    color: isFavorited ? 'var(--color-error)' : 'var(--color-on-surface-variant)',
                    transition: 'color 0.2s, transform 0.2s',
                  }}
                >
                  favorite
                </span>
              </button>
            )}
          </div>

          {/* ── Badge ────────────────────────────────────── */}
          {item.badge && (
            <span className="pdm-badge">{item.badge}</span>
          )}

          {/* ── Category + Name + Price ──────────────────── */}
          {categoryLabel && (
            <span className="pdm-category">{categoryLabel}</span>
          )}
          <h2 className="pdm-name">{item.name}</h2>
          <p className="pdm-price">{displayPrice}</p>

          {/* ── Rating ────────────────────────────────────── */}
          {item.rating && (
            <div className="pdm-rating-row">
              <StarRating rating={item.rating} />
              <span className="pdm-rating-text">{item.rating}</span>
            </div>
          )}

          {/* ── Divider ──────────────────────────────────── */}
          <div className="pdm-divider" />

          {/* ── Description ──────────────────────────────── */}
          {item.description ? (
            <p className="pdm-description">{item.description}</p>
          ) : item.note ? (
            <p className="pdm-description pdm-note">{item.note}</p>
          ) : null}

          {/* ── Tags ───────────────────────────────────────── */}
          {item.tags?.length > 0 && (
            <div className="pdm-tags">
              {item.tags.map((tag) => (
                <span key={tag} className="pdm-tag">{tag}</span>
              ))}
            </div>
          )}

          {/* ── Serving info grid ──────────────────────────── */}
          {(item.serves || item.prepTime) && (
            <div className="pdm-meta-grid">
              {item.serves && (
                <div className="pdm-meta-item">
                  <span className="pdm-meta-icon material-symbols-outlined">restaurant</span>
                  <div>
                    <span className="pdm-meta-label">Serves</span>
                    <span className="pdm-meta-value">{item.serves}</span>
                  </div>
                </div>
              )}
              {item.prepTime && (
                <div className="pdm-meta-item">
                  <span className="pdm-meta-icon material-symbols-outlined">schedule</span>
                  <div>
                    <span className="pdm-meta-label">Prep Time</span>
                    <span className="pdm-meta-value">{item.prepTime}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Add to Order List ────────────────────────────── */}
          <button
            onClick={handleAdd}
            className={`btn-interact pdm-add-btn${added ? ' pdm-add-btn-done' : ''}`}
            disabled={added}
          >
            <span className="pdm-add-icon material-symbols-outlined">playlist_add</span>
            {added ? 'Added!' : 'Add to List'}
          </button>
        </div>
      </div>

      <style>{`
        /* ─── Overlay ─────────────────────────────────────── */
        .pdm-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          padding: 1rem;
        }

        /* ─── Modal — landscape row ─────────────────────────── */
        .pdm-modal {
          display: flex;
          flex-direction: row;
          background: var(--color-surface-container-lowest);
          border-radius: var(--radius-2xl);
          max-width: 780px;
          width: 100%;
          max-height: 85vh;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
          animation: pdm-in 0.25s ease;
          overflow: hidden;
        }

        @keyframes pdm-in {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* ─── Left: image column ────────────────────────────── */
        .pdm-image-col {
          flex: 0 0 45%;
          background: var(--color-surface-container);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 380px;
        }

        .pdm-carousel {
          position: relative;
          width: 100%;
          height: 100%;
          aspect-ratio: 1 / 1;
        }

        .pdm-carousel-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 1.5rem;
        }

        .pdm-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.85);
          color: var(--color-on-surface);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
          transition: background 0.15s, transform 0.15s;
        }
        .pdm-arrow:hover {
          background: #fff;
          transform: translateY(-50%) scale(1.08);
        }
        .pdm-arrow-left  { left: 0.75rem; }
        .pdm-arrow-right { right: 0.75rem; }

        .pdm-dots {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
        }

        .pdm-dot {
          width: 8px;
          height: 8px;
          border-radius: var(--radius-full);
          border: none;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .pdm-dot-active {
          background: var(--color-primary);
          transform: scale(1.35);
          box-shadow: 0 0 4px rgba(45, 106, 79, 0.4);
        }

        /* ─── Right: details column ─────────────────────────── */
        .pdm-details-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1.25rem 1.5rem 1.5rem;
          overflow-y: auto;
          gap: 0.625rem;
        }

        .pdm-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .pdm-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: none;
          background: var(--color-surface-container);
          border-radius: var(--radius-full);
          cursor: pointer;
          color: var(--color-on-surface-variant);
          transition: background 0.2s;
        }
        .pdm-icon-btn:hover {
          background: var(--color-surface-container-high);
        }

        /* ─── Badge ─────────────────────────────────────────── */
        .pdm-badge {
          display: inline-block;
          align-self: flex-start;
          padding: 0.2rem 0.7rem;
          background: linear-gradient(135deg, var(--color-secondary), #f59e0b);
          color: #fff;
          border-radius: var(--radius-full);
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* ─── Text hierarchy ────────────────────────────────── */
        .pdm-category {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--color-primary);
        }

        .pdm-name {
          font-family: var(--font-headline);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-on-surface);
          line-height: 1.15;
          margin: 0;
        }

        .pdm-price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0 0 0.25rem;
        }

        /* ─── Rating ────────────────────────────────────────── */
        .pdm-rating-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pdm-stars {
          display: flex;
          gap: 1px;
        }

        .pdm-star-icon {
          font-size: 1rem !important;
          color: #f59e0b;
        }

        .pdm-rating-text {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-on-surface-variant);
        }

        /* ─── Divider ───────────────────────────────────────── */
        .pdm-divider {
          height: 1px;
          background: var(--color-outline-variant);
          margin: 0.125rem 0;
        }

        /* ─── Description ───────────────────────────────────── */
        .pdm-description {
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-on-surface-variant);
          margin: 0;
        }
        .pdm-note {
          font-style: italic;
          color: var(--color-on-surface-variant);
        }

        /* ─── Tags ──────────────────────────────────────────── */
        .pdm-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .pdm-tag {
          display: inline-block;
          padding: 0.2rem 0.6rem;
          background: var(--color-secondary-container);
          color: var(--color-on-secondary-container);
          border-radius: var(--radius-full);
          font-size: 0.6875rem;
          font-weight: 600;
        }

        /* ─── Meta grid (Serves / Prep time) ────────────────── */
        .pdm-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          background: var(--color-surface-container);
          border-radius: var(--radius-lg);
          padding: 0.75rem 1rem;
        }

        .pdm-meta-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .pdm-meta-icon {
          font-size: 1.25rem !important;
          color: var(--color-primary);
        }

        .pdm-meta-item div {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .pdm-meta-label {
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-on-surface-variant);
        }

        .pdm-meta-value {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }

        /* ─── Add to Cart ───────────────────────────────────── */
        .pdm-add-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: auto;
          padding: 0.8rem 1rem;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          font-weight: 700;
          cursor: pointer;
          background: var(--color-primary);
          color: var(--color-on-primary);
          transition: background 0.2s, opacity 0.2s, transform 0.15s;
        }
        .pdm-add-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .pdm-add-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .pdm-add-btn-done {
          background: var(--color-primary) !important;
          opacity: 0.8;
          cursor: default;
        }

        .pdm-add-icon {
          font-size: 1.125rem !important;
          font-variation-settings: "'FILL' 1, 'wght' 400";
        }

        /* ─── Mobile: stack vertically ──────────────────────── */
        @media (max-width: 640px) {
          .pdm-modal {
            flex-direction: column;
            max-height: 90vh;
            border-radius: var(--radius-xl);
          }

          .pdm-image-col {
            flex: none;
            min-height: 260px;
            max-height: 300px;
          }

          .pdm-carousel {
            aspect-ratio: unset;
            height: 100%;
          }

          .pdm-details-col {
            padding: 1rem 1.25rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
