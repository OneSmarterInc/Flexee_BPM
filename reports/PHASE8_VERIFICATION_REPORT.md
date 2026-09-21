# Phase 8 — Pilot interface verification

Date: 21 September 2026.

## Status and scope

UI tidying implemented. All executed regression checks pass. **Protected R8 dashboard verification is qualified by a pre-existing data-availability limitation described below; this report does not claim an unqualified pass for that screen.**

Authority: `bpm phase8 ui tidy.md` and the supplied Phase 8 implementation request. Baseline: `0208e0f5e09f8202893088147c2de240760e5e59`, branch `main`, remote `https://github.com/OneSmarterInc/Flexee_BPM.git`. Initial fetch showed no remote-only commits. The only initial untracked file was the supplied specification.

No domain, scoring, outcome, configuration, projection, server route, authentication, persistence, migration, schema or deployment configuration was changed. No scenario/document wording was edited. No ZIP was created. Existing local databases and participant data were not read, copied, migrated or modified for this work.

## Changes

- Consolidated five stylesheets into `src/web/styles.css`: shared spacing/type tokens, borders, readable headings and controls, consistent cards, focus outlines, paragraph spacing and constrained reading widths. Retained the existing palette, brand, navigation order and two-column workspace; no new mobile system.
- Kept the complete scenario text, now rendered as ordinary reading text below the existing round name rather than one oversized heading.
- Added public round/open/submitted/completed orientation to the existing header. “Back to decision” links to the existing decision panel, not a new route or workflow. Completed games have no decision link.
- Replaced Decision Log JSON with ordered, nested labels/values. Booleans, zero, null, empty strings/collections, identifiers, numbers, free text, dates, round association and submitter remain represented. Known choice codes are humanized without rewriting authored text. The same renderer tidies student history and instructor submission payloads; instructor diagnostics and correction audit data remain available.
- Replaced R10 metric JSON with an ordered list retaining metric IDs, labels, category, unit, baseline/target values and any supplied range. No metric interpretation, scoring, ranking or origin hints were added.
- Made existing fallback messages plain-language. Client transport/JSON-decoding failures no longer surface browser implementation errors. Existing server validation messages, request paths/methods/headers/bodies, response contracts and authentication remain unchanged.
- Styled the existing instructor team list, refresh, correction and release controls consistently, without sorting by outcome or changing release/correction logic.
- Added `files/` to Git and packaging exclusions alongside the already excluded `dist/` and `.bpm-data/`.

## Verification environment and actual browser results

The actual React app and existing Express routes were run locally at 127.0.0.1:5188 with a disposable MemoryGameRepository API on 127.0.0.1:3008. The temporary preview harness used existing golden decisions through SimulationService to prepare R1/R6/R8/R10/completed games and a 12-team instructor game. It was removed from the repository after use. This is a UI/API verification using memory persistence, **not a PostgreSQL deployment or real participant cold run**.

An existing local production-start server occupied port 3001. An initial preview login reached that server and returned “Game not found”; no submission or database mutation occurred. It was left running and untouched; all subsequent checks used the isolated ports.

Browser checks used agent-browser at 1366×900. R10 also had no horizontal page overflow at 1280×800 and 1366×800. The React skill review checked semantic labels/lists, preserved state/update handlers, direct imports, escaping of authored content, stable existing ordering and absence of new effects or domain calculations.

Verified through browser interactions:

