# Phase 4 Small Pass
## Panel three access predicates

Phase 4 is accepted. Two things are right that were the likely failure points.

The conversation layer is genuine open questioning, not structured selection, and the gating rule is implemented as written — truthful direct answers at any trust level, voluntary disclosure suppressed at low trust, in-character limitation out of lane. Submitting an unscripted question about the Monday eligibility refresh and getting Kubiak's real answer is the test that mattered, and it passed.

Panel three emits names only. No content, no round numbers, no indication of value. That panel looks unfinished by design and it survived implementation, which I had flagged as the thing most likely to acquire helpful additions.

One correction below.

---

## The problem

Panel three is an inventory of what a team genuinely never reached. Several of its predicates are currently too generous, so a team is marked as having seen things it did not.

Two clear cases.

`Tyrell's database` resolves as seen if `structured_interviews > 0` in the round 2 allocation. The design opens that database on contact at the denials bench, or on asking a denials supervisor how they categorise root causes rather than how many denials there are. Spending any amount on interviews generally is not that. A team that interviewed six supervisors in scheduling and registration and never went near denials has not found Tyrell's work.

`Marisol's card` resolves as seen if `floor_observation > 0`. The design opens the card by sitting at the desk for an hour, and explicitly not by survey, interview request, or meeting. A token observation allocation is not an afternoon at the west campus registration desk.

The same generosity likely applies elsewhere in the list. `Kubiak's eligibility feed` accepts `technical_partnership >= 60` as sufficient, but the design opens that on a process question asked of IT, or spontaneously in the round 4 readout if the framing did not accuse him. A high partnership score without either of those events is not the same thing.

---

## Why it matters

Panel three is the only part of the debrief that tells a team about doors they never opened. If it under-reports, the inventory shortens and the most useful discomfort in the whole debrief softens.

The failure is asymmetric. Wrongly listing something a team did find is a small annoyance they can dismiss. Wrongly omitting something they missed removes the one prompt that would have sent them looking for it in their own decision log.

Bias the predicates toward listing.

---

## The correction

Each item should resolve as seen only on the specific access event the design describes, not on a proxy for it.

Where the specific event is recorded in evidence or transcript state, use that. `version 3 board deck` and `page nine of the readiness assessment` already work this way, keyed to `accessedVersions` and `accessedPages`, and they are the model — an exact record of an exact access.

Where the specific event is not currently recorded, record it. A denials-bench contact and a west campus desk observation are distinct events, not thresholds on an allocation. If that means adding evidence keys, add them.

Where an item genuinely cannot be resolved to an event, list it. Do not fall back to a threshold.

---

## What closes this pass

The regenerated panel three for all four paths, with the predicate for each item stated alongside it so I can read what each one is testing.

I particularly want Path A's panel three. That team played well and still missed several things, and if the inventory comes back short for them, the predicates are still too loose.
