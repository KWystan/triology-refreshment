/**
 * SearchBar — live client-side product search with dropdown results.
 *
 * Flattens all menu items, filters by name as the user types,
 * and shows a dropdown with matching results. Clicking a result
 * navigates to /menu.
 */
import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { menuCategories } from '../../data/menuItems';
import Icon from './Icon';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  /* ─── Flatten items with category context ──────────────── */
  const allItems = useMemo(
    () =>
      menuCategories.flatMap((cat) =>
        cat.items.map((item) => ({
          ...item,
          categoryId: cat.id,
          categoryLabel: cat.label,
          resolvedImage: item.image || cat.categoryImage,
        })),
      ),
    [],
  );

  /* ─── Filter results ───────────────────────────────────── */
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allItems.filter((item) => item.name.toLowerCase().includes(q));
  }, [query, allItems]);

  const showDropdown = open && query.trim().length > 0;

  /* ─── Handle selection ─────────────────────────────────── */
  const handleSelect = () => {
    setQuery('');
    setOpen(false);
    navigate('/menu');
  };

  /* ─── Close on click outside ───────────────────────────── */
  useEffect(() => {
    function handleClick(e) {
      if (
        !dropdownRef.current?.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* ─── Close on Escape ──────────────────────────────────── */
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  /* ─── Result count summary text ─────────────────────────── */
  const resultCount = results.length;

  return (
    <div className="search-bar">
      <Icon name="search" size={20} color="var(--color-on-surface-variant)" />

      <input
        ref={inputRef}
        type="text"
        placeholder="Search product"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          if (query.trim()) setOpen(true);
        }}
        className="search-bar-input"
        aria-label="Search products"
        autoComplete="off"
      />

      {query.trim() && (
        <button
          className="search-bar-clear"
          onClick={() => {
            setQuery('');
            inputRef.current?.focus();
          }}
          aria-label="Clear search"
        >
          <Icon name="close" size={16} />
        </button>
      )}

      {showDropdown && (
        <div className="search-dropdown" ref={dropdownRef}>
          {resultCount === 0 ? (
            <div className="search-dropdown-empty">No products found</div>
          ) : (
            <>
              <div className="search-dropdown-header">
                {resultCount} product{resultCount !== 1 ? 's' : ''} found
              </div>
              {results.slice(0, 10).map((item) => (
                <button
                  key={item.id}
                  className="search-result-item btn-interact"
                  onClick={handleSelect}
                >
                  {imgErrors[item.id] ? (
                    <span className="search-result-fallback material-symbols-outlined">
                      restaurant_menu
                    </span>
                  ) : (
                    <img
                      src={item.resolvedImage}
                      alt={item.name}
                      className="search-result-img"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [item.id]: true }))
                      }
                    />
                  )}
                  <div className="search-result-text">
                    <span className="search-result-name">{item.name}</span>
                    <span className="search-result-category">
                      {item.categoryLabel}
                    </span>
                  </div>
                </button>
              ))}
              {resultCount > 10 && (
                <div className="search-dropdown-more">
                  +{resultCount - 10} more results — refine your search
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: var(--color-surface-container-low);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-full, 9999px);
          padding: 0 0.75rem;
          transition: border-color 0.2s ease, background 0.2s ease;
          width: 200px;
          flex-shrink: 0;
        }
        .search-bar:focus-within {
          border-color: var(--color-primary);
          background: var(--color-surface-container-lowest);
        }

        .search-bar-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.5rem 0;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-on-surface);
          outline: none;
          min-width: 0;
          width: 100%;
        }
        .search-bar-input::placeholder {
          color: var(--color-on-surface-variant);
          font-weight: 400;
        }

        .search-bar-clear {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          cursor: pointer;
          color: var(--color-on-surface-variant);
          padding: 0;
          border-radius: var(--radius-full);
          transition: color 0.15s ease;
        }
        .search-bar-clear:hover {
          color: var(--color-on-surface);
        }

        /* ─── Dropdown ───────────────────────────────────────── */
        .search-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          z-index: 60;
          min-width: 280px;
          background: var(--color-surface-container-lowest);
          border: 1px solid var(--color-outline-variant);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .search-dropdown-header {
          padding: 0.625rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-on-surface-variant);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--color-surface-container-highest);
        }

        .search-dropdown-empty {
          padding: 1.5rem 1rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--color-on-surface-variant);
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.625rem 1rem;
          border: none;
          background: transparent;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .search-result-item:hover {
          background: var(--color-surface-container-high);
        }
        .search-result-item:not(:last-child) {
          border-bottom: 1px solid var(--color-surface-container-highest);
        }

        .search-result-img {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          object-fit: cover;
          flex-shrink: 0;
          background: var(--color-surface-container);
        }

        .search-result-fallback {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          color: var(--color-primary);
          background: var(--color-surface-container);
          flex-shrink: 0;
        }

        .search-result-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .search-result-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-on-surface);
        }

        .search-result-category {
          font-size: 0.75rem;
          color: var(--color-on-surface-variant);
        }

        .search-dropdown-more {
          padding: 0.625rem 1rem;
          font-size: 0.75rem;
          color: var(--color-on-surface-variant);
          text-align: center;
          border-top: 1px solid var(--color-surface-container-highest);
        }

        /* ─── Mobile: narrower fixed width ─────────────────────── */
        @media (max-width: 767px) {
          .search-bar {
            width: 160px;
          }
        }
        @media (max-width: 480px) {
          .search-bar {
            width: 120px;
          }
        }
      `}</style>
    </div>
  );
}
