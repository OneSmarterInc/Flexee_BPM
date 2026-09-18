# Cleanup
## Before the pilot

The access-history fix is accepted. 384 tests.

Finding that `replayGame()` had no access merge at all — losing ordinary accessed and discovered flags and generated artifact records, not just the version and page arrays — was a wider hole than the one reported, and finding it required looking past the symptom. Correctly ruling out SQLite as the cause rather than reaching for a schema change was the right diagnosis.

Development is done. What follows is housekeeping so the repository is legible to someone who joins later, and a short pilot-readiness list.

---

## 1. Repository organisation

There are 44 markdown files in the project root. They fall into three kinds and are currently indistinguishable.

Design inputs, which came from me and are authoritative: the design document, the three build specs, the advisor and stakeholder voice briefs, the ten week content files, the artifacts file, the CLEARPATH filenames, the Round 9 benefit review specification and its scoring values.

Instructions and feedback, which are a record of the conversation and are historical: everything named for a phase or a pass.

Implementation reports, which you produced and which document what was built.

Please separate them into directories — something like `design/`, `instructions/`, and `reports/`. Filenames with spaces should be normalised to underscores while you are there.

One rule for the future: if a design input and an implementation report ever disagree, the design input is authoritative. Worth stating in the README so nobody has to reconstruct that.

---

## 2. README

The current README should say, in a page or less, what this is, how to run it, how to seed a game, how to run tests, and where the three kinds of document live.

Someone who joins this project in eighteen months should be able to start it without reading any of the phase history.

---

## 3. DESIGN_UNRESOLVED

Reconcile it against what is actually outstanding. Several items have been closed since they were entered — the CLEARPATH filenames were supplied, the readiness assessment pages and unrendered vendor slides were confirmed as permanent placeholders, and Reyes content was delivered.

What should remain is only what is genuinely open. If nothing is, say so and leave the file as a record with a closing note.

---

## 4. Stray file

`index.html` sits in the project root. If it belongs to the build, fine. If it is a leftover, remove it.

---

## 5. Pilot readiness

Three things I will need and would rather have now than in week one.

A seeding path for a section. Twelve teams in one game, with their codes produced in a list I can distribute. The existing `npm run seed` makes one team.

A short operating note for me, not for students. How to release a round, what happens if a team has not submitted when I release, how to correct a submission if a team makes an obvious error, and how to start a game over.

Confirmation of what happens when a team submits nothing for a round. The simulation has ten rounds and twelve teams and at some point someone will forget. I would rather know the behaviour than discover it.

---

## 6. Not needed

The two readability items deferred earlier stay deferred unless there is spare time: the Round 10 metric panel and the expanded decision log. If there is time, the decision log first.

The editable-field behaviour on a completed game needs nothing.

No further cold runs. The panel three question waits for the pilot.