- Entry/join; student workspace; Evidence, Documents, Advisors and People tabs.
- R6 threshold inputs empty, with no placeholder.
- Exact R8 rollback readback: the fixture team's recorded `{"threshold":10,"authority":"CIO"}`.
- CLEARPATH_ALL contains exactly 63 listing rows, without sorting/ranking changes.
- Board deck versions initially remain behind closed file properties; Version 3 is reachable there, not added as a standalone document.
- Readiness page controls reached “Page 9 of 14” and the $200,000 text; the next page retains the authoritative-body-not-supplied placeholder.
- R10 metrics render readable values rather than JSON; decision-return anchor resolves to `#decision-workspace`.
- Completed debrief has an expanded readable Decision Log. Closing beat is the final main-content element; final text is “You are not there.”
- Instructor sign-in/game selection, 12 teams, refresh, corrected submission (HTTP 200 and “Corrected” shown), override confirmation and cancel.
- Disposable R1 submission succeeded; the UI shows “Submitted” and waits for instructor release.
- No final browser runtime error or Vite error overlay was reported.

Early automation failures (PowerShell argument quoting, off-screen click targeting and invalid text-wait selectors) were investigated and replaced with explicit viewport positioning and observed selectors. They are not counted as successful checks. The underlying correction request was independently confirmed as HTTP 200. Transient hot-reload errors while deleting the retired CSS files disappeared after a fresh navigation; final build/browser checks used the consolidated stylesheet.

### Pre-existing R8 dashboard limitation — not fixed

The real R8-open browser view contains **zero** indicator articles because no readiness indicators are supplied at that point. This is present in baseline code too:

- `src/domain/engine.ts`: assigns `state.readinessIndicators=dashboard(state)` when resolving round 8.
- `src/application/projections.ts`: projects those indicators only when `activeRound===8`.
- The existing decision component only maps the supplied optional indicators.

Phase 8 does not change any of those data/state rules. A component regression verifies that **when four indicators are supplied**, all four render separately, without a composite score or cause. That test is not evidence that the current R8-open data flow supplies them. Correcting their availability would cross the protected mechanics/projection boundary and needs separate authorization/specification. No indicator was fabricated for the real browser walkthrough.

## Protected-requirement checklist

| Requirement | Evidence/status |
|---|---|
| R6 threshold: blank, no default, no placeholder/range hint | Preserved; real browser values empty and placeholder null; component test. |
| R8 team's own R6 rollback words beside controls | Preserved byte-for-byte in browser; no paraphrase/parser change. |
| Four separate readiness indicators, no composite | Renderer preserved and component-tested; real R8-open availability limitation above remains unresolved. |
| Fourth indicator label/range, never cause | Renderer still uses only label/status/consequenceRange, not cause; no projection/domain change. |
| R10 metrics from existing R3 data without inheritance wording | Same projection/props, readable list verified; no inheritance/recommendation text. |
| Paginated readiness assessment | Browser reached page 9 of 14 and $200,000; placeholders remain. |
| 63-item folder, exact disorder/duplicates | Browser count 63; existing Phase 4 filename/order tests pass; artifact/catalog source untouched. |
| Board v3 only through file properties | Browser properties/versions interaction preserved; no new ordinary folder entry. |
| Fixed advisor order; no valence sort/aggregation/consensus | Browser order matches existing six-advisor projection; no advisor logic change. |
| Panel three bare unranked list | Names-only list structure unchanged; explicit new regression. No icons, groups or importance colors. |
| No new hidden-score/trust/risk cues | No hidden data added to projections or UI. Colors indicate public open/submitted/accessed/selected/error states only. Existing approved debrief movement charts remain unchanged. |
| Closing beat last, nothing below | DOM check and regression; no footer/actions inserted afterward. |

## Test/build results

| Command | Result |
|---|---|
| `npm.cmd install` | Up to date; 0 reported vulnerabilities; no dependency/lockfile content changes. |
| `npm.cmd run typecheck` | PASS |
| `npm.cmd run lint` | PASS; zero warnings |
| `npm.cmd test` | **513 passed, 26 skipped, 539 total; no failures** |
| `npm.cmd test -- --run test/golden.test.ts` | **9/9 passed** |
| `npm.cmd run build` | PASS; backend JavaScript and Vite production output built |
| `git diff --check` | PASS |

