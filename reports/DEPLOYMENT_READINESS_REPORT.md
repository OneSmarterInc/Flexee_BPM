# Deployment readiness — Vercel frontend / Render backend / Render PostgreSQL

Reviewed 2026-09-18. **Readiness preparation complete; split-origin deployment is not yet cleared for launch.** No application code, tests, hosting configuration, authentication behavior or simulation mechanics were changed. No deployment, account connection, Git push, seed of a real database or ZIP creation occurred.

## 1. Proposed architecture and release blockers

Browser → Vercel static Vite frontend → Render Express Web Service → Render PostgreSQL.

The frontend has no direct database access. Only the backend holds database and instructor credentials. PostgreSQL starts clean; historical SQLite databases are not deployment inputs.

| Finding | Status / required action |
|---|---|
| Direct Vercel-to-Render browser requests lack CORS support | **Launch blocker.** Approve and implement a narrow backend origin/preflight policy, or approve a same-origin Vercel reverse proxy. Neither is implemented in this task. |
| Credential values were present in `.env.example` at the start of this review | Removed from the template. Treat them as exposed if they were ever used; rotate through the relevant administrator/provider before launch. No credentials were changed in any database or running environment. |
| `.gitignore` does not cover `.env.local`, `.env.production`, other environment variants or arbitrary dumps/keys/logs | Pre-push safeguard required: review an explicit staging manifest or authorize ignore-rule hardening. Do not use an unchecked `git add .`. |
| Vercel Hobby eligibility | Sponsor must confirm personal/non-commercial eligibility; education/sponsorship alone does not establish eligibility. If ineligible, the requested plan must change. |
| No `npm start` or emitted server JavaScript | Not a blocker with the documented explicit start command and retained development dependencies. Do not use `node dist/server/index.js`. |
| Package engine range is broader than actual build support | Select Node 22.x, at least 22.12, in both platforms. Local verification used 22.18.0. Review current security patches before launch. |
| No configured deployment database, origin, secrets or backup policy | Manual provisioning/approval remains outstanding. |

