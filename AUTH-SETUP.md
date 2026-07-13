# Auth System — Architecture & Configuration

Authentication system for Triology Refreshment. Uses **app-level JWT sessions** managed by the Express server, backed by Supabase Auth for identity verification. Supports email/password login and Google OAuth (Authorization Code flow with self-managed PKCE).

---

## Architecture

```
Frontend (React)                        Backend (Express)                   Supabase
┌─────────────────────────┐   fetch    ┌─────────────────────────┐   REST  ┌──────────────────┐
│  AuthPanel.jsx          │ ────────→  │  /api/auth/login        │ ─────→  │  Auth service     │
│  (modal overlay)        │ ←────────  │  /api/auth/signup       │ ←─────  │  (user mgmt,      │
│                         │  httpOnly  │  /api/auth/logout       │         │   bcrypt hashing) │
│  AuthContext.jsx        │   cookies  │  /api/auth/refresh      │         └──────────────────┘
│  (session + panel state)│           │  /api/auth/me           │
│                         │           │  /api/auth/oauth/:provider           ┌──────────────────┐
│  Navbar.jsx             │           │  /api/auth/oauth/callback           │  (providers)      │
│  (user menu, triggers)  │           │                         │         │  Google OAuth     │
└─────────────────────────┘           │  jwt + cookie-parser    │         └──────────────────┘
                                      └─────────────────────────┘
```

### Key design decisions

- **App-level JWT sessions**, not raw Supabase tokens. The Express server issues its own short-lived JWTs (15 min) signed with `SESSION_SECRET`, plus rotated refresh tokens (7 days). This decouples the app from Supabase's session format.
- **Self-managed PKCE OAuth**. The server generates the PKCE challenge/verifier, stores the state locally, and exchanges the authorization code for tokens directly via Supabase's REST API (`auth/v1/token`). The redirect URI points back to Express (proxied through Vite in dev), NOT to a Supabase-hosted callback.
- **httpOnly cookies** carry both tokens. Frontend never sees the JWT — it just reads `/auth/me` to get user info.
- **In-memory refresh token store** (`Map` in `controllers/auth.js`). Production should migrate to a database.

---

## Existing Files (All Wired)

All files are already created and wired. No additional setup needed.

| File | What it does |
|------|-------------|
| `client/src/context/AuthContext.jsx` | Auth state: panel open/close, current view (login/signup), user session, logout. Restores session on mount via `GET /auth/me`. |
| `client/src/components/ui/AuthPanel.jsx` | Login/signup modal overlay. Desktop: two-column split (form + brand image). Mobile: full-screen. Includes Google OAuth, email/password, forgot password, password visibility toggle, body scroll lock, Escape-to-close. |
| `client/src/components/layout/Navbar.jsx` | Uses `useAuth()` — shows Sign In / Sign Up buttons when logged out, user avatar dropdown with email + Sign Out when logged in. |
| `client/src/App.jsx` | Wrapped in `<AuthProvider>`, renders `<AuthPanel />`. |
| `server/src/controllers/auth.js` | All 7 auth handler functions (signup, login, logout, refresh, oauthInit, oauthCallback, me) + JWT signing, PKCE helpers, in-memory token store, periodic cleanup. |
| `server/src/routes/auth.js` | Route definitions, mounted at `/api/auth/*`. |
| `server/src/routes/index.js` | Mounts `authRouter` at `/auth`. |
| `server/src/app.js` | Already has `cookie-parser` middleware. |

---

## API Endpoints

| Endpoint | Method | Purpose | Cookie ops |
|----------|--------|---------|-----------|
| `/api/auth/signup` | POST | Create account (Supabase sends verification email) | None |
| `/api/auth/login` | POST | Authenticate, issue session | Sets `access_token` + `refresh_token` |
| `/api/auth/logout` | POST | Clear session, invalidate refresh token | Clears both cookies |
| `/api/auth/refresh` | POST | Rotate refresh token (theft detection on reuse) | Rotates both cookies |
| `/api/auth/oauth/:provider` | GET | Initiate OAuth flow (returns auth URL) | None (redirect follows) |
| `/api/auth/oauth/callback` | GET | Handle OAuth callback, create session | Sets `access_token` + `refresh_token` |
| `/api/auth/me` | GET | Return current user from access token cookie | None (read-only) |

