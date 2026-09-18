# Phase 7 final cleanup

PHASE 7 FINAL CLEANUP COMPLETE — READY FOR FINAL VERIFICATION

Verified 2026-09-17. Authority: [bpm_final_cleanup.md](../bpm_final_cleanup.md), read in full, and the follow-up instruction to finish verification while reporting the blocked browser check accurately. Phase 7 remains implemented and accepted. This is targeted pilot cleanup, not a new interface build.

## Correction editor

The instructor no longer edits a raw JSON submission. `SubmissionCorrection` reuses the active `DecisionWorkspaceV6` controls with a cloned copy of the team's accepted payload. The round's existing selects, numbers, booleans, checkboxes and text fields are prefilled. Submitted R9 payloads retain their actual crisis/benefit-review branch. The instructor form receives budget, rollback readback, metrics and indicator context from the selected team's existing data.

Save uses the same existing authenticated correction endpoint and callback. Both student submission and instructor correction continue using the existing server validation and `studentErrorMessage`; the shared form catches and displays the returned error. No schema, permission, correction storage, audit, scoring or service code changed. Original/new values and correction metadata retain their existing structure. Non-submissions, closed rounds and completed games remain outside the correction editor. Student callers receive no correction label or callback; their defaults remain unchanged.

The correction component remains keyed by submission identity and correction count, so switching team or saving a correction loads the correct accepted values. React review checked reuse of existing labeled controls, local busy/error state, clone-on-initialization and absence of new effects or polling. This influenced the choice to share the normal controls rather than duplicate validation or build a second form system.

## Instructor refresh

**Refresh teams** appears beside the team list. It calls the existing instructor GET for `instructor.game.id` with the current instructor token, then replaces the view with the response. The game stays selected; team selection remains component-local. Pending refresh disables the button; failure is reported locally without clearing the selected game. There is no polling or new endpoint.

Component/source checks and HTTP tests verify the control and selected-game binding, and that a submission made through a separate student session appears in a fresh instructor response and rendered team list. Actual browser clicking is not claimed as verified; see the browser limitation below.

## Documentation cleanup

- [PHASE7_IMPLEMENTATION_REPORT.md](PHASE7_IMPLEMENTATION_REPORT.md) starts and ends with the accepted current status. Old blocked/partial material is retained under **SUPERSEDED HISTORICAL STATUS**, explicitly described as pre-clarification history. A dated final-cleanup section distinguishes the new controls from earlier rehearsal observations.
- [README](../README.md) now states: "index.html is retained as the Vite application entry point."
- [Instructor operating note](INSTRUCTOR_PILOT_OPERATING_NOTE.md) describes the prefilled correction form and Refresh teams rather than mandatory reload/reselection.
- [Ten-week schedule](TEN_WEEK_INSTRUCTOR_RELEASE_SCHEDULE.md) points instructors to Refresh teams. Historical rehearsal/package reports were not rewritten.

## index.html decision

Kept root `index.html`. `vite.config.ts` has no alternate root or input; `index.html` imports `/src/web/main.tsx` and supplies its root element. The unchanged build produces `dist/web/index.html`. The entry file and Vite configuration are unchanged.

## Removed legacy components

Removed `src/web/components/StudentDashboard.tsx` and `src/web/components/DecisionWorkspace.tsx`. Import review confirmed the old dashboard only referenced the old workspace; no active application component used either. `App.tsx` uses `StudentDashboardV6`, which uses `DecisionWorkspaceV6`.

Three old source-inspection tests now inspect the active V6 files. One People-label assertion needed the existing V6 template-string spelling (`${view.stakeholders.length}` rather than JSX `{view.stakeholders.length}`); its expected wording and no-coaching/no-gates assertions remain intact. No runtime student content was changed. The removed legacy files remain recoverable from the existing, unchanged delivery ZIP.

## Stylesheet cleanup

