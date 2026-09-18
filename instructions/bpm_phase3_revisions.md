# Phase 3 Revisions
## Two state contradictions, one voice regression, one tier definition mismatch

Reviewed against the current build. 190 tests pass, variant selection is deterministic and recorded, and the artifact objects preserve depth without fabricating content. Two judgment calls are right and worth naming: leaving the $710,000 vendor figure and the $600,000 Week 3 estimate as a deliberate document inconsistency is exactly correct, and declining to invent the missing forty-five filenames and interview pages rather than filling them is the right instinct under the no-invention rule. See section 5 for how to close those.

Four items below. The first two are contradictions rather than calibration, and they are visible in the coverage report itself.

---

## 1. Ntende trust contradiction on the disciplined path

Path A fires her full post-readout disclosure at round 4, which gates on trust at or above 65. The same run then fires `ntende_relationship_never_turned` at round 10, which gates on trust below 50. Nothing between rounds 4 and 10 on that path damages the relationship.

Either trust is decaying where it should not, or the round 10 condition is reading a value other than the one the round 4 gate read. Please trace the actual trust series across all ten rounds on Path A and report it. If there is a decay applied to stakeholder trust, it should not be there — the state spec applies drift only to sponsor confidence and financial credibility, and stakeholder trust has no drift.

Second problem in the same round. Path A fires `ntende_real_owner` and `ntende_relationship_never_turned` together. One produces Sylvia saying her first action is to remove the 2023 write-ups. The other produces her volunteering nothing and thanking the team for their time. These describe incompatible relationships and cannot both be true.

The round 10 Ntende variants need to be mutually exclusive and selected from a single condition ladder rather than evaluated independently. The ordering, from the Week 10 source: real ownership with a turned relationship, then nominal ownership or committee, then the distant professional handoff. One fires.

---

## 2. Discovery depth on the disciplined path

Path A funded both floor observation and process mining in round 2, and then fires `r8-process-variance` at round 8, which gates on discovery depth below 50.

At the specified yields — observation 30 and mining 20 at full weight, contribution proportional to allocation — a team splitting across both should be well above 50. Please report the discovery_depth value at each round on Path A and the allocation that produced it.

Two likely causes. The yields may be applied as a fraction of allocation rather than as the allocation's proportional share of a full-weight value. Or something is decaying discovery depth across rounds, which it should not — discovery depth is monotonic except for the capped recovery in rounds 3 and 4, and it never falls.

---

## 3. Marchetti voice regression

She has two rendered lines and alternates them for ten rounds. Section 4 of the phase 2 revision note asked for lines varying with focus lever and intensity rather than only with valence, and that has not changed.

The phase 2 calibration fix also overshot. She previously never opposed. She now never supports, on any path including the disciplined one. On Path A round 3 — a team that funded observation and mining and submitted a constraint claim — she says "the conclusion in week 3 is moving faster than the evidence." That is the wrong stance for that team, and it is the same sentence she uses in round 1 before they have done anything.

Two fixes. Her valence needs to reach support on a well-evidenced path; please include a test asserting support for a team above the round's required depth with the round's analytical claim submitted. And her rendered line needs to vary with focus lever: opposing on discovery depth and opposing on scope instability are different observations and read as different sentences. Her voice brief gives eight sample lines across eight rounds as the pattern to work from.

Check the other five for the same regression while you are in there. The rendered line is where the scoring functions and the voice briefs meet, and a correct stance in a canned sentence is not yet a working advisor.

---

## 4. Outcome tier definition

Path A fired no crisis — round 9 correctly rendered the benefit review — and still resolved to Win with Scars.

That tier is defined as one crisis absorbed with visible damage and at least two materially damaged relationships. A clean run cannot be in it. The tier logic appears to be reading benefit bands alone.

Tiers need to read the full definition from section 9 of the design document: defensible benefit, crisis count and containment, sustainment items funded, and stakeholder state. A run with no crisis and thin benefit is Squeak Through, not Win with Scars, and the difference matters because the tier names are read by students as descriptions of what happened to them.

While fixing this, please confirm Triumph is reachable. Generate a path that reaches it and include it as a fourth playthrough. If no reachable path exists, that is a calibration finding and I need to know.

---

## 5. Closing the deferred content

Three gaps were correctly left unfilled. Here is the disposition.

The forty-five unnamed documents in CLEARPATH_ALL: I will supply these. Do not invent them. Leave the count at sixty-three and the eighteen specified documents in place.

Readiness assessment pages 10 through 14: leave as "full interview notes" with the page count preserved and no body content. A student who pages to 11 finds notes; nothing there is load-bearing and page 9 is what matters.

Vendor deck slides other than 3, 7, 9, 12 and 14: same treatment. Preserve the fifteen-slide count, render the five specified, and leave the rest as titled placeholders. The deck is scanned, not read.

---

## 6. What closes this revision

The Path A trust and discovery series reported at each round. Ntende's round 10 variants mutually exclusive. Marchetti reaching support on a disciplined path with lines varying by focus lever. Tier resolution reading the full definition. And a fourth playthrough demonstrating a reachable Triumph.
