# Phase 5 Pilot-Readiness Plan

Status: **proposal only**. It defines the work required to declare a pilot ready; it does not claim that the work has been implemented or executed.

## A. Cold run-through

The most important Phase 5 test is a moderated observation with one participant who has not seen the design, sources, outcome logic, or prior playthroughs. Use a clean team and ordinary pilot hardware. The moderator gives only the simulation's normal launch instruction, then remains silent except when safety or a true technical block requires intervention.

### Procedure

1. Start recording notes before the participant sees R1.
2. Ask the participant to begin at R1 and think aloud.
3. Let them interpret the scenario and decide what to do without coaching.
4. Allow natural exploration of documents, advisors, and stakeholders.
5. Let validation and progression behave as the product presents them.
6. Continue as far as practical; target R1–R3 at minimum and R1–R10 if session length permits.
7. Record behavior and exact comments, not interpretations alone.
8. Conduct the short post-session interview in `PHASE5_COLD_RUN_REPORT.md`.

Observe where the participant hesitates; what they never notice; whether they discover Documents, Advisors, and stakeholder conversation; whether they understand what to submit and how rounds progress; how they interpret empty/error states; what they believe they are optimizing; where navigation becomes confusing; every request for help; and every material misunderstanding.

This is not a conventional QA script. The moderator must not direct the participant to a feature simply to mark it passed.

## B. Reset and seed path

### Minimum instructor-facing proposal

Provide an authenticated **Pilot administration** surface separate from the teaching dashboard.

- **Create section:** enter a section name and paste team names (one per line); preview the count and names; create the game and teams from the normal configuration snapshot.
- **Reset one team:** clear that team's simulation activity and return it to R1 without affecting other teams.
- **Reset entire game:** return every team to a clean R1 state.
- **Archive then restart:** preferred for a team that goes sideways during a real session, so the abandoned attempt remains available to the instructor but the replacement begins cleanly.

### Authority and retention

Only an authenticated instructor/administrator can use these actions. A reset removes the targeted active attempt's submissions, results, state/state history, selected narratives, evidence/artifact access, transcripts, budget ledger, crises, and outcome, then recreates the canonical initial state from a new or explicitly selected configuration snapshot. Team display name and section membership persist. For a hard reset, old transcripts and Decision Log records do not remain attached to the active attempt. Prefer archive-and-restart where institutional retention matters.

### Accidental-reset prevention

- Separate reset controls from round-close controls.
- Require selection of exact section/team and show the affected data categories.
- Require typing the team or section name for a destructive reset.
- Create a server-side audit record with actor, time, target, and reset mode.
- Never offer bulk reset from a row-level overflow menu.

No reset/seed tool exists as a result of this proposal.

## C. Mid-round failure behavior

### Student loses connection — before submission

**Expected behavior:** The draft remains locally recoverable and no submission is created.

**What the student sees:** A persistent offline banner, last-saved time, and disabled final submission until connectivity returns. Exploration already loaded remains readable where feasible.

**What the instructor sees:** Team still in the same round, not submitted; optionally “last connected” without exposing draft content.

**Persistence requirement:** Draft autosave is local or server-draft storage distinct from the authoritative submission. Conversation/document access already acknowledged by the server remains persisted.

**Recovery path:** Reconnect, reload canonical round state, merge only that team's compatible draft, review, and submit.

### Student loses connection — during submission

**Expected behavior:** Treat the result as unknown until the client queries the authoritative round submission.

**What the student sees:** “Checking whether Round N was received,” not an instruction to click again.

**What the instructor sees:** Either a persisted submission or an unsubmitted team; never two entries for one round.

**Persistence requirement:** Server transaction plus a unique `(team, round)` constraint/idempotency token.

**Recovery path:** On reconnect, fetch the round. If recorded, display success and lock. If absent, restore the draft and permit one new attempt.

### Student loses connection — after persistence but before confirmation

**Expected behavior:** Reconciliation finds the recorded submission and treats it as success.