Vercel's current Hobby rules restrict it to personal, non-commercial use. This report does not determine the sponsor's eligibility. [Official Hobby documentation](https://vercel.com/docs/plans/hobby)

## 2. Repository and startup audit

- `package.json`: Express/Vite/React/pg; no ORM. Build is `tsc --noEmit && vite build`. There is no start script. `dev` runs `tsx src/server/index.ts` without a watch flag; `dev:web` starts the development-only Vite server.
- `tsx`, TypeScript and type packages are development dependencies. Production startup still executes TypeScript; therefore install with `npm ci --include=dev` and do not prune development dependencies afterward.
- Vite output is **`dist/web`**, not `dist`. `index.html` is the Vite entry point. No server code is emitted because TypeScript uses `noEmit`.
- `src/server/index.ts` constructs only the PostgreSQL adapter for runtime. It awaits initialization/migrations before `listen`, uses `process.env.PORT`, and closes the pool on shutdown.
- `listen(port)` does not specify a loopback-only host; the localhost log message is not a host-binding restriction. Confirm platform port detection at deployment.
- `GET /api/health` is unauthenticated and returns the existing `{ok:true,simulation:...}` response. It is **liveness**, not a continuing database probe. Startup verifies database readiness, but a later database outage is not detected by this health response.
- Standalone server/seed/migrate scripts read `process.env`; they do not automatically load `.env` or `.env.example`. Set provider environment variables directly.
- `src/web/api.ts` reads only `VITE_API_BASE`, defaulting to `/api`. Requests append paths such as `/student/session` and send JSON content type plus bearer authorization when authenticated.
- The Vite `server.proxy` to localhost:3001 applies only to the local development server. It does **not** create a production Vercel proxy.
- No `render.yaml` or `vercel.json` currently exists; none was created. No deployment configuration was inferred or applied remotely.
- `git ls-files` returned zero tracked files. Preparing and reviewing the initial commit remains an operator task; this pass did not stage, commit or push files.

## 3. CORS and API routing decision

### Direct API URL — blocked until explicitly supported

The intended public frontend value would be `VITE_API_BASE=https://<render-service-host>/api`, without a trailing slash. This is a template, not a configured production address.

Current backend code contains no CORS middleware, no Access-Control-Allow headers and no explicit OPTIONS handler. JSON requests and Authorization headers trigger browser preflight. The authentication/404 middleware does not provide the required preflight response, so successful local same-origin tests or a successful health curl do not establish Vercel browser connectivity.

A future approved correction must support the exact production frontend origin, required methods and headers, handle OPTIONS before authentication gates, and preserve authorization on actual API requests. Do not whitelist every Vercel preview or use CORS as authentication. Preview deployments should not casually share a live class backend. This is a finding, not an implementation in this pass.

### Same-origin alternative — proposal only

Vercel supports external rewrites. An approved `/api/:path*` reverse proxy to `https://<render-service-host>/api/:path*` could keep `VITE_API_BASE=/api` and avoid browser cross-origin requests without changing frontend code. No rewrite/configuration was added. It must preserve Authorization, methods, bodies, query strings, statuses and existing API `Cache-Control: no-store`, with no shared caching of authenticated responses. [Vercel rewrite documentation](https://vercel.com/docs/routing/rewrites)

Choose and verify one transport before launching the split deployment. Leaving `/api` on Vercel without a proxy targets Vercel itself, not Render.

## 4. Environment separation

| Variable | Where | Requirement |
|---|---|---|
| `VITE_API_BASE` | Vercel build only | Sole frontend application variable; public. Absolute Render `/api` URL after approved CORS, or `/api` with an approved proxy. Rebuild after changing it. |
| `DATABASE_URL` | Render backend only | Secret connection URL for the new Render PostgreSQL database. No SQLite path. |
| `FLEXEE_INSTRUCTOR_PASSPHRASE` | Render backend only | New privately configured secret; no default exists. Blank disables successful instructor login. |
| `PORT` | Render backend | Use Render's supplied port. `.env.example`'s 3001 is local-only. |
| `LLM_PROVIDER` | Render backend | Preserve `deterministic`; no provider behavior change. |
| `LLM_API_KEY` | Render backend only | Leave unset unless separately required; never copy to frontend. |
| `TEST_DATABASE_URL` | Local/CI verification only | Separate disposable `_test` database; never configure it as production data. |
| `NODE_ENV` | Render runtime | `production`; explicitly include dev dependencies during install because startup needs tsx. |
| `NODE_VERSION` | Render platform setting | Select supported Node 22.x, at least 22.12. This is a platform control, not a frontend application variable. |

Set Vercel's Node 22.x in project settings. Do not add database/passphrase/LLM variables to Vercel, including non-VITE versions. Do not prefix any secret with `VITE_`. Vite embeds public values at build time; runtime backend environment updates cannot change an already-built frontend URL.

The template is now blank for database and instructor credentials and contains no production values. Removing a value from a template is not credential rotation. Prior migration-report template assertions are historical; this audit found subsequent non-empty values and sanitized them without repeating them in this report.

## 5. Render Web Service setup — manual steps only

1. After security review, prepare a private GitHub repository containing the complete source, SQL folder, tests, package/lock files and build configuration. Do not include local databases, secrets, dependencies or generated output.
2. Provision the clean database described below, in the same Render region/account as the backend.
3. When deployment is authorized, create a Node Web Service from the reviewed repository/branch; repository root is the project root.
4. Set **Build Command:** `npm ci --include=dev && npm run build`.
5. Set **Start Command:** `node --import tsx src/server/index.ts`.
6. Set **Migration Command:** `npm run migrate`. Run it as a controlled initialization/pre-deploy step where available; it need not run during the asset build. Startup also runs the checksummed migrations and waits before listening.
7. Set environment values from the table, **Health Check Path:** `/api/health`, and retain **one application instance**.
8. Ensure the checkout retains `SQL/001_initial_schema.sql` and `SQL/002_query_indexes.sql` at runtime; the migration runner loads them relative to source.
9. After launch authorization, verify startup, health, authenticated API operations, browser transport and restart behavior before giving access to students.

Render supports explicit build/start commands and configurable health checks. Its service port must be publicly bindable; use the supplied PORT. Node version can be selected with NODE_VERSION. [Web Service setup](https://render.com/docs/web-services), [Node version selection](https://render.com/docs/node-version)

Do not configure `npm start` (missing), `node dist/server/index.js` (not built), a Vite development server, or a Windows `npm.cmd` command in Render's Linux command fields.

Session tokens remain in memory. Restart/redeploy invalidates sessions; users re-enter credentials. Multiple replicas are not supported by the existing session architecture. A paid always-on Web Service is recommended for a live class: Render Free sleeps when idle, and Render advises against Free for production. No plan was purchased. [Render Free limitations](https://render.com/docs/free)

## 6. Vercel frontend setup — manual steps only

| Setting | Value |
|---|---|
| Framework preset | Vite; confirm automatic detection, do not select Express/Next.js |
| Root directory | Project root |
| Install command | `npm ci --include=dev` |
| Build command | `npm run build` |
| Output directory | `dist/web` |
| Node version | 22.x, at least 22.12 |
| Application environment | `VITE_API_BASE` only |

Import the reviewed repository only after authorization and Hobby eligibility confirmation. Set the Production API base according to the approved CORS/proxy decision. Do not point Preview at the class database by default. Vercel serves static output; it does not run `src/server/index.ts` or database migrations. No backend start command is needed there. Existing entry routes are `/` and `/?view=instructor`; this task adds no routing or UI behavior. [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite)

## 7. Render PostgreSQL setup

- Create a new empty database, PostgreSQL 15 or later; local tests used 15.18. Do not import any of the 30 historical SQLite databases.
- Prefer the Render internal connection URL for a same-region/account backend; use an authorized external URL only for off-platform administration. Configure the URL privately. Review provider-specific TLS settings; do not add a blanket certificate-validation bypass. Restrict external access. [Render connection guidance](https://render.com/docs/postgresql-creating-connecting)
- The runtime currently executes DDL on startup, including the migration ledger. Its configured role must have the required schema/table privileges. A deploy-only migration role would require a separately approved startup-policy change.
- Run `npm run migrate`; its transaction/advisory lock/checksum behavior is already implemented. Repeat execution is idempotent. Do not run the numbered SQL files manually and then fabricate ledger rows.
- Run `psql --dbname="$DATABASE_URL" -v ON_ERROR_STOP=1 -f SQL/verify.sql` from an authorized shell with psql installed. Check tables, columns, constraints, zero initial game rows, orphan/duplicate counts and JSON validity. Never paste the resolved URL in a report.
- Only after authorization, use `npm run seed -- --teams 12` to create the intended pilot section. Seeding is not part of build/start and must not be repeated on every deployment.
- Existing seven-table data representation, TEXT IDs/JSON/timestamps, current columns, artifact identity and access history remain unchanged. Startup/seed use PostgreSQL, not SQLite or a local filesystem database. No persistent disk is needed for game data.
- Configure backups, retention and restoration before live use. Review pool capacity (ten clients per runtime process), storage and plan limits. Render Free Postgres expires after 30 days and is not a production data-retention choice. [Free database limitations](https://render.com/docs/free)

## 8. Security audit and pre-push gates

- **Template remediation:** removed two credential-bearing values from `.env.example`. Values are deliberately omitted here. If used anywhere, rotate database credentials and the instructor passphrase externally; no rotation was performed in this no-data-change task.
- **Pattern review:** source/scripts/SQL/reports/design/instructions were checked for credential-bearing PostgreSQL URLs and common private-key/token signatures. The remaining SQL README URL is a placeholder, not an operational credential. No additional live secret was identified by this scoped scan. This is not a guarantee against arbitrary unrecognized secrets.
- **Ignore rules:** `.env`, `.bpm-data`, node_modules, dist and ZIPs are ignored. `.env.local` and `.env.production` are not. Only `.env.example` currently exists among root environment files. Do not rely on current rules to protect future environment variants, dumps, certificates or keys. `.gitignore` was inspected but not modified.
- **Git staging:** use a reviewed explicit file list, inspect `git diff --cached`, and ensure no secrets, participant data, dumps, logs or generated databases are staged. Keep the repository private pending sponsor review of hidden instructor content and historical reports. No commit history/remote secret-exposure assurance is claimed.
- **Browser bundle:** no backend-secret imports or VITE-prefixed secrets were found. Only the API base is referenced as browser environment configuration. The build emits the same frontend asset names as before.
- **Debug/TLS:** no debugger start flag or TLS-validation bypass was found. Backend error boundaries remain unchanged; raw production diagnostics should not be copied to students. No authentication/rate-limiting redesign was attempted.
- **CORS:** absent, not permissive; this breaks cross-origin functionality rather than granting access. CORS/proxy must be resolved without weakening existing bearer authorization.
- **Session/security operations:** one instance, HTTPS, strong rotated instructor secret, restricted database access and no secret logging. Database outage detection is not part of the current liveness endpoint. These limitations are documented, not silently changed.

## 9. Fresh verification and preservation

| Required command | Result |
|---|---|
| `npm.cmd test` | **516/516 PASS**, 21 files, PostgreSQL tests enabled, zero skipped |
| `npm.cmd test -- --run test/golden.test.ts` | **9/9 PASS** |
| `npm.cmd run typecheck` | PASS |
| `npm.cmd run lint` | PASS, zero warnings |
| `npm.cmd run build` | PASS |

The existing PostgreSQL 15.18 disposable verification cluster was restarted on loopback port 55439 only. The test suite created empty isolated schemas, exercised migrations/parity/concurrency and removed them. Zero test schemas remained and the disposable public games table remained empty. The disposable server was stopped afterward. No real runtime/Render database was connected or changed. Tests necessarily write their own temporary fixtures; this is not a claim that tests perform no database writes.

Before/after hashes match for all source, tests, golden fixtures, SQL files and `.bpm-data`, including all 30 historical SQLite databases. No simulation, scoring, outcomes, UI, projection, domain or stored historical data changes occurred. Build output was regenerated normally. No remote browser smoke test was claimed, because nothing was deployed.

## 10. Files and manual release checklist

Modified only `.env.example` (blank secrets and environment comments) and `README.md` (actual build minimum and deployment report link). Added only this report. Vercel deployment/environment skills informed the separation of build-time public configuration and backend secrets; no skill-triggered deployment or environment pull was run.

Before GitHub push: rotate previously used exposed values; review staged files and ignore coverage; confirm private-repository ownership/content permissions. Before deployment: approve CORS or proxy work, confirm Hobby eligibility, provision clean PostgreSQL, set backend secrets/Node/build/start/health settings, establish backups, and configure frontend API routing. After authorization and actual deployment: verify browser login, submissions, documents, conversations, instructor release/correction and restart persistence over HTTPS.

**Conclusion:** ready for a reviewed private GitHub commit after the security gates, but **not ready for an unqualified Vercel/Render production launch**. The principal functional blocker is missing cross-origin API support (or an approved equivalent proxy). Deployment readiness documentation is complete; deployment approval is not implied.
