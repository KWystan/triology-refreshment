# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Triology Refreshment** — a full-stack restaurant/food business website for a Filipino refreshment shop in Trapiche, Oton, Iloilo. Built with React + Vite (frontend) and Express.js (backend), backed by Supabase.

### Monorepo Structure (npm workspaces)

```
triology/          Root: package.json with "workspaces": ["client", "server"]
├── client/        React + Vite (React 19, React Router 7)
│   ├── src/
│   │   ├── components/     UI primitives + layout components
│   │   │   ├── layout/     Navbar, Footer, MobileNav, BottomMobileNav, FAB, Section, DeliveryBanner
│   │   │   └── ui/         Button, Icon, Badge, SectionHeading, MenuProductGrid, ProductDetailModal,
│   │   │                   SearchBar, CategoryIcons, ContactCard, InquiryForm, StatDisplay, ServiceCard
│   │   ├── pages/          Home, Menu, PartyPacks, EventsContact, NotFound
│   │   ├── data/           Static data (menuItems.js — 7 categories 41 items, bundles.js, business.js)
│   │   ├── design-system/  tokens.js (JS design tokens) + index.js barrel
│   │   ├── styles/         global.css (CSS custom properties, reset, utilities)
│   │   ├── lib/            api.js (fetch wrapper), supabase.js (browser Supabase client)
│   │   ├── context/        ActiveSectionContext.jsx (scroll-based nav highlighting)
│   │   ├── hooks/          Barrel file only — no hooks defined yet
│   │   ├── App.jsx         Root component + Routes
│   │   └── main.jsx        Entry point (BrowserRouter)
│   └── vite.config.js      @ import alias, /api proxy → localhost:4000
│
├── server/        Express.js (Express 5, ESM)
│   ├── src/
│   │   ├── config/        env.js (validated env), supabase.js (admin + anon clients)
│   │   ├── controllers/   health.js
│   │   ├── middleware/     errorHandler.js, validate.js, auth.js
│   │   ├── routes/        index.js (mounts /api routes)
│   │   ├── services/      PLACEHOLDER — only .gitkeep
│   │   ├── validators/    PLACEHOLDER — only .gitkeep
│   │   ├── utils/         PLACEHOLDER — only .gitkeep
│   │   ├── app.js         Express app setup
│   │   └── server.js      Entry point
│   └── package.json
│
├── stitch-*.html    Stitch-generated screen designs (home, menu, party, event) — not part of the app
├── docs/            website-structure-for-stitch.txt (detailed page map used as Stitch context)
└── .prettierrc      Semi, single quotes, trailing commas
```

## Key Architecture Decisions

### Design System: Dual Token Source

Visual tokens exist in **two places** that must stay in sync:
1. **`client/src/design-system/tokens.js`** — JS exports (used by component imports)
2. **`client/src/styles/global.css` `:root`** — CSS custom properties (used by all components via `var(--color-*)`)

The CSS variables are the runtime source of truth. Components use `var(--color-*)` / `var(--font-*)` / `var(--radius-*)` / `var(--shadow-*)` — never hardcoded values (except in Stitch-generated page code).

**Material You** dynamic palette with seed `#2d6a4f` / `#056402`. `--color-primary` is a deep green. Secondary is golden yellow (`#fbc002`).

**⚠️ Known discrepancy:** `tokens.js` defines `primary` as `#0f5238` while `global.css` `:root` uses `#056402`. The CSS variables are what components actually render. When syncing, decide which value is canonical and update both files.

### Styling Pattern

All components use **inline `style={{}}` with CSS custom properties** (`var(--color-*)`, `var(--font-*)`, `var(--radius-*)`, `var(--shadow-*)`) plus **scoped `<style>` blocks** for complex responsive layouts. There is no CSS-in-JS library. Page-specific CSS lives in scoped `<style>` tags within page components, not in global.css. The `btn-interact` global class provides hover/active transform behavior (defined in `global.css`).

### Supabase: Two Client Split

