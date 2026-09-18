# Phase 6 Implementation Report

## Scope and status

Phase 6 is implemented and verified. This pass changed only student-readable artifact presentation, student-facing validation messages, conversation continuity, and the no-crisis Round 9 Benefit Review with its Round 10 consistency rule. It did not perform a second cold run and did not create a ZIP.

## Files changed

- `src/domain/types.ts`
- `src/domain/config.ts`
- `src/domain/schemas.ts`
- `src/domain/engine.ts`
- `src/domain/conversations.ts`
- `src/application/service.ts`
- `src/application/projections.ts`
- `src/application/errors.ts`
- `src/server/index.ts`
- `src/web/App.tsx`
- `src/web/api.ts`
- `src/web/rounds.ts`
- `src/web/components/DecisionWorkspaceV6.tsx`
- `src/web/components/StudentDashboardV6.tsx`
- `src/web/components/DebriefV6.tsx`
- `src/web/phase6.css`
- `test/golden.test.ts`
- `test/phase3-revisions.test.ts`
- `test/phase6.test.ts`
- `PHASE6_IMPLEMENTATION_REPORT.md`

## Document presentation

Artifacts now render as student-readable objects rather than persistence JSON. Contracts render as clauses, presentations as numbered slides, and the readiness assessment retains `Page n of 14` navigation. CLEARPATH_ALL renders as the intentionally disorderly 63-entry shared-drive listing with the supplied names, ordering, duplicates, capitalization, `OLD_donotuse`, `Copy of...`, competing `FINAL` names, and `ANALYSIS_DRAFT_v2_JR.docx`. No search, filtering, ranking, or importance hints were added. Board Deck Version 3 remains accessible only through file properties/version history.

## Validation

Zod validation remains authoritative, while API responses translate validation failures into plain student language. Verified messages include invalid choices and whole-number requirements. Schema structures, stack traces, and database details are not returned to the student UI.

## Conversation continuity and persistence

Advisor conversations use prior actor-specific transcript history. After a student answers an advisor follow-up, the advisor acknowledges the answer and advances instead of repeating the original prompt. The six-advisor order, scoring, stance calculation, calibration, forbidden vocabulary, and hidden rationale/focus fields are unchanged.

Stakeholder direct factual answers still take precedence, including on later turns. Non-direct later turns advance without replaying the opening prompt. Trust, disclosure, contact, Reyes discovery, and low-trust truthfulness rules remain authoritative. Automated and browser checks confirmed conversation history across refreshes; SQLite reload tests confirmed persisted multi-turn transcripts and instructor-accessible source records.

## Round 9 no-crisis Benefit Review

When no crisis exists, Round 9 accepts:

- `presented_figure.figure_type`
- optional numeric `figure_usd` only for `decline_to_quantify`, otherwise required
- required free-text `basis_text`
- zero to four authoritative `disclosure_items`

The fields begin blank and have no suggestion, range hint, or default answer. When one or more crises exist, the original crisis response schema and attention mechanics remain in force.

### Exact scoring

`disclosure = disclosure_items.length / 4`

For a numeric figure, `ratio = figure_usd / defensible_benefit_usd`. The initial implementation awarded `1.0` to all ratios through 1.0; the authoritative September 14 correction below replaces that low-side plateau for new configuration snapshots. Upper bands remain `0.6` through 1.25, `0.3` through 1.60, and `0.0` above 1.60. The unchanged completeness heuristic halves basis when text is under 40 characters or lacks a period/data-reference keyword. It is not proof of financial support and does not separately require punctuation. Declining to quantify retains fixed basis `0.7`.

Type scores are: range `1.0`, defensible today `0.85`, decline `0.6`, projected run rate `0.25`.

`total = disclosure × 0.50 + basis × 0.30 + type × 0.20`

Board movement is `round(-5 + 20 × total)`. Financial movement is `round(-6 + 16 × basis)`. Sponsor type movements are projected `+4`, defensible `0`, range `-3`, and decline `-9`. Numeric figures independently receive carried-commitment shortfall movement of `0`, `-4`, or `-8`; decline skips shortfall scoring.

The pre-sustainment Round 9 defensible comparator is calculated through the existing benefit pipeline using full four-item sustainment retention solely to establish the review basis. It does not write realized or defensible benefit into team state before Round 10.

