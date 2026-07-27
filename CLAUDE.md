# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Triology Refreshment** — a full-stack restaurant/food business website for a Filipino refreshment shop in Trapiche, Oton, Iloilo. Built with React + Vite (frontend) and Express.js (backend), backed by Firebase Firestore + Firebase Auth.

### Monorepo Structure (npm workspaces)

```
triology/
├── client/              React + Vite (React 19, React Router 7)
│   ├── src/
│   │   ├── components/    layout/ (Navbar, Footer, MobileNav, FAB, DeliveryBanner, …)
│   │   │                  + ui/ (Button, Icon, MenuProductGrid, AuthPanel, CategoryEditorModal, ItemEditorModal, …)
│   │   ├── pages/         Home, Menu, PartyPacks, Contact, Venue, NotFound
│   │   ├── data/          Static fallback data (menuItems.js, bundles.js, business.js)
│   │   ├── design-system/ tokens.js (JS design tokens) + barrel export
│   │   ├── styles/        global.css (CSS custom properties, reset, utilities)
│   │   ├── lib/           api.js (fetch wrapper), menuApi.js, contentApi.js
│   │   ├── context/       ActiveSectionContext.jsx, AuthContext.jsx, OrderListContext.jsx
│   │   ├── hooks/         useLiveBusiness.js (fetches from API with static fallback)
│   │   ├── utils/         index.js barrel
│   │   ├── assets/        hero/, food/, about/, ui/ images, logo
│   │   ├── App.jsx        Root component + Routes
│   │   └── main.jsx       Entry point (BrowserRouter)
│   └── vite.config.js     @ import alias, /api proxy → localhost:4000
│
├── server/              Express.js (Express 5, ESM)
│   ├── src/
│   │   ├── config/        env.js (validated env), firebase.js (Admin SDK), cloudinary.js
│   │   ├── controllers/   health.js, auth.js, content.js, menu.js
│   │   ├── middleware/    errorHandler.js, validate.js, auth.js (Firebase ID token verify), adminAuth.js
│   │   ├── routes/        index.js (mounts /api routes), auth.js, menu.js, content.js
│   │   ├── validators/    menu.js (category + item schema functions)
│   │   └── scripts/       seed-all.js, seed-menu.js, seed-business.js
│   └── package.json
│
├── docs/               website-structure-for-stitch.txt
├── AUTH-SETUP.md       Deep auth system docs (architecture, OAuth flow, security model, troubleshooting)
└── .env.example
```

### Pages & Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Hero, services bento grid, about/vibe, social proof |
| `/menu` | Menu | Full product grid with filter/sort, search, product detail modal, admin CRUD modals |
| `/party-packs` | PartyPacks | Combo meal bundles, full menu listing, add-ons, contact form |
| `/about` | Contact | Contact details, inquiry form, map (same component as `/contact`) |
| `/contact` | Contact | Same as `/about` |
| `/venue` | Venue | Venue rental showcase, pricing, amenities, gallery, booking form |
| `*` | NotFound | 404 with quick links to popular pages |

## Request Flow

```
Browser → Vite (:5173) → /api/* proxy → Express (:4000) → controllers → Firebase Firestore / Auth
```

- In development, Vite proxies `/api/*` to Express (no CORS issues). Express also configures CORS with credentials for production.
- API client (`client/src/lib/api.js`) wraps `fetch` and always calls `/api/*` paths. Returns parsed JSON, throws on non-2xx, returns `null` on 204.
- Auth endpoints use httpOnly cookies for tokens (access_token + refresh_token). Menu/content read endpoints are public. Non-auth write endpoints use the `requireAdmin` middleware checking app-level JWT in cookies.

## Key Architecture Decisions

### Auth System

Uses **app-level JWT sessions** managed by Express, backed by **Firebase Auth**. See `AUTH-SETUP.md` for the full architecture documentation.

