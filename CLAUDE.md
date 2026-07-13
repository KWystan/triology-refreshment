# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Triology Refreshment** — a full-stack restaurant/food business website for a Filipino refreshment shop in Trapiche, Oton, Iloilo. Built with React + Vite (frontend) and Express.js (backend), backed by Supabase.

### Monorepo Structure (npm workspaces)

```
triology/
├── client/              React + Vite (React 19, React Router 7)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/      Navbar, Footer, MobileNav, BottomMobileNav, FAB, Section, DeliveryBanner
│   │   │   └── ui/          Button, Icon, Badge, SectionHeading, MenuProductGrid, ProductDetailModal,
│   │   │                     SearchBar, CategoryIcons, ContactCard, InquiryForm, StatDisplay, ServiceCard,
│   │   │                     MenuCard, MenuFilterTabs, BentoCard, BounceCards, AuthPanel, BestSellerBadge
│   │   ├── pages/            Home, Menu, PartyPacks, EventsContact, NotFound
│   │   ├── data/             Static data (menuItems.js — 7 categories 41 items, bundles.js, business.js)
│   │   ├── design-system/    tokens.js (JS design tokens) + index.js barrel
│   │   ├── styles/           global.css (CSS custom properties, reset, utilities)
│   │   ├── lib/              api.js (fetch wrapper), supabase.js (browser Supabase client)
│   │   ├── context/          ActiveSectionContext.jsx, AuthContext.jsx
│   │   ├── App.jsx           Root component + Routes
│   │   └── main.jsx          Entry point (BrowserRouter)
│   └── vite.config.js        @ import alias, /api proxy → localhost:4000
│
├── server/              Express.js (Express 5, ESM)
│   ├── src/
│   │   ├── config/           env.js (validated env), supabase.js (admin + anon clients)
│   │   ├── controllers/      health.js, auth.js (JWT sessions, PKCE OAuth, refresh rotation)
│   │   ├── middleware/        errorHandler.js, validate.js, auth.js (Supabase JWT verify)
│   │   ├── routes/            index.js (mounts /api routes), auth.js
│   │   └── services/ validators/ utils/ — PLACEHOLDER directories (only .gitkeep)
│   └── package.json
│
├── stitch-*.html       Stitch-generated screen designs (Home, Menu, Party, Event) — design specs, not app code
├── client/public/stitch-mobile-*.html  Mobile-specific stitch designs (same purpose)
├── docs/               website-structure-for-stitch.txt (page map used as Stitch context)
└── AUTH-SETUP.md       Deep auth system docs (architecture, OAuth flow, security model, troubleshooting)
```

## Request Flow

```
Browser → Vite (:5173) → /api/* proxy → Express (:4000) → controllers → Supabase REST
```

- In development, Vite proxies `/api/*` to Express (no CORS issues). The Express `app.js` also configures CORS with credentials for production.
- API client (`client/src/lib/api.js`) wraps `fetch` and always calls `/api/*` paths. Returns parsed JSON, throws on non-2xx, returns `null` on 204.
- Auth endpoints use httpOnly cookies for tokens (access_token + refresh_token). Non-auth endpoints use the `requireAuth` middleware checking `Authorization: Bearer <supabase-jwt>`.

## Key Architecture Decisions

### Auth System (Wired End-to-End)

Uses **app-level JWT sessions** managed by Express, backed by Supabase Auth. Auth controller at `server/src/controllers/auth.js` handles all 7 endpoints (signup, login, logout, refresh, oauthInit, oauthCallback, me) with:
- Short-lived JWTs (15 min) + rotated refresh tokens (7 days) as httpOnly cookies
- Google OAuth via self-managed PKCE (Authorization Code flow, never Implicit)
- Refresh token theft detection: reuse of a superseded token revokes the entire token family
- In-memory `Map` stores (refresh tokens + OAuth states) with periodic cleanup every 15 min

**Frontend:** `AuthContext` manages panel state + user session, restores on mount via `GET /auth/me` with refresh fallback. `AuthPanel` provides login/signup/forgot-password UI + Google OAuth button. `Navbar` integrates `useAuth()` for conditional rendering.

See `AUTH-SUPABASE.md` for endpoint table, OAuth flow diagram, security model, cookie config, and troubleshooting.

**`requireAuth` middleware** (`server/src/middleware/auth.js`): uses `@supabase/server/core` (`extractCredentials` + `verifyAuth`) with JWKS caching to verify Supabase JWTs from `Authorization` header. Not used by auth routes (they use cookie-based sessions) — reserved for future authenticated API endpoints (orders, profiles).