### Hidden score

`hiddenScores.benefit_review` contains exactly:

```text
{ disclosure, basis, type, total }
```

It is available to instructor diagnostics and absent from student projections.

## Configuration snapshot

Every game snapshot stores:

```text
benefitReviewWeights = { disclosure: 0.50, basis: 0.30, type: 0.20 }
figureChangeThresholdPercent = 15
unexplainedChangeBoardCredibilityPenalty = 10
```

SQLite reload reproduces these values.

## Round 9 to Round 10 consistency

The persisted Round 9 numeric figure becomes the Round 10 baseline. Absolute relative change at or below exactly 15 percent has no penalty. A change above 15 percent in either direction applies `-10` board credibility unless explained. Declining to quantify creates no numeric baseline and skips comparison. The September 14 correction makes the optional free-text explanation always visible at R10. Nonblank `board_narrative.figure_explanation` supplies the explained state; whitespace alone does not. Historical submissions without that text field retain the existing `figure_change_explained` boolean behavior. The UI neither calculates nor displays the scoring boundary.

## Crisis preservation

The no-crisis branch is conditional on an empty crisis list. Existing containment, disclosure, rollback, attention budget, crisis selection, damage calculations, and crisis decision payloads were not changed. Regression coverage confirms the crisis schema remains separate from the Benefit Review.

## Automated verification

- Full suite: **304/304 passed** across 12 files.
- Phase 6 focused suite: **26/26 passed** (32 net new assertions/tests across the full suite after updated compatibility fixtures).
- Golden suite: **9/9 passed**.
- Typecheck: passed.
- ESLint: passed with zero warnings.
- Production build: passed.

Coverage includes readable artifacts, 63-entry preservation, Board Deck v3, validation, advisor and stakeholder continuation, refresh/SQLite persistence, all scoring components and bands, scalar movements, sponsor effects, decline, exact 15 percent, upward/downward changes, explained changes, hidden-score secrecy, R9 propagation, config persistence, crisis preservation, and inherited Phase 3/4/5 tests.

## Browser verification

Observed in the running application:

- CLEARPATH_ALL displayed all 63 deliberately messy entries without search or ranking.
- Board Deck v4 opened as 22 readable slides; version history exposed Version 3, whose savings-composition slide then rendered.
- Blank Round 9 submission returned `Please choose one of the available options for figure type.` rather than an internal validation object.
- An advisor’s second turn acknowledged the answer and advanced; both turns survived reload.
- Kubiak answered a direct factual question truthfully, continued the exchange, and the transcript remained available.
- A disciplined no-crisis game reached Round 9, displayed the Benefit Review workspace, accepted the range, figure, basis, and four disclosures, locked the successful submission, and persisted it.
- Instructor release opened Round 10; the persisted R9 figure drove the consistency UI, while the existing R3 monitoring metric appeared without origin language.
- Student views showed no hidden score components, rationale tags, focus levers, crisis-selection details, or internal rule traces.

## Preservation

All existing Phase 3 outcome/risk/benefit mechanics, Phase 4 debrief and access semantics, and Phase 5 instructor/persistence behavior continue to pass their regression suites. The 420-row advisor audit was not modified. No schema migration was needed, no persisted games were reset, and no missing artifact or scenario content was invented.

## Unresolved items

The existing documented content placeholders remain unchanged. A second human cold run was reported by the project owner; this report records only its supplied Round 3 Analysis finding and does not fabricate additional observations.

## Round 3 Analysis document fix

### Cold-run finding and root cause

The supplied second-cold-run finding was reproduced: from Round 4 onward, the generated `Round 3 analysis` appeared in Documents but its Open control produced no visible result. The artifact uses a generated team-specific ID and is not a member of the static evidence catalog. The shared access service therefore passed that ID through ordinary evidence validation, which rejected it before artifact access could run. The generated artifact also persists its student-facing bottleneck map and metric set in `studentContent`, while the Phase 6 generic document renderer expected `content`.

### Targeted correction

