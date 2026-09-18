# Phase 3
## Scenario content, in-world artifacts, and conditional narrative

Do not begin until the phase 2 audit grid has been reviewed and signed off. Content built on miscalibrated advisors means rework in both layers.

Files supplied with this phase: ten week content files, and the artifacts file. The advisor and stakeholder voice briefs were supplied in phase 2 and remain authoritative.

---

## 1. Scope

Phase 3 is the narrative layer: what a student reads, in what order, and which variant they get. It is not interface work. Where a decision seems to require a UI choice, note it and move on — interface instructions follow separately and will be written against what exists rather than in the abstract.

Three things are in scope. The ten rounds of scenario text with their conditional beats. The four in-world artifacts as browsable objects. And the stakeholder conversation layer, which is where the voice briefs stop being reference material and start being behaviour.

---

## 2. Conditional beats

Most rounds have variants that depend on prior state. These are marked in the week files by their conditions rather than by a naming convention, so they need extracting into a variant table before implementation.

The pattern is always the same: a condition over state or prior levers, and a block of text. Some are small, like whether Marisol is using her card in round 8. Some are the difference between a scene happening and not happening, like Sylvia's disclosure after the round 4 readout.

Two rules that matter more than they look.

A variant that does not fire leaves no trace. There is no "you did not receive this" message, no greyed-out block, no indication that another version existed. The round simply reads differently and the student has no way to know.

Variants are selected at round open from state as of round close of the prior round, and recorded in the round result so a replay produces identical text. The config snapshot must cover variant selection.

---

## 3. The four artifacts

These are objects a student can open, not scenario text. Doug's board deck, the readiness assessment, the vendor presentation, and the Article 14 contract language.

Three implementation requirements.

The board deck has four file versions. Version 4 is what students see by default. Version 3 exists, is reachable, and contains a savings composition slide that version 4 does not. Reaching it should require the same kind of action reaching an old version of a real file requires — file properties, a version list, something equivalent. It must not be listed as a separate document in the folder.

The readiness assessment is fourteen pages and page one is not a summary. Page nine carries the two hundred thousand dollar east campus fix. If the interface presents the assessment as a scrollable single view with no sense of depth, page nine stops being buried and the round 7 lesson weakens. Pagination or an equivalent is load-bearing here.

The inherited document folder holds sixty-three documents. Six of them matter. The other fifty-seven need to exist as plausible titles with plausible contents, because a folder with six documents in it announces which six matter. This is filler that has to be good enough not to read as filler.

Article 14 renders as contract language, including the waiver clause at 14.6. A student should be able to work out the sixty-day arithmetic themselves and should be able to see that a waiver is theoretically available.

---

## 4. Stakeholder conversation

Nine stakeholders with two-dimensional state, each holding disclosures behind gates. Phase 2 established the state. Phase 3 makes them talk.

The governing rule, which applies to all nine: gating is on what a stakeholder volunteers, never on what they confirm. A direct question is always answered truthfully, including when the truth costs them. Low trust means a student gets every fact they asked for and no fact they did not think to ask for.

This rule is what makes low-trust states dangerous rather than merely unhelpful, and it must survive implementation. If a low-trust stakeholder deflects a direct question, the design is broken.

Each brief specifies what is withheld and what opens it. Those gates are the content of this layer. Implement them from the briefs rather than inferring them from trust thresholds alone — several open on a specific question rather than on a state value, and Kubiak's gate on the eligibility feed is technical partnership rather than his own trust.

Reyes has no calendar entry and appears on no stakeholder list. She is reachable only by a student who notices the memo has an author and asks where that person went. Her presence must not be advertised anywhere in the interface.

---

## 5. Advisor rendering

The stances are computed. This phase renders them.

The voice briefs specify register, rhythm, forbidden vocabulary, and sample lines across rounds. The forbidden lists are hard constraints and should be enforced at the render layer rather than trusted to a prompt. Marchetti never says methodology or framework. Oyelaran never says caution or risky. Castellanos never says buy-in. Brennan never says transformation. These are not stylistic preferences, they are what keeps each advisor from collapsing into a generic consultant.

Rendered lines vary with focus lever and intensity, not only with valence, per the phase 2 revision note.

Two render behaviours are specified in the briefs and need explicit implementation. Castellanos returns forward-only from round 8, which forbids retrospective content. Kowalczyk's muted stance renders her refusal line rather than any form of opposition.

---

## 6. What closes this phase

A complete playthrough, read as a student would read it, across three paths: a disciplined team, a team that skipped discovery, and a team that took Option D. I want to read the actual text of all thirty rounds and tell you whether it holds together.

Alongside that, a variant coverage report showing which conditional beats fired on each path and which did not. That is how we find out whether any variant is unreachable.

---

## 7. Not in this phase

Interface and layout. The debrief panels. Faculty view. Outcome tier presentation. All of those follow, and the debrief in particular has design constraints that are easy to violate accidentally, so it should not be improvised ahead of its instructions.