Key files:
- `server/src/controllers/auth.js` — 7 endpoints (signup, login, logout, refresh, me, oauthGoogleInit, oauthGoogleCallback). Refresh tokens are persisted to `server/sessions.json` (disk-backed `Map` with 15-min cleanup).
- `server/src/middleware/auth.js` — `requireAuth`: verifies Firebase ID tokens from `Authorization: Bearer` header via `firebaseAuth.verifyIdToken()`. Not used by auth routes — reserved for future authenticated API endpoints.
- `server/src/middleware/adminAuth.js` — `requireAdmin`: verifies app-level JWT from `access_token` cookie + checks email against `ADMIN_EMAIL` env var.
- `client/src/context/AuthContext.jsx` — manages auth panel state, session restore on mount via `GET /auth/me` → `POST /auth/refresh` fallback.
- `client/src/components/ui/AuthPanel.jsx` — login/signup/forgot-password modal overlay.
- **Google OAuth**: `GET /api/auth/oauth/google` returns a consent URL; the callback at `GET /api/auth/oauth/google/callback` exchanges the code, creates/retrieves a Firebase user, and issues session cookies. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` env vars.

### Data Sources

All persistent data lives in **Firebase Firestore**:

| Collection | Document(s) | Seeded by |
|-----------|-------------|-----------|
| `menu_categories` | One doc per category | `seed-all.js` |
| `menu_items` | One doc per item | `seed-all.js` |
| `site_content` | `business`, `bundles`, `bundle_features`, `menu_filter_tabs` | `seed-all.js` |

Seed script: `node src/scripts/seed-all.js` (from the server directory). It pushes ALL static data from `client/src/data/` into Firestore. Run once after setting up the Firebase service account.

Static fallback data in `client/src/data/` is used when the API is unavailable (no Firestore connection, server not running, etc.). The Menu and PartyPacks pages both try the API first and fall back to static data.

### Menu CRUD (Admin)

Full CRUD endpoints (all admin-protected via `requireAdmin`):
- `GET /api/menu/categories` + `GET /api/menu/categories/:id` (public)
- `POST/PUT/DELETE /api/menu/categories` (admin)
- `GET /api/menu/items` + `GET /api/menu/items/:id` (public)
- `POST/PUT/DELETE /api/menu/items` (admin)
- `POST /api/menu/upload` (admin — Cloudinary image upload via multer, 5 MB limit)

Frontend admin modals: `CategoryEditorModal` and `ItemEditorModal` in `Menu.jsx`. Admin mode activates when logged in as the `ADMIN_EMAIL` user. The admin fetches from the API; if the API is unreachable, admin controls are disabled.

### Order List System

`OrderListContext` manages a "My List" of selected menu items:
- Persisted to localStorage via the `orderList` key
- Items tracked with id, name, price, quantity
- `buildMessengerMessage()` formats the list as a text message
- `openMessenger()` opens Facebook Messenger with the pre-formatted message
- `OrderListDrawer` component provides a slide-out panel with the list
- Add-to-cart in `MenuProductGrid` toggles "Added ✓" for 2 seconds

### Content API

- `GET /api/content/business` — business info, venue, nav links
- `PUT /api/content/business` — update (admin only)
- `GET /api/content/bundles` — bundles array, features, filter tabs

The `useLiveBusiness` hook (`client/src/hooks/useLiveBusiness.js`) fetches business data from the API and falls back to static `business.js` data.

### Scroll-Based Nav Highlighting

`ActiveSectionContext` (used by the Contact page) shares which page section is currently in-view via `IntersectionObserver`. Navbar / MobileNav consume it to highlight links based on scroll position. Routes with no active section fall back to route-based `:active` styling.

### Design System: Dual Token Source

Visual tokens exist in **two places that must stay in sync**:
1. **`client/src/design-system/tokens.js`** — JS exports used by component imports
2. **`client/src/styles/global.css` `:root`** — CSS custom properties (runtime source of truth)

Components use `var(--color-*)` / `var(--font-*)` / `var(--radius-*)` / `var(--shadow-*)` — never hardcoded values.

**⚠️ Known discrepancy:** `tokens.js` defines `primary` as `#0f5238` while `global.css` `:root` uses `#056402`. The CSS variables are what components actually render. When syncing, decide which value is canonical and update both files.

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

Schema functions are plain JS — no schema library. Current validators live in `server/src/validators/menu.js`.