- `SimulationService.evidence()` now selects the artifact-specific access path when the ID belongs to a persisted team artifact. Static evidence continues to use unchanged evidence validation.
- `markArtifactAccess()` creates the generated artifact access record only when the student opens it and records `accessed: true`.
- `closeRound()` carries persisted/generated artifact access records across replay so opened state survives later round releases.
- `artifactStudentView()` uses persisted `studentContent` as opened content only for `round3_analysis`.
- The document viewer renders separate readable Bottleneck map and Metric set sections without persistence JSON.
- Open failures show `This document could not be opened. Please try again.` without internal details.

### Verification

Focused tests cover initial non-access, artifact routing, access-record creation, student projection, SQLite reload, round-transition persistence, semantic rendering, safe failure messaging, ordinary evidence, Board Deck Version 3, and CLEARPATH_ALL. Golden coverage continues to verify that the submitted R3 metric set reaches R10.

- Full suite: **310/310 passed** across 12 files.
- Focused Phase 6 suite: **38/38 passed**.
- Golden suite: **9/9 passed**.
- Typecheck: passed.
- ESLint: passed with zero warnings.
- Production build: passed.

A dedicated persisted browser-verification game was advanced through R4–R10. Round 3 Analysis opened at R4, R5, and R6 and displayed the submitted bottleneck values and metric set as readable fields. Its opened state survived reload and remained rendered after releases into R7, R8, R9, and R10. A canonical board presentation still opened as slides. The browser reported zero console warnings or errors.

## Second Cold-Run Runtime Follow-Up

### Source implementation status

The Phase 6 source correction for the dynamic Round 3 Analysis artifact was already present on disk. It routes persisted team-artifact IDs through artifact access, creates access state only when opened, persists that state across later rounds, projects `studentContent`, and renders the Bottleneck Map and Metric Set as readable content. No additional source-code correction was required during this follow-up.

### Runtime incident

During the second participant cold run, Round 3 Analysis initially failed to open. The student saw: `This document could not be opened. Please try again.`

Investigation established that the participant browser was using the current Vite frontend on port 5173 while API requests still reached a stale backend process on port 3001. The old backend, PID 19260, had started before the Round 3 Analysis source correction and therefore did not have the corrected implementation loaded. The persisted artifact and its student-facing content were present; the failure was not caused by missing artifact data.

### Follow-up verification

The stale backend process was terminated and the current backend was started from the current workspace. The participant then opened Round 3 Analysis successfully in Round 4 and continued to open it successfully in Rounds 5 through 10. Its opened state remained available across later rounds, and the Bottleneck Map and Metric Set rendered as readable student-facing content without raw JSON.

No simulation mechanics were modified during the runtime resolution. No participant data was reset, rewritten, or fabricated.

## Authoritative Phase 6 corrections — September 14, 2026

Source: `bpm_phase6_corrections.md`, read in full before edits. These corrections follow the previously completed cold run; no new human cold run was conducted during this pass. The existing ZIP predates these corrections and is no longer the final delivery artifact.

### R10 explanation and threshold audit

The threshold-triggered checkbox was replaced with an always-present optional textarea labelled “Anything you want the committee to understand about how this figure was arrived at. (Optional)”. Its contents are preserved in the submitted decision. An empty/whitespace-only field is unexplained; nonblank text is explained. Legacy boolean submissions remain compatible. The 15% comparison, exact boundary, penalty magnitude, and decline exception are unchanged.

Student components, decision controls, entry, navigation, conversation/document views, and debrief were inspected for threshold-dependent visibility, disabled states, labels, and warnings. No other hidden-scoring-threshold control was found. Existing budget validation, decline-to-quantify input behavior, document gates, advisor/stakeholder availability, crisis decision branch, and instructor release are legitimate state-dependent behavior and were preserved. No hidden scoring bands, comparison percentages, penalties, or internal advisor context are projected to students.

### Exact basis bands

| Presented / defensible ratio | Numeric basis before text heuristic |
|---|---:|
| 0 through 0.3 inclusive | 0.3 |
| Greater than 0.3 and below 0.6 | 0.6 |
| 0.6 through 1.0 inclusive | 1.0 |
| Greater than 1.0 through 1.25 inclusive | 0.6 |
| Greater than 1.25 through 1.6 inclusive | 0.3 |
| Greater than 1.6 | 0.0 |

