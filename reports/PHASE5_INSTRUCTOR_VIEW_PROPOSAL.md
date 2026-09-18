# Phase 5 Instructor View Proposal

Status: **proposal only**. No instructor interface has been implemented by this phase.

## Current state

The current role switch opens an instructor control room for the active game's first team. It shows active round, game status, team count, a Close Round action, raw current state, raw latest result, and unresolved configuration. The instructor projection already contains all teams, submissions, state history, results, narratives, transcripts, artifacts, debrief data, missed-evidence inventory, and outcome. The UI does not yet provide a team list, outcome overview, Panel 3 teaching view, Decision Log viewer, or transcript browser.

## A. Instructor dashboard

### Proposal

The landing page is a neutral team table with these columns only:

- Team identifier/name.
- Outcome tier, or “Not complete.”
- Completion status and active round.
- R10 completed: Yes/No.
- Panel 3 availability: Available after completion/Available/Not yet available.
- Open team action.

Default ordering is stable creation order or team name, subject to Sir's decision. Do not sort by outcome quality. Filters may include completion state and round for classroom operations, never “top” or “bottom” performers. Outcome tier is presented as a simulation result, not a grade.

Explicit exclusions: no leaderboard, points, class rank, GPA analogue, percentile, trophy treatment, or “best team” sorting.

## B. Team detail

The detail header contains team name, outcome, completion state, current round, and a clear return to all teams. Four teaching tabs follow the required priority:

1. Overview.
2. What You Never Saw.
3. Decision Log.
4. Stakeholder Conversations.

### Decision Log

Display the persisted submission without rewriting it:

- Round.
- Timestamp.
- Submitter.
- Lever values.
- Claims and structured artifacts.
- Free text exactly as submitted.

Use collapsible round sections and a side-by-side round selector when space permits. Labels may make stored field names human-readable, but the value and student wording are never paraphrased. An optional “raw record” disclosure can support audit without making JSON the primary live-teaching view.

## C. Panel 3: What You Never Saw

The instructor can see the team's complete inventory exactly as determined by the accepted predicates. Each item may expand to show instructor-only access evidence: whether the qualifying evidence was opened, exact authoritative disclosure present in a transcript, relevant submission/action, or required variant actually opened. This evidence explains why an item is present or absent; it does not change the inventory.

The student projection remains unchanged. Instructor diagnostics must be served only from the instructor-authorized route and must never be embedded in student markup, downloadable student state, or client-side hidden fields.

## D. Stakeholder transcripts

### Proposal

- A team is already selected from the team detail page.
- A stakeholder list shows every stakeholder with whom the team has a transcript and a turn count. Available-but-uncontacted people may appear in a separate neutral section if useful to the instructor.
- Selecting a stakeholder opens the entire chronological transcript across rounds.
- Every turn distinguishes team question and stakeholder response and shows round and timestamp.
- The original wording is preserved. No generated summary replaces the transcript.
- A “jump to round” filter may shorten live navigation without hiding the full-thread option.

If diagnostic metadata is later approved, place it in a visibly separate **Instructor diagnostics** disclosure. It may identify the evidence that satisfied a Panel 3 predicate, but should not dump internal event IDs, gate code, or inference traces into the core transcript. Nothing in this instructor-only area may enter the student projection.

## E. Live debrief workflow

The shortest live path is:

```text
Select team
→ see outcome
→ inspect What You Never Saw
→ inspect Decision Log
→ inspect stakeholder conversations
→ return to team list
```

Keep the team header and four tabs fixed while the instructor switches evidence. Preserve the selected team when moving between tabs. “Previous team” and “Next team” may follow the neutral dashboard order, never outcome order. Returning to the list should preserve filters and scroll position. This supports rapid classroom comparison without turning comparison into ranking.

## Design tradeoff: instructor debrief speed

**Problem:** Raw state is comprehensive but too slow and too technical for live classroom discussion.

**Proposed solution:** Lead with outcome, Panel 3, Decision Log, and transcripts; place raw diagnostics behind a separate disclosure.

**Pedagogical reason:** The instructor needs to connect outcomes to what teams saw, decided, and asked—not narrate internal engine fields.

**Usability benefit:** The required teaching sequence takes one team selection and shallow tab changes.

**Pedagogical risk:** Simplification can hide nuance needed to answer a student's challenge.

**Mitigation:** Retain instructor-only raw records and predicate evidence as secondary audit views.

## Permissions and boundaries

The pilot implementation should establish explicit instructor authorization; the current visual role switch alone is not a sufficient production privilege boundary. This is a proposed pilot-readiness control, not a claim that authentication already exists. Students must never receive hidden outcome predicates, advisor internals, crisis-selection internals, variant IDs, gate conditions, or instructor diagnostic metadata.

## Preservation constraints

The instructor view may explain but may not recalculate or alter simulation state. It must preserve accepted outcomes, the `scarred` rule with no $8M ceiling, Panel 3 predicates, all conversation behavior, the three-panel student debrief, artifact access, and all six load-bearing interface requirements documented in `PHASE5_INTERFACE_PROPOSAL.md`.

