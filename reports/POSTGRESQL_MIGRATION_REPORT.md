# PostgreSQL migration report

Verified 2026-09-18.

POSTGRESQL MIGRATION COMPLETE — READY FOR LOCAL DATABASE VERIFICATION

The application is PostgreSQL-capable and was **actually exercised against PostgreSQL 15.18**, not an emulator. All verification below ran locally. No deployment or ZIP was created. Production PostgreSQL is to start clean: no importer exists and no historical SQLite database was opened, migrated, normalized, copied into PostgreSQL or changed.

## Preserved baseline and final verification

Before implementation, the existing 486 tests across 18 files passed, golden tests passed 9/9, typecheck passed, lint passed with zero warnings, and production build passed.

| Final check | Result |
|---|---|
| `npm.cmd test` with isolated `TEST_DATABASE_URL` | **516/516 passed**, 21 files, zero skipped |
| `npm.cmd test -- --run test/golden.test.ts` | **9/9 passed**, unchanged assertions/fixtures |
| `npm.cmd run typecheck` | PASS |
| `npm.cmd run lint` | PASS, zero warnings |
| `npm.cmd run build` | PASS |
| Real migration CLI, run twice | PASS; second run idempotent |
| `psql -v ON_ERROR_STOP=1 -f SQL/verify.sql` | PASS against clean disposable PostgreSQL database |
| Historical `.bpm-data` hashes | Unchanged; **30/30 SQLite files** preserved |
| Protected domain/UI/fixtures/design/content/instruction hashes | Unchanged |

There are 30 new checks: four configuration-safety cases and 26 real-database cases. When `TEST_DATABASE_URL` is absent the 26 integration cases are explicitly skipped; that configuration is not a PostgreSQL verification pass. The reported 516/516 run had the variable configured and no skipped cases.

Node's existing experimental SQLite warning still appears from isolated compatibility tests. No test was removed or behavioral assertion weakened. The only modified existing test file changes the seed executable to a SQLite compatibility harness which invokes the same shared seed implementation. Its seven existing tests/assertions remain intact; a new test exercises the actual PostgreSQL seed CLI separately.

## Runtime and application boundary

`src/server/index.ts`, `scripts/migrate.ts`, and `scripts/seed.ts` use `PostgresGameRepository`. There is no DATABASE_PATH-based runtime selection or SQLite fallback. Startup awaits schema migration/readiness before accepting traffic. Shutdown awaits the connection pool.

The asynchronous contract is added alongside the retained synchronous compatibility contract. `PersistentSimulationService` is the awaited production boundary. It calls the **unchanged** `SimulationService` against a transaction-local snapshot, so validation, domain calls, correction rules, transcript generation and resulting projections do not have to be duplicated or rewritten. This deliberately keeps existing SQLite/memory reference tests and service behavior intact instead of mass-converting their synchronous fixtures.

All production route and seed calls are awaited. API URLs, request/response shapes, auth gates and session registries are unchanged. No student/instructor projection, UI component, engine function or authoritative content file changed.

## Transactions and concurrency

- Each PostgreSQL transaction uses one checked-out client from BEGIN through COMMIT/ROLLBACK, then releases it in `finally`.
- Mutation transactions take `SELECT id ... FOR UPDATE` on the game before hydration. The existing service operates on that locked game's transaction-local snapshot. Only staged writes are flushed; failure returns no partial game update.
- This covers submission, correction, close, confirmed missing-team override, evidence/document access and conversation persistence, including the awaited conversation operation.
- Game creation uses a separate transaction-scoped advisory lock covering the existing list/check/team-ID allocation/create sequence. Existing IDs and allocation semantics remain unchanged.
- Multi-query `get`/`list` operations use read-only repeatable-read transactions.
- `save(game)` remains an explicit snapshot-persistence/replay operation. Interactive read–calculate–save flows never use a pre-lock snapshot: they use `withGame` through the persistent service.
- Submission conflict-update guards preserve current-round corrections and completed-game immutability. Only intended transcript ID conflicts use `DO NOTHING`. Unexpected driver/constraint failures roll back and become a generic safe database error, not raw SQL/connection diagnostics in student responses.
- Pool default: ten clients per runtime process. The current deterministic conversation provider is unchanged; future remote-provider latency would require a separate transaction-duration review.

