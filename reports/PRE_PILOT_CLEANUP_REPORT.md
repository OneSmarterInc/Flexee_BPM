# Pre-pilot cleanup and pilot-readiness report

## A. Repository organization

Inspected 45 root Markdown files, including README. Kept README at root; moved 44 root documents and 11 week/artifact sources from `files/`. Destinations: 20 authoritative design inputs in `design/`, 13 historical instructions/feedback in `instructions/`, and 22 existing implementation reports in `reports/`. Generated proposals and calibration records are implementation-produced documents, not new source specifications. Historical phase corrections remain in instructions, including accepted owner amendments.

Nine filenames containing spaces were normalized to underscores. No documents were deleted. The now-empty `files/` directory was left alone. Of 55 moved documents, 53 retain identical SHA-256 hashes; only the unresolved-register closing note and one explicit relocated source path in the implementation report changed content. The second cold-run report is byte-identical.

Historical documents may identify other documents by their original bare filenames. Those are preserved source/history references rather than executable paths or hyperlinks; the move map below resolves them. No historical findings were rewritten. Known historical missing-content statements are superseded by the owner's cleanup disposition, not silently filled.

## B. README

Replaced the long phase-oriented README with concise setup, prerequisites, actual npm scripts, server/student/instructor URLs, database configuration, seed modes, verification commands, document locations, and the explicit authoritative-design-input-over-implementation-report rule.

## C. Design unresolved register

`DESIGN_UNRESOLVED.md` retains its history and now states no active design-unresolved items remain, under `../instructions/bpm_cleanup_instructions.md`. CLEARPATH filenames and Reyes were delivered. Readiness pages 10–14 and the ten unspecified vendor-slide bodies are permanent placeholders, not unfinished content to invent. Deferred JSON readability and pilot observation of Panel 3 are not new simulation-design work.

## D. index.html — kept

Vite has no alternate root/input and builds to `dist/web`. Root `index.html` supplies the root element and imports `/src/web/main.tsx`; `src/server/index.ts` serves the generated `dist/web/index.html`. The production build passed. No build configuration changed.

## E. Pilot seeding

Actual command: `npm.cmd run seed -- --teams 12`.

Explicit `--teams 1` through `--teams 12` always calls the existing `SimulationService.create()` once to create a fresh game; no creation logic, engine, or team-code algorithm is duplicated. Normal configuration, game/team ownership, SQLite relationships and session authorization are preserved. It prints the Game ID and twelve named codes. Invalid arguments are rejected before database access; a detected code collision stops distribution with an error.

The no-argument legacy behavior remains unchanged: reuse a created R1 game with a team having no submissions/transcripts, otherwise create one `Phase 5 Cold Run` team. It is documented as unsuitable for pilot logistics. The new explicit mode does not reuse that game.

The actual npm command succeeded against an isolated temporary SQLite database:
`C:/Users/ruchi/AppData/Local/Temp/flexee-pilot-logistics-82e13f5a-d12f-481f-8148-a7c716251167/pilot.sqlite`.

**Verification fixture only — do not distribute these codes as the actual class pilot.** No participant was enrolled and no cold run was conducted. Game ID: `845dfe87-0b26-4967-a631-3609674dcd50`.

| Team | Verification code |
|---|---|
| Team 01 | 3D5CB76F |
| Team 02 | 7B19D46F |
| Team 03 | 9D76F181 |
| Team 04 | C8F8E2E9 |
| Team 05 | 48F6DD40 |
| Team 06 | D41ABF4D |
| Team 07 | 1580AE7D |
| Team 08 | F0FF413A |
| Team 09 | 3AF3F4FE |
| Team 10 | BAA39868 |
| Team 11 | 021AAC0E |
| Team 12 | 2FA270BF |

For class, choose an isolated pilot DATABASE_PATH shared by server and seed terminal; run the same command and distribute that invocation's output. Existing default runtime and cold-run data were not seeded, migrated, reset, or changed by this work.

## F. Instructor operating note

[INSTRUCTOR_PILOT_OPERATING_NOTE.md](INSTRUCTOR_PILOT_OPERATING_NOTE.md) covers startup and seeding, code distribution, student entry, instructor selection, manual release/completion, missing submissions, immutable-submission limitations, fresh-game restart, reload/server recovery, team diagnostics/transcripts, and pilot precautions.

## G. Missing submissions — unchanged

Verified `submit()`, `closeRound()`, `SimulationService.close()`, InstructorDashboard and regression tests. If one of twelve teams has not submitted, closure throws exactly `Every team must submit before round close`. Nothing is saved/resolved, the active round does not advance, no default/no-action submission or consequence is generated, and submitted teams wait. Instructor release remains disabled until all submit; all-submitted status enables manual release, not automatic advancement. A new test verifies unchanged state after eleven submissions and successful release only after the twelfth.

## H. Submission correction — unchanged

