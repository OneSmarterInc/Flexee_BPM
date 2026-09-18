# Build Spec: State Schema
## Typed variables, ranges, update rules, and derivations

Companion to the design document. This is the translation layer — everything here exists in prose in the design document and is restated as fields, types, and expressions. Where the two disagree, the design document is the intent and this is the error.

Naming follows the marketing sim's conventions where they were visible. Anything marked provisional needs a decision from whoever owns the engine.

---

## 1. Scalar state

All scalar variables are floats clamped 0 to 100 unless noted. Each is stored per team per round, and each round's value is derived from the prior round plus that round's deltas, so the full history is reconstructible and no value is authoritative except as a function of the decision log.

| Field | Init | Drift/round | Floor | Ceiling | Notes |
|---|---|---|---|---|---|
| sponsor_confidence | 62.0 | -1.0 | 0 | 100 | Read back by Okonkwo's scoring |
| board_credibility | 48.0 | 0 | 0 | 100 | Moves 4–5 times across arc, large steps |
| financial_credibility | 50.0 | +0.5 | 0 | 100 | Gates Deiss disclosure at 45 and 70 |
| discovery_depth | 0.0 | 0 | 0 | 100 | Multiplier, not gate; recovery capped |
| readiness | null until R7 | n/a | 0 | 100 | Derived; see section 4 |
| automation_risk_debt | 18.0 | 0 | 0 | 100 | Inherited from Clearpath pilot |
| technical_partnership | 32.0 | 0 | 0 | 100 | Asymmetric: slow gain, fast loss |
| realized_benefit_usd | null until R6 | n/a | 0 | — | Currency, not 0–100 |
| defensible_benefit_usd | null until R6 | n/a | 0 | — | Derived from realized × credibility factor |

Drift applies at round close, before threshold evaluation, and does not apply in round 1.

### Asymmetric movement

Two variables use asymmetric clamping on deltas rather than symmetric application.

sponsor_confidence: positive deltas apply at 1.0×, negative at 1.0×, but the magnitudes themselves are asymmetric by event class — align +3 to +6, decline -8 to -12, deliver_showable +15, public_error -25.

technical_partnership: positive deltas apply at 0.6×, negative at 1.0×. A relationship damaged by public accusation does not repair inside ten rounds, and this is the mechanism rather than a special case.

---

## 2. Stakeholder state

Nine stakeholders, each carrying two independent floats 0 to 100.

| id | trust_init | position_init | disclosure_gate |
|---|---|---|---|
| ntende | 30 | 35 | trust ≥ 65, round ≥ 4 |
| deiss | 50 | 58 | trust ≥ 55 (R3 warning), trust ≥ 70 (private view) |
| moreau | 45 | 30 | trust ≥ 50 (service lines), ≥ 70 (2023 history) |
| kubiak | 28 | 50 | see technical_partnership, not trust |
| anand | 55 | 60 | none — forthcoming by default |
| walters | 50 | 45 | design_room membership, not trust |
| ferrara | 62 | 8 | observation funded in R2 |
| boyce | 58 | 12 | denials-bench contact in R2 |
| reyes | 40 | 50 | contact required; no calendar entry exists |

Two design properties that must survive implementation. Trust gates what a stakeholder volunteers and never what they confirm — a direct question is always answered truthfully regardless of state. And position moves on decisions while trust moves on handling, so the two must never be updated by the same rule.

kubiak is the one exception: his disclosures gate on technical_partnership rather than his own trust value, because that variable is the relationship. His stakeholder trust still exists and still moves; it just isn't what opens the eligibility feed.

---

## 3. Risk register

Replaces the single-crisis formula. Eight entries, each accumulating independently.

| id | gate | selection weight sources |
|---|---|---|
| statement_4_17 | none | R6 threshold_usd unset (45), pilot untouched (10), no escalation path (15) |
| duplicate_posting | none | R8 controls missing (35), queue ownership unset (15), financial_credibility < 45 (var) |
| silent_field_change | none | R6 change_detection unset (40), technical_partnership < 35 (15), authorization automated (var) |
| grievance | none | R5 clean_sheet without union (35), R7 walters notified only (20), walters trust low (15) |
| freeze_collision | none | technical_partnership < 35 (40), R4 blamed IT (20), R6 heavy build without kubiak (15) |
| restatement | none | R3 baseline = adopt_inherited (50), R1 commitment gap (≤20), memo suppressed (15) |
| clinical_revolt | R6 depth == D | moreau position low (30), anand not activated (20), physicians absent R5 (20) |
| vendor_cliff | R6 sourcing != retain | transition governance unset (35), discovery_depth < 50 (20) |

Exposure contributions scaled by automation depth where the design document says so. Depth multiplier: A 0.3, B 0.7, C 1.0, D 1.2, applied to the automation-derived contributions only, not to political ones.

Selection at close of round 8. Rank by exposure. Fire highest if ≥ 40. Fire second if also ≥ 60. If none ≥ 40, round 9 runs the benefit_review scenario instead, which is a scenario rather than an empty round.

Severity is a separate scalar from selection: severity = exposure, passed to the damage function, so the same crisis at 45 and at 80 differs in consequence.

Exposure is never serialized to any student-facing surface. It surfaces only as narrative consequence and as the round 8 fourth indicator.

---

## 4. Derived values

readiness, computed at round 7 open:

Weight design_quality 0.15, mean stakeholder position across the executor set (walters, ferrara, boyce, ntende) 0.30, frontline_in_design_room boolean 0.20, training_investment normalized 0.25, discovery_depth as a 0.6–1.0 multiplier on the whole. The executor set weighting is Castellanos's worldview expressed as arithmetic and should not be flattened to all nine stakeholders.

The round 8 dashboard exposes readiness as four indicators rather than the scalar. Technical, process, staff, and a fourth drawn from the highest unresolved risk register entry. The fourth shows a label and a consequence range, never a cause and never a number that reads as a score.

realized_benefit_usd, computed at round 6 as a preview and finalized at round 10:

base from (redesign_ambition × automation_depth) lookup, then × readiness_factor, then − crisis_damage, then × sustainment_retention. Sustainment retention runs 0.55 with no items funded to 1.0 with all four.

defensible_benefit_usd = realized × credibility_factor, where credibility_factor derives from financial_credibility and board_credibility. A team that adopted the inherited baseline in round 3 carries a factor low enough that Triumph is unreachable regardless of realized benefit. This is the single most important property in the model and it must be a consequence of the arithmetic rather than a special-cased rule.

---

## 5. Round record

Each round persists a submission and a derived result, matching the marketing sim's split where the submission is source of truth and the result is recomputable.

The submission carries the lever values for that round, the team member who submitted, and a timestamp. The result carries the state deltas, the advisor stances, the exposure updates, and any narrative variants selected.

A config snapshot is written at game creation so a completed game replays identically. All lookup tables in this document belong in that snapshot rather than in code.

---

## 6. Provisional, needs an engine decision

Whether advisor scoring functions can read prior-round state, or only current-round levers plus baseline. The design requires the former — Marchetti's response to a round 5 redesign depends on round 2 discovery — and the marketing sim appears to do the latter. This is the largest of the three engine questions.

Whether the risk register generalizes the existing single-crisis mechanic or sits beside it. Recommendation is to generalize, with marketing's crisis becoming a register of one.

Whether stakeholder relationship becomes a two-field structure in shared code or a BPM-local extension. Recommendation is shared, since the distinction between trusting someone and agreeing with them is not specific to this sim.
