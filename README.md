# Triology

A modern full-stack web application built with **React + Vite** (frontend) and **Express.js** (backend), backed by **Firebase** (Firestore + Auth).

```
triology/
├── client/          React + Vite frontend
├── server/          Express.js API server
├── package.json     Root workspace (npm workspaces)
├── .env.example     Shared env template
└── .gitignore
```

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Then open `server/.env` and fill in the Firebase Web API Key:

- **`FIREBASE_WEB_API_KEY`** — from Firebase Console → Project Settings → General

Also ensure `server/service-account.json` exists (download from Firebase Console → Project Settings → Service Accounts → Generate New Private Key).

### 3. Start development

```bash
npm run dev
```

Starts both services concurrently:

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:4000 |

The Vite dev server proxies `/api/*` requests to the Express server, so the frontend can call `fetch('/api/health')` without CORS issues.

### 4 Verify

Open http://localhost:5173 — you should see the Triology status page confirming the frontend is running and the backend is reachable.

---

## Project structure

```
triology/
├── client/                          # React + Vite
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # SDKs & API clients
│   │   │   ├── api.js               # Express API wrapper
│   │   │   ├── menuApi.js           # Menu API client
│   │   │   └── contentApi.js        # Content API client
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── Home.jsx
│   │   │   └── NotFound.jsx
│   │   ├── styles/                  # CSS files
│   │   ├── utils/                   # Utility functions
│   │   ├── App.jsx                  # Root component + routing
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Express.js API
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js               # Environment validation
│   │   │   └── firebase.js          # Firebase Admin SDK
│   │   ├── controllers/             # Route handlers
│   │   │   └── health.js
│   │   ├── middleware/
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   └── validate.js          # Request validation
│   │   ├── routes/                  # Express routers
│   │   │   └── index.js
│   │   ├── services/                # Business logic
│   │   ├── validators/              # Validation schemas
│   │   ├── utils/                   # Helpers
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Entry point
│   └── package.json
│
├── package.json                     # npm workspaces root
├── .env.example
├── .gitignore
└── README.md
```

---

## Architecture decisions

### npm workspaces

Both `client/` and `server/` are registered as npm workspaces in the root `package.json`. This means:

- A single `npm install` at the root installs everything.
- Shared dev tooling can live at the root.
- Each package keeps its own dependencies and scripts.

### Vite proxy

In development, Vite proxies `/api` requests to Express. This avoids CORS configuration during local development. The proxy is configured in `client/vite.config.js`.

### Supabase client split

| Client | Key | Scope | File |
|--------|-----|-------|------|
| Browser | `anon` key (public) | Row-Level Security enforced | `client/src/lib/supabase.js` |
| Server | `service_role` key (secret) | Bypasses RLS | `server/src/config/supabase.js` |

Never expose the service-role key — it's only used server-side.

### Error handling

The Express backend has a centralized error-handling middleware (`server/src/middleware/errorHandler.js`). Throw from any route handler with `err.status` and `err.message`, and it gets formatted consistently.

---

## Adding routes

### Frontend

```jsx
// client/src/App.jsx
import About from './pages/About';

<Route path="/about" element={<About />} />
```

Create the page in `client/src/pages/About.jsx`.

### API

```js
// server/src/controllers/items.js
export async function listItems(req, res, next) {
  try {
    const { data } = await supabase.from('items').select('*');
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
```

```js
// server/src/routes/index.js
import { listItems } from '../controllers/items.js';
router.get('/items', listItems);
```

---

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both frontend + backend in dev mode |
| `npm run dev:server` | Start only the backend |
| `npm run dev:client` | Start only the frontend |
| `npm run build` | Build both for production |
| `npm run start` | Start the production server |
| `npm run lint` | Lint both packages |
| `npm run clean` | Remove build artifacts |

---

## What's next

- Add authentication flows with Supabase Auth
- Create database migrations with Supabase CLI
- Add unit/integration tests (Vitest for client, Vitest or Node test for server)
- Containerize with Docker for reproducible deployments
# triology-refreshment
