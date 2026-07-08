/**
 * MenuProductGrid — filterable product grid with category sections.
 *
 * Layout:
 *   - Pill-shaped filter tabs (All + each category)
 *   - Category section headers (title, separator line, notes)
 *   - Responsive product card grid (4→2→1 columns)
 *
 * Props:
 *   categories   — menuCategories array from data/menuItems
 *   onAddToCart  — (item) => void, called when Add to Cart is clicked
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import ProductDetailModal from './ProductDetailModal';
import { CATEGORY_ICONS } from './CategoryIcons';

/* ─── Price formatting helper ─────────────────────────────── */
function formatItemPrice(item, categoryPriceNote) {
  if (item.price != null) return `₱${item.price}`;
  if (item.variants && item.variants.length > 0) {
    const prices = item.variants.map((v) => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `₱${min}` : `₱${min} – ₱${max}`;
  }
  return categoryPriceNote || '';
}

/* ═══════════════════════════════════════════════════════════════
   CategoryHeader — title + separator line + optional notes
   ═══════════════════════════════════════════════════════════════ */
function CategoryHeader({ category }) {
  const { label, priceNote, note } = category;
  return (
    <div className="mpg-section-header">
      <h2 className="mpg-section-title">{label}</h2>
      <div className="mpg-section-line" />
      {priceNote && <span className="mpg-section-note">{priceNote}</span>}
      {note && <span className="mpg-section-note-italic">{note}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ProductCard
   ═══════════════════════════════════════════════════════════════ */
function ProductCard({ item, onAddToCart, onClick, style }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = useCallback((e) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart(item);
    setTimeout(() => setAdded(false), 2000);
  }, [item, onAddToCart]);

  return (
    <div className="mpg-card" style={style} onClick={onClick}>
      {/* Image with badge overlay */}
      <div className="mpg-card-img-wrap">
        {item.badge && <span className="mpg-card-badge">{item.badge}</span>}
        {imgError ? (
          <div className="mpg-card-img-fallback" aria-label={item.name} />
        ) : (
          <img
            src={item.resolvedImage}
            alt={item.name}
            loading="lazy"
            className="mpg-card-img"
            onError={() => setImgError(true)}
          />
        )}
        {/* Gradient overlay at bottom of image */}
        <div className="mpg-card-img-overlay" />
      </div>

      {/* Name */}
      <h3 className="mpg-card-name">{item.name}</h3>

      {/* Price */}
      <p className="mpg-card-price">{item.displayPrice}</p>

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        className={`btn-interact mpg-card-btn${added ? ' mpg-card-btn-added' : ''}`}
        disabled={added}
        aria-label={`Add ${item.name} to cart`}
      >
        {added ? 'Added ✓' : 'Add to Cart'}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MenuProductGrid
   ═══════════════════════════════════════════════════════════════ */
export default function MenuProductGrid({ categories, onAddToCart = () => {} }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    } catch {
      return [];
    }
  });

  /* ─── Persist favorites to localStorage ──────────────────── */
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id],
    );
  }, []);

  const isFavorited = useCallback(
    (item) => favorites.includes(item.id),
    [favorites],
  );

  /* ─── Tabs derived from categories ─────────────────────── */
  const tabs = useMemo(
    () => [{ id: 'all', label: 'All' }, ...categories.map((c) => ({ id: c.id, label: c.label }))],
    [categories],
  );

  /* ─── Flatten items with category context ──────────────── */
  const allItems = useMemo(
    () =>
      categories.flatMap((cat) =>
        cat.items.map((item) => ({
          ...item,
          categoryId: cat.id,
          categoryLabel: cat.label,
          categoryPriceNote: cat.priceNote,
          resolvedImage: item.image || cat.categoryImage,
          displayPrice: formatItemPrice(item, cat.priceNote),
        })),
      ),
    [categories],
  );

  /* ─── Group items into category sections ──────────────────── */
  const categorySections = useMemo(() => {
    if (activeCategory === 'all') {
      return categories
        .map((cat) => ({
          category: cat,
          items: allItems.filter((i) => i.categoryId === cat.id),
        }))
        .filter((s) => s.items.length > 0);
    }

    const cat = categories.find((c) => c.id === activeCategory);
    if (!cat) return [];
    return [
      {
        category: cat,
        items: allItems.filter((i) => i.categoryId === activeCategory),
      },
    ];
  }, [allItems, categories, activeCategory]);

  const hasItems = categorySections.some((s) => s.items.length > 0);

  return (
    <div>
      {/* ═══════════════════════════════════════════════════════
          Toolbar — filter tabs with scroll gradient hint
          ═══════════════════════════════════════════════════════ */}
      <div className="mpg-toolbar">
        {/* Icon slider tabs */}
        <div className="mpg-tabs-scroll-wrap">
          <div className="mpg-tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeCategory;
            const iconData = CATEGORY_ICONS[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`btn-interact mpg-tab${isActive ? ' mpg-tab-active' : ''}`}
                title={tab.label}
              >
                <span className="mpg-tab-icon-wrap">
                  {iconData?.Icon && <iconData.Icon size={24} />}
                </span>
                <span className="mpg-tab-label">{iconData?.shortLabel || tab.label}</span>
              </button>
            );
          })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          Category sections with headers + product grid
          ═══════════════════════════════════════════════════════ */}
      {categorySections.map(({ category, items }) => (
        <div key={category.id} className="mpg-section">
          <CategoryHeader category={category} />
          <div className="mpg-grid">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {!hasItems && (
        <div className="mpg-empty">
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 48, color: 'var(--color-outline-variant)', marginBottom: '0.75rem' }}
          >
            search_off
          </span>
          <p className="mpg-empty-text">No items found in this category.</p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          Product Detail Modal
          ═══════════════════════════════════════════════════════ */}
      {selectedItem && (
        <ProductDetailModal
          item={selectedItem}
          categoryLabel={selectedItem.categoryLabel}
          categoryPriceNote={selectedItem.categoryPriceNote}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
          isFavorited={isFavorited(selectedItem)}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {/* ═══════════════════════════════════════════════════════
          Scoped styles
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        /* ─── Toolbar row ──────────────────────────────────── */
        .mpg-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        /* ─── Scroll wrapper — track + peek affordance ──────── */
        .mpg-tabs-scroll-wrap {
          flex: 1;
          min-width: 0;
          position: relative;
          background: var(--color-surface-container);
          border-radius: var(--radius-2xl);
          padding: 6px;
        }
        /* Right fade gradient to hint there's more to scroll */
        .mpg-tabs-scroll-wrap::after {
          content: '';
          position: absolute;
          top: 6px;
          right: 6px;
          bottom: 6px;
          width: 32px;
          background: linear-gradient(
            to right,
            transparent,
            var(--color-surface-container)
          );
          pointer-events: none;
          border-radius: 0 var(--radius-2xl) var(--radius-2xl) 0;
        }

        /* ─── Icon slider tabs ──────────────────────────────── */
        .mpg-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          flex: 1;
          min-width: 0;
          padding: 0.5rem 0;
          scroll-snap-type: x mandatory;
        }
        .mpg-tabs::-webkit-scrollbar {
          display: none;
        }

        .mpg-tab {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-xl);
          font-size: 0.6875rem;
          font-weight: 600;
          line-height: 1.2;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
          min-width: 0;
          scroll-snap-align: start;
          background: transparent;
        }

        .mpg-tab-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: var(--radius-full);
          transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
        }

        .mpg-tab-active .mpg-tab-icon-wrap {
          background: var(--color-primary);
          color: var(--color-on-primary);
          box-shadow: var(--shadow-sm);
        }

        .mpg-tab:not(.mpg-tab-active) .mpg-tab-icon-wrap {
          background: transparent;
          color: var(--color-on-surface-variant);
          border: 1.5px solid var(--color-outline-variant);
        }
        .mpg-tab:not(.mpg-tab-active):hover .mpg-tab-icon-wrap {
          background: var(--color-surface-container-high);
          border-color: var(--color-outline);
        }

        .mpg-tab-label {
          white-space: nowrap;
        }

        .mpg-tab-active .mpg-tab-label {
          color: var(--color-primary);
          font-weight: 700;
        }

        .mpg-tab:not(.mpg-tab-active) .mpg-tab-label {
          color: var(--color-on-surface-variant);
          font-weight: 500;
        }

        /* ─── Desktop: horizontal pill tabs ──────────────────── */
        @media (min-width: 768px) {
          .mpg-tabs-scroll-wrap {
            background: none;
            padding: 0;
          }
          .mpg-tabs-scroll-wrap::after {
            display: none;
          }

          .mpg-tab {
            flex-direction: row;
            padding: 0.5rem 1.125rem;
            gap: 0.5rem;
            border-radius: var(--radius-full);
            font-size: 0.8125rem;
            font-weight: 600;
            scroll-snap-align: unset;
          }

          .mpg-tab-icon-wrap {
            width: 26px;
            height: 26px;
          }

          /* Active state: entire pill filled */
          .mpg-tab-active {
            background: var(--color-primary);
            color: var(--color-on-primary);
            box-shadow: var(--shadow-sm);
          }
          .mpg-tab-active .mpg-tab-icon-wrap {
            background: transparent;
            color: var(--color-on-primary);
            border: none;
            box-shadow: none;
          }
          .mpg-tab-active .mpg-tab-label {
            color: var(--color-on-primary);
          }

          /* Inactive state: outlined pill */
          .mpg-tab:not(.mpg-tab-active) {
            background: transparent;
            color: var(--color-on-surface-variant);
            border: 1.5px solid var(--color-outline-variant);
          }
          .mpg-tab:not(.mpg-tab-active):hover {
            background: var(--color-surface-container-high);
            border-color: var(--color-outline);
          }
          .mpg-tab:not(.mpg-tab-active) .mpg-tab-icon-wrap {
            background: transparent;
            border: none;
            color: var(--color-primary);
          }
          .mpg-tab:not(.mpg-tab-active) .mpg-tab-label {
            color: inherit;
          }
        }

        /* ─── Category Section ──────────────────────────────── */
        .mpg-section {
          scroll-margin-top: 6rem;
          margin-bottom: 3rem;
        }
        .mpg-section:last-child {
          margin-bottom: 0;
        }

        .mpg-section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .mpg-section-title {
          font-family: var(--font-headline);
          font-size: clamp(1.25rem, 2vw, 1.75rem);
          font-weight: 700;
          color: var(--color-on-surface);
          flex-shrink: 0;
        }

        .mpg-section-line {
          height: 2px;
          flex: 1;
          background: var(--color-outline-variant);
        }

        .mpg-section-note {
          font-size: 0.875rem;
          color: var(--color-primary);
          font-weight: 600;
          flex-shrink: 0;
        }

        .mpg-section-note-italic {
          font-size: 0.8125rem;
          color: var(--color-on-surface-variant);
          font-style: italic;
          flex-shrink: 0;
        }

        /* ─── Product grid ─────────────────────────────────── */
        .mpg-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 640px) {
          .mpg-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .mpg-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* ─── Product card ─────────────────────────────────── */
        .mpg-card {
          display: flex;
          flex-direction: column;
          background: var(--color-surface-container-lowest);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: 1rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .mpg-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        /* Image container — square with light gray bg */
        .mpg-card-img-wrap {
          aspect-ratio: 1 / 1;
          background: var(--color-surface-container);
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin-bottom: 0.875rem;
        }

        .mpg-card-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          transition: transform 0.3s ease;
        }
        .mpg-card:hover .mpg-card-img {
          transform: scale(1.04);
        }

        .mpg-card-img-fallback {
          width: 100%;
          height: 100%;
          background: var(--color-surface-container-high);
        }

        /* Name — centered, medium weight */
        .mpg-card-name {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-on-surface);
          text-align: center;
          margin-bottom: 0.25rem;
          line-height: 1.4;
        }

        /* Price — centered, muted */
        .mpg-card-price {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-on-surface-variant);
          text-align: center;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        /* Add to Cart button — full width, outline style */
        .mpg-card-btn {
          width: 100%;
          margin-top: auto;
          padding: 0.625rem 1rem;
          border-radius: var(--radius-lg);
          font-size: 0.8125rem;
          font-weight: 600;
          line-height: 1.4;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;

          /* Default: white bg, thin border, dark text */
          background: var(--color-surface-container-lowest);
          color: var(--color-on-surface);
          border: 1px solid var(--color-outline);
        }
        .mpg-card-btn:hover:not(:disabled) {
          background: var(--color-surface-container);
          border-color: var(--color-on-surface-variant);
        }

        /* Added state */
        .mpg-card-btn-added {
          background: var(--color-primary) !important;
          color: var(--color-on-primary) !important;
          border-color: var(--color-primary) !important;
          cursor: default;
        }

        /* ─── Empty state ───────────────────────────────────── */
        .mpg-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem;
          text-align: center;
        }

        .mpg-empty-text {
          font-size: 1rem;
          color: var(--color-on-surface-variant);
        }

      `}</style>
    </div>
  );
}