### Request Validation Pattern

`server/src/middleware/validate.js` is a factory that validates `body` / `query` / `params` against schema functions:
```js
// Define a schema function (returns { valid, errors? })
const createItemSchema = (data) => {
  const errors = [];
  if (!data.name) errors.push({ field: 'name', message: 'Name is required' });
  return { valid: errors.length === 0, errors };
};

// Use it in routes via validate({ body: mySchema })
router.post('/items', validate({ body: createItemSchema }), handler);
```

Schema functions are plain JS — no schema library. Expected to live in `server/src/validators/` (scaffolded but empty).

### Scroll-Based Nav Highlighting

`ActiveSectionContext` (used by `EventsContact` page) shares which page section is currently in-view via `IntersectionObserver`. Navbar / MobileNav consume it to highlight links based on scroll position. Routes with no active section fall back to route-based `:active` styling.

### Design System: Dual Token Source

Visual tokens exist in **two places that must stay in sync**:
1. **`client/src/design-system/tokens.js`** — JS exports used by component imports
2. **`client/src/styles/global.css` `:root`** — CSS custom properties (runtime source of truth)

Components use `var(--color-*)` / `var(--font-*)` / `var(--radius-*)` / `var(--shadow-*)` — never hardcoded values.

**⚠️ Known discrepancy:** `tokens.js` defines `primary` as `#0f5238` while `global.css` `:root` uses `#056402`. The CSS variables are what components actually render. When syncing, decide which value is canonical and update both files.

## Styling Conventions

- **Inline `style={{}}` with CSS custom properties** plus scoped `<style>` blocks in page components for complex responsive layouts
- **No CSS-in-JS library**
- **`btn-interact` class** (defined in `global.css`): `scale(0.97)` on active, `opacity(0.85)` on hover
- **`container` class**: max-width 1280px + responsive padding (16px mobile, 64px desktop)
- **`section-padding` class**: vertical padding (4rem mobile, 6rem desktop)
- **`sr-only` class**: visually hidden utility for screen readers
- Mobile-first breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)

## Page Component Conventions

Every page component follows this pattern:
```jsx
/**
 * PageName
 *
 * Sections:
 *   1. Hero — description
 *   2. Features — description
 *   3. Contact — description
 */
```
Sections are separated by `{/* ═══════ SECTION NAME ═══════ */}` comment blocks.

## Data Layer (Static)

Business info, menu items, and bundles are all **static JS modules** (no DB reads for content yet):
- `client/src/data/business.js` — brand info, contact, nav links, stats
- `client/src/data/menuItems.js` — 7 categories, 41 items with 7 layout types (compact-square, rice-card, circular, compact-card, platter-grid, horizontal-list, horizontal-card)
- `client/src/data/bundles.js` — party pack bundles + features + filter tabs

## Menu Data Architecture

Menu items have a `layoutType` field determining card rendering in `MenuProductGrid`:

| Layout | Category | Grid |
|--------|----------|------|
| compact-square | Halo-Halo | 4-col centered squares |
| rice-card | Rice Meals | H-48 image + price overlay |
| circular | Breakfast | Rounded-full images |
| compact-card | Pasta | H-32 images |
| platter-grid | Platters | Aspect-square grid |
| horizontal-list | Short Orders | Small thumbnails |
| horizontal-card | Snacks | Detailed card with variants |

**Price resolution logic:** `item.price` → `item.variants` min/max range → `category.priceNote` fallback.

## Adding Environment Variables

1. Add to `server/src/config/env.js` using `required('VAR_NAME')` (throws on missing) or `process.env.VAR_NAME || 'default'`
2. Add to `server/.env.example`
3. If needed client-side, add to `client/.env.example` with `VITE_` prefix and read via `import.meta.env.VITE_VAR_NAME`

## Supabase: Three Client Split

| Client | Key | File |
|--------|-----|------|
| Browser (React) | `anon` key (public, VITE env) | `client/src/lib/supabase.js` |
| Server (admin) | `service_role` key (secret, `createAdminClient` from `@supabase/server/core`) | `server/src/config/supabase.js` |
| Server (anon) | `publishable` key (standard `createClient`) | `server/src/config/supabase.js` |

Admin client bypasses RLS. Never expose the service-role key. **Note:** the server's admin client uses `createAdminClient` from `@supabase/server/core` (not standard `@supabase/supabase-js`).

