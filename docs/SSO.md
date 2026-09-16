## SSO integration for 72X sub-apps (CRM / Finance / TenderlyAI)

Summary
-------
This document describes the Single Sign-On (SSO) flow between the main 72X application and the sub-apps (CRM, Finance Manager, TenderlyAI), the backend endpoints involved, required environment variables, security considerations, and deployment checklist for Vercel.

Flow (high level)
------------------
1. Authenticated user in main app requests a short-lived one-time token:
   - `POST /api/auth/sso/generate` (requires Authorization header)
   - Backend saves a `SsoToken` record (60s TTL, single-use) and returns `{ ssoToken, expiresIn }`.
2. Main app opens the sub-app in a new tab/window with `?sso=<token>` appended to the URL.
3. Sub-app detects `?sso=` on load and immediately `POST /api/auth/sso/exchange` with `{ ssoToken }`.
4. Backend validates token, marks it used, and returns `{ token: <JWT>, user, userPackage, organisation }`.
5. Sub-app stores JWT + user in `localStorage` and proceeds as authenticated.

Key backend files
-----------------
- `src/main/java/.../controller/SsoController.java` — endpoints `/generate` and `/exchange`.
- `src/main/java/.../service/SsoTokenService.java` — token create/exchange logic (single‑use, cleanup).

Frontend hooks / components
---------------------------
- `src/sso/useSsoAuth.ts` and `src/sso/SubAppShell.tsx` (monorepo frontend) implement detection and exchange.
- Individual subapps use `SsoHandler` (or equivalent) to call `/api/auth/sso/exchange` and store auth state.

Required env vars (frontend)
----------------------------
- `VITE_BACKEND_URL` or `VITE_PRODUCTION_URL` — base URL of your Spring Boot API (used by axios client).
- `VITE_MAIN_APP_URL` — main app root (used by subapp sign-in links and redirects).
- Optional: `VITE_CRM_URL`, `VITE_FINANCE_URL`, `VITE_TENDERLYAI_URL` for app-store links.

Secrets (backend only)
----------------------
- Keep `SUPABASE_SERVICE_KEY`, JWT signing keys, DB credentials, Stripe secret keys, etc., strictly on the backend. Never expose them as `VITE_` variables.

Security recommendations
------------------------
- Serve all domains over HTTPS.
- Ensure backend CORS allows your production domains (add Vercel domains). The controller currently allows `https://*.72x.co.za` and localhost — update for production.
- Consider verifying `Referer`/Origin or use a short nonce/state if you need stronger request binding.
- Confirm server clocks are synced (SSO TTL depends on server time).

Vercel deployment checklist (per subapp)
--------------------------------------
1. Create Vercel project for each subapp (name e.g., `72x-crm`).
2. Project settings:
   - Install: `npm ci` (or `pnpm install`)
   - Build: `npm run build:crm` / `build:finance` / `build:tenderlyai`
   - Output dir: `dist-crm` / `dist-finance` / `dist-tenderlyai`
3. Add environment variables (Production): `VITE_BACKEND_URL`, `VITE_MAIN_APP_URL`, plus any `VITE_SUPABASE_*` or payment public keys.
4. Deploy and verify that a signed-in user in the main app can open a subapp and be silently authenticated.

Troubleshooting
---------------
- If SSO exchange fails with 401: check token TTL, token reuse, and that `/generate` returned a token and was called with a valid Authorization header.
- If CORS errors appear: add the Vercel project domain to backend CORS allowed origins.

Notes
-----
The SSO implementation is intentionally short‑lived and single‑use. For stricter guarantees add origin checks or a short state value passed from the main app.