Concurrency tests use separate pools, not a shared in-memory mutex. They cover simultaneous creation, evidence changes, conversation turns, different-team submissions, duplicate submissions, corrections plus evidence, duplicate round closes, duplicate overrides, lock retention across an await, and callback rollback/lock recovery.

## Schema and SQL folder

All seven tables remain: `games`, `teams`, `submissions`, `round_results`, `state_history`, `transcripts`, `artifacts`.

IDs and serialized values remain TEXT. Round fields remain INTEGER. Existing simulation timestamps remain TEXT. No UUID or JSONB conversion occurred. Initial creation includes `teams.round_narratives`, `submissions.kind`, `submissions.corrections`, and nullable `artifacts.artifact_json`. Existing primary keys, foreign keys, cascading deletes, defaults and `(team_id,round)` submission uniqueness are preserved. Artifact identity remains `(team_id,id)`.

Infrastructure-only additions: checksummed `schema_migrations` and transcript `storage_order` for deterministic equal-timestamp ordering. These do not enter domain models or projections.

| Sponsor file | Contents |
|---|---|
| `SQL/001_initial_schema.sql` | Seven complete tables, current columns/constraints, migration ledger and transcript ordering metadata |
| `SQL/002_query_indexes.sql` | Five supporting indexes for existing game/team/submission/transcript queries |
| `SQL/verify.sql` | Read-only table/column/constraint inventory, counts, orphan/wrong-game checks, duplicate team/round checks, serialized JSON validation and ledger inspection |
| `SQL/README.md` | Prerequisites, clean provisioning, execution order, commands, environment setup, isolated tests, Render considerations, backup/rollback |

Migrations are serialized with an advisory lock, checksum-checked and transactional. Concurrent initial runners, repeat execution, checksum drift, unknown future migrations and failed-DDL rollback were tested. Startup does not silently accept changed migration files.

The clean CLI verification found all eight tables including the ledger, all 53 expected columns, 17 constraints, zero rows in the seven application tables, zero orphan/wrong-game records and no duplicates. Schema installation never seeds a game. JSON casts in verification fail on malformed serialized values; the script does not repair them.

## Artifact and state compatibility

The first parity run caught a difference between PostgreSQL catalog-insertion order and SQLite's current composite-key artifact traversal. PostgreSQL now reads artifacts by ID with C collation to match the observed SQLite behavior. This is only ordering of artifact objects; the 63-document CLEARPATH array and its exact spelling, duplicates and disorder are unchanged.

Rich artifact JSON, student content, canonical documents, dynamically generated Round 3 Analysis, nullable rich-JSON fallback and the legacy Round 3 title fallback are preserved. Canonical documents for a clean game come from the unchanged engine. There is no historical-database backfill or content fabrication. Access/page/version state remains in existing serialized team state, not a new evidence system.

## Parity verification

Four unchanged path declarations are read from the existing report generator without importing/executing its report-writing side effects. The current explicit golden benefit-review payload is used for the R9 no-crisis branch. No decisions or mechanics were adjusted to force outcomes.

| Established path | SQLite and PostgreSQL outcome |
|---|---|
| Path A — Disciplined | `squeak_through` |
| Path B — Automation Risk | `disaster` |
| Path C — Option D | `win_with_scars` |
| Path D — Triumph | `triumph` |

Each path runs R1–R10 through both application services, comparing complete reconstructed game state plus student and instructor projections after every close. Only independently generated submission/transcript UUIDs and event timestamps are normalized; benefits, scores, content, state, array ordering, decisions and context hashes are not normalized away. A separate exact round-trip test checks IDs, timestamps, raw configuration serialization/hash, codes and document order without normalization.

Additional coverage includes:

- Real PostgreSQL game/team creation and seed CLI with twelve teams.
- Team-code ownership, normal authentication and forbidden instructor access from a student token.
- Both R9 branches, R10 completion and debrief projection.
- Restart via closed/reopened pools and explicit replay persistence.
- Correction original metadata/audit and all ten missing-team releases compared against a new temporary SQLite reference database.
- Board v3, readiness page 9, analyst memo and dynamic Analysis access through subsequent closes/completion/replay.
- Advisor multi-turn and direct stakeholder conversations compared against SQLite.
- Legacy Analysis content/title fallback and team-isolated artifact access.
- HTTP document access and unchanged student validation response; the full student response equals the existing student projection.
- Failed database write rollback and safe error text.

No interactive browser run or human cold run was performed. HTTP integration tests use the real Express app with PostgreSQL; unchanged frontend assets remain `index-DHtfASG2.css` and `index-Dz9XX7rx.js`.

## Environment and local verification isolation

Driver: `pg` 8.23.0, with `@types/pg` 8.23.1; lockfile updated normally; no ORM.

- `DATABASE_URL`: required backend runtime configuration; never exposed through Vite.
- `TEST_DATABASE_URL`: optional explicit dedicated integration database, required to run the database suites. The database name must end in `_test`; configured runtime-target reuse and test search-path overrides are rejected. No fallback to production DATABASE_URL.
- `DATABASE_PATH`: only the unchanged SQLite adapter/explicit compatibility harness; not runtime configuration.
- PORT, VITE_API_BASE, FLEXEE_INSTRUCTOR_PASSPHRASE, LLM_PROVIDER and LLM_API_KEY are preserved.

Verification used a new disposable PostgreSQL 15.18 cluster bound only to loopback on port 55439, separate from the already installed service on 5432. No credentials were obtained or changed for the installed service. Test schemas were UUID-scoped and removed; zero test schemas remained. The disposable server was stopped after verification. Its generated cluster/log files remain in the operating-system temporary directory, outside the project; they contain synthetic verification data only. No installed PostgreSQL service settings were changed.

All existing `.bpm-data` file SHA-256 hashes match before/after, including every one of the 30 SQLite databases. They were never opened via a mutating application path. Parity used fresh temporary SQLite files that tests subsequently removed.

## Files modified

1. `package.json`
2. `package-lock.json`
3. `.env.example`
4. `README.md`
5. `src/persistence/repository.ts`
6. `src/server/index.ts`
7. `scripts/migrate.ts`
8. `scripts/seed.ts`
9. `test/pilot-seed.test.ts` — compatibility launcher only; assertions retained
10. `reports/INSTRUCTOR_PILOT_OPERATING_NOTE.md`

## Files added

1. `src/application/persistent-service.ts`
2. `src/persistence/postgres.ts`
3. `src/persistence/postgres-migrations.ts`
4. `SQL/README.md`
5. `SQL/001_initial_schema.sql`
6. `SQL/002_query_indexes.sql`
7. `SQL/verify.sql`
8. `test/helpers/postgres.ts`
9. `test/helpers/postgres-paths.ts`
10. `test/helpers/sqlite-seed.ts`
11. `test/postgres-persistence.test.ts`
12. `test/postgres-concurrency.test.ts`
13. `test/postgres-migrations.test.ts`
14. `reports/POSTGRESQL_MIGRATION_REPORT.md`

Build output was regenerated normally. No historical acceptance report was regenerated, no golden fixture changed and no SQLite source/schema changes were needed.

## Remaining prerequisites and boundaries

No local implementation/test blocker remains. Before actual deployment, provision the sponsor's **clean** database, configure DATABASE_URL and instructor credentials privately, choose provider-specific TLS/network restrictions, allocate suitable connection/DDL privileges, and establish backup/restore procedures. Repeat verification against that chosen environment. This task does not create the sponsor's deployment or persist any environment secret.

Session registries remain process-local, exactly as before; PostgreSQL does not introduce multi-instance authentication support. Use one application instance unless separately authorized session architecture work is performed. Do not roll back new PostgreSQL writes by switching to historical SQLite data.

No simulation formulas, calibration, outcome thresholds, crisis selection, benefits, advisors, stakeholder mechanics, authoritative content, projections, UI behavior, API URLs or authentication behavior were changed. No content was invented. No data importer, deployment or ZIP was created; the existing ZIP SHA-256 remains `97ADDE2964BF1190315E7D6B355D34DB898DB3ACFA9CE3999E6875CC6CD63FD6`.
