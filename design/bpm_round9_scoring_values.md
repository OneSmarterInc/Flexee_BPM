# Round 9 Benefit Review — Scoring Values

Supplements the benefit review specification. Ruchita was right to stop: the original was written in prose where every other lever in this project has numbers, and inventing these would have created mechanics we never agreed.

Values below are derived from the existing Round 3 and Round 4 claim patterns rather than chosen fresh, so magnitudes stay consistent with the rest of the model. Everything here belongs in the config snapshot.

---

## 1. Claim score

Same shape as `constraintWeights`. Three components, each 0 to 1, combined by weight.

```
benefitReviewWeights: { disclosure: .50, basis: .30, type: .20 }
```

Disclosure carries the most because the round's point is that a thin result honestly framed survives a room and a thin result oversold does not.

### disclosure component

```
disclosure = |disclosure_items| / 4
```

Linear. Four items, each worth 0.25.

### basis component

Measures whether the figure is supportable at day nine.

```
ratio = figure_usd / defensible_benefit_usd

basis = 1.0   if ratio <= 1.0
      = 0.6   if ratio <= 1.25
      = 0.3   if ratio <= 1.60
      = 0.0   if ratio  > 1.60
```

Then, if `basis_text` is fewer than 40 characters or contains no reference to a period, a data source, or a baseline, multiply by 0.5. A number without a stated basis is half a claim.

For `decline_to_quantify`, basis = 0.7 fixed. Declining is defensible and is not the strongest answer.

### type component

```
typeScore: {
  range_with_assumptions: 1.0,
  defensible_today:       0.85,
  decline_to_quantify:    0.6,
  projected_run_rate:     0.25
}
```

Range is the strongest play and the hardest to put on a slide, which is what Brennan says about it. Projected run rate at day nine is the overreach.

---

## 2. Scalar movements

Same triple-per-choice pattern as `published_baseline` in Round 3: sponsor confidence, board credibility, financial credibility.

### Board credibility

Driven by the claim score, not by the figure.

```
board_credibility_delta = round(-5 + 20 * benefit_review_score)
```

Range is −5 to +15. A team scoring 0.25 loses nothing much; a team at 1.0 gains 15. The floor is negative because presenting a thin result with no disclosure is worse than neutral.

### Financial credibility

Driven by basis alone.

```
financial_credibility_delta = round(-6 + 16 * basis)
```

Range is −6 to +10.

### Sponsor confidence

Two independent effects, summed.

Type effect:

```
sponsorByType: {
  projected_run_rate:      +4,
  defensible_today:         0,
  range_with_assumptions:  -3,
  decline_to_quantify:     -9
}
```

Okonkwo wants a number. The nine-point penalty for declining is his disappointment, and it sits deliberately close to the 8-to-12 "decline the sponsor" band already in the model.

Shortfall effect, comparing the presented figure against what Okonkwo has been carrying:

```
carried = savings_commitment_usd from R1 if committed, else 12_000_000

shortfall = (carried - figure_usd) / carried

sponsor_shortfall_delta = 0    if shortfall <= .25
                        = -4   if shortfall <= .50
                        = -8   if shortfall  > .50
```

"Materially below" is therefore 25 percent. Not applied when `decline_to_quantify`, which already carries its own penalty.

---

## 3. R9 to R10 consistency

Your specification of this is correct and I am adopting it as written. 15 percent relative difference, exactly 15 percent passes, above 15 percent unexplained is −10 board credibility, explained changes pass, `decline_to_quantify` skips the comparison, threshold and penalty in the config snapshot.

One addition: "explained" should be a boolean field on the Round 10 board narrative rather than text analysis. Add `figure_change_explained` as an optional boolean, defaulting false, only rendered when a difference above threshold exists.

---

## 4. Hidden score record

Record as `hiddenScores.benefit_review` with the same shape as `constraint_claim`:

```
{ disclosure, basis, type, total }
```

Never surfaced to a student. It feeds the Round 10 comparison and the instructor view only.

---

## 5. Sanity check

Two reference cases to test against.

A team presenting a range at defensible value with all four disclosures: disclosure 1.0, basis 1.0, type 1.0, total 1.0. Board +15, financial +10, sponsor −3, plus shortfall effect. Strong round, mild sponsor cost.

A team presenting projected run rate at 1.8× defensible with no disclosures and a one-line basis: disclosure 0, basis 0, type 0.25, total 0.05. Board −4, financial −6, sponsor +4 with no shortfall penalty. Okonkwo is pleased and everyone else is not, which is the correct shape for that decision.