**What the student sees:** The exact recorded values, timestamp, submitter, and locked state.

**What the instructor sees:** One normal submission.

**Persistence requirement:** Success is defined by server state, not whether the client received the response.

**Recovery path:** Refresh/reconnect; no resubmission required.

### Duplicate submission

**Expected behavior:** The first valid persisted submission remains authoritative; an identical retry is an idempotent success, and a conflicting retry is rejected.

**What the student sees:** “Round N was already submitted” plus the recorded submission. A conflicting retry is not silently substituted.

**What the instructor sees:** One Decision Log entry, with an optional operational duplicate-attempt audit event.

**Persistence requirement:** Existing unique team/round enforcement plus a request idempotency key in a pilot implementation.

**Recovery path:** Load the recorded submission; instructor reset is the only proposed way to restart, not an edit-in-place.

### Required field empty

**Expected behavior:** No submission request is accepted.

**What the student sees:** Field-level explanation and a summary that focuses the first invalid field. It does not suggest a correct value or scoring range.

**What the instructor sees:** Team remains unsubmitted; no partial Decision Log entry.

**Persistence requirement:** Server validation remains authoritative even if client validation runs first. Draft storage may retain the incomplete value.

**Recovery path:** Complete the field and review again. Deliberately optional blank fields remain valid, including the R6 threshold if the accepted design permits it.

### Browser refresh

**Expected behavior:** Reload the canonical team, round, submission state, evidence access, and transcripts without changing outcomes or reselecting narrative.

**What the student sees:** Same round and selected reality; a compatible draft is restored with a clear draft label.

**What the instructor sees:** No state change caused by refresh.

**Persistence requirement:** Submitted state, narratives, transcripts, artifact access, and evidence are server-persisted; draft recovery must not overwrite them.

**Recovery path:** Automatic reload. If a restored draft no longer matches the active round, quarantine it and show the current canonical round.

### Returning to a completed round

**Expected behavior:** Completed rounds are read-only records.

**What the student sees:** Submitted values, date, submitter, and relevant student-visible narrative/consequence; no active controls.

**What the instructor sees:** The same submission in Decision Log plus authorized diagnostics.

**Persistence requirement:** Historical submissions and selected variants are immutable during normal navigation.

**Recovery path:** Return to Current Round; a genuine restart requires the protected instructor reset path.

## Pilot readiness criteria

A pilot is ready only after a first-time participant can, without coaching:

- Identify the current round and what judgment it asks for.
- Find ways to inspect available information.
- Discover that the document folder exists and open it.
- Discover that advisors can be consulted.
- Discover that stakeholders can be contacted and ask a free-form follow-up.
- Find the decision submission, understand required inputs, and interpret an empty-field error.
- Tell whether submission succeeded.
- Continue to the next round or understand that the instructor must close it.

### Productive discovery versus interface failure

**Productive discovery:** The participant initially overlooks a meaningful source, later finds it through ordinary exploration, and can explain that it had been available. Difficulty selecting the important item within CLEARPATH_ALL is expected.

**Interface failure:** The participant never realizes Documents, Advisors, Stakeholder Conversations, or Submit exists; concludes a working feature is broken; cannot determine whether a submission persisted; or requires moderator directions to progress.

### Suggested pass thresholds for Sir's approval

- Zero critical navigation failures in the cold run.
- All eight core activities above discovered without moderator instruction.
- No mistaken belief that a hidden score, advisor vote, or highlighted document identifies the correct answer.
- No loss or duplicate of a submitted decision during targeted recovery checks.
- All six Phase 4 load-bearing interactions remain exact.

These thresholds are proposed, not existing requirements.

## Preservation audit

Pilot-readiness work must not change Path A/B/C/D outcomes, `scarred` semantics, benefit/crisis/budget mechanics, Panel 3 predicates, stakeholder gates, advisor scoring/secrecy, student secrecy, three-panel debrief, scenario content, the accepted artifact model, or any of the six interface constraints listed in `PHASE5_INTERFACE_PROPOSAL.md`.