| Client | Key | File |
|--------|-----|------|
| Browser | `anon` key (public, `VITE_SUPABASE_ANON_KEY`) | `client/src/lib/supabase.js` |
| Server (admin) | `service_role` key (secret) | `server/src/config/supabase.js` |
| Server (anon) | `publishable` key | `server/src/config/supabase.js` |

The admin client (`supabaseAdmin`) bypasses RLS. Never expose the service-role key. The anon client (`supabaseAnon`) enforces RLS.

**Important:** The server's admin client uses `createAdminClient` from `@supabase/server/core` (not standard `@supabase/supabase-js`). The server's anon client uses the standard `createClient`. Both are in `server/src/config/supabase.js`.

### Server Auth Middleware

`server/src/middleware/auth.js` exports `requireAuth` — Express middleware that verifies a Supabase JWT from the `Authorization` header using `@supabase/server`'s `extractCredentials` + `verifyAuth`. It caches the JWKS endpoint. On success it attaches `req.user`, `req.supabase`, and `req.authMode`. Currently no routes use it — it's ready for when authenticated endpoints are added.

### Express Backend

- Express 5 with ESM (`"type": "module"`)
- Centralized error handler at `server/src/middleware/errorHandler.js` — throw `err.status` + `err.message` from handlers
- Request validation middleware at `server/src/middleware/validate.js` — factory that validates `body` / `query` / `params` against schema functions; passes a 400 with structured errors on failure
- Helmet, CORS (origin from env), Morgan logging
- `server/src/config/env.js` validates required env vars at startup with a `required()` helper — MISSING_ENV errors mean the `.env` file is incomplete
- Health check at `GET /api/health`
- Service, validator, and utility directories are **scaffolded but empty** (only .gitkeep) — ready for business logic

### Frontend

- React 19 with React Router 7 (`BrowserRouter` in main.jsx)
- Vite proxies `/api/*` → `localhost:4000` (no CORS issues in dev)
- `@` import alias resolves to `./src`
- Pages: Home (`/`), Menu (`/menu`), PartyPacks (`/party-packs`), EventsContact (`/events`), NotFound (`*`)
- `ActiveSectionContext` for scroll-based nav highlighting (used by EventsContact page)
- `client/src/hooks/` directory exists but is empty — no custom hooks defined yet

### Menu Data Architecture

Menu items live in `client/src/data/menuItems.js` as structured data with 7 layout types that determine card rendering:

| Layout | Category | Grid |
|--------|----------|------|
| `compact-square` | Halo-Halo | 4-col centered squares |
| `rice-card` | Rice Meals | H-48 image + price overlay |
| `circular` | Breakfast | Rounded-full images |
| `compact-card` | Pasta | H-32 images |
| `platter-grid` | Platters | Aspect-square grid |
| `horizontal-list` | Short Orders | Small thumbnails |
| `horizontal-card` | Snacks | Detailed card with price variants |

Each category has a shared `categoryImage` + optional individual item images (Halo-Halo has per-item assets in `client/src/assets/halo_halo/`). Most food images currently point to `foodsample.jpg` placeholder.

**Category icons** are custom inline SVG components in `CategoryIcons.jsx`, mapped by category ID via the `CATEGORY_ICONS` lookup object (e.g., `'halo-halo': { Icon: HaloHaloIcon, shortLabel: 'Desserts' }`).

### Image Sourcing Pattern

Two image sourcing strategies coexist:
1. **Remote CDN URLs** — Many hero/decorative/page images use Google `aida-public` URLs exported from Stitch (e.g., `https://lh3.googleusercontent.com/aida-public/...`)
2. **Local imports** — Menu item images, logo, and assets use standard React asset imports from `client/src/assets/`

### Client-Side State

- **No global state library** — uses React Context (`ActiveSectionContext`) for nav highlighting
- **localStorage** used for favorites persistence in `MenuProductGrid`
- **Form submissions are simulated** — both InquiryForm usages (EventsContact, PartyPacks) use `setTimeout` to simulate async submission, no actual API calls yet
- **FAB and Navbar action icons** (user, favorites, cart) are currently **display-only** with no onClick handlers

