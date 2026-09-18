# Phase 5 Student Interface Proposal

Status: **proposal only**. This document describes a candidate student experience for Sir's review. It is not an implemented requirement unless it restates an accepted Phase 3/4 constraint.

## Source status and current-state observations

The authoritative `bpm phase5 instructions.md` was read in full. This proposal also uses the detailed Phase 5 brief supplied with this review, the accepted Phase 3/4 reports, the current projections and application code, the tests, and direct observation of the rendered R10 interface. Suggestions beyond those sources are explicitly presented as proposals.

The current application provides a ten-round rail, a student/instructor role switch, a two-column student workspace, scenario narrative and budget, Evidence/Documents/Advisors/Stakeholders tabs, decision history, a round-specific submission form, and the three-panel debrief. Direct observation at R10 showed the narrative and decision form above the resource tabs in a long page. All six advisors are displayed together and a click issues one fixed prompt; the returned answer is transient rather than a durable advisor thread. Stakeholder questioning is free-form and its transcript persists. The document browser preserves the 63-item folder and exposes Board Deck v3 under file properties/version history. The current application automatically selects the newest usable game and its first team; it does not provide a student-facing game/team chooser.

## A. How a round should read

### Proposed opening sequence

When a round opens, the first viewport should establish four things in order: round identity, the selected scenario reality, the decision the team must make, and whether work is open or already submitted. The narrative remains the visual anchor. Beside it, a compact decision brief names the submission sections without supplying a recommended answer. The remaining budget appears only where it is relevant to the decision.

### Always visible

- Current week/round, round title, and completion state.
- The complete selected scenario narrative, with no variant labels or alternate realities.
- A plain-language “decision due this round” outline derived only from the existing input schema.
- Persistent routes to Information, People, and Decision.
- Current-round submission state and a clear return-to-decision action.
- Any accepted round-specific surface that must be visible with the decision, including the R8 readback/dashboard and R10 monitoring metrics.

### One interaction away

- Evidence and the document folder.
- Advisor consultation and its previous messages.
- Available stakeholder contacts and each contact's transcript.
- The full decision form and prior submitted decisions.
- Documents already opened in the current session, without elevating unopened sources.

### Deliberately discoverable

- Which of 63 messy folder entries matters.
- Board Deck v3 through properties/version history.
- Page 9 of the paginated readiness assessment.
- Reyes through the accepted evidence/contact path.
- Information a stakeholder volunteers only after an authoritative gate is met.

Discoverable does not mean visually absent. The interface should make the existence of Documents, Advisors, and Stakeholder Conversations unmistakable, but should not signal which item, person, or question is correct.

### Round progression

The round stays open while the team explores, consults, and edits. A submission review step shows exactly what will be recorded. Once submission succeeds, the form becomes read-only and the success state includes the round number, timestamp, and “waiting for instructor” or “next round available,” depending on the current operating model. The ten-round rail shows position and completed rounds but does not become a way to edit history.

## B. Navigation model

Use one persistent round shell with three primary destinations:

1. **Briefing** — scenario and current-round context.
2. **Information & People** — Evidence, Documents, Advisors, and Stakeholders as secondary tabs.
3. **Decision** — the current submission and read-only decision history.

On desktop, the decision status and a “Return to decision” control remain in a slim sticky summary while the main pane changes. Information and conversations open in the main pane or a wide drawer so the student can retain round and decision context. Deep links into documents return to the same folder location and do not reset the decision draft. The debrief becomes a destination only after completion.

Separate full screens would impose too much navigation cost for evidence comparison. One undifferentiated dashboard would make every signal equally prominent. A stable shell with shallow secondary tabs offers orientation without converting discovery into a checklist.

## C. Advisor consultation

### Proposal

- Present an **Advisor desk** with names and brief, source-supported role identifiers, not six simultaneous answers.
- The student chooses one advisor and explicitly requests a consultation. Multiple advisors may be consulted; there is no artificial one-advisor limit.
- The first view shows who is available, not their stance, valence, intensity, rationale tags, or focus lever.
- Opening an advisor shows that advisor's chronological consultation history and a neutral “Consult” action. The rendered response persists with round and timestamp.
- Disagreement is surfaced only through the advisors' actual messages. Do not label a “consensus,” winner, split vote, or recommended answer.
- Do not generate six responses in advance. This preserves the cost of deciding whom to consult and avoids an answer-key list.

