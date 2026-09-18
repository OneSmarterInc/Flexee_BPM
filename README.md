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

For the proposed Vercel frontend / Render backend / Render PostgreSQL topology, see [deployment readiness](reports/DEPLOYMENT_READINESS_REPORT.md). Direct cross-origin browser API calls are currently blocked by missing CORS/preflight support. Deployment requires an approved transport configuration, credential rotation where applicable, and the manual security checks in that report. No hosting configuration or deployment has been applied.

- [design/](design/): authoritative design inputs, build specifications, voice briefs, all ten week sources, artifacts, filenames, and Round 9 specifications.
- [instructions/](instructions/): historical phase instructions, corrections, feedback, and owner decisions. Accepted amendments remain recorded here; historical status is not necessarily current status.
- [reports/](reports/): implementation reports, audits, calibration, playthroughs, proposals, and the historical unresolved-design register.

**If an authoritative design input and an implementation report disagree, the authoritative design input takes precedence.** Do not alter design inputs to agree with reports or silently reconcile conflicts. Historical reports are preserved, not rewritten as current specifications.