`submit()` rejects an existing active-round submission with `Submission is immutable and already exists`. API/service/UI expose no submission edit, deletion, replacement, resubmission, or instructor correction mechanism. Teams can correct local inputs before acceptance. There is no supported correction of an accepted record.

## I. Starting over — current behavior

No reset/restart/delete endpoint exists. The new explicit seed mode offers a fresh-game start at R1, retaining old games and transcripts without transferring them. It is not a rollback, team-only restart, or alteration of the original submission. Never delete or manually edit participant databases.

## J. Verification

- Full suite: **391/391 passed**, 15 test files; baseline 384 plus seven focused seed tests.
- Golden: **9/9 passed**.
- Typecheck: **PASS**.
- Lint: **PASS, zero warnings**.
- Production build: **PASS**, unchanged client asset identifiers `index-Cqtfa8yW.js` / `index-DHtfASG2.css`.
- Existing experimental Node SQLite warning remains; it is not an ESLint warning.
- Initial focused run had six passes and one new subprocess test exceeding the default five-second timeout. Only time allowances for the new multi-process tests/setup were increased; all final assertions passed.
- New coverage: exactly one game/twelve teams, distribution output, code uniqueness and ownership, unchanged config/initial state, missing-submission gate, fresh one-team support and existing-game preservation, legacy one-team reuse, and invalid CLI arguments.
- No new browser session or cold run was performed. Browser/UI behavior was not changed.

## K–L. Preservation

No files under `src/` changed: Phase 3/4/5/6 engine, scoring, benefits, crises, budgets, access-history correction, SQLite schema/repository, projections, secrecy, stakeholder/advisor mechanics, Panel 3 and UI are byte-identical. Regression tests remain passing. No configuration or golden fixtures changed. R10 Metrics JSON, Decision Log JSON and completed-game editable-field behavior remain unchanged.

Authoritative sources are byte-identical after moves. CLEARPATH order/disorder/duplicates, 63 entries, the 45 supplied names, all placeholders and advisor audit remain intact; audit has 420 rows. Before/after hashes confirm all existing `.bpm-data` files and the second cold-run report unchanged. Existing ZIP was not regenerated.

## M. File changes

- Source/application files changed: **none**.
- Scripts: `scripts/seed.ts` gains explicit pilot mode; `scripts/advisor-audit.ts` and `scripts/phase3-reports.ts` only change output paths to `reports/`.
- Tests: new `test/pilot-seed.test.ts`; `test/phase6-closeout.test.ts` only updates its Week 10 source path to `design/`.
- Configuration changed: **none**.
- Documentation edits: README; unresolved-register closing note; one path-only change in Phase 6 implementation report.
- New documents: this report and the instructor operating note.
- Deleted files: **none**; 55 relocations listed below.
- No ZIP created or replaced.