The two new low bands reuse the existing 0.6 and 0.3 score levels and the authoritative approximate ratio boundaries. This preserves the existing stepped shape and upper-side spacing while removing the peak score at arbitrarily low claims. The new values are stored in `benefitReview.lowerBasisBands` in new game configuration snapshots. Older snapshots without these values retain their original basis behavior for deterministic historical replay; no persisted game is migrated or rewritten. The weights remain 0.50/0.30/0.20. Decline and the existing text heuristic are unchanged.

### Brennan and sponsor confidence

Brennan compares the submitted no-crisis R9 figure with the same existing pre-review defensible comparator used for basis scoring. Below the configured peak-minimum ratio he asks why the figure is below what the team can defend. Subsequent turns ask about omitted benefit and reconciliation rather than replaying the opening question. This is internal conversation context, not a change to the stance contract, coefficients, component scores, or calibration. It applies once a numeric R9 submission exists; drafts are not sent to advisors. Other advisors and stakeholder behavior are unchanged.

The existing carried-commitment shortfall mechanism was preserved. With a defensible comparator of $9,880,248.824651442 and a presented figure of $3,293,416.274883814 (one third), basis is 0.6 and the existing `benefit_review_shortfall` produces -8 sponsor confidence. The same case was verified through the service and isolated browser setup. This remains a comparison to the explicit R1 commitment, or the inherited $12M when no commitment was made; it is not a second comparison to defensible benefit. A claim below defensible benefit but above a lower carried commitment does not acquire a new sponsor penalty.

### Verification and preservation

- Added 32 focused regression cases covering optional rendered explanation controls, absence of UI comparison logic, both lower band boundaries, preserved upper bands, old-snapshot compatibility, exact text-heuristic behavior, R10 free-text persistence and consistency scoring, real-service Brennan continuity, unchanged advisor results, sponsor shortfall, and student secrecy. The prior snapshot assertion was updated only to include the newly authorized configuration values.
- Full suite: 342/342 passed across 12 files.
- Focused Phase 6 suite: 70/70 passed.
- Golden suite: 9/9 passed.
- Typecheck: passed. Lint: passed with zero warnings. Production build: passed.
- Browser verification used the production build on an isolated in-memory server at port 3106, with normal student entry and application routes. No participant database was connected. The R10 explanation appeared before editing and remained present at $3,293,416 and $5,000,000. Two Brennan messages were rendered: “The figure is substantially below what you can defend. What accounts for the difference?” followed by “Which part of the defensible benefit have you left out, and what evidence supports leaving it out?” The free-text explanation submitted successfully and the UI displayed Submitted. No hidden scoring diagnostics or thresholds appeared in the student view; browser error and console checks returned no application errors.
- Phase 3 outcome logic is untouched: A Squeak Through, B Disaster, C Win with Scars, D Triumph; `scarred` remains required and no Win-with-Scars upper ceiling or scenario overrides were introduced. Existing golden and Phase 3/4/5 regression suites pass. Debrief, Panel 3, stakeholder series/gates, artifacts, discovery, budgets, R8, R10 monitoring, instructor release, team entry, and ownership were not edited. Benefit realization and crisis formulas were not changed.
- Readiness pages 10–14 and ten unspecified vendor-slide bodies remain unsupplied. No content or participant findings were fabricated. No ZIP was created, and no real participant/cold-run database was changed.

COLD RUN READY — A SECOND COLD RUN WITH A DIFFERENT PARTICIPANT IS REQUIRED.

PHASE 6 CORRECTIONS IMPLEMENTED — READY FOR SECOND COLD RUN.

No R3 submission/scoring rule, benefit or outcome calculation, advisor or stakeholder behavior, debrief/Panel 3 rule, Phase 5 behavior, or other approved Phase 3/4 mechanic changed. Existing cold-run games were not reset or rewritten, and no schema migration was required.

## Second Cold-Run Follow-Up

The project owner now confirms completion of the second cold run with a different participant. See `PHASE6_SECOND_COLD_RUN_REPORT.md` for supplied observations, source investigation, evidence limits, and deferred findings. Earlier readiness statements above are historical; no implementation history has been rewritten.

Opened-document persistence is PASS / EXPECTED. R10 Metric Monitoring JSON and expanded Decision Log JSON are readability defects, not demonstrated hidden-scoring leaks. The completed-game R10 workspace is a usability defect: submission is disabled and the normal backend duplicate guard rejects another R10 submission, although local fields remain editable. A separate source-established caveat concerns loss of canonical version/page access history during round closure, potentially affecting Panel 3.