**Currently supported OAuth providers**: `google` only. Adding a provider requires:
1. Enabling it in Supabase dashboard (Authentication → Providers)
2. Adding it to the whitelist in `oauthInit` (`if (provider !== 'google')` → include the new provider)
3. Adding a button in `OAUTH_PROVIDERS` array in `AuthPanel.jsx`

---

## OAuth Flow (Self-Managed PKCE)

Triology does NOT use Supabase's built-in OAuth callback redirect. Instead, the Express server manages the entire PKCE flow itself:

```
User clicks "Continue with Google"
       │
       ▼
Frontend → GET /api/auth/oauth/google
       │
       ▼
Backend:
  1. Generates cryptographically random code_verifier (32 bytes, base64url)
  2. Computes SHA-256 code_challenge from verifier
  3. Generates random state token (24 bytes hex)
  4. Stores (state → { codeVerifier, provider, expiresAt }) in oauthStates Map
  5. Builds Supabase authorize URL with PKCE params + redirect_to = CLIENT_ORIGIN/api/auth/oauth/callback
  6. Returns { url: authorizeUrl } to frontend
       │
       ▼
Frontend redirects browser to authorize URL
       │
       ▼
Supabase → Google sign-in page
User authorizes the app
       │
       ▼
Google redirects → Supabase callback → Supabase redirects to redirect_to:
  http://localhost:5173/api/auth/oauth/callback?code=...
       │
       ▼
Express (via Vite proxy) receives code in query params,
reads oauth_state from httpOnly cookie (SameSite=Lax):
  1. Reads oauth_state cookie to look up code_verifier
  2. Clears the cookie immediately (one-time use)
  3. Validates state against stored Map (CSRF protection + verifier lookup)
  4. Deletes used state from Map
  5. Calls Supabase POST /auth/v1/token?grant_type=authorization_code
     with code + code_verifier + redirect_uri
  6. On success: extracts user id + email from response
  7. Signs app-level JWT access token (15 min)
  8. Generates random refresh token (40 bytes hex)
  9. Stores refresh token in in-memory Map
  10. Sets httpOnly cookies on response (access_token + refresh_token)
  11. Redirects browser to CLIENT_ORIGIN/?auth=success
```

**Why self-managed?** Gives the app full control over session token format and lifetime, decoupling from Supabase's session management. The trade-off is more code to maintain and an in-memory token store that must be persisted for production.

---

## Security Model

| Feature | Implementation |
|---------|---------------|
| OAuth 2.0 flow | Authorization Code + PKCE (SHA-256), never Implicit |
| CSRF protection on OAuth | Cryptographically random state stored in httpOnly `oauth_state` cookie (`SameSite=Lax`, one-time use) + PKCE code_verifier binding |
| Access token lifetime | 15 minutes (JWT signed with `SESSION_SECRET`) |
| Refresh token lifetime | 7 days, rotated on every use |
| Refresh token reuse detection | If a superseded token is used, revokes ENTIRE token family (all tokens for that userId) |
| Cookie security | `httpOnly`, `Secure` (prod only), `SameSite=Strict` |
| Error messages | Generic only — "Invalid email or password", never "email not found" |
| Password storage | Handled by Supabase Auth (bcrypt/argon2), never touches the app |
| Email verification | Required before account activation (Supabase sends verification email on signup) |
| Periodic cleanup | Expired refresh tokens + OAuth states purged every 15 minutes |

---

## Cookie Configuration

| Cookie | Path | Max-Age | SameSite | Purpose |
|--------|------|---------|----------|---------|
| `access_token` | `/` | 15 min | `Strict` | JWT with user claims (sub, email, role) |
| `refresh_token` | `/api/auth` | 7 days | `Strict` | Opaque random token, single-use + rotation |
| `oauth_state` | `/api/auth/oauth/callback` | 10 min | `Lax` | CSRF state for OAuth; survives cross-site redirect from Supabase |

All cookies: `httpOnly: true`, `secure: true` (prod, omitted in dev).