Advisor messages remain derived outputs. No component score, focus lever, rationale tag, hidden weight, or scoring trace enters the student projection.

### Tradeoff: advisor visibility

**Problem:** Six identical visible cards invite students to click through an answer list, while hiding advisors makes a core learning resource look unavailable.

**Proposed solution:** Make the Advisor desk a primary People destination, then require selection and consultation one advisor at a time.

**Pedagogical reason:** Choosing whose perspective to seek is itself part of the judgment exercise.

**Usability benefit:** Availability is obvious; individual conversations remain readable and durable.

**Pedagogical risk:** Students may repeatedly consult all six mechanically.

**Mitigation:** Do not batch-generate replies, rank advisors, summarize consensus, or mark consultations as required tasks.

## D. Stakeholder conversation

### Proposal

- Label the People destination **Advisors & Stakeholders** and show “Contact stakeholders” as an equal sub-route, not a small utility link.
- Show only currently available stakeholders. A person is selected by name; no trust, support, disclosure, or hidden availability metadata is shown.
- The conversation occupies a full-height reading pane with chronological turns, visibly distinct “Team” and stakeholder messages, round labels, and timestamps.
- A free-form question box remains at the end of the thread. After each response the cursor returns to the question box, making follow-ups natural.
- History persists across rounds and is filterable by round, but defaults to the whole relationship so students can recall what was said.
- Empty questions remain disabled. An unavailable or undiscovered person is absent rather than shown as locked.

The interface never reveals gate conditions, trust scores, disclosure rules, knowledge lanes, event IDs, or variant IDs. Low trust changes what is volunteered, not whether a direct factual question receives a truthful answer.

### Tradeoff: stakeholder visibility

**Problem:** A buried conversation tab can make stakeholder work appear optional or nonexistent.

**Proposed solution:** Put Stakeholders beside Advisors under a persistent People destination and retain a small, neutral “People available” cue near the round brief.

**Pedagogical reason:** Contact is a legitimate way to investigate, but the interface must not reveal whom to ask or which question unlocks evidence.

**Usability benefit:** First-time students can find conversation in one interaction and follow a continuous thread.

**Pedagogical risk:** A cue may overemphasize talking relative to documents and observation.

**Mitigation:** Keep the cue neutral, never add completion badges, critical-person markers, or suggested questions.

## E. Document folder

### Proposal

Represent CLEARPATH_ALL as a familiar shared-drive list in the authoritative 63-item order. Preserve every spelling, capitalization, duplicate, and inconsistent version name. Default to that authored order. Permit basic in-folder text filtering only if Sir approves; filtering must be literal, not relevance-ranked, and clearing it must restore the exact order. Do not add recommended, relevant, critical, unread, or “read first” classifications.

An entry that has supplied content opens in a document viewer. A listing-only item remains a file row but does not receive fabricated body text. The UI may use ordinary file affordances, but it must not label listing-only entries as fake or imply which files matter.

Doug's Board Deck opens at Version 4. A conventional properties action reveals version history; Version 3 is opened from that history and never appears as a second ordinary folder row. The readiness assessment retains Previous/Next paging and the exact `Page n of 14` indicator. Page 9 remains distinct; pages 10–14 remain the documented placeholders.

### Tradeoff: folder discoverability

**Problem:** Sixty-three disordered entries can look broken or unusable, but organizing them by importance destroys the discovery exercise.

**Proposed solution:** Use a conventional folder surface, exact authored order, stable scroll position, ordinary file-type cues, and optional literal filename filtering only.

**Pedagogical reason:** Students must decide where to look without the system flagging correct evidence.

**Usability benefit:** Familiar interactions reduce mechanical friction while preserving informational disorder.

**Pedagogical risk:** Search could make a known filename too easy to retrieve.