`TEST_DATABASE_URL` is absent. The 26 PostgreSQL integration cases were skipped, **not passed**. Executed golden, phase, final-acceptance, UI, SQLite legacy and non-live-PostgreSQL regression checks passed. Historical databases were not used; existing SQLite tests use disposable test files.

Added 14 Phase 8 tests: lossless nested/empty rendering; authored text and enum separation; order/units/precision; HTML escaping; Decision Log; non-submissions; metrics/no provenance; R6/R8 render invariants; round orientation; final closing beat; scenario/advisor/secrecy preservation; packaging exclusions; friendly transport messages; existing API validation/request contract.

Updated one Phase 7 cleanup assertion that required the old four-CSS import order: it now verifies the authorized single-stylesheet consolidation and removal of retired files. No golden fixtures or mechanics assertions were changed.

## Packaging hygiene

- `git ls-files dist files .bpm-data` returned no tracked files.
- `git check-ignore` confirms all three paths excluded.
- Packaging script excludes all three root directories; it was inspected/tested, not executed.
- No databases, runtime transcripts, .env, credentials, build output, node_modules or screenshots are staged.
- Temporary screenshots and the browser helper stay outside the repository; the in-repository preview helper was deleted.
- No database selection or Render/Vercel configuration changes.

## Exact changed files

Modified:

- `.gitignore`
- `scripts/package.ps1`
- `src/web/App.tsx`
- `src/web/api.ts`
- `src/web/components/DebriefV6.tsx`
- `src/web/components/DecisionWorkspaceV6.tsx`
- `src/web/components/InstructorDashboard.tsx`
- `src/web/components/Shell.tsx`
- `src/web/components/StudentDashboardV6.tsx`
- `src/web/styles.css`
- `test/phase7-final-cleanup.test.ts`

Added:

- `src/web/components/ReadableValues.tsx`
- `test/phase8.test.ts`
- `reports/PHASE8_VERIFICATION_REPORT.md`
- `bpm phase8 ui tidy.md` — supplied authoritative specification, unchanged contents, now versioned.

Removed after consolidation:

- `src/web/document-readability.css`
- `src/web/documents-debrief.css`
- `src/web/entry-instructor.css`
- `src/web/round-progression.css`

## Before/after screenshot evidence

These are actual screenshots of disposable local games, not mockups. Absolute links refer to local review evidence outside Git, as requested; GitHub viewers cannot retrieve these local files. Screenshots are not committed or packaged.

| Screen | Before | After |
|---|---|---|
| Student entry | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-entry.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-entry.png) |
| R1 workspace | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-workspace.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-workspace.png) |
| Evidence | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-evidence.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-evidence.png) |
| Documents | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-documents.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-documents.png) |
| Advisors | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-advisors.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-advisors.png) |
| People | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-people.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-people.png) |
| R6 | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-r6.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-r6.png) |
| R8 (existing missing indicators) | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-r8.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-r8.png) |
| R10 metrics | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-r10.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-r10.png) |
| Expanded Decision Log | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-debrief.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-debrief.png) |
| Closing beat | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-closing.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-closing.png) |
| Instructor login | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-instructor-login.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-instructor-login.png) |
| 12-team instructor list | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-instructor.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-instructor.png) |
| Correction form | [Before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-correction.png) | [After](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-correction.png) |

Additional after screenshots: [folder](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-folder.png), [board version history selection](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-board-v3.png), [readiness page nine text](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-readiness-page9.png), [saved correction](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-correction-saved.png), [override confirmation](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-override-confirmation.png), [submitted round](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-submitted.png).

### Student workspace

![Student before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-workspace.png)

![Student after](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-workspace.png)

### Instructor team list

![Instructor before](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-before-instructor.png)

![Instructor after](C:/Users/ruchi/.codex/visualizations/2026/09/02/01a060f0-5e55-73c3-a4a8-3f42f47485a8/phase8-after-instructor.png)
