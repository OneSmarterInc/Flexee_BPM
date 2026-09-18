# Round 9 — The Benefit Review

Closes a gap in the original design. The no-crisis branch of Round 9 has scenario text and no levers, so a team that avoided every crisis has nothing to decide. The cold run participant found an empty decision area and was right to be confused.

This is a design correction, not an implementation defect. The specification never gave that branch a decision.

---

## 1. Why it needs one

The reward for carrying no unresolved risk into Round 9 should be a hard conversation, not a free week. A clean run currently coasts through Round 9 and meets the board cold in Round 10, which is the wrong shape — it makes crisis avoidance feel like an absence of consequence rather than a different kind of pressure.

The branch also has a specific job. The Round 10 board narrative is the last claim in the simulation and it arrives with no rehearsal. Teams on a crisis path get their rehearsal in the crisis. Teams on the clean path get nothing.

---

## 2. The situation

Scenario text is in the Week 9 content file, section 10. It stands as written. The finance committee has pulled its benefit realization review forward by three weeks. The process is nine days old. Registration times are down, the authorization queue has stopped growing without yet shrinking, and denial rate is early and noisy. Cost to collect will not move measurably for two quarters, and everyone in the room knows that and will ask about it anyway.

The team has five days. Brennan is available. Deiss will be in the room. Okonkwo needs a number.

---

## 3. The decision

A claim, in the same family as the Round 3 constraint, the Round 4 root cause, and the Round 10 board narrative.

### presented_figure — claim, composite, required

Fields:

`figure_type` — enum: `defensible_today`, `projected_run_rate`, `range_with_assumptions`, `decline_to_quantify`.

`figure_usd` — currency. Required unless `figure_type` is `decline_to_quantify`. Free entry, no default, no suggestion.

`basis_text` — free text. What the number rests on.

### disclosure_items — choice, set, may be empty

Members: `nine_days_of_data`, `queue_stopped_growing_not_shrinking`, `cost_to_collect_lags_two_quarters`, `denial_rate_still_noisy`.

Each is true, each is unflattering, and each will be found by someone in the room if it is not volunteered.

---

## 4. Scoring

Three components, consistent with the other claims.

Basis quality. Whether `figure_usd` is supportable given the team's published baseline and the state of the process at day nine. A modest figure with a stated basis outscores an impressive one without.

Disclosure completeness. How many of the four items were volunteered. This is the dominant term, because the whole point of the round is that a thin result honestly framed survives a room and a thin result oversold does not.

Type appropriateness. `projected_run_rate` at day nine is the overreach. `decline_to_quantify` is defensible and costs sponsor confidence. `range_with_assumptions` is the strongest play and the hardest to put on a slide, which Brennan will say.

### Effects

Board credibility moves up to 15 either way, driven mostly by disclosure completeness rather than by the figure.

Financial credibility moves on basis quality.

Sponsor confidence falls on `decline_to_quantify` and on any figure materially below what Okonkwo has been carrying.

The submitted figure is recorded and read by the Round 10 board narrative. A team that presents one number in Round 9 and a substantially different one in Round 10 without explanation takes a board credibility penalty. That link is the rehearsal this branch was missing.

---

## 5. Advisor stances

All six are available. Three have something specific to say.

Brennan scores this hard and it is squarely his lane. His line on `range_with_assumptions`: defensible, and harder to put on a slide. On `projected_run_rate` at day nine he asks what nine days of data supports.

Okonkwo wants a number and says so, and this is one of the rounds where he is wrong for his own reasons rather than for the team's.

Castellanos is largely silent here. It is not her lane and she should not be padded into relevance.

---

## 6. Not changing

The crisis branch is unaffected. Containment, disclosure and rollback instantiate only when a crisis fires, as now.

Attention budget does not apply to this branch. There is nothing competing for it.

The Week 9 scenario text needs no rewrite. It already describes the situation this decision sits inside.
