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
│   │   │                   SearchBar, CategoryIcons, ContactCard, InquiryForm, StatDisplay, ServiceCard,
│   │   │                   MenuCard, MenuFilterTabs, BentoCard, BounceCards, AuthPanel
│   │   ├── pages/          Home, Menu, PartyPacks, EventsContact, NotFound
│   │   ├── data/           Static data (menuItems.js — 7 categories 41 items, bundles.js, business.js)
│   │   ├── design-system/  tokens.js (JS design tokens) + index.js barrel
│   │   ├── styles/         global.css (CSS custom properties, reset, utilities)
│   │   ├── lib/            api.js (fetch wrapper), supabase.js (browser Supabase client)
│   │   ├── context/        ActiveSectionContext.jsx, AuthContext.jsx
│   │   ├── hooks/          Barrel file only — no hooks defined yet
│   │   ├── App.jsx         Root component + Routes
│   │   └── main.jsx        Entry point (BrowserRouter)
│   └── vite.config.js      @ import alias, /api proxy → localhost:4000
│
├── server/        Express.js (Express 5, ESM)
│   ├── src/
│   │   ├── config/        env.js (validated env), supabase.js (admin + anon clients)
│   │   ├── controllers/   health.js, auth.js (JWT sessions, PKCE OAuth, refresh rotation)
│   │   ├── middleware/     errorHandler.js, validate.js, auth.js (Supabase JWT verify)
│   │   ├── routes/        index.js (mounts /api routes), auth.js
│   │   ├── services/      PLACEHOLDER — only .gitkeep
│   │   ├── validators/    PLACEHOLDER — only .gitkeep
│   │   ├── utils/         PLACEHOLDER — only .gitkeep
│   │   ├── app.js         Express app setup
│   │   └── server.js      Entry point
│   └── package.json
│
├── stitch-*.html    Stitch-generated screen designs (home, menu, party, event) — not part of the app
├── docs/            website-structure-for-stitch.txt (detailed page map used as Stitch context)
├── AUTH-SETUP.md    Auth system overview (how JWT sessions work, in-memory vs DB tokens)
└── .prettierrc      Semi, single quotes, trailing commas
```

## Key Architecture Decisions

### Auth System (Now Wired End-to-End)

The auth system is fully implemented across frontend and backend:

**Frontend:**
- `AuthContext` (`client/src/context/AuthContext.jsx`) — manages panel visibility, current view (login/signup/forgot), and authenticated user state. Restores session on mount via `GET /auth/me`. Exposes `openAuthPanel('login'|'signup')`, `closeAuthPanel`, `switchView`, `logout`, `setUser`.
- `AuthPanel` (`client/src/components/ui/AuthPanel.jsx`) — full login/signup panel with:
  - Desktop two-region split (form + branded image panel)
  - Mobile full-screen takeover
  - Email/password login and signup (with client-side validation)
  - Google OAuth via PKCE flow
  - Forgot password mode
  - Password visibility toggle, keyboard (Escape to close), body scroll lock
  - Signup success confirmation screen
- Navbar integrates `useAuth()` — shows user menu (signed in) or Sign In / Sign Up buttons
- FAB and other action icons remain **display-only** with no onClick handlers

**Backend** (`server/src/controllers/auth.js`):
- **POST `/api/auth/signup`** — creates account via Supabase Auth, returns email verification notice
- **POST `/api/auth/login`** — validates credentials via Supabase, issues app-level JWT access token (15 min) + rotated refresh token (7 days) as httpOnly cookies
- **POST `/api/auth/logout`** — clears cookies, invalidates refresh token
- **POST `/api/auth/refresh`** — rotates refresh token on each use; detects reuse of superseded tokens (theft signal) and revokes the entire token family
- **GET `/api/auth/oauth/:provider`** — initiates OAuth 2.0 Authorization Code flow with PKCE (SHA-256 code challenge, cryptographically random state)
- **GET `/api/auth/oauth/callback`** — exchanges auth code for Supabase session, creates app session, redirects to frontend
- **GET `/api/auth/me`** — returns current user from access token cookie

**Security model:**
- OAuth 2.0 Authorization Code + PKCE (never Implicit)
- Short-lived access tokens (15 min) + rotated refresh tokens
- httpOnly, Secure (prod), SameSite=Strict cookies
- Generic error messages only ("invalid email or password")
- Refresh token theft detection via superseded-token tracking
- ⚠️ Refresh tokens stored in **in-memory Map** — persist to database for production

**Auth middleware** (`server/src/middleware/auth.js`):
- `requireAuth` — verifies Supabase JWT from `Authorization` header via `@supabase/server/core` (`extractCredentials` + `verifyAuth`). Caches JWKS endpoint. Attaches `req.user`, `req.supabase`, `req.authMode` on success. Currently no routes use it — the auth controller uses its own cookie-based session instead.

### Design System: Dual Token Source

Visual tokens exist in **two places** that must stay in sync:
1. **`client/src/design-system/tokens.js`** — JS exports (used by component imports). Barrel at `design-system/index.js` re-exports all token groups.
2. **`client/src/styles/global.css` `:root`** — CSS custom properties (used by all components via `var(--color-*)`)

The CSS variables are the runtime source of truth. Components use `var(--color-*)` / `var(--font-*)` / `var(--radius-*)` / `var(--shadow-*)` — never hardcoded values (except in Stitch-generated page code).

**Material You** dynamic palette with seed `#2d6a4f` / `#056402`. `--color-primary` is a deep green. Secondary is golden yellow (`#fbc002`).

