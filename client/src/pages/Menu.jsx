/**
 * Menu page — "Our Full Menu" with filterable/sortable product grid.
 *
 * Sections:
 *   1. Delivery Banner — fixed-top phone + service area
 *   2. Hero Title — "Our Fresh Local Menu" with decorative blur circle
 *   3. Product Grid — unified MenuProductGrid with category filter pills,
 *      sort dropdown, and uniform product cards
 *   4. Event CTA + Delivery Direct card
 *
 * Admin mode:
 *   When logged in as admin, fetches categories from the API instead of
 *   using static data, and shows CRUD controls (add/edit/delete).
 */
import { useState, useEffect, useCallback } from 'react';
import { menuCategories } from '../data/menuItems';
import { business as businessStatic } from '../data/business';
import Icon from '../components/ui/Icon';
import MenuProductGrid from '../components/ui/MenuProductGrid';
import OrderListDrawer from '../components/ui/OrderListDrawer';
import AdminMenuToolbar from '../components/ui/AdminMenuToolbar';
import CategoryEditorModal from '../components/ui/CategoryEditorModal';
import ItemEditorModal from '../components/ui/ItemEditorModal';
import { useOrderList } from '../context/OrderListContext';
import { useAuth } from '../context/AuthContext';
import { fetchCategories, fetchItems } from '../lib/menuApi';
import { fetchBusiness as fetchBusinessApi } from '../lib/contentApi';

