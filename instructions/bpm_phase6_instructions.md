# Phase 6
## Cold run findings, and one design correction

The ten-round cold run is the most valuable thing produced in this project so far. A first-time participant discovered Evidence, Documents, Advisors and People unprompted, played all ten rounds, and reached a debrief. That could not be verified against a specification and now it does not have to be.

The report is honest about what broke, which is what made it useful. Six items below.

Supplied with this phase: the Round 9 benefit review specification.

---

## 1. The domain layer is reaching the student

Four of the five reported issues are one problem. Documents render as raw JSON. Some Open controls produce nothing visible. Opening a document breaks the layout. Validation failures surface as technical JSON.

This is more serious for the simulation than it sounds, because the documents are not reference material. The Reyes memo is a person's four-page argument that nobody answered. The board deck is a thing with a slide missing between 14 and 15. Page nine of the readiness assessment is buried in fourteen pages of interview notes. All three only work if a student reads them as documents somebody wrote and left in a folder.

A memo rendered as JSON is not a buried finding. It is a data structure, and nobody browses a data structure for forty-five minutes hoping to notice something.

Every artifact needs a document view appropriate to what it is. A memo reads as a memo. A deck reads as slides with a slide list. The assessment reads as pages. The contract reads as clause-numbered text. The folder reads as a folder.

Validation messages need to be written for a student. In Round 4 a participant entered weights as decimals, the field wanted integers, and they were shown a JSON error. The validation was correct and the message was not. Every field with a type or range constraint needs a plain sentence saying what it wants.

---

## 2. Advisor conversation does not advance

An advisor answers, asks a follow-up, the participant answers the follow-up, and the advisor asks the same question again.

The participant's reply is not reaching the next turn. Whatever context is assembled for an advisor response is not including the exchange in progress, so every turn is being treated as the first.

Two things to check while fixing it. Whether stakeholder conversation has the same defect — it was built the same way and the participant used it too little for the report to say. And whether the persistence across rounds we added in phase 5 is working, which is a related mechanism and would fail the same way.

This is the highest-priority item in the phase. Free-form conversation that cannot hold an exchange is worse than the fixed prompt it replaced, because it invites a student to try and then fails them.

---

## 3. Round 9 had nothing to decide

The participant saw a decision area in Round 9 and could not find an action. They were right. Their run fired no crisis, and on that branch `crisis_responses` is never populated, so no lever instantiates. There was genuinely nothing there.

That is a gap in my specification, not an implementation error. You built what was written.

The attached Round 9 benefit review specification closes it. The no-crisis branch now carries a claim in the same family as Rounds 3, 4 and 10 — what figure the team presents to the finance committee, on what basis, and how much of what is not yet working they volunteer. It reads forward into the Round 10 board narrative, which gives the clean path the rehearsal it was missing.

The crisis branch is unchanged.

---

## 4. Round progression

The release-message and LOCKED-state fix was the right response and is already in. No further work.

Worth recording why that finding mattered: everyone who built or specified this system knows the instructor releases rounds, so nobody could have found it. It took someone who did not know.

---

## 5. What I am not asking you to change

The participant reached Squeak Through. That is a legitimate outcome for a first-time player working alone with no domain background, and nothing about it suggests a calibration problem.

The three-panel debrief displayed correctly. The report does not say how the participant reacted to panel three, which is the thing I would most like to know. If the participant is available and remembers, ask them what they made of it and send the answer. If not, that waits for the next run.

---

## 6. What closes this phase

Document views for all artifact types. Student-readable validation messages. Advisor conversation holding an exchange, with stakeholder conversation and cross-round persistence verified alongside it. The Round 9 benefit review implemented to the attached specification, with a playthrough on a no-crisis path showing the decision present and feeding Round 10.

Then a second cold run with a different participant, using the same protocol. The first one told us what breaks. The second tells us whether it is fixed.