| Original path | Current path | Content |
|---|---|---|
| `files/bpm_artifacts.md` | `design/bpm_artifacts.md` | Identical |
| `files/bpm_week01_content.md` | `design/bpm_week01_content.md` | Identical |
| `files/bpm_week02_content.md` | `design/bpm_week02_content.md` | Identical |
| `files/bpm_week03_content.md` | `design/bpm_week03_content.md` | Identical |
| `files/bpm_week04_content.md` | `design/bpm_week04_content.md` | Identical |
| `files/bpm_week05_content.md` | `design/bpm_week05_content.md` | Identical |
| `files/bpm_week06_content.md` | `design/bpm_week06_content.md` | Identical |
| `files/bpm_week07_content.md` | `design/bpm_week07_content.md` | Identical |
| `files/bpm_week08_content.md` | `design/bpm_week08_content.md` | Identical |
| `files/bpm_week09_content.md` | `design/bpm_week09_content.md` | Identical |
| `files/bpm_week10_content.md` | `design/bpm_week10_content.md` | Identical |
| `ADVISOR_AUDIT_PHASE2.md` | `reports/ADVISOR_AUDIT_PHASE2.md` | Identical |
| `bpm cleanup instructions.md` | `instructions/bpm_cleanup_instructions.md` | Identical |
| `bpm deferred decisions.md` | `instructions/bpm_deferred_decisions.md` | Identical |
| `bpm phase3 final pass.md` | `instructions/bpm_phase3_final_pass.md` | Identical |
| `bpm phase3 instructions.md` | `instructions/bpm_phase3_instructions.md` | Identical |
| `bpm phase3 revisions.md` | `instructions/bpm_phase3_revisions.md` | Identical |
| `bpm phase4 small pass.md` | `instructions/bpm_phase4_small_pass.md` | Identical |
| `bpm phase5 feedback.md` | `instructions/bpm_phase5_feedback.md` | Identical |
| `bpm phase5 instructions.md` | `instructions/bpm_phase5_instructions.md` | Identical |
| `bpm phase6 closeout.md` | `instructions/bpm_phase6_closeout.md` | Identical |
| `bpm_advisor_voices.md` | `design/bpm_advisor_voices.md` | Identical |
| `bpm_build_spec_advisors.md` | `design/bpm_build_spec_advisors.md` | Identical |
| `bpm_build_spec_levers.md` | `design/bpm_build_spec_levers.md` | Identical |
| `bpm_build_spec_state.md` | `design/bpm_build_spec_state.md` | Identical |
| `bpm_clearpath_filenames.md` | `design/bpm_clearpath_filenames.md` | Identical |
| `bpm_phase2_revisions.md` | `instructions/bpm_phase2_revisions.md` | Identical |
| `bpm_phase4_instructions.md` | `instructions/bpm_phase4_instructions.md` | Identical |
| `bpm_phase6_corrections.md` | `instructions/bpm_phase6_corrections.md` | Identical |
| `bpm_phase6_instructions.md` | `instructions/bpm_phase6_instructions.md` | Identical |
| `bpm_round9_benefit_review.md` | `design/bpm_round9_benefit_review.md` | Identical |
| `bpm_round9_scoring_values.md` | `design/bpm_round9_scoring_values.md` | Identical |
| `bpm_stakeholder_voices.md` | `design/bpm_stakeholder_voices.md` | Identical |
| `CALIBRATION_V1.md` | `reports/CALIBRATION_V1.md` | Identical |
| `DESIGN_UNRESOLVED.md` | `reports/DESIGN_UNRESOLVED.md` | Authorized note/path update |
| `flexee_bpm_design_v1.md` | `design/flexee_bpm_design_v1.md` | Identical |
| `IMPLEMENTATION_MAP.md` | `reports/IMPLEMENTATION_MAP.md` | Identical |
| `MANUAL_PLAYTHROUGH.md` | `reports/MANUAL_PLAYTHROUGH.md` | Identical |
| `PHASE3_ARTIFACT_INVENTORY.md` | `reports/PHASE3_ARTIFACT_INVENTORY.md` | Identical |
| `PHASE3_PLAYTHROUGH.md` | `reports/PHASE3_PLAYTHROUGH.md` | Identical |
| `PHASE3_SOURCE_CONFLICTS.md` | `reports/PHASE3_SOURCE_CONFLICTS.md` | Identical |
| `PHASE3_VARIANT_COVERAGE.md` | `reports/PHASE3_VARIANT_COVERAGE.md` | Identical |
| `PHASE4_CONVERSATION_REPORT.md` | `reports/PHASE4_CONVERSATION_REPORT.md` | Identical |
| `PHASE4_DEBRIEF_REPORT.md` | `reports/PHASE4_DEBRIEF_REPORT.md` | Identical |
| `PHASE4_INTERFACE_REPORT.md` | `reports/PHASE4_INTERFACE_REPORT.md` | Identical |
| `PHASE4_PANEL3_ACCESS_AUDIT.md` | `reports/PHASE4_PANEL3_ACCESS_AUDIT.md` | Identical |
| `PHASE5_COLD_RUN_REPORT.md` | `reports/PHASE5_COLD_RUN_REPORT.md` | Identical |
| `PHASE5_IMPLEMENTATION_REPORT.md` | `reports/PHASE5_IMPLEMENTATION_REPORT.md` | Identical |
| `PHASE5_INSTRUCTOR_VIEW_PROPOSAL.md` | `reports/PHASE5_INSTRUCTOR_VIEW_PROPOSAL.md` | Identical |
| `PHASE5_INTERFACE_PROPOSAL.md` | `reports/PHASE5_INTERFACE_PROPOSAL.md` | Identical |
| `PHASE5_PILOT_READINESS.md` | `reports/PHASE5_PILOT_READINESS.md` | Identical |
| `PHASE5_PROPOSAL_SUMMARY.md` | `reports/PHASE5_PROPOSAL_SUMMARY.md` | Identical |
| `PHASE6_IMPLEMENTATION_REPORT.md` | `reports/PHASE6_IMPLEMENTATION_REPORT.md` | Authorized note/path update |
| `PHASE6_SECOND_COLD_RUN_REPORT.md` | `reports/PHASE6_SECOND_COLD_RUN_REPORT.md` | Identical |
| `SCENARIO_VARIANT_TABLE.md` | `reports/SCENARIO_VARIANT_TABLE.md` | Identical |

## N. Remaining pilot prerequisites

Arrange a controlled instructor-access/network environment; instructor routes currently lack authentication. Choose the host/database, start the server with that same database setting, create the actual class pilot and privately distribute its twelve codes. Instructor/student refresh behavior and lack of post-submission correction must be understood before class. No further cold run or deferred UI implementation is required by this cleanup; Panel 3 is observed during the actual pilot.

PRE-PILOT CLEANUP COMPLETE — READY FOR PILOT LOGISTICS
