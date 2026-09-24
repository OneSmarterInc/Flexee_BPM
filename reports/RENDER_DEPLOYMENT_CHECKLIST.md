# Render deployment checklist

2026-09-24. Preparation only: no service, database, or deployment was changed.

## Release gates

- [ ] Provide a dedicated TEST_DATABASE_URL ending in `_test`; execute all PostgreSQL integration, migration, parity, concurrency and session-creation tests. Skipped tests do not satisfy this gate.
- [ ] Confirm rotation/revocation of any historically exposed credentials and review repository history privately.
- [ ] Accept the existing pilot TLS certificate-verification risk explicitly, or separately verify a certificate-validating provider configuration. Current SSL selection is intentionally unchanged.
- [ ] Verify database backup retention and restore into an isolated database; establish owner, recovery objectives, and alert routing.
- [ ] Review current changes and approve a commit separately. No commit or push was performed by this task.

## Backend Web Service

1. Select the intended reviewed revision and repository root. Use a patched Node 22 release at least 22.12; the historical package engine floor alone is insufficient for installed Vite.
2. Build: `npm ci --include=dev && npm run build`. Development dependencies are needed for TypeScript and the explicit migration command.
3. Start: `npm start` (compiled `dist/backend/server/index.js`). Do not use the development watcher for production.
4. Set private DATABASE_URL and FLEXEE_INSTRUCTOR_PASSPHRASE in Render environment settings, not Git. Set NODE_ENV=production and FLEXEE_POSTGRES_SSL=require. Leave PGSSLMODE unset or require. Do not put SSL query parameters in the database URL.
5. Use Render's PORT. Start with one instance: sessions and rate limits are process-local. Do not enable multiple replicas without a separately designed shared session/limiter solution.
6. TRUST_PROXY_HOPS defaults to 0. Set 1 only after verifying that all traffic arrives through exactly one trusted proxy, that it overwrites forwarded client addresses, and that there is no shorter alternate path. Otherwise rate limits can group clients at a proxy; excessive trust can permit spoofing.
7. Explicit migration command: `npm run migrate`. Startup also awaits the same checksummed migration runner. Existing migrations 001–003 must accompany the build; do not edit applied checksums. Migration 003 belongs to the pre-existing session-creation work, not this hardening pass.
8. Health check: `/api/health`. This is liveness, not continuing database readiness. Check authenticated create/read-back and restart persistence separately before a class.
9. Confirm startup emits `server_started`, with no secret values. Missing/invalid required configuration must fail closed. Confirm unauthorized private APIs remain rejected.

## Frontend (Vercel / static Vite)

- Framework: Vite. Build: `npm run build`; output: `dist/web`.
- Only public frontend setting: VITE_API_BASE, set to the backend HTTPS origin plus `/api`. Rebuild when it changes. Never configure DATABASE_URL or the instructor passphrase as VITE values.
- Current allowed browser origins remain `https://flexee-bpm.vercel.app` and `http://localhost:5173`. CORS permits GET, POST, PUT, PATCH, DELETE, OPTIONS and Content-Type/Authorization. No wildcard was introduced. A new frontend hostname needs separately reviewed CORS configuration.
- Verify browser preflight and actual instructor/student requests from the deployed origin, including an error response. Local tests do not demonstrate provider networking.
- Check query-string instructor entry, session creation, team join, refresh, and return navigation. Save generated codes before leaving the success screen.

## Final manual acceptance

- [ ] Live PostgreSQL tests all execute and pass.
- [ ] Create a disposable staging session; join a team, submit, release, restart, and verify stored state remains. Never use production student data for destructive tests.
- [ ] Check classroom shared-network login load: current limits are 20 instructor and 120 student login requests per client IP per ten minutes, including successful requests.
- [ ] Verify 24-hour expiry/relogin, restart/relogin, friendly network errors, and browser widths used by the class.
- [ ] Review Render service/database plan availability, sleep behavior, capacity, external connection allowlists and backup features in the actual account; these were not inspected here.
- [ ] Keep credentials, dumps, logs, screenshots and runtime files out of commits and distribution packages.
