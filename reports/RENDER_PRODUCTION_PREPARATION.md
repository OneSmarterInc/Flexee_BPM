# Render production startup preparation

Date: 2026-09-19.

Compiled backend build and production start script implemented. **Successful database-backed production startup remains unverified in this pass**, because permission to restart the disposable PostgreSQL verification cluster was declined. No alternate route was used to start it. No deployment or ZIP was created.

## Files changed / added

- Modified `package.json`: added `build:server` and `start`; extended `build` to emit backend JavaScript before the existing Vite build.
- Added `tsconfig.server.json`: server-entry dependency graph, NodeNext ESM resolution, `noEmitOnError`, output to `dist/backend`.
- Added `scripts/copy-server-assets.mjs`: copies the four existing SQL-folder files byte-for-byte to `dist/SQL`.
- Added this report.

No dependencies changed; no package-lock change was necessary for these script-only edits. The existing `typecheck` command remains exactly `tsc --noEmit`, and the original `tsconfig.json` is unchanged. Existing development commands, migration/seed scripts and tests are unchanged.

## Build and runtime

```text
npm run build
  tsc --noEmit
  npm run build:server
    tsc -p tsconfig.server.json
    node scripts/copy-server-assets.mjs
  vite build

npm start
  node dist/backend/server/index.js
```

Output layout:

```text
dist/
  backend/
    server/index.js
    application/*.js
    domain/*.js
    persistence/*.js
  SQL/
    001_initial_schema.sql
    002_query_indexes.sql
    verify.sql
    README.md
  web/
    index.html
    assets/...
```

The server configuration includes only `src/server/index.ts` and its imported dependencies. It does not emit test files, frontend components, seed scripts or the legacy SQLite adapter. Production runs ordinary ESM JavaScript through Node, without tsx or a TypeScript loader.

The unchanged migration runner resolves `../../SQL/` relative to its own module. Emitted `dist/backend/persistence/postgres-migrations.js` therefore requires `dist/SQL`. Copying the existing SQL assets preserves that path and the migration checksums without changing runtime code or schema. All four copied files were hash-compared with their originals and matched.

Vite continues to build into `dist/web`; its output cleanup does not remove the sibling backend/SQL output. The existing static-file serving path remains valid when started from the project root. The resulting frontend assets remain `index-DHtfASG2.css` and `index-Dz9XX7rx.js`.

## Render commands

Use the repository root as working directory.

- **Build command:** `npm ci --include=dev && npm run build`
- **Start command:** `npm start`
- **Health check:** `/api/health`
- **Node:** supported Node 22.x at least 22.12; local checks used 22.18.0.

Build tools require development dependencies during installation/build. The new production start command itself does not require tsx. The existing separate `npm run migrate` and `npm run seed` commands still use tsx; retain their dependencies if using those operational commands.

Retain DATABASE_URL, FLEXEE_INSTRUCTOR_PASSPHRASE, Render-supplied PORT and existing server settings in the backend environment, never in frontend variables. Startup still awaits PostgreSQL migrations before listening. Keep the compiled backend, copied SQL and production dependencies available at runtime; keep dist/web when serving the existing frontend from Render. No Render configuration file was added.

This report supersedes only the earlier readiness report's statement that the backend has no emitted JavaScript/start script. Existing cross-origin CORS/proxy, credential-rotation, repository-security and hosting-plan considerations remain unresolved by this narrowly scoped task.

## Verification

Windows equivalents (`npm.cmd`) were used for the requested npm commands.

| Check | Result |
|---|---|
| `npm test` | **490 passed, 26 skipped**, 516 total; zero failed |
| Additional golden run | **9/9 passed** |
| `npm run typecheck` | PASS; command unchanged |
| `npm run lint` | PASS; zero warnings |
| `npm run build` | PASS; backend JavaScript, SQL assets and Vite frontend emitted |
| `node --check dist/backend/server/index.js` | PASS |
| Import compiled server with plain Node | PASS; no tsx loader |
| Copied SQL asset hashes | 4/4 identical |
| `npm start` with isolated test database address | Compiled entry executes, then exits 1 at database initialization because PostgreSQL is unavailable |
| Successful listening/health request from production entry | **BLOCKED / NOT VERIFIED** |

The 26 PostgreSQL integration cases are explicitly skipped when TEST_DATABASE_URL is absent. The previously verified 516/516 result remains historical; it is not claimed as the result of this run. The disposable server on port 55439 was not running, TEST_DATABASE_URL was not configured, and restart approval was declined. The production-start attempt printed the existing safe PostgreSQL initialization failure message and did not listen on the chosen verification port. No existing database credentials or alternative live database were used.

An initial lint run found the new `.mjs` helper needed an explicit `URL` import for the existing ESLint configuration. That import was added and the final typecheck/lint/build sequence passed. No lint rule or test was weakened.

No browser verification is claimed: the production server never reached listening state. Browser skills were inspected for a possible local check, but no browser action was performed.

## Preservation and remaining verification

Before/after hashes match for all source files, tests, golden fixtures, SQL source files and `.bpm-data`, including the historical SQLite databases. Domain logic, scoring, outcomes, authentication, UI, database schema and database records were not modified. Normal test-owned temporary fixtures and generated dist output are the only transient build/test data.

To finish verification, authorize or provide an isolated PostgreSQL instance, set TEST_DATABASE_URL to its dedicated `_test` database, rerun all 516 tests, then run `npm start` with an isolated DATABASE_URL and verify `/api/health` and frontend assets. Do not connect verification to participant/production data. The build/start implementation is ready for that check, but a successful end-to-end production startup is not yet asserted.

No deployment. No ZIP. No changes to simulation behavior.
