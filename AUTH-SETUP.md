# Auth System — Architecture & Configuration

Authentication system for Triology Refreshment. Uses **app-level JWT sessions** managed by the Express server, backed by **Firebase Auth** for user management and identity verification. Supports email/password login.

---

## Architecture

```
Frontend (React)                        Backend (Express)                   Firebase
┌─────────────────────────┐   fetch    ┌─────────────────────────┐   REST  ┌──────────────────┐
│  AuthPanel.jsx          │ ────────→  │  /api/auth/login        │ ─────→  │  Auth REST API    │
│  (modal overlay)        │ ←────────  │  /api/auth/signup       │ ←─────  │  (signInWithPwd)  │
│                         │  httpOnly  │  /api/auth/logout       │         └──────────────────┘
│  AuthContext.jsx        │   cookies  │  /api/auth/refresh      │         ┌──────────────────┐
│  (session + panel state)│           │  /api/auth/me           │         │  Admin SDK        │
│                         │           │                         │         │  (createUser,     │
│  Navbar.jsx             │           │  jwt + cookie-parser    │         │   verifyIdToken)  │
│  (user menu, triggers)  │           └─────────────────────────┘         └──────────────────┘
└─────────────────────────┘
```

### Key design decisions

- **App-level JWT sessions**, not raw Firebase tokens. The Express server issues its own short-lived JWTs (1h) signed with `SESSION_SECRET`, plus rotated refresh tokens (30 days). This decouples the app from Firebase's token format.
- **Server-side auth flow**. The server handles sign-in via the Firebase Auth REST API (`identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`), then verifies the returned ID token via the Firebase Admin SDK (`verifyIdToken`). No Firebase client SDK is needed on the frontend.
- **httpOnly cookies** carry both tokens. Frontend never sees the JWT — it just reads `/auth/me` to get user info.
- **In-memory refresh token store** (`Map` in `controllers/auth.js`). Production should migrate to a database.

---

## Existing Files (All Wired)

| File | What it does |
|------|-------------|
| `client/src/context/AuthContext.jsx` | Auth state: panel open/close, current view (login/signup), user session, logout. Restores session on mount via `GET /auth/me`. |
| `client/src/components/ui/AuthPanel.jsx` | Login/signup modal overlay. Desktop: two-column split (form + brand image). Mobile: full-screen. Email/password + forgot password + password visibility toggle, body scroll lock, Escape-to-close. |
| `client/src/components/layout/Navbar.jsx` | Uses `useAuth()` — shows Sign In / Sign Up buttons when logged out, user avatar dropdown with email + Sign Out when logged in. |
| `client/src/App.jsx` | Wrapped in `<AuthProvider>`, renders `<AuthPanel />`. |
| `server/src/controllers/auth.js` | All 5 auth handler functions (signup, login, logout, refresh, me) + JWT signing, Firebase Auth REST + Admin SDK integration, in-memory token store, periodic cleanup. |
| `server/src/routes/auth.js` | Route definitions, mounted at `/api/auth/*`. |
| `server/src/routes/index.js` | Mounts `authRouter` at `/auth`. |
| `server/src/middleware/auth.js` | `requireAuth` middleware — verifies Firebase ID tokens from `Authorization` header via `firebaseAuth.verifyIdToken()`. |
| `server/src/middleware/adminAuth.js` | `requireAdmin` middleware — verifies app-level JWT cookie + checks `ADMIN_EMAIL`. |
| `server/src/config/firebase.js` | Firebase Admin SDK init (exposes `firestore` + `firebaseAuth`). |

---

## API Endpoints

| Endpoint | Method | Purpose | Cookie ops |
|----------|--------|---------|-----------|
| `/api/auth/signup` | POST | Create account (Firebase Auth) | None |
| `/api/auth/login` | POST | Authenticate, issue session | Sets `access_token` + `refresh_token` |
| `/api/auth/logout` | POST | Clear session, invalidate refresh token | Clears both cookies |
| `/api/auth/refresh` | POST | Rotate refresh token (theft detection on reuse) | Rotates both cookies |
| `/api/auth/me` | GET | Return current user from access token cookie | None (read-only) |

---

## Auth Flows

### Sign Up
1. Frontend sends `{ email, password }` to `POST /api/auth/signup`
2. Server calls `firebaseAuth.createUser({ email, password })` (Admin SDK)
3. Firebase Auth user is created (verification email may be sent)
4. Returns `{ user: { id, email } }` with success message

