# Build Spec: Advisor Scoring
## Six functions, their inputs, and what they return

Each advisor is a pure function of state and levers returning a stance. The language model renders the stance into voice using the voice briefs; it does not decide it.

```
stance = {
  valence:        support | mixed | oppose
  intensity:      0.0 – 1.0
  rationale_tags: [string]
  focus_lever:    lever_id | null
}
```

rationale_tags are the grounding passed to the renderer. They are internal vocabulary, never student-facing strings, and they are what keeps a rendered line tied to an actual computed reason.

---

## 1. Shared contract

Every advisor function receives the current round's submitted levers, full prior-round state, the stakeholder vector, and the risk register. Receiving prior state is the engine change flagged in the state spec; without it four of the six functions cannot be written as specified.

No advisor function may return a lever value, an option recommendation, or a claim answer. The ownership blocklist from the marketing engine applies unchanged and should be extended with BPM-specific phrases: naming a station as the constraint, naming a root cause, or naming an automation option as correct.

Intensity maps to render length and specificity, not to volume. Each brief defines its own intensity expression; they are not interchangeable.

---

## 2. Marchetti — evidence, altitude, sequence

```
evidence_term = discovery_depth_at_decision / required_depth_for(round)
altitude_term = 1.0 if round_level_reached(round) else penalty_by_gap
sequence_term = 1.0 - scope_instability(r5_ambition, r6_depth)

score = 0.45*evidence_term + 0.40*altitude_term + 0.15*sequence_term
```

required_depth_for rises across rounds: 20 at r3, 45 at r4, 60 at r5, 60 thereafter.

round_level_reached tests whether the analytical work for the round's level exists. r3 requires a submitted constraint_claim, r4 a root_cause_claim, r5 both.

valence: support above 0.72, oppose below 0.45, mixed between.
intensity: abs(score - 0.6) scaled, so she is loudest at both extremes and quiet in the middle.

Neutral on automation_depth, sourcing, and all stakeholder state. These must not appear in her inputs at all, or she drifts into Oyelaran's and Castellanos's lanes.

focus_lever is the lever with the largest negative contribution, which is what the renderer builds her question around.

---

## 3. Oyelaran — feasibility × parameters

```
feasibility     = depth_feasibility[automation_depth]      # A 1.0, B 0.9, C 0.75, D 0.5
parameters      = count_substantive(parameter_set) / 5
constraint_term = 1.0 if automated_station == constraint else 0.7

score = (0.5 + 0.5*parameters) * constraint_term
```

feasibility does not enter the score. It enters the render as his honest first answer, which is why it is computed separately and passed through. An advisor whose enthusiasm is scored away stops being believed.

The interaction that matters: low parameters with high automation depth produces his sharpest stance. Express as

```
if parameters < 0.4 and depth in (C, D): valence = oppose, intensity = 0.9
```

count_substantive rejects empty strings, "TBD", and placeholder values. A field is answered or it is not.

Neutral on cost and adoption. Asked about either, he returns a redirect stance with a named referral.

He never returns oppose in round 9. His trace stance is valence mixed, intensity 0.2, tag prior_question_unanswered, and the renderer produces a flat reference to his own notes.

---

## 4. Castellanos — executors, participation, timing

```
executor_position = mean(position of walters, ferrara, boyce, ntende)
participation     = |design_room ∩ {frontline_staff, union}| / 2 * 0.6
                  + |coalition_actions| / 4 * 0.4
timing            = 1.0 - compression_index(approach, training_alloc, notice_clock)

score = 0.50*executor_position_norm + 0.30*participation + 0.20*timing
```

The executor set is deliberately four of nine and excludes deiss, okonkwo, moreau, kubiak. That weighting is her worldview and must not be widened to all stakeholders.

intensity: driven by which stakeholder is lowest, passed as a tag so the renderer quotes the right person. Mild concern quotes an anonymous supervisor; serious concern names someone the team has met.

From round 8 she returns forward_only in her tags, which forbids the renderer from producing retrospective content. Enforce at the render layer, not by hoping.

Neutral on technology, cost, and method.

---

## 5. Brennan — claim support, category, cost completeness

```
claim_support = 1.0 - clamp(claimed - defensible, 0, claimed) / max(claimed, 1)
category      = category_discipline_flags_clear ? 1.0 : 0.4
cost_complete = counted_cost_items / total_applicable_cost_items

score = 0.50*claim_support + 0.25*category + 0.25*cost_complete
```

Applies from round 3 onward. Before round 3 he returns a single stance with tag baseline_absent regardless of anything else.

Round 3 coupling: if constraint_claim located correctly and published_baseline is adopt_inherited, apply a 0.35 multiplier to score. Knowing and publishing anyway is worse than not knowing.

intensity: number of unresolved questions, capped at 3. The renderer emits one question per unit, in sequence, and stops.

Neutral on ambition, people, politics, adoption. Does not soften for okonkwo — his function has no sponsor input at all, which is how that property is guaranteed rather than hoped for.

---

## 6. Kowalczyk — a lookup, not a formula

```
facts_addressed = |operational_facts ∩ addressed_by(design)| / 10
workaround_term = 1.0 - unexplained_eliminations / max(eliminations, 1)
execution_load  = load_score(new_steps, authority_gaps, unowned_queues)

score = 0.45*facts_addressed + 0.30*workaround_term + 0.25*execution_load
```

The ten operational facts are config data, not code. Each has an id, a text, an addressed_by predicate over the design levers, and the discovery path that surfaces it.

Muting: if discovery_depth < 50, return valence mixed, intensity 0.15, tag insufficient_visibility, and the renderer produces her "I couldn't tell you" line. This is not a low score. It is a refusal to score, and it must be a distinct branch or the renderer will produce opposition she would not voice.

intensity: how far into a shift the render goes. Low intensity is a moment, high intensity is an hour-by-hour walk. Pass as a render_depth tag.

Neutral on clinical, financial, and technical matters.

---

## 7. Okonkwo — pace, visibility, ambition

```
pace       = 1.0 - delay_against_fiscal_window(decision)
visibility = showable_output(decision) ? 1.0 : 0.3
ambition   = normalized(scope_and_claim_magnitude)

score = 0.45*pace + 0.35*visibility + 0.20*ambition
```

He reads sponsor_confidence back as an input, which no other advisor does:

```
if sponsor_confidence < 40: suppress offers, reduce render length, valence unchanged
if sponsor_confidence > 80: append escalation tag — asks for more
```

He is correct in two places and these are explicit overrides, not emergent:

```
if round == 7 and readiness > 75 and approach == system_wide: valence = oppose  # phase it
if round == 9 and disclosure in (none, okonkwo_only): valence = oppose          # disclose faster
```

Both must be reachable, because an advisor who is always wrong stops being consulted and the trap stops working.

He never returns a stance that instructs. His render always terminates in returning the decision, and the ownership blocklist applies to him most strictly of the six, since he is the one with actual authority.

---

## 8. Audit surface for phase two

The phase two audit is a generated table, not a code review. For each advisor, for each round, for a representative set of lever combinations, emit valence, intensity, and rationale tags. Vikram reads it and says whether those are the right instincts.

That table is the deliverable that closes phase two, and it is readable without reading any code.
