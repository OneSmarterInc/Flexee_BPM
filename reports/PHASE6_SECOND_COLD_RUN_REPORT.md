# Phase 6 second cold-run report

## Status and evidence boundaries

Phase 6 corrections implemented + second cold-run findings documented.

The project owner reports that a second cold run with a different participant is complete. This report records that supplied human evidence and the subsequent read-only source investigation; it is not a new cold run. No participant was created, interviewed, coached, or replayed during documentation/packaging. No participant database was altered.

Sources: the owner's second-cold-run observations and packaging instructions; the preceding investigation; `PHASE6_IMPLEMENTATION_REPORT.md`; current projections, engine, artifact access, and V6 components; existing Phase 6 tests. Exact participant identity, timestamps, timings, decision values, scores, final tier, and verbatim interview answers were not supplied for this report and are not inferred from automated paths.

The implementation report's earlier READY FOR SECOND COLD RUN statements are historical. The owner now confirms completion. The earlier runtime incident described there is preserved as history, not presented as a new observation of the corrected run.

## A. Implementation completed before the reported run

The current accepted corrections and prior verification record establish:

- R10 explanation is always visible, optional, and neutrally worded, with no threshold-dependent visibility.
- The recorded hidden-threshold audit found no additional hidden-scoring-threshold controls.
- Numeric basis bands: ratio <= 0.3 gives 0.3; > 0.3 and < 0.6 gives 0.6; 0.6–1.0 gives 1.0; > 1.0–1.25 gives 0.6; > 1.25–1.6 gives 0.3; > 1.6 gives 0.0. These are instructor/developer report details, not student content. Historical configuration-snapshot compatibility is unchanged.
- Brennan responds to materially low presented claims and advances through distinct follow-up questions. Advisor scoring is unchanged.
- Existing carried-commitment shortfall behavior remains; the underclaim test verified sponsor-confidence movement without introducing a second sponsor penalty.
- The basis-text check remains unchanged and is a completeness heuristic, not a substantive evaluation of evidence quality.
- Recorded baseline: 342/342 full tests, 9/9 golden tests, typecheck passed, lint passed with zero warnings, production build passed. These are prior verified results, not tests rerun during this packaging operation.

## B. Participant flow and observation limits

| Stage | Reported flow / evidence | What is not established |
|---|---|---|
| Entry | Game ID/team-code entry worked for the participant. | Exact entry values and timing are not reproduced. |
| R1 | Participant entered successfully; discovery of Evidence, Documents, Advisors, and People was reported as working. The run proceeded through the opening round. | No detailed reading sequence, exact decision, or verbatim reaction was supplied. |
| R2–R8 | The participant continued using documents, advisors, people, evidence, and decision workspace and continued submitting rounds. Student-readable documents generally, multi-turn advisor continuity, and student-friendly validation were reported as working. Progression is instructor-controlled in the implementation. | Exact waits for release, per-round submissions, validation attempts, questions, and navigation timings were not recorded in the supplied evidence. This is not a reconstructed action log. |
| R9 | Benefit Review decision interaction was reported as working and the participant continued. Source inspection found no Benefit Review score in the examined metrics/log data. | Exact chosen figure, basis, disclosures, and participant understanding of scoring were not supplied. |
| R10 | R10 decision was reported as working; final submission and instructor completion led to the final outcome and three-panel debrief. The current explanation control is always-present and optional by source/prior verification. | Whether this participant used the explanation, its text, and exact final outcome are not supplied. No fresh claim about their interaction with that control is made. |
| After completion | Participant saw the outcome/debrief, expanded Decision Log entries, and encountered the remaining R10 decision-oriented workspace while scrolling. | No second accepted R10 submission was reported or demonstrated. |

The historical runtime follow-up records Round 3 Analysis successfully opening in R4–R10 after a stale backend restart. That recorded incident is not proof of unrecorded actions in the latest participant session. The current observation is that opened documents remain available across later rounds.

## C. Investigation and classifications

### 1. Document persistence — PASS / EXPECTED

The participant observed that documents opened once remained available through later rounds.

`markArtifactAccess()` records opened state in `currentState.evidence`; persistence stores that state. `closeRound()` carries opened status forward. `artifactsAvailableAt()` includes artifacts released at or before the current round. `studentProjection()` exposes opened content accordingly. No expiration requirement was found. Cross-round Round 3 Analysis access is explicitly documented and tested.

Retaining legitimate opened content does not itself reveal hidden scoring information. Opening records evidence access and can legitimately affect access-dependent behavior/Panel 3; persistence is not a new score or penalty. This observation is not a bug and needs no correction.

