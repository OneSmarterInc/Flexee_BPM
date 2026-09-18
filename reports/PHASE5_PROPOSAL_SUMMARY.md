# Phase 5 Proposal Summary

## Current state

The verified Phase 4 workspace provides the complete R1–R10 simulation, accepted Phase 3 outcomes and mechanics, deterministic stakeholder conversations with persisted transcripts, six advisor outputs, 63-item CLEARPATH_ALL with the 45 supplied filenames, paginated readiness assessment, exact Panel 3 access semantics, and the three-panel debrief. The current student UI is a two-column round workspace with resource tabs and a decision form. The current instructor UI is a raw first-team diagnostic/control view rather than the proposed teaching dashboard.

The authoritative `bpm phase5 instructions.md` and the comprehensive Phase 5 brief supplied for this review were read and used. The older Phase 3 artifact inventory's filename-gap statement is superseded by the accepted Phase 4 implementation/report showing all 45 supplied filenames are present. Existing reports were not edited.

## Proposed interface

Use a stable round shell with Briefing, Information & People, and Decision as the three primary destinations. Keep the selected narrative and submission status prominent. Make Documents, Advisors, and Stakeholders clearly discoverable in one interaction without identifying which source or person matters. Consult advisors one at a time with durable history; maintain free-form stakeholder threads; preserve the deliberately messy document folder; add explicit review, validation, pending, success, and locked submission states.

## Proposed instructor view

Lead with a neutral team list showing outcome, completion, R10 completion, and Panel 3 availability. Do not rank. Team detail follows the live teaching sequence: outcome → What You Never Saw → Decision Log → stakeholder transcripts. Preserve the team's exact submissions and conversation wording. Keep diagnostic evidence instructor-only and secondary to the teaching views.

## Pilot readiness

Phase 5 closes only after a real first-time participant cold run. The workspace contains no evidence that such a run occurred, so `PHASE5_COLD_RUN_REPORT.md` is explicitly marked **COLD RUN NOT YET EXECUTED** and supplies the protocol, metrics, interview, and pass/fail criteria. The pilot plan also proposes protected section/team creation, reset/archive-and-restart behavior, and deterministic recovery for connection loss, duplicates, validation, refresh, and historical navigation.

## Load-bearing constraints

These are constraints, not options:

1. R6 threshold initially blank; no default, placeholder, suggested value, or range hint; blank remains valid where accepted.
2. R8 rollback shows the team's own recorded words, without paraphrase.
3. R8 readiness uses four separate indicators, no composite/percentage; fourth label and consequence range may show, but not its cause.
4. R10 monitoring metrics display the R3 metric set without saying it came from, was inherited, copied, recommended, or carried forward from R3.
5. Readiness assessment remains paginated with `Page n of 14`; Page 9 retains the $200,000 material; Pages 10–14 remain placeholders.
6. CLEARPATH_ALL remains exactly 63 items; the 45 supplied filenames keep exact spelling, capitalization, order, duplicates, and inconsistent version naming; Board Deck v3 stays in properties/version history.

The proposals also preserve Path A → `squeak_through`, Path B → `disaster`, Path C → `win_with_scars`, Path D → `triumph`; the `scarred` requirement; no $8M ceiling; exact Panel 3 access semantics; student/advisor secrecy; stakeholder gating; and the three-panel debrief.

## Open questions for Sir

Only decisions not already fixed by authoritative requirements are listed:

1. Should CLEARPATH_ALL permit literal filename filtering, or should the pilot preserve browsing-only access? Either option retains exact authored order and prohibits relevance ranking.
2. Should the round advance automatically when every team submits, or remain exclusively instructor-closed? The UI wording and success state depend on this operating choice.
3. For pilot restarts, should an abandoned attempt be archived by default for teaching/audit, or permanently removed after protected confirmation?
4. What is the pilot's minimum supported tablet width, and should phones be formally read/recovery-only or fully supported for submission?
5. Should instructor team ordering default to creation order or alphabetical team name? Outcome-based order remains prohibited.
6. What authentication/identity mechanism will distinguish instructor administration from student access in the pilot environment?
7. Is persistent advisor consultation history desired, or should advisor responses intentionally remain single-use/ephemeral? In either case advisor internals remain hidden.

## Implementation status

```text
PHASE 5 PROPOSAL ONLY
NO APPLICATION CODE MODIFIED
NO UI IMPLEMENTED
NO ZIP CREATED
```
