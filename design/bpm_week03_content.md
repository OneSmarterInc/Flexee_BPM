# The Reengineering Mandate — Week 3 Content
## Scenario text, the capacity data, and the baseline

---

## 1. Opening scenario

Three things arrived before nine on Monday.

Harold Brennan sent a one-line note asking whether you have a baseline yet, and if so, what it's measured against. He is not on the project. Okonkwo brought him in as an advisor and he bills by the day and he does not waste words.

Okonkwo forwarded a calendar invitation. Board finance committee, seven weeks out, agenda item "Clearpath — benefit realization update." He added: "Good chance to show progress. Let's talk Thursday about what we put in front of them."

And Karen Deiss's assistant called to ask whether you could stop by. Not a meeting. Stop by.

You went at 2:00. Deiss had a printout on her desk, which is unusual for her, and she turned it around so you could read it. It was Doug's board deck from four months ago, open to slide 14. Three point one million realized.

She said: "Two quarters ago the finance committee asked for a reconciliation of that figure. Gerald told them we'd bring it to the next quarterly. We didn't. It's on the agenda again in seven weeks." She let that sit. Then: "I'm not asking you to fix something you didn't break. I'm telling you what's coming, because I'd rather you heard it from me than from them."

You asked what the reconciliation would show. She said she didn't know, which you don't entirely believe, and then she said something you do believe: "Three point one million against what? That's the whole question. Nobody has ever answered it in writing."

By Friday you owe two things. A read on where this process is actually constrained. And a number, or a decision not to give one.

---

## 2. The capacity data

Available to any team that asks for it, in whatever form their Week 2 discovery earned. A team that funded process mining gets it clean. A team that didn't gets it from supervisors, in pieces, with gaps, and has to assemble it.

Daily arrival volume against daily processing capacity, front-end stations, averaged over the last two quarters.

| Station | Arrivals | Capacity | Output |
|---|---|---|---|
| Scheduling | 1,840 | 2,100 | 1,840 |
| Registration and data capture | 1,840 | 1,950 | 1,840 |
| Eligibility verification | 1,840 | 2,400 | 1,840 |
| Prior authorization | 610 | 519 | 519 |
| Financial clearance | 519 | 640 | 519 |
| Charge capture | 1,840 | 1,900 | 1,840 |
| Claim submission | 1,795 | 1,720 | 1,720 |

Two stations are underwater. Authorization runs at roughly 85 percent of what arrives, a shortfall of about 91 cases a day that has persisted for twenty-two months and is why the queue has a slope. Claim submission runs at about 96 percent, a shortfall of 75 a day, which is where the untimely-filing write-offs come from.

Authorization is the binding constraint. Submission is a second constraint downstream, real but smaller, and it is where Janine Reyes put her money.

Two further conditions belong to authorization and neither is fixable by adding staff. Surgery scheduling runs six weeks out and authorization cannot be initiated until four weeks out, so a two-week window is structurally unavailable regardless of capacity. And the scheduling module and the authorization workqueue do not share a patient identifier for self-pay conversions, so a portion of arrivals enter the queue without a traceable origin.

Eligibility verification runs at 76 percent utilization. It has spare capacity. It is the station Doug automated.

---

## 3. The baseline problem

Also available: the composition behind the four headline numbers, for teams that go after it.

Cost to collect at 4.2 percent, or 77.3 million, is not one number. It is 340 FTE in salary and benefits, the vendor contract on denials, the RPA license and maintenance, clearinghouse fees, and an allocation of IT support that finance applies by headcount rather than by usage. Two of those line items were not in Doug's baseline at all. The RPA license and maintenance is one of them.

Doug's 3.1 million realized consists of 1.9 million in reduced overtime in verification, 0.8 million in avoided hiring against a growth forecast, and 0.4 million in a denial rate improvement that finance attributes to a payer contract renegotiation that closed the same quarter.

So: 1.9 million is cost reduction and is real. 0.8 million is cost avoidance measured against a forecast nobody has revalidated. 0.4 million belongs to someone else. And the RPA license and maintenance running against it, roughly 0.6 million annually, appears nowhere.

Brennan will not tell a team this. He will ask what the 3.1 million is composed of, and then he will ask what category each component is, and then he will stop talking.

---

## 4. The decision

Your read on the constraint goes in writing this week, because the Week 5 design work has to start somewhere and the organization needs to know where you think the problem is.

And the number. Four ways to go.

Adopt the inherited baseline and continue reporting against it. It's the organization's published position, Okonkwo has defended it to the board, and changing it in your third week is a statement about your predecessor and your sponsor.

Restate it with a documented methodology. Publish what's in it, what isn't, and what the resulting savings figure actually is. It will be smaller than 3.1 million.

Publish a range with the assumptions stated. Defensible, honest, and harder to put on a slide.

Defer, pending further analysis. Costs you nothing this week.

Okonkwo wants something for the Thursday conversation. He has not said which of these he wants and would be uncomfortable if you asked him directly.

---

## 5. Design notes

The capacity table is the entire Week 3 analytical payload and it is presented without commentary. Nothing labels authorization as the constraint. A team that reads the table has it in about ninety seconds. A team that never asks for the table can still submit a constraint claim and will be guessing.

The three scoring components of the constraint claim map to the table this way. Naming authorization is the location. Getting the shortfall roughly right, around 91 a day or 15 percent, is the arithmetic. And noticing that eligibility verification runs at 76 percent utilization — that Doug automated a station with spare capacity — is the implication, which is worth the most and which the table supports without stating.

Submission being a genuine second constraint is deliberate. It makes Reyes's memo defensible rather than simply wrong, and it means a team that names submission is not stupid, just less right. Partial credit should reflect that.

Deiss's scene is the highest-value stakeholder interaction available before Week 4. She is telling a team something costly and she is doing it early, and how they respond determines whether she is an ally in Week 9 when the reconciliation lands. Her line about not asking them to fix what they didn't break is genuine.

The 0.4 million attributed to a payer renegotiation is the detail most likely to be missed and the one Brennan cares about most, because it is the difference between a number being wrong and a number being someone else's.

Okonkwo's discomfort if asked directly is real and should be implemented. He will say it's the team's call, and mean it, and be disappointed by whatever they choose if it isn't fast.