**⚠️ Known discrepancy:** `tokens.js` defines `primary` as `#0f5238` while `global.css` `:root` uses `#056402`. The CSS variables are what components actually render. When syncing, decide which value is canonical and update both files.

### Styling Pattern

All components use **inline `style={{}}` with CSS custom properties** (`var(--color-*)`, `var(--font-*)`, `var(--radius-*)`, `var(--shadow-*)`) plus **scoped `<style>` blocks** for complex responsive layouts. There is no CSS-in-JS library. Page-specific CSS lives in scoped `<style>` tags within page components, not in global.css.

The `btn-interact` global class (defined in `global.css`) provides hover/active transform behavior (`scale(0.97)` on active, `opacity(0.85)` on hover).

### Import Alias

Vite is configured with `@` → `./src`. Import with `import Foo from '@/components/Foo'` or relative paths.

### Supabase: Two Client Split

| Client | Key | File |
|--------|-----|------|
| Browser | `anon` key (public, `VITE_SUPABASE_ANON_KEY`) | `client/src/lib/supabase.js` |
| Server (admin) | `service_role` key (secret, `createAdminClient` from `@supabase/server/core`) | `server/src/config/supabase.js` |
| Server (anon) | `publishable` key (standard `createClient`) | `server/src/config/supabase.js` |

The admin client (`supabaseAdmin`) bypasses RLS. Never expose the service-role key. The anon client (`supabaseAnon`) enforces RLS.

**Important:** The server's admin client uses `createAdminClient` from `@supabase/server/core` (not standard `@supabase/supabase-js`). The server's anon client uses the standard `createClient`. Both are in `server/src/config/supabase.js`.

### Express Backend

- **Express 5** with ESM (`"type": "module`). Express 5 automatically catches rejected promises in async route handlers, so `try/catch` + `next(err)` in controllers is a safety net, not strictly required for async handlers.
- Centralized error handler at `server/src/middleware/errorHandler.js` — throw `err.status` + `err.message` from handlers. Express 5's error handler catches both sync throws and rejected promises without explicit `next(err)`.
- Request validation middleware at `server/src/middleware/validate.js` — factory that validates `body` / `query` / `params` against schema functions; passes a 400 with structured errors on failure. Schemas are plain functions returning `{ valid: boolean, errors?: { field, message }[] }`.
- Helmet, CORS (origin from env), Morgan logging.
- **Environment validation:** `server/src/config/env.js` uses a `required()` helper that throws with a descriptive message on missing vars. Add new env vars to `env.js` with either `required('VAR_NAME')` or `process.env.VAR_NAME || 'default'`. The file exposes `isDev`/`isProd` getters.
- Health check at `GET /api/health`.
- Service, validator, and utility directories are **scaffolded but empty** (only .gitkeep) — ready for business logic.
- Route pattern: mount everything under `/api` via `routes/index.js`.

### API Client Pattern

`client/src/lib/api.js` exports an `api` object with `get`, `post`, `put`, `patch`, `delete` methods. All point to `/api/*` (proxied to Express in dev). Throws on non-2xx with parsed error body (`.error.message` or `.message`). Returns `null` on 204. The auth panel and AuthContext use this client for all auth API calls.

### Frontend

- **React 19** with React Router 7 (`BrowserRouter` in main.jsx).
- Vite proxies `/api/*` → `localhost:4000` (no CORS issues in dev).
- `@` import alias resolves to `./src`.
- Pages: Home (`/`), Menu (`/menu`), PartyPacks (`/party-packs`), EventsContact (`/events`), NotFound (`*`).
- `ActiveSectionContext` for scroll-based nav highlighting (used by EventsContact page → Navbar / MobileNav).
- `client/src/hooks/` directory exists but is **empty** — only a barrel file with comments. No custom hooks defined yet.
- All components are re-exported from `client/src/components/index.js` (barrel file).

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

