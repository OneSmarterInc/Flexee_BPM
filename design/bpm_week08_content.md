# The Reengineering Mandate — Week 8 Content
## Scenario text, the dashboard, and the decision that isn't the one it looks like

---

## 1. Opening scenario

Sunday night. The cutover, if it happens, begins at 6:00 Monday morning when the east tower registration desk opens.

You have been in the building since Thursday. Everyone has. There is a room on the second floor that has become the room, with a whiteboard and a phone bridge and four laptops and a box of granola bars somebody's assistant brought on Friday and nobody has opened.

The readiness indicators came in at 4:00 this afternoon. Four of them. They are not a score and Castellanos would not give you one.

Technical readiness. Green. The build passed integration testing Thursday. Two defects open, both cosmetic, both logged with workarounds.

Process readiness. Green. Documentation complete, workflows configured, the run book exists and has been walked twice.

Staff readiness. Amber. West campus is ready. East campus is where it is, which depends on what you funded three weeks ago.

The fourth indicator is different every time and it is the one you have been looking at since 4:00.

Okonkwo has called twice. Not to pressure you. To ask whether you need anything, which is a form of pressure that is harder to decline.

Sylvia is in the building. She did not have to be.

---

## 2. The fourth indicator

Conditional. It is the accumulation of whatever the team has not resolved, expressed as one line on a dashboard.

If automation risk debt is high: "Exception handling — unvalidated." Underneath, in smaller type: projected exception volume at go-live, 340 to 900 per day, range wide because the rules have not been run against production data. The range is the tell. Nobody knows.

If technical partnership is low: "Change window — constrained." The freeze is enforced. Any defect found after 6:00 Monday waits eleven days for a patch.

If the notice period was mishandled: "Workforce — notice period incomplete." Legal has flagged it. Nobody has said what happens if you proceed.

If discovery was shallow: "Process variance — undocumented." Four workflows at the east campus do not match the documented process and were discovered Friday. Nobody knows how many more there are.

If sourcing was chosen: "Vendor transition — month one." The BPO has staffed to plan and has not yet run a full day of volume.

If more than one applies, the dashboard shows the worst and a count. "Plus two others."

---

## 3. The decision

Go, or don't.

Delay costs the fiscal year window, which costs the board meeting, which costs Okonkwo something he cannot get back. It also costs benefit realization inside the year, which changes what the Week 10 number can be. And it materially reduces what Week 9 does to you.

Proceeding is what most teams do. It is not automatically wrong. What makes it right or wrong is the second decision, which most teams treat as budget administration.

---

## 4. Cutover controls

Four items, priced against whatever remains after Week 7.

Command center. Staffed room, first five days, dedicated bridge, someone senior awake at each site. Two hundred forty thousand.

Parallel running. The old process continues alongside the new for the first two weeks, with reconciliation between them daily. Four hundred thousand and it slows everything down, and it is the only control that catches a systemic error before it has been systematically wrong for a week.

Manual fallback. Documented procedures for running each function without the automation, tested once before go-live, available to any supervisor. One hundred sixty thousand.

Rollback trigger. A defined threshold, a named person with authority to pull it, and the technical capability to actually execute the reversion. Three hundred twenty thousand.

That last one has a note attached, generated from your Week 6 file: "Rollback trigger specified in parameter set — threshold value [X], authority [name]." Or, if it wasn't: "No rollback trigger on file."

A team that specified one in Week 6 and does not fund it in Week 8 is looking at their own words on a screen.

---

## 5. Monday through Friday

Conditional beats across the week. These are texture, not decisions.

Monday 6:00. The east tower desk opens. First registration completes in four minutes against a target of three. Second one takes eleven. By 9:00 the average is six and falling.

Monday 2:00. If parallel running is funded, the reconciliation shows a fourteen-case discrepancy in authorization status. It is investigated by Wednesday and turns out to be a timing artifact. If parallel running is not funded, the fourteen cases exist and are not visible.

Tuesday. Whatever the fourth indicator said, it starts producing evidence. Exception volume, or a defect that cannot be patched, or a supervisor at the east campus running a workflow nobody documented.

Wednesday. Marisol Ferrara works a full shift on the new process without using her card. She does not mention this and neither does anyone else. If frontline staff were in the Week 5 design room, the card is in a drawer at home. If they weren't, it is still taped inside the lid and she is using it, and the reason is that the new process did not address the thing the card was for.

Thursday. The medical staff meeting. Anand either raises the project herself or doesn't.

Friday. Okonkwo asks for one number for the board. Not the projection. What happened this week.

---

## 6. Design notes

The go decision reveals almost nothing about a team's judgment. The pairing with controls reveals everything. Proceeding on amber with all four controls funded is a defensible act of leadership. Proceeding on amber with none is the same lever value and a different act entirely, and the sim should score them nowhere near each other.

The rollback note pulled from the Week 6 file is the sharpest single interface moment in the sim. A team reads its own specification back and then decides whether to fund it. Specified and unfunded is scored worse than never specified, because they knew.

The fourth indicator must never name a cause. "Exception handling — unvalidated" with a wide range underneath. The range is the information. A team that understands why the range is wide understands what they did in Week 6.

Marisol's card on Wednesday is the quietest consequence in the sim and possibly the truest. Nobody reports it. It appears in no metric. It is simply whether the process she runs is the process that was designed, and the answer was determined three weeks earlier by who was in a room.

Sylvia being in the building on a Sunday she did not have to be there for is stated without comment and should stay that way.