## Styling Conventions

- **Inline `style={{}}` with CSS custom properties** plus scoped `<style>` blocks in page components for complex responsive layouts
- **No CSS-in-JS library**
- **`btn-interact` class** (defined in `global.css`): `scale(0.97)` on active, `opacity(0.85)` on hover
- **`container` class**: max-width 1280px + responsive padding (16px mobile, 64px desktop)
- **`section-padding` class**: vertical padding (4rem mobile, 6rem desktop)
- **`sr-only` class**: visually hidden utility for screen readers
- Mobile-first breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- **`material-symbols-outlined`** class for Google Material Symbols icons (variable font)

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

## Data Layer (Static Fallback)

Business info, menu items, and bundles have static JS modules that serve as fallbacks:
- `client/src/data/business.js` — brand info, contact, nav links, stats, venue data
- `client/src/data/menuItems.js` — 7 categories, 41+ items with 7 layout types
- `client/src/data/bundles.js` — party pack bundles + features + filter tabs

All three have corresponding Firestore documents seeded by `seed-all.js`.

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
2. Add to `server/.env.example` AND root `.env.example`
3. If needed client-side, add to `client/.env.example` with `VITE_` prefix and read via `import.meta.env.VITE_VAR_NAME`

## Image Sourcing

Two strategies coexist:
1. **Remote CDN URLs** — Hero/decorative/page images use Google `aida-public` URLs exported from Stitch
2. **Local imports** — Menu item images, logo, and assets from `client/src/assets/`
3. **Cloudinary upload** — Admin image upload via `POST /api/menu/upload` (multer → Cloudinary), configured in `server/src/config/cloudinary.js`

Most food images currently point to `foodsample.jpg` placeholder.

## Client-Side State

- **Three React Contexts**: `AuthContext` (auth panel + session), `ActiveSectionContext` (scroll-based nav), `OrderListContext` (order list + Messenger)
- **No global state library**
- **localStorage** for order list persistence (`orderList` key)
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
- `BottomMobileNav.jsx` — **not imported or rendered anywhere** (mobile nav uses `MobileNav` sidebar + `FAB`; this component has no corresponding routes for Orders/Profile)
- `client/src/hooks/index.js` — empty barrel file
- `ContactBar.jsx` — layout component exported but not imported by any page

## Assets

Images in `client/src/assets/`: `hero/` (4 hero images), `halo_halo/` (8 per-item images), `food/` (refreshments, rice-meal, venue), `about/` (5 about images), `ui/` (location-bg, blob.svg). Root-level assets (`foodsample.jpg`, `triology-logo.png`, `handaan.jpg`, SVGs) used as fallbacks.

## Fonts

- **Okinawa brush script** (self-hosted): `/public/fonts/okinawa.ttf` via `@font-face` in `global.css` — used for decorative hero/section titles
- **Inter** and **Plus Jakarta Sans** — body and headline fonts from Google Fonts
- **Material Symbols Outlined** — variable font for icons, loaded from Google Fonts, rendered via `<span class="material-symbols-outlined">icon_name</span>` or the `Icon` component

## Dependencies

- Root has `gsap` (installed but not yet used) and `concurrently` (dev)
- `firebase-admin` — Firebase Admin SDK (Auth + Firestore)
- `jsonwebtoken` — JWT signing for app-level sessions
- `cookie-parser` — cookie reading for auth
- `helmet`, `cors`, `morgan` — Express middleware
- `cloudinary` + `multer` — image upload infrastructure
- Client: `react` 19, `react-dom` 19, `react-router-dom` 7

## Common Commands

```bash
npm install               # Install everything (root)
npm run dev               # Start both servers concurrently
npm run dev:client        # Vite only (port 5173)
npm run dev:server        # Express with --watch (port 4000, Node 22+)
npm run build             # Build both for production
npm run start             # Start production server
npm run lint              # ESLint 9 flat config (--max-warnings 0)
npm run clean             # Remove build artifacts
npm run seed              # (from server/) node src/scripts/seed-all.js
```

The server uses Node 22+ `node --watch` for auto-restart on file changes during development.

## Common Patterns