`SameSite=Lax` on `oauth_state` is critical — with `Strict`, the cookie would not be sent when Supabase redirects the browser back to the callback URL (cross-site navigation). The PKCE code challenge/verifier provides the real CSRF protection; the state cookie just links the callback to the correct `code_verifier`.

---

## Configuration (Environment Variables)

These are already defined in `server/src/config/env.js`:

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `SUPABASE_URL` | Yes | — | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | — | Supabase anon/publishable key |
| `SUPABASE_SECRET_KEY` | Yes | — | Supabase service-role key (secret!) |
| `SUPABASE_JWKS_URL` | No | `{SUPABASE_URL}/auth/v1/.well-known/jwks.json` | JWKS endpoint for `requireAuth` middleware (not used by auth controller) |
| `SESSION_SECRET` | No | `dev-secret-change-me` | JWT signing key — **change in production** |
| `CLIENT_ORIGIN` | No | `http://localhost:5173` | Frontend URL for CORS + OAuth redirects |

---

## OAuth Provider Setup

### Google

**1. Supabase Dashboard** → Authentication → Providers → Google:
- Toggle **Enabled** ON
- Enter Client ID and Client Secret from Google Cloud Console

**2. Google Cloud Console** → [APIs & Credentials](https://console.cloud.google.com/apis/credentials):
- Create OAuth 2.0 Client ID (Web application)
- **Authorized JavaScript origins**: `http://localhost:5173` (dev), your production URL
- **Authorized redirect URIs**: `https://{SUPABASE_REF}.supabase.co/auth/v1/callback`
  - This is Supabase's own callback — Supabase receives the Google response, then redirects to your app's callback URL

### Adding a New Provider

1. Enable in Supabase Dashboard → Authentication → Providers
2. In `server/src/controllers/auth.js`, update the whitelist in `oauthInit`:
   ```js
   if (!['google' /* , 'facebook', 'apple' */].includes(provider)) {
   ```
3. In `client/src/components/ui/AuthPanel.jsx`, add to `OAUTH_PROVIDERS`:
   ```js
   { id: 'facebook', label: 'Facebook', icon: <svg>...</svg> },
   ```

---

## Middleware: `requireAuth` (Unused by Auth Routes)

`server/src/middleware/auth.js` exports `requireAuth` — a separate middleware that verifies **raw Supabase JWTs** from the `Authorization` header (not cookies). It uses `@supabase/server/core`'s `extractCredentials` + `verifyAuth` with JWKS caching.

This middleware is **not used by any route** — the auth controller uses its own cookie-based sessions. `requireAuth` was implemented as a reusable guard for future authenticated API endpoints (e.g., order history, user profile) where the frontend would send a Supabase session token rather than relying on cookie-based auth.

---

## Production Readiness Checklist

- [ ] **Persist refresh tokens** — migrate from in-memory `Map` to a database table (e.g., Supabase `refresh_tokens` table with columns: `token_hash`, `user_id`, `email`, `family_id`, `expires_at`, `created_at`)
- [ ] **Change `SESSION_SECRET`** — set a strong random value in production
- [ ] **Rate limiting** — add `express-rate-limit` to login/signup/refresh endpoints (currently none)
- [ ] **HTTPS + Secure cookies** — `Secure` flag is already production-only; verify HTTPS is enforced
- [ ] **CORS** — verify `CLIENT_ORIGIN` is set to the production frontend URL
- [ ] **OAuth redirect URI** — ensure `CLIENT_ORIGIN/api/auth/oauth/callback` is reachable (Express must serve under the same origin in production, or be reverse-proxied)

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `redirect_uri_mismatch` | Google Cloud redirect URI doesn't match Supabase's callback URL | The redirect URI in Google Cloud must be `https://{SUPABASE_REF}.supabase.co/auth/v1/callback` |
| `provider is not enabled` | Provider not toggled ON in Supabase dashboard | Enable in Authentication → Providers |
| OAuth redirects to `localhost` in production | `CLIENT_ORIGIN` env var not set | Set to production frontend URL in server's `.env` |
| Auth panel shows error on login | Backend not running or wrong credentials | Check `npm run dev:server` is running, verify Supabase credentials in `.env` |
| Session lost on page refresh | `/api/auth/me` returned 401 | Check `access_token` cookie exists and hasn't expired; refresh token rotation may have a bug |