export default function Menu() {
  const { addItem } = useOrderList();
  const { isAdmin, isLoading: authLoading } = useAuth();

  // Global state — all users fetch from API; static data is the fallback
  const [liveCategories, setLiveCategories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [categoryEditor, setCategoryEditor] = useState(null); // null | 'new' | category
  const [itemEditor, setItemEditor] = useState(null);         // null | { categoryId } | item
  const [liveBusiness, setLiveBusiness] = useState(businessStatic); // live data, fall back to static

  // Fetch business info from the API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchBusinessApi();
        if (res?.data) setLiveBusiness(res.data);
      } catch (err) {
        console.warn('[Menu] Business API unavailable, using static fallback:', err.message);
      }
    })();
  }, []);

  // Fetch categories + items from the API (always — for every user)
  const loadMenuData = useCallback(async () => {
    setLoading(true);
    setApiFailed(false);
    try {
      const cats = await fetchCategories();
      // Fetch items for each category to build the full structure
      const withItems = await Promise.all(
        cats.map(async (cat) => {
          try {
            const items = await fetchItems(cat.id);
            return { ...cat, items };
          } catch {
            return { ...cat, items: [] };
          }
        }),
      );
      setLiveCategories(withItems);
      setApiFailed(false);
    } catch (err) {
      console.warn('[Menu] API unavailable, using static fallback:', err.message);
      setLiveCategories(null);
      setApiFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from API on mount
  useEffect(() => {
    loadMenuData();
  }, [loadMenuData]);

  // The data to render — API data when available, static data otherwise
  const usingApi = liveCategories !== null;
  const displayCategories = usingApi ? liveCategories : menuCategories;
  const isLiveData = liveCategories !== null;
  // Admin tools only work against the API. If the API failed, all admin
  // controls (toolbar, per-card Edit, Add Item) are disabled so admins don't
  // click buttons that would silently fail.
  const adminToolsDisabled = !isLiveData;
  const categoryCount = displayCategories.length;
  // Derived — always the sum of items in whatever we're rendering. This used
  // to be tracked as separate state, which forced nested setState calls inside
  // the optimistic CRUD updaters (a React anti-pattern that double-counts in
  // StrictMode). Deriving it removes that hazard entirely.
  const itemCount = displayCategories.reduce(
    (sum, c) => sum + (c.items?.length || 0),
    0,
  );

  // Admin callbacks — apply the change to local state immediately (no full
  // re-fetch flash). The modals only call these AFTER the API succeeded, so
  // the returned object / id is authoritative. `refreshData` is kept for the
  // toolbar's manual Refresh button.
  const refreshData = useCallback(() => {
    loadMenuData();
  }, [loadMenuData]);

  const handleCategorySaved = useCallback((cat) => {
    setCategoryEditor(null);
    if (!cat) return;
    setLiveCategories((prev) => {
      if (!prev) return prev;
      const idx = prev.findIndex((c) => c.id === cat.id);
      if (idx === -1) {
        // New category — append (preserves fetch order; re-sort if order exists)
        const next = [...prev, { ...cat, items: cat.items || [] }];
        return next.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
      }
      // Updated category — replace metadata, keep existing items intact
      const existing = prev[idx];
      const next = [...prev];
      next[idx] = { ...existing, ...cat, items: existing.items || cat.items || [] };
      return next.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    });
  }, []);

  const handleCategoryDeleted = useCallback((catId) => {
    setCategoryEditor(null);
    setLiveCategories((prev) => {
      if (!prev) return prev;
      return prev.filter((c) => c.id !== catId);
    });
  }, []);

  const handleItemSaved = useCallback((item) => {
    setItemEditor(null);
    if (!item) return;
    setLiveCategories((prev) => {
      if (!prev) return prev;
      const catId = item.categoryId;
      const catIdx = prev.findIndex((c) => c.id === catId);
      if (catIdx === -1) return prev;
      const cat = prev[catIdx];
      const items = cat.items || [];
      const itemIdx = items.findIndex((i) => i.id === item.id);
      const nextItems = itemIdx === -1
        ? [...items, item]
        : items.map((i, idx) => (idx === itemIdx ? item : i));
      const next = [...prev];
      next[catIdx] = { ...cat, items: nextItems };
      return next;
    });
  }, []);

  const handleItemDeleted = useCallback((itemId) => {
    setItemEditor(null);
    setLiveCategories((prev) => {
      if (!prev) return prev;
      return prev.map((cat) => {
        const items = cat.items || [];
        if (!items.some((i) => i.id === itemId)) return cat;
        return { ...cat, items: items.filter((i) => i.id !== itemId) };
      });
    });
  }, []);

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════
          DELIVERY BANNER
          ═══════════════════════════════════════════════════════ */}
      <div className="menu-delivery-banner">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="menu-delivery-inner">
            <div className="menu-delivery-info">
              <Icon name="delivery_dining" size={20} />
              <span className="menu-delivery-text">
                Delivery via partner riders! Reach us at {liveBusiness.phone}
              </span>
            </div>
            <span className="menu-delivery-location">
              Serving Trapiche, Oton, Iloilo
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          HERO TITLE
          ═══════════════════════════════════════════════════════ */}
      <section className="menu-hero">
        <div className="container menu-hero-container">
          <div className="menu-hero-blur" />
          <h1 className="menu-hero-title">
            Our Fresh Local Menu
          </h1>
          <p className="menu-hero-desc">
            A daily comfort food escape, bringing you the authentic warmth of
            Iloilo&rsquo;s delicacies and modern refreshments.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ADMIN TOOLBAR (admin only — gated on auth resolving to avoid flash)
          ═══════════════════════════════════════════════════════ */}
      {!authLoading && isAdmin && (
        <div className="container">
          {adminToolsDisabled && (
            <div className="menu-admin-disabled-banner" role="status">
              <span className="material-symbols-outlined menu-admin-disabled-icon">cloud_off</span>
              <span>
                Admin tools are disabled — using static data. Reconnect the API to manage the menu.
              </span>
            </div>
          )}
          <AdminMenuToolbar
            onAddCategory={() => setCategoryEditor('new')}
            onRefresh={loadMenuData}
            isLiveData={isLiveData}
            disabled={adminToolsDisabled}
            isRefreshing={loading}
            itemCount={itemCount}
            categoryCount={categoryCount}
          />
        </div>
      )}

      {/* Loading indicator — visible to ALL users during API fetch */}
      {loading && (
        <div className="container">
          <div className="menu-loading">
            <div className="menu-loading-spinner" />
            <p>Loading menu…</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          PRODUCT GRID — filterable, sortable, unified cards
          ═══════════════════════════════════════════════════════ */}
      <div className="container menu-grid-wrap">
        <MenuProductGrid
          categories={displayCategories}
          onAddToCart={addItem}
          adminMode={isAdmin}
          adminToolsDisabled={adminToolsDisabled}
          onEditItem={(item) => setItemEditor(item)}
          onAddItem={(categoryId) => setItemEditor({ _new: true, categoryId })}
          onEditCategory={(cat) => setCategoryEditor(cat)}
        />
      </div>

      {/* Order List Drawer — floating trigger + slide-out panel */}
      <OrderListDrawer />

      {/* ═══════════════════════════════════════════════════════
          EVENT CTA + DELIVERY DIRECT
          ═══════════════════════════════════════════════════════ */}
      <section className="container">
        <div className="menu-cta-grid">
          {/* Hosting an Event */}
          <div className="menu-cta-event">
            <div className="menu-cta-floats" aria-hidden="true">
              <svg
                className="menu-float menu-float-leaf1"
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <svg
                className="menu-float menu-float-leaf2"
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              <svg
                className="menu-float menu-float-sparkle"
                xmlns="http://www.w3.org/2000/svg"
                width="24" height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              </svg>
              <svg
                className="menu-float menu-float-dots"
                viewBox="0 0 200 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="30" cy="40" r="4" />
                <circle cx="170" cy="25" r="3" />
                <circle cx="140" cy="45" r="2.5" />
                <circle cx="15" cy="160" r="5" />
                <circle cx="170" cy="150" r="3.5" />
                <circle cx="55" cy="120" r="2" />
                <circle cx="130" cy="175" r="4" />
              </svg>
            </div>
            <div className="menu-cta-event-content">
              <h2 className="menu-cta-heading">
                Hosting an Event?
              </h2>
              <p className="menu-cta-desc">
                Our Party Packs are designed to bring Triology&rsquo;s warmth to
                your office, family gatherings, or celebrations in Iloilo.
              </p>
              <a
                href="/party-packs"
                className="menu-cta-btn btn-interact"
              >
                Inquire for Catering
              </a>
            </div>
            <div className="menu-cta-circle" />
          </div>

          {/* Delivery Direct */}
          <div className="menu-cta-delivery">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 48,
                marginBottom: '1rem',
                fontVariationSettings: "'FILL' 1, 'wght' 400",
              }}
            >
              call
            </span>
            <h3 className="menu-cta-delivery-title">
              Delivery Direct
            </h3>
            <p className="menu-cta-delivery-phone">
              {liveBusiness.phone}
            </p>
            <p className="menu-cta-delivery-desc">
              Call us for quick orders within Oton area.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ADMIN MODALS
          ═══════════════════════════════════════════════════════ */}
      {categoryEditor && (
        <CategoryEditorModal
          category={categoryEditor === 'new' ? null : categoryEditor}
          onClose={() => setCategoryEditor(null)}
          onSaved={handleCategorySaved}
          onDeleted={handleCategoryDeleted}
        />
      )}

      {itemEditor && (
        <ItemEditorModal
          item={itemEditor._new ? null : itemEditor}
          categories={displayCategories}
          onClose={() => setItemEditor(null)}
          onSaved={handleItemSaved}
          onDeleted={handleItemDeleted}
        />
      )}

      {/* ═══════════════════════════════════════════════════════
          RESPONSIVE STYLES
          ═══════════════════════════════════════════════════════ */}
      <style>{`
        /* ─── Delivery Banner ──────────────────────────────── */
        .menu-delivery-banner {
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
          padding: 0.75rem 0;
          position: relative;
        }

        .menu-delivery-banner .container {
          position: relative;
          z-index: 1;
        }

        .menu-delivery-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .menu-delivery-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
        }

        .menu-delivery-text {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .menu-delivery-location {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
        }

        /* ─── Hero Title ───────────────────────────────────── */
        .menu-hero {
          padding: 3rem 0 1rem;
          text-align: center;
          margin-bottom: 0;
        }
        @media (min-width: 768px) {
          .menu-hero {
            text-align: left;
          }
        }

        .menu-hero-container {
          position: relative;
        }

        .menu-hero-blur {
          display: none;
        }
        @media (min-width: 768px) {
          .menu-hero-blur {
            display: block;
            position: absolute;
            top: -3rem;
            left: -3rem;
            width: 12rem;
            height: 12rem;
            background: var(--color-primary);
            opacity: 0.05;
            border-radius: var(--radius-full);
            filter: blur(48px);
            pointer-events: none;
          }
        }

        .menu-hero-title {
          font-family: 'Okinawa', cursive;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400;
          color: var(--color-primary);
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .menu-hero-desc {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--color-on-surface-variant);
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
        }
        @media (min-width: 768px) {
          .menu-hero-desc {
            margin-left: 0;
            margin-right: 0;
          }
        }

        /* ─── Grid wrapper padding (responsive) ───────────── */
        .menu-grid-wrap {
          padding-bottom: 3rem;
        }
        @media (min-width: 768px) {
          .menu-grid-wrap {
            padding-bottom: 5rem;
          }
        }

        /* ─── CTA Section ──────────────────────────────────── */
        .menu-cta-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          padding-bottom: 5rem;
          margin-top: 6rem;
        }
        @media (min-width: 768px) {
          .menu-cta-grid {
            grid-template-columns: 2fr 1fr;
          }
        }

        .menu-cta-event {
          background: var(--color-primary-container);
          color: var(--color-on-primary-container);
          padding: 3rem;
          border-radius: var(--radius-2xl);
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .menu-cta-event-content {
          position: relative;
          z-index: 10;
        }

        .menu-cta-heading {
          font-family: var(--font-headline);
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .menu-cta-desc {
          font-size: 1.0625rem;
          line-height: 1.6;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 500px;
        }

        .menu-cta-btn {
          display: inline-block;
          padding: 0.75rem 2rem;
          background: var(--color-surface-container-lowest);
          color: var(--color-primary);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
        }

        .menu-cta-circle {
          position: absolute;
          right: -4rem;
          bottom: -4rem;
          width: 16rem;
          height: 16rem;
          border-radius: var(--radius-full);
          background: var(--color-primary);
          opacity: 0.3;
        }

        .menu-cta-delivery {
          background: var(--color-secondary-container);
          color: var(--color-on-secondary-container);
          padding: 2rem;
          border-radius: var(--radius-2xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .menu-cta-delivery-title {
          font-family: var(--font-headline);
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .menu-cta-delivery-phone {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .menu-cta-delivery-desc {
          font-size: 0.8125rem;
          opacity: 0.8;
        }

        /* ─── Floating decorative elements (same style as home page) ─── */
        .menu-cta-floats {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .menu-float {
          position: absolute;
        }

        .menu-float-leaf1 {
          top: -16px;
          right: 28px;
          width: 52px;
          height: 52px;
          opacity: 0.18;
          color: var(--color-secondary, #fbc002);
          animation: menu-float-spin 25s linear infinite;
        }

        .menu-float-leaf2 {
          bottom: 16px;
          left: 22%;
          width: 34px;
          height: 34px;
          opacity: 0.14;
          color: var(--color-primary-fixed, #b1f0ce);
          animation: menu-float-drift 7s ease-in-out infinite;
        }

        .menu-float-sparkle {
          top: 28%;
          right: 14%;
          width: 26px;
          height: 26px;
          opacity: 0.22;
          color: var(--color-secondary, #fbc002);
          animation: menu-float-twinkle 4s ease-in-out infinite;
        }

        .menu-float-dots {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.18;
          color: var(--color-secondary, #fbc002);
          animation: menu-float-shift 18s ease-in-out infinite alternate;
        }

        @keyframes menu-float-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes menu-float-drift {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }

        @keyframes menu-float-twinkle {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50%      { opacity: 0.25; transform: scale(1.15); }
        }

        @keyframes menu-float-shift {
          0%   { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(6px, -8px) rotate(8deg); }
        }

        /* ─── Mobile: delivery banner ─────────────────────── */
        /* ─── Loading state ──────────────────────────────────── */
        .menu-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 4rem 0;
          color: var(--color-on-surface-variant);
          font-size: 0.9375rem;
          font-weight: 500;
        }
        .menu-loading-spinner {
          width: 36px;
          height: 36px;
          border: 3px solid var(--color-outline-variant);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: menu-spin 0.7s linear infinite;
        }
        @keyframes menu-spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 767px) {
          html, body {
            overflow-x: hidden;
          }
          .menu-delivery-banner {
            color: #ffffff;
          }
          .menu-delivery-text,
          .menu-delivery-location {
            color: #ffffff;
          }
          .menu-delivery-text {
            font-size: 0.6875rem;
          }
          .menu-delivery-inner {
            flex-direction: column;
            gap: 0.25rem;
            align-items: flex-start;
          }
          .menu-delivery-location {
            font-size: 0.5625rem;
          }
        }
      `}</style>
    </main>
  );
}
