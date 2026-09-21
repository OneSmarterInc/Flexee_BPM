# Phase 8
## Tidying the interface for the fall pilot

The simulation is complete and the interface works. It was never designed as a whole — every screen exists because a specific requirement forced it into being — and it shows. This phase makes it clean, legible, and consistent enough that a room of graduate students can use it for ten weeks without the interface getting in the way.

This is a tidy, not a redesign. No visual identity work, no Flexee brand system, no new features. That comes after the pilot, when we know what to change.

---

## 1. What tidying means here

Consistency. One stylesheet system rather than five files accumulated by phase. One spacing scale, one type scale, one small palette used the same way everywhere. A heading on the documents screen and a heading on the debrief should look like the same kind of thing.

Legibility. Body text comfortable to read for long stretches, because students will read scenario text, memos, and stakeholder replies for forty minutes at a time. Clear hierarchy so the eye knows what matters on each screen.

Orientation. At any moment a student should be able to see which round they are in, whether it is open or submitted, and how to get back to the decision. The round progression work already did part of this and it should be carried through consistently.

Plain language everywhere a system message appears. Loading, empty, error and confirmation states should read as sentences a person wrote.

Laptop first. The pilot runs on student laptops in a classroom. Everything should work comfortably at typical laptop widths. Phone layout is not required.

---

## 2. The two readability items, now due

Both were deferred until the rest was done. It is done.

The expanded decision log entries render as JSON. The decision log is panel one of the debrief, and panel one exists so a student can read what they chose and pair it against panel two. Render each round's entries as readable labels and values.

The Round 10 metric monitoring panel renders as JSON. Render it as the list of metrics it is.

Decision log first.

---

## 3. What must not change

Tidying is exactly the kind of work where load-bearing decisions get smoothed away by someone trying to make things nicer. These hold.

The six interface requirements from phase 4. The Round 6 threshold field with no default or placeholder. The Round 8 rollback control showing the team's own Round 6 words beside it. The four-indicator readiness dashboard with no composite score and a fourth indicator showing a label and range but never a cause. The Round 10 metrics pre-populated from Round 3 with nothing indicating inheritance. The paginated readiness assessment. The sixty-three item folder with version 3 reachable only through file properties.

The advisor rules from phase 5. Fixed order, never sorted by valence, no aggregation or consensus count.

Panel three stays a bare list of names. No icons that rank, no colour that grades, no grouping that implies importance.

Nothing that reveals scoring. No progress bars on hidden values, no colour-coded trust, no visual weight that tells a student which document or person matters. A tidier interface that hints is worse than a rougher one that does not.

The closing beat remains the last thing on the screen, with nothing below it.

If a tidying change would touch any of these, leave that element alone and note it.

---

## 4. Instructor view

The same tidy applies, with one priority: legible under time pressure. During a release window I am scanning twelve teams for who has submitted, and the team list should make that readable at a glance. The refresh control, correction form and release override should be easy to find without hunting.

No ranking or sorting by outcome, as before.

---

## 5. Packaging hygiene

The last package included three directories that should not ship.

`.bpm-data` holds local SQLite databases from development and both cold runs. The cold-run databases may contain what a real participant typed into stakeholder conversations, so this folder should not travel in zips at all. `dist` is build output and should not ship as source. `files` is empty.

Exclude all three from the package and add them to `.gitignore`.

---

## 6. What closes this phase

Before-and-after screenshots of each student screen and the instructor view, at laptop width. A short note confirming each item in section 3 was checked and still holds. And the two readability items rendered as readable content.

One open question for me, not for you: which database the pilot runs on. That is separate from this phase and does not block it.
