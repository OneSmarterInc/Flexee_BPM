# Production operations

2026-09-24. Existing simulation decisions, evidence gates and instructor release rules are unchanged.

## Instructor and student access

1. Instructor opens `/?view=instructor` and signs in with the privately supplied deployment passphrase.
2. Choose an existing game or Create New Simulation Session; choose 1–12 teams.
3. Save/copy the displayed Game ID and team codes before leaving the success page. Treat codes as private access credentials. Refreshing that success page does not provide a recovery inventory of its codes.
4. Open the control room. Students enter their Game ID and team code at the ordinary entry screen; instructor release still governs progression.
5. If creation times out, inspect the game selector before retrying. Creation has no server idempotency key; a successful write with a lost response can otherwise create a second game. Do not repeatedly create sessions to recover lost codes; ask the operator to investigate safely.

Instructor/student bearer sessions expire after an absolute 24 hours and are lost on backend restart. This removes authentication state, not game data. Reauthenticate with the existing passphrase or game/team code. Tokens remain in browser session storage as before; shared computers should close the session and must not share browser state. There is no new authentication provider or durable session store.

Login requests are limited per resolved client IP over ten-minute windows: instructor 20, student 120. A 429 response includes Retry-After; wait rather than retrying continuously. Successful attempts also consume the allowance. Classroom NAT can share a bucket. Proxy trust must be validated before enabling TRUST_PROXY_HOPS=1; default 0 ignores forwarded client IPs. Sessions and limiters are bounded and process-local, so use one backend instance. Restart resets limits and signs everyone out; do not use restarting to bypass protection.

## Startup, restart and migrations

Use the deployment checklist for required environment values. Backend settings come from the process environment, not automatic `.env` loading. No default passphrase exists. Local non-SSL PostgreSQL requires explicit `disable` and non-production loopback; Render retains `require` and the existing pilot certificate-verification policy.

Build with `npm ci --include=dev` then `npm run build`. Run `npm run migrate` against the intended database with private credentials supplied by the environment. Start using `npm start`. Startup also waits for migration initialization. Never change the checksum/content of an already applied SQL migration. There is no SQLite fallback and no historical SQLite import.

For a planned restart, notify the instructor and avoid active submissions. Use the service's normal restart/termination controls; the server closes its listener and pool on SIGTERM/SIGINT. Sessions must sign in again afterward. Confirm `/api/health` and an authenticated read; liveness alone does not prove database access. Do not reset, seed, truncate, or recreate the production database to troubleshoot a restart.

## Errors and troubleshooting

| Symptom | Safe response |
|---|---|
| Invalid game/code or expired session | Confirm details privately; sign in again. Do not paste access codes into public logs. |
| 429 / too many sign-ins | Wait for Retry-After and check shared-IP/proxy configuration; do not weaken authentication. |
| Evidence cannot be opened | Retry after connectivity returns. The message is local to the resource area; other work remains available. |
| Temporary load failure | Use Try again. Transient student refresh failures preserve the session; confirmed authorization/missing-game failures require entry again. |
| Unknown submission outcome after a disconnect | Refresh/review accepted decision history before retrying. Existing immutable-submission protections remain authoritative. |
| 400 malformed input or 413 oversized body | Correct the request/input; do not expose parser details to students. |
| 500/503 | Correlate the response X-Request-ID with server logs, check database/service availability privately, then retry safely. |
| SSL configuration error | Check explicit mode agreement and forbidden URL SSL parameters. Never globally disable SSL to fix a local connection. |

Structured logs include generated request IDs, method, status, elapsed time, safe error category and selected error codes. They deliberately omit raw error messages/stacks, request bodies, URLs, credentials and tokens. This is basic diagnostics, not full tracing or external monitoring. Database diagnostic events are not independently request-correlated; the route failure event carries the request ID. No new CORS-exposed response headers were added; request IDs can be inspected in browser network tools.

## Backups and recovery

The operator must confirm provider backup retention, schedule, encryption, access controls, recovery point/time objectives and a restore drill before production acceptance. Restore into a separate isolated database first; verify migrations, games, submissions, access history and transcripts without contacting students. Do not overwrite the live database as a test. Store any logical dumps only in an approved private backup location, never in the repository or review ZIP. Supply backup-tool credentials through approved secret management; never put passwords on a command line or in a report.

Restrict external database access using provider network controls where available. Rotate any historically exposed credentials and verify old credentials are revoked. Current empty example fields are not evidence of historical rotation. Existing remote TLS encryption skips certificate validation; this remains an explicit outstanding production security decision.

## Verification and escalation

Set TEST_DATABASE_URL only to a dedicated disposable database ending in `_test`; tests use isolated schemas. Run full tests, golden tests, typecheck, lint and build. Skipped PostgreSQL tests are not a live-persistence pass. Monitor service failures and capacity before each class. Multi-instance support, durable sessions, server-side creation idempotency, code recovery after a lost response, database readiness probes and load/restore drills remain separate work; this pass does not silently introduce them.
