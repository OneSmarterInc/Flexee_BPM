# Phase 2 Revisions
## Audit table structure, one spec amendment, three calibration fixes

Reviewed against the 3 September build. 165 tests pass, no UI drift, and the deterministic separation is holding. Two things are right that were easy to get wrong: Oyelaran's high-depth-low-parameters override fires at 0.9 as specified, and Kowalczyk's muting produces a refusal to score rather than a low score. Both were subtle and both are correct.

What follows is one structural change to the audit output, one amendment to the advisor spec where the original spec was wrong, and three calibration fixes.

---

## 1. The audit table must be a grid, not a diagonal

Currently the scenario rotates with the round. Marchetti R1 is "disciplined team," R2 is "weak discovery," R3 is "aggressive automation," and so on. That produces one data point per advisor per round.

The purpose of the table is to let a reader see how the same advisor responds to different situations in the same round. A diagonal cannot show that. Every calibration issue in section 3 was invisible in the current output and became obvious the moment the values were computed across scenarios.

Regenerate as a full cross product: every advisor, every round, every scenario. Roughly 420 rows. Length is not a problem — the table is scanned for anomalies, not read linearly.

Sort by advisor, then round, then scenario, so a reader can run their eye down a single advisor's column and see the shape of their instincts change.

Add two columns: the component values that produced the score, and the valence band boundary that was crossed. When a stance looks wrong, the first question is always which term drove it.

---

## 2. Spec amendment — Castellanos executor term

This is a correction to the design spec, not an implementation error. The original section 4 said to average position across the executor set, and that was implemented faithfully. The spec was wrong.

Ferrara and Boyce start at position 8 and 12 by design, because nobody has ever asked them anything. Averaging them in from round 1 puts Castellanos's executor mean on the floor before a team has made a single decision, so she opens the simulation at maximum opposition with nowhere left to go. That is not her character.

The deeper problem is that the current formula cannot distinguish the two most different things a team can do. A team that has met nobody and a team that has met everyone and alienated them produce the same score.

Replace the single executor term with two.

```
contacted        = |executors the team has engaged| / 4
executor_position = mean(position of contacted executors only)   # null if none contacted

score = 0.30*contacted
      + 0.20*(executor_position_norm if any contacted else 0.5)
      + 0.30*participation
      + 0.20*timing
```

Uncontacted executors do not depress the position average. They register in the contact term instead, which is what Castellanos would actually notice. She is not disappointed that Ferrara's position is 8. She is noting that nobody has met Ferrara. Those are different observations and only one of them is hers.

Engagement is defined as any interaction with that stakeholder, not a favourable one.

Expected behaviour after the change. Low contact and no position signal in early rounds produces a question about not having been to the floor, at moderate intensity. Full contact with a low average produces her sharper stance. Intensity should be able to rise across the arc rather than starting at ceiling.

---

## 3. Three calibration fixes

### Marchetti never opposes

In the current table she returns support in every row including weak discovery. The cause is term weighting: altitude and sequence contribute 0.55 before evidence enters, so a team at discovery 25 in round 9 scores 0.738 and lands above the support band.

Evidence is meant to be her dominant term. Two options — raise the evidence weight so it can carry the score below 0.45 on its own, or make altitude a gate rather than an additive term, so failing to reach the round's level caps the score instead of contributing to it. The second is closer to the design intent, since altitude skipping is described as her sharpest negative rather than as a missing bonus.

After the fix, a team at discovery 25 in round 5 or later should land in oppose. Please include that as a test.

### Oyelaran speaks before his levers are open

He is producing parameter_set stances in rounds 1 through 5. No automation lever exists until round 6.

He should return a minimal or null stance before round 6, with the exception of round 1, where the inherited pilot is already operating against unspecified parameters and a light stance is appropriate. Do not have him reference parameters that cannot yet be set.

### Okonkwo's correct moments never fire

Both mandated overrides are implemented correctly in the code — round 7 phasing when readiness exceeds 75, and round 9 disclosure. Neither appears in the audit table, because the diagonal never places him in a round where the conditions hold.

The grid should surface both. If it does not, the scenario set needs a case that satisfies each condition. These two stances must be visibly reachable, because an advisor who is never right stops being consulted and the design depends on him remaining worth listening to.

---

## 4. Rendered voice

Every Marchetti row in the current table renders the same sentence. Her brief specifies that she never repeats a concern in the same words twice, and the same principle applies to the other five.

The rendered line should vary with focus lever and intensity, not only with valence. Marchetti opposing on discovery depth and Marchetti opposing on scope instability are different observations and should read as different sentences.

This is the column that will be read most closely at review, because it is where the scoring functions and the voice briefs meet. A correct stance rendered in a canned sentence is not yet a working advisor.

---

## 5. What closes this revision

The regenerated grid, with the component and band columns, and with Marchetti reaching oppose, Castellanos not pinned at ceiling in round 1, Oyelaran quiet before round 6, and both Okonkwo overrides visible somewhere in the table.

No new content files are needed for this pass. The ten week scenario files and the in-world artifacts are phase three.