All four follow-up issues (metric JSON, log JSON, completed workspace, and canonical access-history preservation) are **Deferred — awaiting Sir's decision.** None was fixed during documentation/packaging. No participant data was altered and no new cold run was conducted.

The recorded verification baseline remains 342/342 full tests, 9/9 golden tests, typecheck passed, lint passed with zero warnings, and production build passed. Tests were not rerun during this operation. Package description: **Phase 6 corrections package — awaiting Sir's decision on second cold-run follow-up findings.**

## Final closeout — September 15, 2026

Authority: `bpm phase6 closeout.md`, read in full. This section records only the completed-game decision-surface correction and completed-submission invariant. It does not supplement or reconstruct participant observations. The panel-three question remains for the pilot; no additional cold run was performed.

### Root cause and exact UI correction

`closeRound()` already sets `game.status` to `completed` at R10. The student projection already includes that status and the debrief. `App.tsx` previously rendered the debrief followed by an unconditional `StudentDashboard`, which mounted `DecisionWorkspace` even after completion.

`App.tsx` now delegates the active/completed presentation boundary to `StudentExperience`. The existing `game.status` is the only completion state: non-completed games render the unchanged active dashboard and release message; completed games render the existing outcome/three-panel `Debrief` followed by the closing beat, with no active dashboard, workspace, form, lever controls, or submit button mounted. R10 after submission but before instructor completion retains its previous Submitted presentation.

Inspection also established that the closing beat was supplied in `../design/bpm_week10_content.md`, section 5, but was not wired into the V6 renderer. The completion boundary now renders its two paragraphs verbatim, ending with “You are not there.” No closing text was rewritten or invented, and no score or decision surface follows it. The existing debrief component and JSON rendering are unchanged.

### Backend completed-game submission verification

The sole submission API route is `POST /api/games/:id/teams/:teamId/submissions`. It authorizes the team, invokes `SimulationService.submit()`, then domain `submit()`, saving only after success. Previously rejection depended on an existing same-round submission; status alone did not prevent submission to a completed object without that record. Domain `submit()` now rejects completed status before team/schema/duplicate checks with the existing plain-error convention: `This game is complete. No further decisions can be submitted.` Normal active-round validation and immutable-submission checks are otherwise unchanged.

Focused tests cover rejection with and without a prior R10 record, unchanged state after rejection, the service boundary with no save, and successful active R10 submission. An actual request to the production server routes on isolated port 3116 returned HTTP 400 with `{"error":"This game is complete. No further decisions can be submitted."}` after completion. The submission count remained 10. No participant database was used.

### Regression and browser verification

- Added `test/phase6-closeout.test.ts`: 20 focused tests for absent completed workspace/inputs/submit affordance; preserved outcome and three panels; exact closing text and final ordering; active R1–R9 and R10 rendering; submitted-but-not-completed R10; domain/service rejection; and active service acceptance.
- Full suite: 362/362 passed across 13 files. Golden suite: 9/9 passed. Typecheck passed. Lint passed with zero warnings. Production build passed. An initial typecheck mismatch in the new test helper was corrected without changing application projections; final typecheck/build passed.
- Browser verification used the production build and unchanged production API routes with a disposable SQLite fixture under the operating-system temporary directory, on port 3116. It was an automated verification fixture, not a participant or cold run. The fixture entered active R10 through Game ID/team-code entry, submitted through the normal UI, displayed Submitted before completion, and reached the completed view after instructor-close API and reload.
- Final outcome and all three panels were visible. Scrolling to the bottom showed the exact closing beat last. DOM inspection found zero inputs/textareas/selects/buttons/forms and zero decision workspaces. No Round 10 submission prompt remained. Captured browser warning/error logs were empty. Node's existing experimental SQLite warning is unrelated to the UI change.

### Preservation and scope

The React review checklist was applied to the two edited/added TSX components: the completion boundary is a module-level component, derives directly from existing status, adds no effects or state, and does not mount hidden decision controls.

