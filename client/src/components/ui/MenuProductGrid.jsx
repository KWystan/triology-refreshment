/**
 * MenuProductGrid — filterable product grid with category sections.
 *
 * Layout:
 *   - Pill-shaped filter tabs (All + each category)
 *   - Category section headers (title, separator line, notes)
 *   - Responsive product card grid (4→2→1 columns)
 *
 * Props:
 *   categories     — menuCategories array from data/menuItems
 *   onAddToCart    — (item) => void, called when Add to Cart is clicked
 *   adminMode      — boolean, shows edit/delete controls when true
 *   onEditItem     — (item) => void, admin edit callback
 *   onAddItem      — (categoryId) => void, admin add item callback
 *   onEditCategory — (category) => void, admin edit category callback
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import ProductDetailModal from './ProductDetailModal';
import BestSellerBadge from './BestSellerBadge';
import SearchBar from './SearchBar';
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
function CategoryHeader({ category, adminMode, onEditCategory }) {
  const { label, priceNote, note } = category;
  return (
    <div className="mpg-section-header">
      <h2 className="mpg-section-title">{label}</h2>
      {adminMode && (
        <button
          className="mpg-admin-btn mpg-admin-header-btn"
          onClick={() => onEditCategory?.(category)}
          title="Edit category"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
          <span className="mpg-admin-btn-label">Edit</span>
        </button>
      )}
      <div className="mpg-section-line" />
      {priceNote && <span className="mpg-section-note">{priceNote}</span>}
      {note && <span className="mpg-section-note-italic">{note}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ProductCard
   ═══════════════════════════════════════════════════════════════ */
