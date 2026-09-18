# Flexee BPM standalone calibration — bpm-v1

These are standalone implementation calibration values approved for `bpm-v1`; they are not quoted values from the original source documents unless explicitly marked source-defined.

| Config key | Selected value | Design purpose | Test coverage |
|---|---|---|---|
| `stations` | scheduling, registration, verification, authorization, financial clearance, claim submission, denial management | Ratifies seven stations without the prototype's guessed charge-capture step. | calibration and golden tests |
| `discovery` | multipliers 1.15/1/.85; coverage .45/.72/1 | Separates concentrated depth from whole-system understanding. | discovery comparison tests |
| `claimScoring` | constraint .30/.25/.45; root cause .55/.45 | Makes implication primary and keeps analysis separate from framing. Arithmetic bands: ±5=1, ±10=.75, ±20=.40. | boundary, paraphrase, political tests |
| `readiness` | linear .60–1 discovery factor; $700K training cap | Implements the approved readiness structure and tradeoff. | interpolation and cap tests |
| `durations` | 28/42/14 days | Drives configured union-notice, Epic-freeze, and fiscal-deadline calculations. | duration and golden tests |
| `budget.controlCosts` | $240K/$400K/$160K/$320K | Approved Phase 3 narrative-aligned prices for command center, parallel run, fallback, and rollback. | pricing and ledger tests |
| `budget.sustainmentCosts` | $180K/$120K/$90K/$160K; rebuild $85K | Prices sustainment and optional metric reconstruction. | pricing and inheritance tests |
| `sustainmentRetention` | .55/.68/.80/.91/1 | Preserves benefit by funded sustainment count. | retention tests |
| `automationDebt` | inherited 18; missing 14/16/13/12/15 | Makes substantive governance reduce debt. | risk and golden tests |
| variable risks | credibility 0/5/10/15; authorization A/B/C/D 0/5/10/15; sourcing 0/1/1.5 | Completes gated exposure components. | band and multiplier tests |
| `risks.restatement.commitmentGapFullScaleUsd` | $12,000,000 | Normalizes only the positive difference between the R1 commitment and the R3-supported amount to the source-defined 0–20 contribution. The supported amount reuses the configured `redesign_structure_intact.B` benefit cell, multiplied by R3 analytical support and the published-baseline method modifier. | final acceptance commitment-gap tests |
| `attention` | 100; containment 0/25/55/70; disclosure 0/5/10/20/30; rollback 20/40 | Makes multi-crisis response a visible constraint. | cost and rejection tests |
| crisis response | `.35 + .65 × severity_factor`; containment 1.2/.9/.65/.5; rollback .75/.85 | Scales configured damage while retaining minimum consequence. | severity and response tests |
| benefit matrix | refine 4.5/6.8/9.2/10.8M; intact 5.6/8.5/11.8/13.5M; clean-sheet 6/9.5/13/15M | Establishes base benefit by redesign and automation. | pipeline and golden tests |
| readiness factor | `.50 + readiness/100 × .50` | Allows partial delivery under weak readiness. | pipeline tests |
| credibility | financial .55, board .45; factor `.45 + score/100 × .55` | Produces defensible benefit through arithmetic. | credibility tests |
| baseline modifiers | 1/.92/.80/**.53** | Proposed inherited .68 allowed $10.2M defensible. .53 is the smallest two-decimal reduction capping the theoretical maximum at $7.95M. | maximum-path invariant test |
| outcome thresholds | Triumph crisis <55 and fully contained; relationship damage 20; defensibility ratio <.75 | Implements explicit tier boundaries without student leakage. | outcome and golden tests |
| advisors | mandated weights; bands .55/.20/-.20/-.55 | Produces deterministic five-band stances and advisor modifiers. | stance and golden tests |

The final acceptance pass also restored ordinary state movements required by the source design: target-state participation moves participant position, substantive IT process engagement moves Kubiak trust, and IT inclusion improves the slow-to-gain `technical_partnership` scalar. These are normal decision effects, not golden-fixture exceptions.

All approved crisis maximum state, delay, and benefit vectors are centralized in `src/domain/config.ts` and exercised by severity, response, and golden-scenario tests.
