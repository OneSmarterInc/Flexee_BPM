# Phase 6 Corrections
## One interface leak, one scoring band

Phase 6 is otherwise accepted. 310 tests.

The work is faithful and three things are better than asked for. Documents render as documents and the sixty-three-entry folder kept its disorder — the competing FINAL names, the OLD_donotuse, the Copy of, all preserved without search or filtering added. Advisor conversation now acknowledges an answer and advances rather than replaying the prompt, and stakeholder direct factual answers still take precedence on later turns, which was the harder half. And `hiddenScores.benefit_review` is absent from student projections, with the config snapshot reproducing through SQLite reload.

Two corrections.

---

## 1. The Round 10 explanation control leaks the rule

The optional explanation control appears only when the entered Round 10 figure differs from the Round 9 figure by more than fifteen percent.

That reports the scoring rule back to the student. A student typing into the figure field watches a control appear, disappear, and reappear, and can locate the fifteen percent boundary in under a minute without understanding anything about the simulation. It is the same class of error as showing a risk meter: the interface is telling them what is being measured.

It is also self-defeating. The penalty exists because presenting one number and then a substantially different one without explanation is a credibility failure. A student who is told when they have crossed the line will explain every time, and the decision stops being a decision.

The control should always be present. A free-text field, always available, always optional, labelled so it reads as an opportunity rather than a prompt — something along the lines of "anything you want the committee to understand about how this figure was arrived at."

A team that changes their figure by two percent and writes an explanation has lost nothing. A team that changes it by forty percent and leaves the field empty has made a choice.

The same principle applies anywhere else a control is conditional on a scoring threshold. Please check for others.

---

## 2. The basis band rewards sandbagging

Basis currently scores on the ratio of presented figure to defensible figure, at 1.0 for any ratio at or below 1.0, then 0.6, 0.3 and 0.0 as the ratio rises.

So a team presenting one million against a six million defensible figure scores basis 1.0, identical to a team presenting a well-judged six. Undershooting by a factor of six is costless.

That is not what the specification meant. A modest figure with a stated basis outscoring an impressive one without is correct. Arbitrarily low is a different failure — it is a team that did real work and cannot say what it was worth, and at a benefit realization review that has consequences of its own.

Add a lower band. Below roughly 0.6 of the defensible figure, basis begins to fall; at or below roughly 0.3, it falls substantially. The exact values are yours to set in line with the existing band spacing, so long as the shape is a peak around the defensible figure rather than a plateau extending to zero.

Brennan needs a line for this case. He is the advisor who would notice, and his lane is whether a number will survive contact rather than whether it is large. Something in the register of asking why the figure is a third of what the team can defend.

Sponsor confidence should also fall on a materially low figure, which the carried-commitment shortfall movement already handles. Confirm that shortfall scoring is triggering on the underclaim case and not only on figures below Okonkwo's carried number.

---

## 3. One note, not a correction

The basis text check — under forty characters, or no period, or no data-source reference, halves the score — is a form test rather than a substance test. A student passes it with "Based on the restated baseline." and a genuinely good thirty-five-character basis gets halved.

Leave it. It is a reasonable proxy and the alternative is scoring free text properly, which is not worth the complexity here. But it should be described in the implementation map as a completeness heuristic rather than as measuring whether the figure is supportable, so nobody later mistakes it for the latter.

---

## 4. What closes this

The explanation control always present, and a check for other controls conditional on scoring thresholds. The basis band peaked rather than plateaued, with Brennan's underclaim line and shortfall scoring confirmed on that case.

Then the second cold run, with a different participant, same protocol.