### Mobile Navigation Routes

`BottomMobileNav` links to four routes: Home (`/`), Menu (`/menu`), Orders (`/orders`), Profile (`/profile`). **Orders and Profile have no corresponding React Router routes** — they currently lead to the NotFound page.

### Root Dependencies

GSAP (`^3.15.0`) is in the root `package.json` for animation. It's installed but not yet imported by any component.

### Icons

All icons use **Google Material Symbols Outlined** (variable font). Render with `<span class="material-symbols-outlined">icon_name</span>` or the `Icon` wrapper component (`client/src/components/ui/Icon.jsx`). The icon library is loaded from Google Fonts — no local icon files.

### Stitch Design References

`stitch-*.html` files in the project root (home, menu, party, event) are **design specs exported from Google Stitch**, not part of the React app. They contain the original screen designs the React code was built from. `docs/website-structure-for-stitch.txt` is a detailed page map used as Stitch context — useful reference for page structure.

## Data Layer (Static)

Business info, menu items, and bundles are all **static JS modules** (no database reads for content yet):
- `client/src/data/business.js` — brand info, contact, nav links, stats
- `client/src/data/menuItems.js` — 7 categories, 41 items
- `client/src/data/bundles.js` — party pack bundles + features + filter tabs

The Supabase backend is scaffolded but only the health endpoint is wired. Content rendering is entirely frontend-driven from these static files.

## Dead / Unused Code

Some components are exported from the barrel (`components/index.js`) but their functionality is inlined in their consuming pages and they are **not currently imported**:
- `MenuCard.jsx` — Menu page uses inline ProductCard rendering inside `MenuProductGrid.jsx`
- `MenuFilterTabs.jsx` — Filter tabs are rendered inline inside `MenuProductGrid.jsx`
- `BentoCard.jsx` — PartyPacks page has its own inline bento card rendering
- `BounceCards.jsx` — Only used directly by `Home.jsx`, not exported from barrel

These may be legacy components or intended for future reuse. When making changes, prefer modifying the inlined implementations (they're the live code), not the standalone wrappers.

## Assets

Images live in `client/src/assets/`:
- `hero/` — 4 hero page images used by `Home.jsx`
- `halo_halo/` — 8 per-item images for the Halo-Halo category
- Root-level image imports (`foodsample.jpg`, `triology-logo.png`, various SVGs) are used as fallbacks and decorative elements
- Most food images in the menu data currently point to `foodsample.jpg` (placeholder)

## Common Commands

```bash
# Install everything (root)
npm install

# Start dev (both servers concurrently)
npm run dev
# Frontend: http://localhost:5173
# Backend:  http://localhost:4000

# Start individually
npm run dev:client   # Vite only
npm run dev:server   # Express with --watch

# Build for production
npm run build

# Start production server
npm run start

# Lint both packages
npm run lint

# Lint individually
npm run lint -w client
npm run lint -w server

# Clean build artifacts
npm run clean
```

## Environment Setup

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
# Fill in Supabase credentials from Supabase dashboard → Settings → API
```

Client env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
Server env vars: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `PORT`, `NODE_ENV`, `CLIENT_ORIGIN`, `SESSION_SECRET`

## Conventions

- **ESM only** — both packages use `"type": "module"`
- **Prettier** with semi, single quotes, trailing commas, 100 print width
- **ESLint 9 flat config** (`eslint.config.js` in each package)
- **No tests yet** — Vitest is the intended test runner (mentioned in README)
- **CSS**: Components use inline `style={{}}` with CSS custom properties (`var(--color-*)`) + scoped `<style>` blocks for complex responsive layouts (page components have their own `<style>` tags). The `btn-interact` class provides global hover/active transform behavior.
- **JSDoc** on all components describing props
- **`container` class** provides max-width 1280px + responsive padding
- **Mobile-first** breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Every page component** follows a section-based structure with clear JSDoc section comments (numbered) at the top
