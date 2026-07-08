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
│   │   ├── pages/          Route-level page components
│   │   ├── data/           Static data (menu, bundles, business info)
│   │   ├── design-system/  Design token JS objects (tokens.js)
│   │   ├── styles/         CSS (global.css — CSS custom properties)
│   │   ├── lib/            API wrappers (api.js, supabase.js)
│   │   ├── context/        React context (ActiveSectionContext)
│   │   ├── App.jsx         Root component + routing
│   │   └── main.jsx        Entry point (BrowserRouter)
│   └── vite.config.js      Vite dev proxy: /api → localhost:4000
│
├── server/        Express.js (Express 5, ESM)
│   ├── src/
│   │   ├── config/        env.js (validated env), supabase.js (admin + anon clients)
│   │   ├── controllers/   Route handlers (health.js)
│   │   ├── middleware/     errorHandler.js, validate.js, auth.js
│   │   ├── routes/        index.js (mounts /api routes)
│   │   ├── services/      Business logic (placeholder)
│   │   ├── validators/    Validation schemas (placeholder)
│   │   ├── utils/         Helpers (placeholder)
│   │   ├── app.js         Express app setup (helmet, CORS, morgan, error handler)
│   │   └── server.js      Entry point
│   └── package.json
│
├── stitch-*.html   Stitch-generated screen designs (home, menu, party, event)
└── .prettierrc     Semi, single quotes, trailing commas
```

## Key Architecture Decisions

### Design System: Dual Token Source

Visual tokens exist in **two places** that must stay in sync:
1. **`client/src/design-system/tokens.js`** — JS exports (used by component imports)
2. **`client/src/styles/global.css` `:root`** — CSS custom properties (used by all components via `var(--color-*)`)

The CSS variables are the runtime source of truth. Components use `var(--color-*)` / `var(--font-*)` / `var(--radius-*)` / `var(--shadow-*)` — never hardcoded values (except in Stitch-generated page code).

**Material You** dynamic palette with seed `#2d6a4f` / `#056402`. `--color-primary` is a deep green. Secondary is golden yellow (`#fbc002`).

### Supabase: Two Client Split

| Client | Key | File |
|--------|-----|------|
| Browser | `anon` key (public, `VITE_SUPABASE_ANON_KEY`) | `client/src/lib/supabase.js` |
| Server (admin) | `service_role` key (secret) | `server/src/config/supabase.js` |
| Server (anon) | `publishable` key | `server/src/config/supabase.js` |

The admin client (`supabaseAdmin`) bypasses RLS. Never expose the service-role key. The anon client (`supabaseAnon`) enforces RLS.

### Express Backend

- Express 5 with ESM (`"type": "module"`)
- Centralized error handler at `server/src/middleware/errorHandler.js` — throw `err.status` + `err.message` from handlers
- Helmet, CORS (origin from env), Morgan logging
- Health check at `GET /api/health`

### Frontend

- React 19 with React Router 7 (`BrowserRouter` in main.jsx)
- Vite proxies `/api/*` → `localhost:4000` (no CORS issues in dev)
- `@` import alias resolves to `./src`
- Pages: Home (`/`), Menu (`/menu`), PartyPacks (`/party-packs`), EventsContact (`/events`), NotFound (`*`)
- `ActiveSectionContext` for scroll-based nav highlighting

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

Each category has a shared `categoryImage` + optional individual item images (Halo-Halo has per-item assets).

### Icons

All icons use **Google Material Symbols Outlined** (variable font). Render with `<span class="material-symbols-outlined">icon_name</span>` or the `Icon` wrapper component (`client/src/components/ui/Icon.jsx`). The icon library is loaded from Google Fonts — no local icon files.

## Data Layer (Static)

Business info, menu items, and bundles are all **static JS modules** (no database reads for content yet):
- `client/src/data/business.js` — brand info, contact, nav links, stats
- `client/src/data/menuItems.js` — 7 categories, 41 items
- `client/src/data/bundles.js` — party pack bundles + features + filter tabs

The Supabase backend is scaffolded but only the health endpoint is wired. Content rendering is entirely frontend-driven from these static files.

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
- **CSS**: Components use inline `style={{}}` with CSS custom properties (`var(--color-*)`) + scoped `<style>` blocks for complex responsive layouts. The `btn-interact` class provides global hover/active transform behavior.
- **JSDoc** on all components describing props
- **`container` class** provides max-width 1280px + responsive padding
- **Mobile-first** breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