## Image Sourcing

Two strategies coexist:
1. **Remote CDN URLs** — Hero/decorative/page images use Google `aida-public` URLs exported from Stitch
2. **Local imports** — Menu item images, logo, and assets from `client/src/assets/`

Most food images currently point to `foodsample.jpg` placeholder.

## Client-Side State

- **No global state library** — React Context only (`ActiveSectionContext`, `AuthContext`)
- **localStorage** for favorites persistence (in `MenuProductGrid`)
- **Product detail modal**: `ProductDetailModal` rendered by `MenuProductGrid` — image carousel, star rating, tags, serving info, body scroll lock, keyboard nav (Escape, arrow keys)
- **Inline search**: `SearchBar` inside `MenuProductGrid` (visible on mobile)
- **Form submissions are simulated**: `InquiryForm` uses `setTimeout` (800ms delay) — not yet wired to API
- **Add-to-cart is display-only**: toggles "Added ✓" for 2 seconds, no persistence
- **FAB and Navbar action icons** beyond auth are display-only

## Stitch Design References

`stitch-*.html` files in the project root + `client/public/stitch-mobile-*.html` are **design specs exported from Google Stitch**, not part of the React app. `docs/website-structure-for-stitch.txt` is a detailed page map used as Stitch context.

## Dead / Unused Code

Components in the barrel that are **not imported** by any page (functionality is inlined):
- `MenuCard.jsx` — Menu uses inline ProductCard in `MenuProductGrid`
- `MenuFilterTabs.jsx` — filter tabs rendered inline in `MenuProductGrid`
- `BentoCard.jsx` — PartyPacks has inline bento cards
- `BounceCards.jsx` — only used directly by `Home.jsx`, not barrel-exported
- `BottomMobileNav.jsx` — **not imported or rendered anywhere** (mobile nav uses `MobileNav` sidebar + `FAB` instead; this component has no corresponding routes for Orders/Profile)
- `client/src/hooks/` — empty barrel file, no hooks defined yet

## Assets

Images in `client/src/assets/`: `hero/` (4 hero images), `halo_halo/` (8 per-item images). Root-level assets (`foodsample.jpg`, `triology-logo.png`, SVGs) used as fallbacks.

## Fonts

- **Okinawa brush script** (self-hosted): `/public/fonts/okinawa.ttf` via `@font-face` in `global.css` — used for decorative hero/section titles
- **Inter** and **Plus Jakarta Sans** — body and headline fonts from Google Fonts
- **Material Symbols Outlined** — variable font for icons, loaded from Google Fonts, rendered via `<span class="material-symbols-outlined">icon_name</span>` or the `Icon` component

## Dependencies

- Root has `gsap` (installed but not yet used) and `concurrently` (dev)
- `@supabase/supabase-js`, `@supabase/server/core` — Supabase client libraries
- `jsonwebtoken` — JWT signing for app-level sessions
- `cookie-parser` — cookie reading for auth
- `helmet`, `cors`, `morgan` — Express middleware

## Common Commands

```bash
npm install              # Install everything (root)
npm run dev              # Start both servers concurrently
npm run dev:client       # Vite only (port 5173)
npm run dev:server       # Express with --watch (port 4000)
npm run build            # Build both for production
npm run start            # Start production server
npm run lint             # ESLint 9 flat config (--max-warnings 0)
npm run clean            # Remove build artifacts
```

## Common Patterns

**Adding a new API route:**
1. Create controller function in `server/src/controllers/*.js`
2. Create schema function in `server/src/validators/*.js` (optional)
3. Add route in a `server/src/routes/*.js` file
4. Mount in `server/src/routes/index.js`

**Adding a new frontend page:**
1. Create page file in `client/src/pages/` with numbered JSDoc section comments
2. Add `<Route>` in `client/src/App.jsx`
3. Add to existing nav links in `business.js` data if needed

## Environment

- **ESM only** — both packages use `"type": "module"`
- **Express 5** — auto-catches rejected promises in async route handlers
- **React 19** + **React Router 7** (BrowserRouter in main.jsx)
- **ESLint 9 flat config** (`eslint.config.js` per package), zero warnings allowed
- **Prettier** with semi, single quotes, trailing commas, 100 print width
- **Readme note:** references `SUPABASE_SERVICE_KEY` but the codebase uses env var name `SUPABASE_SECRET_KEY` — use the latter when setting up `.env`
- No test framework configured yet (Vitest intended)
