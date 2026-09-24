# Round 8 Dashboard Completion
## The dashboard is visible for the first time, and it is a placeholder

The Round 8 fix is accepted. The screenshots confirm four indicators now appear before submission, and the test proving they stay identical across different cutover controls is exactly right.

Making the dashboard visible exposed a problem nobody could see before, because no student had ever seen this screen. It predates your work. It needs fixing before the pilot, and this note authorizes the changes.

---

## 1. What is wrong

In the second screenshot, the scenario text says "The fourth indicator records no additional exception beyond the three visible readiness dimensions." Directly beside it, the fourth indicator says "An unresolved condition may affect cutover." They contradict each other on the same screen.

The cause is in `dashboard()` in the engine.

Technical readiness is real, derived from technical partnership. Process readiness is real, derived from discovery depth. Staff readiness is hard-coded to "mixed" for every team. The fourth indicator is hard-coded to "attention" with the same generic label and range for every team, and never reads the risk register.

So a clean team is told something is unresolved, and a team carrying heavy automation debt sees the identical generic warning. The fourth indicator is the most important thing on the Round 8 screen and it currently carries no information.

The scenario narrative beside it is correct. Its fourth-indicator variants are properly conditional and include a default for teams with nothing unresolved. The dashboard should agree with it rather than the other way round.

---

## 2. Staff readiness

Derive it from the readiness score computed at Round 7, which already combines executor position, frontline participation, training investment and discovery depth. That is precisely what staff readiness means in this design.

At 75 or above, strong. From 40 up to 75, mixed. Below 40, fragile. These are the same readiness thresholds the design already uses for whether Week 8 is uneventful or damaging on its own.

---

## 3. The fourth indicator

The narrative and the dashboard must read the same source, so they cannot disagree. Extract the existing Round 8 narrative condition ladder into one shared selection function, evaluated on state as of Round 7 close, and have both the narrative variant and the fourth indicator use it.

When a condition matches, the fourth indicator shows status "attention," the specific label from the ladder, and a consequence range. When nothing matches, it shows status "clear" and a label saying no additional exception is recorded, with no range.

Labels and ranges, taken from the existing narrative text:

Exception handling — unvalidated. Range: 340 to 900 exceptions per day at go-live.

Change window — constrained. Range: any defect after go-live may wait up to eleven days.

Workforce — notice period incomplete. Range: go-live may be contested.

Process variance — undocumented. Range: an unknown number of workflows differ from the documented process.

Vendor transition — month one. Range: unproven at full daily volume.

Label and range only. Never the cause. The narrative can carry more; the dashboard cannot.

When more than one condition matches, show the first in ladder order and a count of the rest, such as "plus two others." The Week 8 design specifies this, and it tells a team their problem has more than one part without telling them what the other parts are.

---

## 4. The opening scenario sentence

The Round 8 base text states "Technical readiness is green. Process readiness is green. Staff readiness is amber." A team whose technical readiness is blocked reads "green" in the text and "blocked" on the dashboard.

Remove the three status claims from the base text. Replace them with a neutral sentence such as "The readiness indicators came in at four o'clock." The dashboard carries the statuses. Leave the rest of the paragraph as written. This is a content change and it is authorized.

---

## 5. The Round 6 trigger readback

The trigger specification still renders as raw JSON, for example `{"threshold":25,"authority":"VP Applications"}`.

"Verbatim" in the design meant the team's own values, not paraphrased or interpreted. It did not mean the storage format. Render it as the team's values with plain labels, for example "Threshold: 25. Authority: VP Applications." Do not round, reword, or add commentary. If no trigger was specified, keep the existing "No rollback trigger on file."

---

## 6. Must not change

Round 8 close, risk calculation and crisis selection stay as they are. The indicators remain frozen at Round 7 close and must not change with Round 8 levers. Your existing regression test must still pass. Golden fixtures may change only in the dashboard snapshot and the Round 8 narrative text. If anything else in a golden result moves, stop and report it.

---

## 7. What closes this

Add tests showing that the narrative variant and the fourth indicator always select the same condition, that a team with nothing unresolved sees "clear," and that staff readiness follows the readiness score.

Then three screenshots at Round 8 open: a clean team, a team with high automation risk debt, and a team with low technical partnership. In each, the text and the dashboard must agree.
