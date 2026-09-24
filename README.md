# Flexee BPM — The Reengineering Mandate

A standalone ten-round Business Process Reengineering simulation for MIS 7500: React/Vite interfaces, Express API, and PostgreSQL runtime persistence. Closed-round decisions drive a deterministic engine using a saved `bpm-v1` configuration; students do not receive instructor diagnostics. SQLite remains only for historical compatibility and isolated reference tests.

index.html is retained as the Vite application entry point.

## Install and run

Requires Node.js 22.12+ on the Node 22 release line, npm 10+, and PostgreSQL 15 or later. The installed Vite version requires a higher minimum than the package's historical `>=22.5` declaration. Run from this repository root. Provision a **clean** PostgreSQL database and set `DATABASE_URL` in the backend process environment. See [SQL setup](SQL/README.md); never import or open the historical `.bpm-data` files through the application.

```powershell
npm.cmd ci
npm.cmd run migrate
npm.cmd run build
npm.cmd run dev
```

Configure `FLEXEE_INSTRUCTOR_PASSPHRASE` in the backend process environment before starting the server; no default secret exists. Instructor sign-in exchanges it for a server-checked opaque session. Never use a Vite-prefixed variable or commit an actual passphrase. Use HTTPS for network deployment. See the operating note for open-round correction and the currently supported missing-team overrides.

Open `http://localhost:3001/`; instructor entry is `http://localhost:3001/?view=instructor`. For development, run `npm.cmd run dev:web` in a second terminal and use port 5173; Vite proxies the API to port 3001.

## Seed a pilot section

Instructors can instead sign in at `/?view=instructor`, choose **Create New Simulation Session**, and create 1–12 teams. The new page (`/?view=instructor-create`) returns the Game ID, names and six-character team codes, with copy and control-room buttons. Students continue using the existing Game ID / Team Code entry. Save the access details before leaving the success page. Existing games and their older codes are unchanged.

The backend applies `SQL/003_team_access_codes.sql` through the existing migration runner on startup (or `npm run migrate`). It adds a nullable team access-code column and a per-game uniqueness index; it does not change simulation state or existing codes.

In another terminal, using the same database setting as the server:

```powershell
npm.cmd run seed -- --teams 12
```

Creates **one fresh game with twelve teams**, printing the Game ID and `Team 01 — <code>` through `Team 12 — <code>`. Every explicit `--teams 1` through `--teams 12` invocation creates a new game, retaining existing games.

Set the same `DATABASE_URL` in both seed and server terminals. There is no production SQLite fallback. `npm.cmd run migrate` applies checksummed PostgreSQL migrations; server/seed startup also awaits schema readiness. Backend environment settings must be supplied to the process; copying `.env.example` alone does not load them. The existing SQLite databases are historical data, remain untouched, and are not imported into the clean PostgreSQL deployment.

Legacy `npm.cmd run seed` without arguments reuses a created R1 game containing a team with no submissions/transcripts, or creates one team named `Phase 5 Cold Run` if none qualifies. **Do not use this legacy mode for pilot logistics.** See the [instructor operating note](reports/INSTRUCTOR_PILOT_OPERATING_NOTE.md) for release, correction limitations, restart, and access precautions.

## Verify

Set `TEST_DATABASE_URL` to a **separate disposable PostgreSQL database whose name ends in `_test`** to execute database integration/parity/concurrency tests. Never point it at the runtime database. Tests create and remove only their own UUID-named schemas. Without this variable PostgreSQL integration tests are explicitly skipped; that is not PostgreSQL runtime verification. Existing SQLite tests use temporary files, never historical `.bpm-data` databases.

```powershell
npm.cmd test
npm.cmd test -- --run test/golden.test.ts
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

## Project documents

For the current Vercel frontend / Render backend / Render PostgreSQL topology, see the [Render deployment checklist](reports/RENDER_DEPLOYMENT_CHECKLIST.md), [production operations](docs/PRODUCTION_OPERATIONS.md), and [production verification report](reports/PRODUCTION_FINAL_REPORT.md). CORS/preflight support and a compiled production start command exist. Historical deployment reports describe earlier states; outstanding live-database and security acceptance checks are recorded in the current report. This hardening pass did not deploy anything.

## Production configuration and workflows

The Express API delegates to the application service and deterministic domain engine, then persists through the PostgreSQL repository. Student projections omit instructor diagnostics. The build produces `dist/backend` and `dist/web`; `npm start` runs the compiled backend and can serve the built frontend. A separately hosted Vite frontend needs its backend API base at build time.

Supply backend settings through the process environment or hosting secret manager; the server does not automatically load `.env` files. `.env.example` contains documentation and empty credential slots, not usable secrets.

| Variable | Use |
|---|---|
| DATABASE_URL | Required backend PostgreSQL connection; never expose to Vite |
| FLEXEE_INSTRUCTOR_PASSPHRASE | Required private instructor sign-in secret; no default |
| FLEXEE_POSTGRES_SSL | `disable` only for local non-production loopback PostgreSQL; `require` for Render (also the default) |
| PGSSLMODE | Optional compatibility setting, only `require`/`disable`; must agree with FLEXEE_POSTGRES_SSL if both are set |
| NODE_ENV | `production` on Render; local non-SSL development must not use production |
| PORT | Backend listener, default 3001; use Render's supplied port |
| TRUST_PROXY_HOPS | Default `0`; use `1` only after validating the single trusted proxy topology and forwarded-header sanitization |
| TEST_DATABASE_URL | Dedicated disposable `_test` database, never the live game database |
| VITE_API_BASE | Public frontend-only setting: `/api` for same origin or the HTTPS backend URL ending in `/api` |

Do not put TLS query parameters in DATABASE_URL; use the explicit SSL settings. The existing accepted remote TLS policy remains encrypted but does not validate the certificate (`rejectUnauthorized:false`); production risk acceptance or a separately verified certificate-validation change is required.

For local non-SSL PostgreSQL, set `FLEXEE_POSTGRES_SSL=disable` in the process environment, leave PGSSLMODE unset or matching, and supply credentials privately before the install/migrate/build commands above. Use `npm start` to check the compiled server, or `npm run dev` for source execution.

Instructors sign in, create or select a game, save the team access details, and use the existing control room to inspect submissions and release rounds. Students join with their Game ID and team code, inspect available resources, submit decisions, and wait for instructor release. Existing round rules and corrections are unchanged. Sessions now expire after 24 hours and on backend restart; sign in again to access persisted work. See operations documentation for throttling, network recovery, backups, and uncertain session-creation responses.

- [design/](design/): authoritative design inputs, build specifications, voice briefs, all ten week sources, artifacts, filenames, and Round 9 specifications.
- [instructions/](instructions/): historical phase instructions, corrections, feedback, and owner decisions. Accepted amendments remain recorded here; historical status is not necessarily current status.
- [reports/](reports/): implementation reports, audits, calibration, playthroughs, proposals, and the historical unresolved-design register.

**If an authoritative design input and an implementation report disagree, the authoritative design input takes precedence.** Do not alter design inputs to agree with reports or silently reconcile conflicts. Historical reports are preserved, not rewritten as current specifications.
