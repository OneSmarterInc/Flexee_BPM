# Non-Submission Representation
## A design decision, resolving the five blocked rounds

Phase 7 items A and B are accepted. Authentication fails closed, gates before body parsing, and returns a plain 404 with no authentication-specific response. Correction works within the open round, preserves original submitter and timestamp, records the change, and keeps the audit away from students. 447 tests.

Item C stopped correctly. Five rounds have no valid passive representation, and every available workaround would fabricate work a team never did. Refusing to invent a constraint claim or a basis sentence was the right call, and the table of exactly where it breaks is what made this decidable.

This is the decision.

---

## 1. The principle

A non-submission is not a submission with passive values. It is a recorded absence.

The current implementation treats it as a payload, which works where a genuinely passive value exists — continue rather than change, empty sets, zero spend — and cannot work where the lever is a claim. There is no passive constraint claim. There is no neutral root cause. Any value the system supplies is an analysis the team did not perform, and scoring it means scoring something nobody said.

So the representation changes. Where a lever has a passive value, the existing implementation stands. Where it does not, the lever is recorded as absent, and absent is a distinct thing from any value the lever can hold.

---

## 2. What absent means in scoring

An absent lever scores zero on every component. Not a low score against a wrong answer — zero, because there is nothing to score.

For the Round 3 constraint claim, that is zero on location, zero on arithmetic, zero on implication. For Round 4, zero on components, zero on weights, and zero on framing, which also means no stakeholder consequence, because a team that said nothing has not named anyone.

That last point matters and is worth being explicit about. Framing carries the political cost in Round 4. A team that never submitted has not blamed anybody, and the absence should not be silently converted into the mildest framing, which would be a small gift.

---

## 3. What absent means for the artifacts and recovery

No analytical artifact is produced. The bottleneck map has no stations and the metric set has no entries, because no analysis occurred. Rather than forcing an empty artifact through validation that requires at least one entry, no artifact is created for that round at all, and downstream consumers treat its absence as absence.

Round 3 analytical recovery is not granted. Recovery exists because a team went back and did work they had skipped. A team that submitted nothing did no work, and granting recovery would make a missed round better than a thin one.

Round 3's metric set carries into Round 10, where it pre-populates the monitoring field. A team with no metric set arrives at Round 10 with nothing pre-populated, which is its own true consequence and needs no special handling beyond not crashing.

---

## 4. Round 2 specifically

Discovery allocation has no passive value because the schema requires the keys to total 100. The honest answer is zero across all four.

Record the allocation as absent rather than as a zero-summed payload, and have discovery depth accrue nothing for that round. Leave the ordinary schema untouched — a submitting team still allocates exactly 100.

I am accepting the consequence. A team that misses Round 2 carries near-zero discovery depth for the rest of the game, which degrades every downstream analysis and cannot be fully recovered. That is severe and it is correct. It is also the round where I would chase a team by phone before releasing, and that is a teaching decision rather than a software one.

---

## 5. Round 9 without crises

The benefit review requires basis text. A non-submission has no basis, and writing one would put a sentence in a team's mouth.

Record `presented_figure` as absent. Disclosure completeness scores zero, since nothing was volunteered. Basis scores zero. Type appropriateness does not apply and contributes nothing rather than defaulting to any type.

The Round 10 board narrative reads the Round 9 figure to detect an unexplained change. With no Round 9 figure, there is no comparison and no consistency penalty. A team that missed the review is not additionally punished for inconsistency with a figure they never gave.

---

## 6. What students see

The decision log shows the round as a non-submission, not as a set of values. A student reading panel one should see that they missed the round, not a list of choices they did not make.

This is the same distinction as choosing to defer versus failing to submit, and it needs to survive into the debrief evidence.

---

## 7. What this does not change

Ordinary submissions, correction, and normal release keep their existing rules and validation. The five rounds with genuine passive values keep the implementation already built. No schema loosens for submitting teams.

The override still requires explicit confirmation with outstanding teams named, and the atomicity at the service boundary stays as built.

---

## 8. What closes this

The five blocked rounds resolving through absence rather than through a payload, with an override exercised across all ten rounds on a test game to confirm no round produces an invalid state.

And confirmation that a team with absent claims in Rounds 2, 3 and 4 still reaches a debrief at Round 10 with a coherent outcome tier rather than an error.