Separate source-established caveat: canonical artifact close-round replay preserves `accessed` and `discovered`, but not `accessedVersions` / `accessedPages` in that branch. This can affect remembered Board Deck v3 and Readiness Page 9 access and potentially Panel 3 classification. The generated Round 3 artifact takes the separate whole-record-copy branch. The caveat was investigated, not fixed, and is not claimed to have been observed by the participant.

**Deferred — awaiting Sir's decision.**

### 2. R10 Metric Monitoring JSON — USABILITY / READABILITY DEFECT

The participant observed metric information displayed as JSON at R10.

Source: team Round 3 submission artifact → `round3_analysis.studentContent.metricSet`. Projection: `studentDecisionModel()` → `decision.metricSet`. API: student team projection. Component: `DecisionWorkspaceV6.tsx`, explicitly rendering each metric with `JSON.stringify(m, null, 2)` inside `pre`.

These are legitimate student-facing metric values, not diagnostic scores. The Round 3 document viewer already renders the same metric information readably. The R10 data binding is required; JSON presentation is a readability issue, not a demonstrated secrecy violation. A possible correction would change presentation only, retaining values and adding no R3-origin language. It has not been implemented.

**Deferred — awaiting Sir's decision.**

### 3. Decision Log JSON — USABILITY / READABILITY DEFECT

The participant observed JSON when expanding Decision Log entries for the ten rounds.

Source: `team.submissions[].payload`. Projection: `studentDebrief()` → Decision Log `entries[].leverValues`. Component: `DebriefV6.tsx`, serializing `entry.leverValues`. Additional occurrence: Student Decision History serializes `history[].payload` in `StudentDashboardV6.tsx`.

These are the participant's submitted decisions, not hidden engine results. Exact round, date, submitter, lever values, claims, and free text must remain faithful. A readable rendering would address usability without changing the underlying record. No correction was made; this is not a demonstrated hidden-scoring leak.

**Deferred — awaiting Sir's decision.**

### 4. Completed-game R10 workspace — COMPLETED-STATE UI / USABILITY DEFECT

After instructor completion, the participant saw the final outcome/debrief, Decision Log, What Moved, and What You Never Saw, but the R10 decision-oriented workspace remained rendered.

`closeRound()` sets game status to `completed` while `activeRound` remains 10. The student projection still supplies situation/history/decision with `decision.submitted` true. `App.tsx` renders the debrief and then the dashboard, which still mounts `DecisionWorkspace`. Its submit button is disabled. `aria-disabled` does not disable the local inputs, so local fields can still be edited. The form initializes from defaults rather than acting as an exact historical submission summary.

Backend `submit()` rejects a duplicate current-round submission as immutable. Normal completion requires R10 submissions from every team; another R10 decision cannot be accepted through that normal path. There is no separate completed-status guard in that function. The remaining decision language could reasonably imply another action is required. No explicit requirement to remove the entire dashboard was found.

This is not a demonstrated ability to submit another R10 decision. A possible correction would distinguish completed presentation using the existing status while preserving the historical log. No correction was made.

**Deferred — awaiting Sir's decision.**

## D. Student secrecy

The source investigation did not find prohibited hidden information in R10 Metric Monitoring or Decision Log. No demonstrated exposure of Benefit Review score, board credibility calculation, sponsor-confidence calculation, advisor scoring, risk calculations, crisis-selection logic, hidden thresholds, or internal scoring traces was found in these objects. JSON here is classified as readability/usability, not secrecy. This is a scoped source finding, not a new network capture or blanket security certification.

## E. Preservation and packaging scope

No newly observed issue was fixed. No application code, tests, configuration, UI, mechanics, scoring, evidence rules, participant data, or database was changed by this documentation/package operation. Phase 3/4/5 behavior and implemented Phase 6 corrections are retained, subject to the explicitly documented access-history caveat. Prior regression results are not a claim that deferred presentation/access issues passed new acceptance checks.

CLEARPATH_ALL remains 63 entries with all 45 supplied filenames, original order, duplicates, and inconsistent names. Readiness pages 10–14 remain placeholders, and ten unspecified vendor-slide bodies remain unfilled. No content, decisions, quotes, scores, timings, or observations were fabricated.

This package is not an all-issues-resolved implementation. It contains the current implemented corrections and this report; metric JSON, log JSON, completed-state workspace, and canonical access-history preservation remain deferred.

**Phase 6 corrections package — awaiting Sir's decision on second cold-run follow-up findings.**
