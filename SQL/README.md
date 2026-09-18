# PostgreSQL persistence setup

## Scope and prerequisites

PostgreSQL 15+; Node.js 22.5+; npm 10+. PostgreSQL 15 is the local verification target. Production starts **clean**. There is no SQLite importer or production SQLite fallback. Keep every historical `.bpm-data` file untouched. Simulation rules, content and projections remain in TypeScript, not SQL.

The schema retains TEXT IDs, serialized JSON as TEXT, and existing timestamp strings. Seven application tables preserve all current keys, cascading FKs and defaults. `schema_migrations` is an infrastructure ledger. `transcripts.storage_order` is private ordering metadata used only to break equal-timestamp ties; it is never projected. Artifact reads match SQLite's composite-key order; nested CLEARPATH listings are never sorted.

## Provision locally

Use PostgreSQL administration tools to create a dedicated login role and an empty database owned by that role. Set its password privately with an interactive prompt; do not put credentials in this folder or command history. For example, with authorized local administrator access:

```powershell
createuser --pwprompt <application-role>
createdb --owner=<application-role> <application-database>
```

Set `DATABASE_URL` in the backend process environment using the privately supplied connection URL (`postgresql://<user>:<password>@<host>:<port>/<database>` is a template only). URL-encode credentials. Do not commit actual URLs. `.env.example` does not automatically load variables. Do not use `VITE_*` for database settings.

```powershell
npm.cmd ci
npm.cmd run migrate
psql --dbname="$env:DATABASE_URL" -v ON_ERROR_STOP=1 -f SQL/verify.sql
npm.cmd run seed -- --teams 12
npm.cmd run build
npm.cmd run dev
```

Use the same runtime URL in seed and server terminals. `PORT`, `VITE_API_BASE`, `FLEXEE_INSTRUCTOR_PASSPHRASE`, `LLM_PROVIDER` and `LLM_API_KEY` retain their existing meaning. Instructor passphrase and HTTPS configuration remain required. Node's built-in SQLite is used only by compatibility tests.

## SQL order and readiness

1. `001_initial_schema.sql`: all tables, current columns and constraints.
2. `002_query_indexes.sql`: game creation ordering, team/game lookup, submission/game lookup, transcript/game and transcript chronological lookup.
3. `verify.sql`: read-only verification, not a migration.

Use **`npm.cmd run migrate`** for steps 1–2 rather than executing the files individually. The runner owns BEGIN/COMMIT/ROLLBACK, serializes concurrent runners, records SHA-256 checksums, rejects changed or unknown migrations, and commits the schema atomically. A failure rolls back. Do not manually populate the ledger to bypass a mismatch; restore/reconcile the correct migration release. Future changes require a new numbered migration.

Server and seed startup also await this runner before serving requests/creating games. The configured deployment role therefore needs schema DDL privileges for this release, in addition to ordinary data access. A separately privileged deploy-only migration role would require a future explicit startup-policy change. No game is seeded by schema installation. Pool default is ten connections per runtime process. SIGINT/SIGTERM waits for HTTP shutdown and pool closure.

`verify.sql` runs inside a read-only repeatable-read transaction. Check that every expected table/column is present, all required constraints exist, orphan/wrong-game counts are zero, and duplicate submissions produce no rows. JSON casts validate every serialized column; malformed JSON stops verification with a SQL error. It does not repair data. Empty-table JSON counts of zero are normal for a clean database.

## Integration tests

Provision a separate disposable database ending in `_test`, with permission to create/drop schemas, and set **only its URL** as `TEST_DATABASE_URL`. The test helper never falls back to `DATABASE_URL`, rejects a matching production target and allocates a unique schema per test. Do not use production credentials/database for tests. Host aliases beyond the loopback aliases cannot be inferred: the operator must ensure the target is genuinely separate.

```powershell
npm.cmd test
npm.cmd test -- --run test/golden.test.ts
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Without `TEST_DATABASE_URL`, database integration suites explicitly skip. A skipped suite is **not** evidence of database verification. Tests never seed, migrate or read the historical SQLite files. SQLite parity uses new temporary files only.

## Render considerations — documentation only, no deployment

Provision a new empty Render Postgres database. Same-account/same-region services should use its internal URL; local tools use the external URL. Configure secrets in Render's environment, not source or Vite. External connections require TLS; select appropriate certificate verification with the provider/client guidance, not a blanket `rejectUnauthorized:false` override. Internal TLS has different certificate requirements. Restrict external access and budget the pool across all runtime instances. Check the selected plan's backup/retention and connection limits before deployment.

References: [Render connection guidance](https://render.com/docs/postgresql-creating-connecting), [node-postgres transactions](https://node-postgres.com/features/transactions), [node-postgres TLS](https://node-postgres.com/features/ssl).

The existing student/instructor session registries remain process-local. PostgreSQL does not make session tokens shared between replicas. A single application instance preserves the current authentication architecture; multi-instance session handling is outside this migration.

## Backup and rollback

Before future schema changes, take a verified PostgreSQL backup with the provider's backup facility or `pg_dump`, store it outside the repository, and rehearse restoration into a separate database. Freeze writes for cutover/restore. Initial deployment begins empty; no existing participant data is moved.

Do not roll back by pointing the PostgreSQL runtime at SQLite, changing a migration checksum, or deleting tables. Restore a compatible PostgreSQL backup and matching application release. Switching to an old SQLite file after new PostgreSQL writes would lose those writes. Historical SQLite archives are not PostgreSQL rollback snapshots.

No passwords, URLs with actual credentials, tokens, certificates, participant data, database dumps or reset scripts belong in `SQL/`.