function ProductCard({ item, onAddToCart, onClick, adminMode, onEditItem }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAdd = useCallback((e) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart(item);
    setTimeout(() => setAdded(false), 2000);
  }, [item, onAddToCart]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEditItem?.(item);
  }, [item, onEditItem]);

  return (
    <div className="mpg-card" style={adminMode ? { position: 'relative' } : undefined} onClick={onClick}>
      {/* Best Seller badge — positioned relative to the card, overhangs the edge */}
      {item.isBestSeller && <BestSellerBadge size={60} />}

      {/* Image with FAB */}
      <div className="mpg-card-img-wrap">
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
        {/* Floating action button — replaces full-width "Add to Cart" */}
        <button
          onClick={handleAdd}
          className={`mpg-card-fab${added ? ' mpg-card-fab-added' : ''}`}
          disabled={added}
          aria-label={`Add ${item.name} to order list`}
        >
          <span className="material-symbols-outlined mpg-card-fab-icon">
            {added ? 'check' : 'add'}
          </span>
        </button>
      </div>

      {/* Price + Name column */}
      <div className="mpg-card-footer">
        <p className="mpg-card-price">{item.displayPrice}</p>
        <h3 className="mpg-card-name">{item.name}</h3>
        {/* Admin edit button — shown below the name */}
        {adminMode && (
          <button className="mpg-admin-edit-link" onClick={handleEdit}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit_square</span>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MenuProductGrid
   ═══════════════════════════════════════════════════════════════ */
export default function MenuProductGrid({
  categories,
  onAddToCart = () => {},
  adminMode = false,
  onEditItem,
  onAddItem,
  onEditCategory,
}) {
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
        {/* Search — mobile above tabs, desktop inline */}
        <div className="mpg-mobile-search">
          <SearchBar categories={categories} />
        </div>

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
          <CategoryHeader
            category={category}
            adminMode={adminMode}
            onEditCategory={onEditCategory}
          />
          <div className="mpg-grid">
            {items.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onClick={() => setSelectedItem(item)}
                adminMode={adminMode}
                onEditItem={onEditItem}
              />
            ))}
          </div>
          {/* Admin "Add Item" button — below each category grid */}
          {adminMode && (
            <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
              <button
                className="mpg-admin-add-item-btn"
                onClick={() => onAddItem?.(category.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Add Item to {category.label}
              </button>
            </div>
          )}
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
        /* Search bar — full-width on mobile, inline on desktop */
        .mpg-mobile-search {
          width: 100%;
        }
        .mpg-mobile-search .search-bar {
          width: 100%;
        }
        @media (min-width: 768px) {
          .mpg-mobile-search {
            width: 300px;
            flex-shrink: 0;
          }
          .mpg-mobile-search .search-bar {
            width: 100%;
          }
        }
        @media (min-width: 1024px) {
          .mpg-mobile-search {
            width: 340px;
          }
        }

        .mpg-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .mpg-toolbar {
            align-items: center;
          }
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
          top: 0;
          right: 0;
          bottom: 0;
          width: 48px;
          background: linear-gradient(
            to right,
            transparent,
            var(--color-surface-container) 85%
          );
          opacity: 0.95;
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
          gap: 12px;
        }
        @media (min-width: 480px) {
          .mpg-grid {
            gap: 16px;
            grid-template-columns: repeat(2, 1fr);
          }
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
          border: 0.5px solid var(--color-outline-variant);
          border-radius: 20px;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          position: relative;
          min-width: 0;
          width: 100%;
        }
        .mpg-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        /* Image container — full-width, square */
        .mpg-card-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: var(--color-surface-container);
          border-radius: 20px 20px 0 0;
          overflow: hidden;
        }

        .mpg-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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

        /* FAB — floating add-to-cart button, bottom-right of image */
        .mpg-card-fab {
          position: absolute;
          bottom: 10px;
          right: 10px;
          z-index: 2;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: var(--color-primary);
          color: var(--color-on-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          transition: background 0.2s ease, transform 0.15s ease;
          padding: 0;
        }
        /* 44x44px touch target on mobile — expands hit area without changing visual size */
        .mpg-card-fab::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border-radius: 50%;
        }
        .mpg-card-fab:hover:not(:disabled) {
          background: color-mix(in srgb, var(--color-primary) 80%, #000);
        }
        .mpg-card-fab:active:not(:disabled) {
          transform: scale(0.9);
        }
        .mpg-card-fab-added {
          background: var(--color-primary) !important;
          cursor: default;
          opacity: 0.85;
        }

        .mpg-card-fab-icon {
          font-size: 18px !important;
          font-variation-settings: "'FILL' 1, 'wght' 400";
        }

        /* Footer — price on top, name below */
        .mpg-card-footer {
          display: flex;
          flex-direction: column;
          padding: 0.75rem;
          gap: 0.125rem;
        }

        /* Price — bold, black */
        .mpg-card-price {
          font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
          font-weight: 700;
          color: var(--color-on-surface);
          text-align: left;
          margin: 0;
          line-height: 1.3;
        }

        /* Name — smaller, regular weight */
        .mpg-card-name {
          font-size: clamp(0.6875rem, 2vw, 0.8125rem);
          font-weight: 400;
          color: var(--color-on-surface-variant);
          text-align: left;
          margin: 0;
          line-height: 1.3;
        }
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

        /* ─── Admin controls ──────────────────────────────── */
        .mpg-admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--color-surface-container-high);
          color: var(--color-on-surface-variant);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .mpg-admin-btn:hover {
          opacity: 0.8;
        }
        .mpg-admin-header-btn {
          margin-right: -0.5rem;
        }

        .mpg-admin-edit-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-primary);
          font-size: 0.6875rem;
          font-weight: 600;
          padding: 0.25rem 0 0;
          margin-top: 0.125rem;
          transition: opacity 0.15s;
        }
        .mpg-admin-edit-link:hover {
          opacity: 0.75;
          text-decoration: underline;
        }

        .mpg-admin-add-item-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: transparent;
          color: var(--color-primary);
          border: 1.5px dashed var(--color-outline-variant);
          border-radius: var(--radius-xl);
          padding: 0.5rem 1rem;
          font-size: 0.8125rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .mpg-admin-add-item-btn:hover {
          background: var(--color-primary-container);
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