### Login
1. Frontend sends `{ email, password }` to `POST /api/auth/login`
2. Server calls Firebase Auth REST API: `POST identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={WEB_API_KEY}`
3. Returns an `idToken` — server verifies it with `firebaseAuth.verifyIdToken(idToken)`
4. Server signs app-level JWT access token (1h) + generates random refresh token (40 bytes hex)
5. Sets httpOnly cookies: `access_token` (Path=/) + `refresh_token` (Path=/api/auth)
6. Returns `{ user: { id, email } }`

### Session Refresh
1. Frontend sends `POST /api/auth/refresh` — the `refresh_token` cookie is sent automatically
2. Server looks up the token in the in-memory store
3. If valid: issues a new access_token + refresh_token pair, marks old refresh as superseded
4. **Theft detection**: if a superseded token is used, the ENTIRE token family is revoked

### Logout
1. Frontend sends `POST /api/auth/logout`
2. Server deletes the refresh token from the store
3. Both cookies are cleared

---

## Security Model

| Feature | Implementation |
|---------|---------------|
| Access token lifetime | 1 hour (JWT signed with `SESSION_SECRET`) |
| Refresh token lifetime | 30 days, rotated on every use |
| Refresh token reuse detection | If a superseded token is used, revokes ENTIRE token family |
| Cookie security | `httpOnly`, `Secure` (prod only), `SameSite=Strict` |
| Error messages | Generic only — "Invalid email or password", never "email not found" |
| Password storage | Handled by Firebase Auth, never touches the app |
| Periodic cleanup | Expired refresh tokens purged every 15 minutes |

---

## Cookie Configuration

| Cookie | Path | Max-Age | SameSite | Purpose |
|--------|------|---------|----------|---------|
| `access_token` | `/` | 1h | `Strict` | JWT with user claims (sub, email, role) |
| `refresh_token` | `/api/auth` | 30 days | `Strict` | Opaque random token, single-use + rotation |

All cookies: `httpOnly: true`, `secure: true` (prod, omitted in dev).

---

## Configuration (Environment Variables)

All defined in `server/src/config/env.js`:

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `FIREBASE_WEB_API_KEY` | Yes | — | Firebase Web API Key (from Project Settings → General) |
| `SESSION_SECRET` | No | `dev-secret-change-me` | JWT signing key — **change in production** |
| `CLIENT_ORIGIN` | No | `http://localhost:5173` | Frontend URL for CORS |
| `ADMIN_EMAIL` | No | `""` | Email of the admin user (for `requireAdmin` middleware) |

Firebase Admin SDK credentials are loaded from `server/service-account.json`.

---

## Middleware: `requireAuth` (Unused by Auth Routes)

`server/src/middleware/auth.js` exports `requireAuth` — middleware that verifies a **Firebase ID token** from the `Authorization` header via `firebaseAuth.verifyIdToken()`. Not used by auth routes (they use cookie-based sessions) — reserved for future authenticated API endpoints.

`server/src/middleware/adminAuth.js` exports `requireAdmin` — reads the `access_token` cookie, verifies the app-level JWT, and checks that the email matches `ADMIN_EMAIL`. Used by menu CRUD routes.

---

## Production Readiness Checklist

- [ ] **Persist refresh tokens** — migrate from in-memory `Map` to Firestore
- [ ] **Change `SESSION_SECRET`** — set a strong random value in production
- [ ] **Rate limiting** — add `express-rate-limit` to login/signup/refresh endpoints
- [ ] **HTTPS + Secure cookies** — `Secure` flag is already production-only; verify HTTPS is enforced
- [ ] **CORS** — verify `CLIENT_ORIGIN` is set to the production frontend URL

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Auth panel shows error on login | Backend not running or wrong credentials | Check `npm run dev:server` is running, verify Firebase credentials in `.env` |
| Session lost on page refresh | `/api/auth/me` returned 401 | Check `access_token` cookie exists and hasn't expired |
| `FIREBASE_WEB_API_KEY` error | Missing env var | Get the Web API Key from Firebase Console → Project Settings → General |
| `service-account.json` not found | Missing Firebase service account | Download from Firebase Console → Project Settings → Service Accounts → Generate New Private Key |
