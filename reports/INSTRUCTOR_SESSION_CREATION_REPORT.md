# Instructor simulation session creation

Date: 2026-09-24.

Implemented the instructor-facing creation workflow. Browser/API checks passed with isolated memory data. **Live PostgreSQL verification is pending:** TEST_DATABASE_URL was unavailable in the executing process and in user/machine environment scopes. Skipped database tests are not a PostgreSQL pass. No production database was accessed, no deployment was performed, and no ZIP was created.

## Architecture and API

- Existing instructor passphrase sign-in and opaque bearer sessions protect the new page/API. Authentication policy, middleware ordering and CORS are unchanged.
- `POST /api/instructor/games/create`, body `{ "teams": 12 }`, returns HTTP 201 with `gameId`, `simulationId`, and `teams: [{ name, code }]`. Missing/invalid/student credentials receive the existing HTTP 404 response. Invalid team counts receive HTTP 400.
- Team count is an integer from 1 to 12, preserving the existing explicit seed limit. Names are Team 01 through Team 12.
- The new service entry delegates to the existing `SimulationService.create` and domain `createGame`. PostgreSQL uses the existing `withCreation` advisory-lock transaction; no second game-creation engine was introduced.
- Six-character codes use Node crypto.randomInt with alphabet ABCDEFGHJKLMNPQRSTUVWXYZ23456789. No O/0/I/1. A Set rejects collisions before persistence, retries are bounded, and a database index enforces per-game uniqueness.
- Legacy games retain their original eight-character derived codes. New games use their stored code only; the old derived code is not an additional login credential for those teams. Student tokens, ownership checks and instructor authentication are otherwise unchanged. Codes are excluded from student projections and are returned only by the protected creation response.
- The existing CLI creation behavior remains available. Its legacy reuse branch now prints the stored code if it happens to reuse a UI-created game.

## Database change and deployment requirement

`SQL/003_team_access_codes.sql` adds nullable `teams.access_code`, a six-character format constraint and a unique partial index on `(game_id, access_code)`. Existing rows remain NULL; no existing access details or simulation data are rewritten. Existing migrations 001/002 and their checksums are untouched. No new table is needed.

The migration runner and backend SQL-asset copy list include 003. Run the normal `npm run migrate`, or let the existing startup migration runner apply it. Deploy application and migration together. Older application releases reject unknown newer migrations under the existing safety policy; do not attempt an unplanned downgrade after applying 003.

The historical SQLite adapter can also round-trip the optional field, preventing silent loss in compatibility tests. It is not a production fallback. Historical database files were not opened or migrated during verification.

PostgreSQL connection/SSL selection, Render configuration, environment variables, instructor secrets and frontend API-base configuration are unchanged.

## UI

`/?view=instructor` now links to **Create New Simulation Session**. `/?view=instructor-create` uses the same sign-in when unauthenticated. The form identifies The Reengineering Mandate and defaults to 12 teams. It validates the count and prevents repeat form submission while a request is pending.

Success shows Game ID, every team/code, Copy Student Access Details and Open Instructor Control Room. The clipboard operation reports success or offers a selectable-text fallback. The control-room button loads the existing instructor dashboard, not a new dashboard. The game also appears in the existing game selector. Existing student entry is unchanged.

Save/copy the access details before leaving the success page; the success display is component state, not persisted browser state. On an uncertain network failure, the UI instructs the instructor to check the existing selector before creating another session. No server-side idempotency protocol or code-recovery UI was added in this scoped implementation.

No CSS changes. The new page reuses the existing card/form/button styles. The React review emphasized labelled inputs, a real form, explicit errors, a pending-request guard and no client-side import of server crypto/configuration.

## Files

Added:

- `src/application/session-creation.ts`
- `src/web/components/CreateSimulationSession.tsx`
- `SQL/003_team_access_codes.sql`
- `test/session-creation.test.ts`
- `reports/INSTRUCTOR_SESSION_CREATION_REPORT.md`