**Adding a new API route:**
1. Create controller function in `server/src/controllers/*.js`
2. Create schema function in `server/src/validators/*.js` (optional)
3. Add route in a `server/src/routes/*.js` file
4. Mount in `server/src/routes/index.js`

**Adding a new frontend page:**
1. Create page file in `client/src/pages/` with numbered JSDoc section comments
2. Add `<Route>` in `client/src/App.jsx`
3. Add nav link in `business.js` data if needed (or in Firestore `site_content/business`)

**Seeding Firestore data:**
1. Edit the static data in `server/src/scripts/seed-all.js` (or run the targeted scripts)
2. Run `node src/scripts/seed-all.js` from the server directory
3. Static fallback data in `client/src/data/` must be updated separately

## Environment

- **ESM only** — both packages use `"type": "module"`
- **Express 5** — auto-catches rejected promises in async route handlers
- **React 19** + **React Router 7** (BrowserRouter in main.jsx)
- **ESLint 9 flat config** (`eslint.config.js` per package), zero warnings allowed
- **Prettier** with semi, single quotes, trailing commas, 100 print width
- **Firebase Web API Key** (`FIREBASE_WEB_API_KEY`) — get from Firebase Console → Project Settings → General. Used for Firebase Auth REST API calls (sign-in endpoint)
- **Firebase service account** — download from Firebase Console → Project Settings → Service Accounts → Generate New Private Key. Save as `server/service-account.json`. Never commit this file.
- **No test framework configured yet** (Vitest intended)

## Vercel Deployment

Single-project deployment serving the React frontend as static files and the Express API as a serverless function under one domain.

### Files

| File | Purpose |
|------|---------|
| `vercel.json` | Build config, route rewrites, Node 22 |
| `api/index.mjs` | Serverless entry — imports the Express app |
| `server/src/config/firebase.js` | Reads `FIREBASE_SERVICE_ACCOUNT` env var (base64 JSON) on Vercel |

### How it works

```
Request → Vercel Edge
  ├── /api/*    → serverless function (Express app at api/index.mjs)
  ├── /assets/* → static files from client/dist/
  └── /*        → index.html (SPA client-side routing)
```

The build command (`npm run build -w client`) only builds the Vite frontend. The Express server runs as-is (no compilation step) via the serverless function wrapper at `api/index.mjs`.

### Setup in Vercel Dashboard

1. Push the repo to GitHub and import in Vercel
2. Set these environment variables in Vercel → Project Settings → Environment Variables:

   | Variable | Required | Notes |
   |----------|----------|-------|
   | `FIREBASE_WEB_API_KEY` | Yes | Firebase Console → Project Settings → General → Web API Key |
   | `FIREBASE_SERVICE_ACCOUNT` | Yes | Base64 of `server/service-account.json` |
   | `SESSION_SECRET` | Yes | Random string, min 32 chars |
   | `CLIENT_ORIGIN` | Yes | Your Vercel domain, e.g. `https://triology.vercel.app` |
   | `CLOUDINARY_URL` | If using uploads | `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` |
   | `ADMIN_EMAIL` | If using admin | Email of the admin user |
   | `GOOGLE_CLIENT_ID` | If using OAuth | Google OAuth client ID |
   | `GOOGLE_CLIENT_SECRET` | If using OAuth | Google OAuth client secret |

3. **Generate the Firebase service account env var:**
   ```bash
   # Windows PowerShell
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("server\service-account.json"))
   # Linux / macOS
   base64 -w0 server/service-account.json | pbcopy
   ```
   Paste the output as the `FIREBASE_SERVICE_ACCOUNT` env var in Vercel.

4. Deploy! Vercel detects the config, installs workspace deps, builds the client, and deploys the serverless function.

### Known serverless limitations

- **Refresh tokens** stored in `server/sessions.json` don't persist across cold starts (ephemeral filesystem). Users may need to re-login after periods of inactivity. Planned fix: migrate to a database session store.
- **First request after inactivity** may be slow (~1s cold start). Subsequent requests are fast while the function stays warm.
- **File uploads** (Cloudinary via multer) work but are limited to 5 MB and the function timeout of 30 seconds.