Four phase-named stylesheets existed, alongside the already descriptive base `styles.css`. Renamed only the phase files:

| Previous | Current |
|---|---|
| phase4.css | documents-debrief.css |
| phase5.css | entry-instructor.css |
| phase5-followup.css | round-progression.css |
| phase6.css | document-readability.css |

SHA-256 comparison confirms every renamed file is byte-identical to its original. `App.tsx` preserves their import order; `main.tsx` and `styles.css` are unchanged. No CSS merging, selector changes or visual redesign. The generated CSS asset remains `index-DHtfASG2.css`.

## Verification results

| Required command | Final result |
|---|---|
| npm.cmd test | PASS — 486/486 tests, 18 files |
| npm.cmd test -- --run test/golden.test.ts | PASS — 9/9 |
| npm.cmd run typecheck | PASS |
| npm.cmd run lint | PASS — zero warnings |
| npm.cmd run build | PASS |

Added 18 tests in `test/phase7-final-cleanup.test.ts`: prefilled correction controls for R1–R10, R9 crisis branch, unchanged student defaults, legacy removal/CSS imports, correction visibility, valid save and exact audit keys, invalid correction/student-message equivalence with no audit mutation, rejected student credentials, and refreshed same-game state after another student's submission. Tests use server-rendered React markup and an in-memory repository/API server; they are not browser interaction tests.

An initial full-suite run had 485 passes and one failure in the old People-label source-text assertion. The assertion was adjusted solely to V6's existing template-string syntax, as described above. The subsequent full suite passed 486/486. No timeout was changed, no test was deleted, and no validation or mechanic was weakened. Node's experimental SQLite warning remains a runtime notice, not a lint failure.

## Browser verification — BLOCKED, NOT PASSED

The browser verification skill required a visual/interactive check of the local test server. The browser CLI was unavailable. The in-app browser attempt was rejected before opening the page because its automatic approval service could not refresh a revoked authentication token. No alternate browser route or bypass was attempted.

Therefore no claim is made that live correction editing, validation-error rendering, save feedback or refresh clicks were browser-verified. These remain the final interactive verification items after browser-tool sign-in/access is restored. This limitation is tooling access, not evidence of an application defect.

The attempted verification server used only `MemoryGameRepository` with two synthetic teams, never an existing SQLite database. It was stopped; port 3131 has no listener and its in-memory records were discarded. No participant cold run or persistent pilot game was created.

## Preservation

Before/after file hashes confirm all 30 existing databases and every file under `.bpm-data` are unchanged. No participant or cold-run database was migrated, seeded or modified. The existing ZIP is unchanged; no ZIP was created.

All domain, application, persistence, server, configuration, golden-fixture and authoritative-content files retain their original hashes. Only the requested presentation cleanup, focused tests and directly related documentation changed.

Deferred items remain unchanged: R10 metric-monitoring JSON, expanded decision-log JSON, and completed-game editable-field behavior. StudentDashboardV6, StudentExperience and debrief components are unchanged. The shared V6 decision component only gains optional instructor initial values and save-label props; its student rendering/handlers are otherwise unchanged. Panel 3, non-submission behavior, scoring, validation, benefits, crises and budgets were not modified.

## Files changed

- UI: `src/web/App.tsx`, `src/web/components/InstructorActions.tsx`, `InstructorDashboard.tsx`, `DecisionWorkspaceV6.tsx`.
- Removed: the two unused legacy components listed above.
- Renamed: the four stylesheets listed above; content unchanged.
- Tests: new `test/phase7-final-cleanup.test.ts`; active-component references in `test/phase4.test.ts` and `test/phase5.test.ts`, plus the equivalent People-label syntax assertion.
- Documentation: README, Phase 7 implementation report, instructor operating note, ten-week schedule and this report.

No ZIP. No cold run. No deferred-item implementation. Ready for final verification, with browser interaction verification explicitly outstanding.