Modified:

- `src/application/access.ts`
- `src/application/service.ts`
- `src/application/persistent-service.ts`
- `src/domain/types.ts` (optional team access metadata only)
- `src/persistence/postgres.ts`
- `src/persistence/postgres-migrations.ts`
- `src/persistence/sqlite.ts`
- `src/server/index.ts`
- `src/web/App.tsx`
- `src/web/api.ts`
- `scripts/copy-server-assets.mjs`
- `scripts/seed.ts`
- `test/postgres-migrations.test.ts`
- `SQL/README.md`
- `SQL/verify.sql`
- `README.md`

## Verification

- Full suite: 572 passed, 28 PostgreSQL-dependent tests skipped, 600 total; zero failures.
- Golden suite: 9/9 passed.
- Production build: PASS (compiled backend, migration assets and Vite frontend). Typecheck: PASS. Lint: PASS, zero warnings. All commands completed with exit code 0.
- New tests cover twelve-team creation, names, code alphabet/uniqueness, collision retry/failure, invalid counts, legacy login preservation, protected HTTP API, student login, game listing/control-room access, student projection secrecy, SQLite close/reopen/save, seed reuse and initial form rendering.
- Added live PostgreSQL coverage for all twelve stored teams/codes, fresh-pool reads, login, uniqueness rollback and subsequent save preservation. Added an upgrade-from-002 test preserving legacy records. These two new tests, together with the existing 26 integration tests, were skipped without TEST_DATABASE_URL.
- Migration-count assertions were updated from two to three; no existing test was removed or weakened.

### Browser verification

The compiled app was served at 127.0.0.1:3012 using createApp and MemoryGameRepository, with a disposable preview-only passphrase. The browser skills were used to inspect the actual form, rendered success page and navigation. This was not a deployed/Render or PostgreSQL-backed check.

- Existing instructor sign-in: PASS.
- Create 12 teams from the UI: PASS; POST returned 201.
- Copy control: PASS; success message rendered.
- Open existing instructor control room: PASS; all twelve teams shown, normal release disabled pending submissions.
- New game in existing selector: PASS.
- Student login using generated details: YES; existing R1 team workspace rendered.
- Browser errors: none reported.
- Screenshot inspection: successful page matched existing card styling; evidence is outside the repository.

Disposable example: Game ID `87b8bd6b-cea0-43a1-a8fe-02e2f5a6d0b0`, Team 01 code `ZLQZ2D`. These are memory-only verification details, not real classroom access. The preview and browser were stopped afterward; these details no longer work.

## Manual PostgreSQL acceptance remaining

1. Supply TEST_DATABASE_URL privately to the test process for a dedicated `_test` database. Do not reuse the participant database.
2. Run `npm test`; require all 600 tests to execute successfully, including the two new database cases.
3. With an authorized disposable PostgreSQL-backed app, sign in at `/?view=instructor`, open the creation page, and create 12 teams.
4. Confirm the game and twelve unique codes are stored, reopen the server, and repeat student entry with a generated Game ID/code.
5. Open the instructor control room and confirm the game appears in its selector.

No claim of a live PostgreSQL pass is made until these checks actually run.

## Git status

Fetched origin successfully; HEAD and origin/main both pointed to `f7b2f9e` before the attempted feature commit. The approval reviewer blocked the requested commit because of the earlier no-commit instruction. Nothing was staged or committed, and nothing was pushed. The feature remains in the working tree pending explicit commit approval. The three pre-existing untracked sponsor documents remain untouched.

## Preservation

Engine calculations, rounds, scoring, outcomes, advisors, stakeholder mechanics, budgets, Round 8 conditions/dashboard, scenario content, golden fixtures, existing decision UI and Render SSL policy have no changes. The only domain-file edit is optional access metadata in Team. Existing report files and the three pre-existing untracked sponsor documents are untouched.