Phase 3/4/5 and existing Phase 6 tests remain passing: outcomes/scarred gate/no upper ceiling, benefits, crisis selection, debrief/Panel 2/Panel 3, conversations, artifact access, readiness, Board Deck v3, CLEARPATH_ALL, advisor consultation/persistence, student entry, instructor release, locked rounds, transcripts, R9 Benefit Review, R9–R10 consistency, explanation, basis bands, Brennan, sponsor shortfall, secrecy, and Round 3 Analysis. No scoring, content source, configuration, projection, persistence schema, or access rule was changed.

R10 Metric Monitoring JSON, Decision Log JSON, and canonical version/page access-history preservation were deliberately NOT changed. Historical reports are retained. The old ZIP was not rebuilt and does not contain this closeout correction. No real participant/cold-run data was seeded, migrated, reset, replayed, or modified. Temporary isolated test fixtures were used only for verification.

PHASE 6 FINAL DEFECT FIXED — READY FOR FINAL VERIFICATION

## Canonical Access-History Persistence Correction

Authority: `bpm deferred decisions.md` (Deferred Items — Decisions), read in full before implementation. Only item 1, access-history durability, is implemented in this pass. No participant or cold-run observations were added, and no ZIP was created or replaced.

### Investigation before implementation

The complete flow was traced: `StudentDashboardV6` document/version/page interaction → `api.access()` → authenticated `POST /api/games/:id/teams/:teamId/evidence/:evidenceId/access` → `SimulationService.evidence()` → `markArtifactAccess()` or `accessEvidence()` → `currentState.evidence` → round closure/replay → repository save → SQLite load → `studentProjection()` / `studentDebrief()` / `neverSaw()`.

`EvidenceState` contains exactly `id`, `available`, `discovered`, `accessed`, optional `accessedVersions`, and optional `accessedPages`. There are no additional timestamp, visit-count, or separate access-event-history fields. Identity and availability are not proof of access. `markArtifactAccess()` writes `accessed: true` and adds an explicitly requested version/page to the corresponding ordered, de-duplicated array. It creates an access record for a known generated artifact when absent. Ordinary `accessEvidence()` sets the existing evidence record's accessed flag. No open behavior was changed.

Before this correction, `closeRound()` rebuilt state with `replayTeam()` and merged only `accessed` and `discovered` for existing canonical evidence IDs. It lost `accessedVersions` and `accessedPages`. Generated Round 3 Analysis records use IDs absent from the static replay state and already took a whole-record-copy branch; that close-round behavior was correct. The separately exported `replayGame()` did no access merge, so explicitly replaying a game also discarded independently recorded ordinary accessed/discovered flags and generated artifact records, not just version/page arrays.

SQLite was not the source of loss: `writeGame()` serializes the entire `currentState` into `teams.current_state`, and `loadTeam()` parses it intact. Artifact content is separately stored under team-scoped artifact keys. Once replay removed a field, saving faithfully stored the already-truncated state. No schema or repository change was necessary.

### Exact Panel 3 dependency scope

| Panel 3 input | Existing use | Persistence conclusion |
|---|---|---|
| `evidence[id].accessed` | Analyst memo, Ferrara working aid, Boyce database, stale weekend feed | Already retained by normal close; lost by explicit game replay before this fix |
| `doug_board_deck.accessedVersions` includes `v3` | Board Deck v3 inventory predicate | Lost by canonical close/replay before this fix |
| `readiness_assessment.accessedPages` includes `9` | Page 9 inventory predicate | Lost by canonical close/replay before this fix |
| Transcript `actorId` / `actorReply` | Reyes contact and authoritative stakeholder disclosures | Retained independently; unchanged |
| Round narrative `variantId` | Observation-thread / Sylvia disclosure beats | Existing deterministic narrative reconstruction unchanged |
| R4 submission framing / R5 design-room values | Existing Kubiak / Walters predicates | Immutable submissions retained; unchanged |

Panel 3 does not read `available` or `discovered` as access proof. The latter remains preserved under the existing discovery merge. No Panel 3 predicate, label, proxy, or meaning was changed. The additional replay exposure of ordinary access flags was included because it directly affects these same Panel 3 inputs.

### Smallest correction

`src/domain/engine.ts` now contains one shared `preserveAccessHistory()` helper called immediately after reconstruction in `closeRound()` and `replayGame()`.