**Menu item data shape** (each item within a category):

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | kebab-case slug |
| `name` | string | Display name |
| `price` | number (optional) | Direct price, or use `variants` for options |
| `variants` | `{label, price, highlight?}`[] | For items with size/option pricing (e.g. Solo vs w/ Drink) |
| `image` | import | Individual item image; falls back to `categoryImage` |
| `images` | import[] | 3-image array for detail modal carousel |
| `tags` | string[] | Hashtag-style tags like `['#ube', '#halohalo']` |
| `rating` | number (1-5) | Star rating |
| `description` | string | Full description shown in detail modal |
| `badge` | string (optional) | e.g. `'Best Seller'` |
| `isBestSeller` | boolean | Controls BestSellerBadge visibility |
| `serves` | string | e.g. `'1 person'`, `'4-5 people'` |
| `prepTime` | string | e.g. `'~10 mins'` |
| `note` | string (optional) | Category-level note (e.g. `'All include a drink'`) |

**Price resolution logic** (in MenuProductGrid): `item.price` → `item.variants` min/max range → `category.priceNote` fallback.

Each category has a shared `categoryImage` + optional individual item images (Halo-Halo has per-item assets in `client/src/assets/halo_halo/`). Most food images currently point to `foodsample.jpg` placeholder.

**Category icons** are custom inline SVG components in `CategoryIcons.jsx`, mapped by category ID via the `CATEGORY_ICONS` lookup object (e.g., `'halo-halo': { Icon: HaloHaloIcon, shortLabel: 'Desserts' }`).

### Image Sourcing Pattern

Two image sourcing strategies coexist:
1. **Remote CDN URLs** — Many hero/decorative/page images use Google `aida-public` URLs exported from Stitch (e.g., `https://lh3.googleusercontent.com/aida-public/...`)
2. **Local imports** — Menu item images, logo, and assets use standard React asset imports from `client/src/assets/`

### Client-Side State

- **No global state library** — uses React Context (`ActiveSectionContext` for nav highlighting, `AuthContext` for auth)
- **localStorage** used for favorites persistence in `MenuProductGrid`
- **Product detail modal** — `ProductDetailModal` is rendered by `MenuProductGrid` when a card is clicked. It includes an image carousel (with dot navigation and arrow keys), star rating, tags, serving info, and add-to-cart. It locks body scroll and supports keyboard navigation (Escape, arrow keys).
- **Inline search** — `SearchBar` is rendered inside `MenuProductGrid` (visible on mobile, hidden on desktop via media query). Filtering/search logic lives in `SearchBar.jsx`.
- **Form submissions are simulated** — both `InquiryForm` usages (EventsContact, PartyPacks) use `setTimeout` to simulate async submission (800ms delay), no actual API calls yet. When wiring real endpoints, the form's `onSubmit` async handler should be wired to `api.post('/inquiries', data)`.
- **FAB and Navbar action icons** (user, favorites, cart) are wired for auth but other actions are **display-only**
- **Add-to-cart** is display-only — clicking the card FAB or the Add to Cart button in the detail modal toggles a `"Added ✓"` state for 2 seconds but doesn't persist anywhere.

### Mobile Navigation

`BottomMobileNav` (mobile-only bottom nav bar) exists as a component file with four links: Home, Menu, Orders, Profile. **It is NOT currently imported or rendered in `App.jsx`** — it's dead code. Orders and Profile have no corresponding React Router routes and would lead to the NotFound page. The mobile nav is handled by `MobileNav` (sidebar/menu drawer) and the `FAB` component instead.

### Root Dependencies

GSAP (`^3.15.0`) is in the root `package.json` for animation. It's installed but **not yet imported by any component**.

### Okinawa Brush Font

A **self-hosted cursive/brush script font** (`Okinawa`, loaded from `/public/fonts/okinawa.ttf` via `@font-face` in `global.css`) is used for hero/section titles on pages like Menu (`font-family: 'Okinawa', cursive;`). This is the decorative brand font, distinct from the Inter / Plus Jakarta Sans body and headline fonts.

### Icons

All icons use **Google Material Symbols Outlined** (variable font). Render with `<span class="material-symbols-outlined">icon_name</span>` or the `Icon` wrapper component (`client/src/components/ui/Icon.jsx`). The `Icon` component accepts `name`, `size`, `fill`, `weight`, `grade`, `ariaLabel` props. The icon library is loaded from Google Fonts — no local icon files.