**Mitigation:** Search remains literal and unranked, exposes no suggested queries, and is subject to Sir's decision.

## F. Submission model

### Proposal

- At the top of Decision, show a neutral list of submission sections generated from the existing round schema.
- Required fields use standard required semantics. Optional fields say “Optional”; required fields are not prefilled merely to suppress validation.
- When a required field is empty, submission does not occur. Focus moves to the first invalid field, a field-level message explains what is missing, and a summary lists remaining errors without revealing mechanics.
- Preserve deliberate blank states. In particular, the R6 threshold starts blank with no placeholder, default, suggestion, range hint, or implied acceptable value. If the current accepted schema permits blank, it must not be relabelled as required.
- “Review submission” opens a read-only summary containing the team's exact values and text. “Submit Round N” is the final in-app action.
- While the request is pending, disable repeat submission and show “Submitting…”. Use the persisted round submission as the authoritative idempotency check.
- On success, lock the round, retain a readable copy of exactly what was submitted, and show timestamp/submitter.
- If server state says the round was already submitted, show the recorded submission rather than asking the team to try again.

### Tradeoff: submission clarity

**Problem:** A generic submit button does not distinguish validation failure, a pending request, and a recorded decision.

**Proposed solution:** Add review, precise validation, pending, success, and locked states around the existing submission model.

**Pedagogical reason:** Students should wrestle with the decision, not uncertainty about whether the system recorded it.

**Usability benefit:** Fewer accidental omissions and duplicate attempts.

**Pedagogical risk:** A checklist could reveal the intended solution structure.

**Mitigation:** Describe only required input categories already present in the form; never explain how choices score.

## G. Mobile and responsive recommendation

Recommend **desktop-first with robust tablet support**. The simulation asks teams to compare narrative, documents, conversations, and a detailed decision form. A wide desktop is the primary pilot target. Tablet landscape should retain all functions with one pane at a time and a persistent return-to-decision control. Phones should support reading, reviewing conversations, and recovery from refresh, but are not recommended as the primary completion device for the pilot. No essential evidence or action may become inaccessible on a phone.

## Cross-cutting design tradeoffs

### Information density

**Problem:** Current R10 places narrative, debrief, resources, history, and decision on one long page.

**Proposed solution:** Reveal the debrief only as its own completed-game destination and organize active-round work into Briefing, Information & People, and Decision.

**Pedagogical reason:** Not every available signal should compete for attention at once.

**Usability benefit:** Students can form a task model before exploring detail.

**Pedagogical risk:** Separating surfaces can conceal useful cross-connections.

**Mitigation:** Preserve shallow navigation, draft state, and a persistent round/decision summary.

### Navigation burden

**Problem:** Multiple separate screens make evidence comparison slow; one long page loses place.

**Proposed solution:** Stable shell, three primary destinations, secondary resource tabs, and context-preserving viewers.

**Pedagogical reason:** Navigation should support synthesis without curating evidence.

**Usability benefit:** Any core activity is at most one interaction away.

**Pedagogical risk:** Persistent shortcuts can make the simulation feel tool-driven.

**Mitigation:** Keep the narrative as the opening anchor and avoid notifications that prescribe activity.

## Non-negotiable preservation audit

Any implementation following this proposal must preserve:

- Path A → `squeak_through`; Path B → `disaster`; Path C → `win_with_scars`; Path D → `triumph`.
- The `scarred` requirement and no $8M upper bound.
- Exact Panel 3 access semantics, student/advisor secrecy, stakeholder gating, and the three-panel debrief.
- R6 threshold initially blank, with no default, placeholder, suggestion, or range hint.
- R8 rollback showing the team's exact recorded words.
- Four distinct R8 readiness indicators, no aggregate, with the fourth indicator's cause hidden.
- R10 metrics without saying they came from, were inherited from, or were carried from R3.
- Paginated readiness assessment using `Page n of 14`, distinct Page 9, and placeholders on Pages 10–14.
- Exactly 63 CLEARPATH_ALL items; the supplied 45 filenames remain byte-for-byte, in order, including duplicates and inconsistent naming; Board Deck v3 remains in properties/version history.