- Existing boolean merge behavior for `accessed` and `discovered` is retained.
- Existing version/page arrays are copied when present, preserving their exact values/order and avoiding shared array references.
- The existing whole-record-copy fallback remains restricted to IDs belonging to the team's artifacts.
- Reconstructed canonical availability is not overwritten, and absent history is not synthesized.
- `replayTeam()` remains a pure submissions/configuration reconstruction. It has no access-event input from which to invent visits; the existing game/team record is preserved at its game-level callers.
- Historical snapshots, numerical results, narrative evaluation, scoring, configuration, projections, and persistence formats are unchanged. No late access is injected into earlier narrative evaluation.

### Regression and SQLite verification

Added `test/access-history.test.ts` with 22 focused cases. Coverage includes canonical opens; explicit version/page recording; flags and ordered arrays through close; array-copy isolation; every subsequent round through completion; correct Panel 3 exclusions for opened v3/Page 9; retained unopened inventory; unavailable artifacts remaining unavailable; generated Round 3 Analysis; explicit replay/idempotence; all four ordinary Panel 3 evidence flags; unchanged numerical results/narratives/non-evidence state; and student-projection secrecy.

Isolated SQLite tests close and reopen repositories, continue through later rounds, complete the game, save an explicit replay, and reopen again. The original access records remain equal, including generated analysis history. Negative coverage opens Board Deck v3 but never the readiness assessment: after close/completion/reload, the board remains accessed, readiness remains unaccessed, and Panel 3 distinguishes them. Other negative coverage opens only board v4 and assessment page 1; v3 and page 9 remain correctly listed as unseen.

Initial focused execution caught an incorrect expected error string in the new unavailable-artifact test: the existing service correctly returned `Evidence unavailable` before that artifact's release, not `Artifact unavailable`. Only the new test expectation was corrected; availability behavior was not changed.

Final verification: **384/384 tests passed across 14 files**, including all 22 new cases; **9/9 golden tests passed**; typecheck passed; lint passed with zero warnings; production build passed. Existing Node experimental SQLite warnings are unrelated to this change.

### Browser and Panel 3 verification

The browser-verification workflow used the current production build and production API routes at port 3118 with a newly created disposable verification database under the operating-system temporary directory. It was not a participant or cold run. The browser CLI was unavailable; the available browser-control tool was used instead.

1. At R1, opened the normal board deck, expanded file properties/version history, and clicked Version 3. The savings-composition slide rendered.
2. Submitted and closed R1–R6 through the normal isolated API routes. At R7, stored board history remained `["v3"]`; the browser reloaded and still displayed the v3 savings-composition slide.
3. Opened Readiness Assessment and navigated pages 1 through 9 using Next. Page 9 displayed the authoritative $200,000 East Campus passage.
4. Closed R7 and R8. At R9, version history remained `["v3"]`, page history remained `[1,2,3,4,5,6,7,8,9]`, and the untouched analyst memo remained `accessed: false`.
5. Completed R9/R10 through the isolated API. After browser reload, Panel 3 omitted the genuinely opened v3 and Page 9, and retained the genuinely unopened memo. The final closing beat remained last, with zero decision inputs.
6. Captured browser warning/error logs were empty. SQLite tests separately verified repository close/reopen durability rather than relying solely on browser memory.

### Preservation and limitations

Phase 3 outcome tiers, scarred gate, absence of a Win-with-Scars ceiling, benefits, and crisis mechanics remain unchanged and their regression suites pass. Phase 4 three-panel structure, Panel 2, stakeholder conversations, artifact/readiness/Board Deck/CLEARPATH semantics, and Panel 3 predicates are unchanged; only the durability of their evidence inputs is corrected. Phase 5 entry, ownership, advisors/history, instructor release, locks, and transcripts remain unchanged. Phase 6 R9 Benefit Review, consistency threshold/explanation, basis bands, Brennan, sponsor shortfall, document rendering, generated analysis behavior, secrecy, and completed-game closeout remain unchanged and passing.

R10 Metric Monitoring JSON, expanded Decision Log JSON, and completed-game UI/editable-field behavior were NOT changed. The second cold-run report and authoritative content were not edited. No participant database was migrated, reset, rewritten, or replayed. The implementation preserves records still present; it cannot reconstruct access history already erased in an older game without authoritative evidence, and no retrospective access was inferred.

CANONICAL ACCESS-HISTORY FIX IMPLEMENTED AND VERIFIED — READY FOR PACKAGING