### Stitch Design References

`stitch-*.html` files in the project root (home, menu, party, event) are **design specs exported from Google Stitch**, not part of the React app. They contain the original screen designs the React code was built from. `docs/website-structure-for-stitch.txt` is a detailed page map used as Stitch context — useful reference for page structure.

### Barrel Export Pattern

- `client/src/components/index.js` — all UI and layout components re-exported
- `client/src/design-system/index.js` — all token groups re-exported
- `client/src/hooks/index.js` — empty barrel, ready for future hooks

### Page Component Conventions

Every page component follows a **numbered JSDoc section comment** pattern at the top:
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
Sections are separated by comment blocks like `{/* ═══════ SECTION NAME ═══════ */}`.

## ESLint Configuration

Both packages use **ESLint 9 flat config** (`eslint.config.js`):

- **Client** (`client/eslint.config.js`): extends `eslint:recommended` + `plugin:react/recommended` + `plugin:react/jsx-runtime` + `react-hooks/recommended` + `react-refresh/only-export-components`. JSX enabled. Target: browsers.
- **Server** (`server/eslint.config.js`): extends `eslint:recommended` only. Target: Node.js.

Zero warnings allowed (`--max-warnings 0`).

## Data Layer (Static)

Business info, menu items, and bundles are all **static JS modules** (no database reads for content yet):
- `client/src/data/business.js` — brand info, contact, nav links, stats
- `client/src/data/menuItems.js` — 7 categories, 41 items
- `client/src/data/bundles.js` — party pack bundles + features + filter tabs

The Supabase backend is scaffolded: health endpoint is wired, and **auth endpoints are wired** (login, signup, logout, refresh, oauth, me). Content rendering is entirely frontend-driven from static files.

## Dead / Unused Code

Some components are exported from the barrel (`components/index.js`) but their functionality is inlined in their consuming pages and they are **not currently imported**:
- `MenuCard.jsx` — Menu page uses inline ProductCard rendering inside `MenuProductGrid.jsx`
- `MenuFilterTabs.jsx` — Filter tabs are rendered inline inside `MenuProductGrid.jsx`
- `BentoCard.jsx` — PartyPacks page has its own inline bento card rendering
- `BounceCards.jsx` — Only used directly by `Home.jsx`, not exported from barrel
- `BottomMobileNav.jsx` — Exists as a component but **not imported or rendered anywhere** in the app

These may be legacy components or intended for future reuse. When making changes, prefer modifying the inlined implementations (they're the live code), not the standalone wrappers.

## Assets

Images live in `client/src/assets/`:
- `hero/` — 4 hero page images used by `Home.jsx`
- `halo_halo/` — 8 per-item images for the Halo-Halo category
- Root-level image imports (`foodsample.jpg`, `triology-logo.png`, various SVGs) are used as fallbacks and decorative elements
- Most food images in the menu data currently point to `foodsample.jpg` (placeholder)

## Testing

No test framework is configured yet. **Vitest** is the intended test runner (mentioned in README). No test files exist anywhere.

## Environment Setup

Three `.env.example` files exist: root, `client/`, `server/`. Copy these to `.env` and fill in Supabase credentials from Supabase dashboard → Settings → API.

Client env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
Server env vars: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `PORT`, `NODE_ENV`, `CLIENT_ORIGIN`, `SESSION_SECRET`

The server's `env.js` will throw a descriptive `MISSING_ENV` error at startup if `required()` vars are missing.

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
npm run dev:server   # Express with --watch (Node 18+ built-in --watch)

# Build for production
npm run build

# Start production server
npm run start

# Lint both packages (ESLint 9, --max-warnings 0)
npm run lint

# Lint individually
npm run lint -w client
npm run lint -w server

# Clean build artifacts
npm run clean
```

## Conventions

- **ESM only** — both packages use `"type": "module"`
- **Prettier** with semi, single quotes, trailing commas, 100 print width, 2-space indent
- **ESLint 9 flat config** (`eslint.config.js` in each package), zero warnings
- **No tests yet** — Vitest is intended
- **CSS**: Components use inline `style={{}}` with CSS custom properties (`var(--color-*)`) + scoped `<style>` blocks for complex responsive layouts (page components have their own `<style>` tags). The `btn-interact` class provides global hover/active transform behavior.
- **JSDoc** on all components describing props
- **`container` class** provides max-width 1280px + responsive padding (16px mobile, 64px desktop)
- **`section-padding` class** provides vertical padding (4rem mobile, 6rem desktop)
- **Mobile-first** breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **Every page component** follows a section-based structure with clear JSDoc section comments (numbered) at the top
