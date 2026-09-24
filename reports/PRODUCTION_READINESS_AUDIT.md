# Production readiness audit

2026-09-24. Scope: current working tree, including the uncommitted instructor-session creation feature. This is not a deployment approval. Simulation rules and workflows are preservation constraints.

## Architecture and strengths

React/Vite builds a static frontend into dist/web; Express runs compiled Node ESM from dist/backend/server/index.js. The frontend uses VITE_API_BASE; Render hosts the API and PostgreSQL. No browser database access. Existing instructor passphrase authentication and student game/team credentials issue separate opaque in-memory bearer sessions.

The application service orchestrates the deterministic R1–R10 engine, saved configuration snapshots, replay and explicit student/instructor projections. PostgreSQL wraps aggregate writes in transactions; game mutation takes a row lock, creation and migration use separate transaction advisory locks. SQL values use placeholders. Foreign keys, per-team round uniqueness and transcript ordering are present. Seven application tables plus a migration ledger; current migration 003 adds stored team codes. Historical SQLite is for compatibility tests, not production fallback.

Existing strengths include immutable accepted submissions, explicit instructor corrections, protected instructor APIs, no-store API responses, narrow CORS/preflight handling, persisted evidence access, regression/golden coverage, parameterized SQL and rollback. React renders text rather than injecting HTML. R8 snapshot timing and shared condition selection are preserved.

## Findings and priorities

| Priority | Finding / evidence | Required action |
|---|---|---|
| P0 | Live PostgreSQL tests cannot run without TEST_DATABASE_URL in this process; migration 003 is unverified here | Execute all dedicated-database tests and restart/read-back acceptance before release |
| P0 | External PostgreSQL TLS uses rejectUnauthorized:false in postgres-connection.ts | Existing explicitly accepted pilot behavior must not be silently changed. Before unrestricted production, verify a certificate-validating configuration against the actual provider or obtain explicit risk acceptance; this pass preserves connectivity policy |
| P0 | Historical deployment report records prior credential exposure | Owner must confirm rotation/revocation wherever those values were used and assess Git history. Current template credential slots are empty; do not assume template cleanup equals rotation |
| P1 | Raw Error.message is returned by route wrappers; Express parser errors can use default HTML/stack handling | Add safe public error boundary and secret-free structured diagnostics |
| P1 | No login throttling; six-character new codes require guessing protection | Add bounded process-local throttling at the two existing login endpoints, retain authentication architecture |
| P1 | Sessions have no expiry and maps grow indefinitely | Add bounded lifetime/storage without changing token formats or login screens; document reauthentication and single-instance limitations |
| P1 | Malformed conversation/envelope input can cause TypeError; invalid artifact version can persist before projection fails | Validate transport shape and requested artifact page/version before mutation; do not alter valid access gates or content |
| P1 | Missing passphrase/invalid PORT can reach startup; repository construction is outside startup catch | Validate before database connection and use safe startup failure logging |
| P1 | .gitignore covers only .env, not variants, dumps, logs or keys | Ignore secret/runtime variants, retain only the documented safe .env.example |
| P1 | Session creation success details disappear on refresh; uncertain create retries can duplicate a game | Document save/copy requirement and deferred server idempotency/recovery workflow; do not introduce a new instructor workflow in this pass |
| P1 | In-memory sessions and throttles are replica-local and reset on restart | One backend instance only. Redis/shared auth is not introduced; multi-instance deployment remains unapproved |
| P1 | Browser refresh treats any student fetch failure as session invalid; evidence click lacks local error handling | Preserve authentication on transient failures where safely fixable; report remaining recovery limitations rather than redesign UI |
| P1 | Backup retention, restore drill, alert routing and external DB allowlists unverified | Operator checklist and live acceptance required |
| P2 | Health endpoint is liveness only; no continuing DB readiness probe | Retain its response contract; use operator DB checks and consider a separate probe later |
| P2 | list/create loads complete game aggregates, so cost grows with history | Measure realistic classroom load; do not add speculative indexes or redesign persistence |
| P2 | package.json uses latest ranges; engine floor is lower than installed Vite requires | Use npm ci and a supported patched Node release; pin/update dependencies in a separately verified release |
| P2 | Existing ZIP script excludes only a narrow set of secret variants | Do not use it for production distribution without a manifest review; no ZIP run in this task |

## Review boundaries

Reviewed server bootstrap/routes, authentication/access, services/projections, PostgreSQL adapter/pool/migrations/schema/indexes, current session creation, student/instructor components, API client, build scripts, configuration, tests and relevant deployment/phase reports. Historical design material is treated as context, not a reason to rewrite accepted mechanics. Existing local untracked sponsor files and pre-existing edits are preserved.

Production dependency audit (`npm audit --omit=dev --json`) returned zero known vulnerabilities on 2026-09-24. This is a registry snapshot, not proof of overall security. No dependency update was performed.

## External guidance checked

- [Express production security](https://expressjs.com/en/advanced/best-practice-security/): validate inputs, protect authentication endpoints and avoid exposing debug responses.
- [Render Node/Express deployment](https://render.com/docs/deploy-node-express-app): configure build/start commands for the service.
- [Render PostgreSQL connections](https://render.com/docs/postgresql-creating-connecting): review external access and connection requirements.
- [Vite environment handling](https://vite.dev/guide/env-and-mode): VITE-prefixed values are client-visible build configuration, not secret storage.

Final implementation status and verification are recorded in PRODUCTION_FINAL_REPORT.md. Findings above describe the review baseline; the final report distinguishes mitigated issues from open risks.
