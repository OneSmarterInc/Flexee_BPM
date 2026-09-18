# The Reengineering Mandate — Week 1 Content
## Scenario text, inherited artifacts, and the buried memo

---

## 1. Opening scenario

Your badge works. That's the first thing you find out, standing at the north entrance of Regional Health Partners' administrative building at 7:20 on a Monday morning in the second week of the month. The second thing you find out is that your office is on the fourth floor, two doors down from the one Doug Vandermeer used, and that nobody has moved his whiteboard out of it. There's a burndown chart on it, dated eleven weeks ago, with three items still open.

The email from Gerald Okonkwo arrived at 6:41 last night, Sunday. It's four sentences long. He's glad you're here, he's cleared his Thursday afternoon, he'd like your thirty-day plan by Friday, and he mentions — the last sentence, no emphasis — that the fiscal year closes in seven months and he'd like to be able to show them something by then.

Four meetings are already on your calendar and you didn't put them there. Karen Deiss, the CFO, Tuesday at 8:00, thirty minutes. Dr. Anthony Moreau, Chief Medical Officer, Tuesday at 4:30, thirty minutes, with a note from his assistant that he may need to move it. Sylvia Ntende, Director of Revenue Cycle, Wednesday at 10:00, sixty minutes. Ray Kubiak, VP of Applications and Integration, Wednesday at 2:00, thirty minutes, accepted-tentative.

There's also an email that came in at 7:04 this morning, before you sat down. Deneen Walters, SEIU Local, subject line "Introduction and one procedural matter." She welcomes you, notes that she represented the registration and patient access staff through the last two contracts, and reminds you that Article 14 of the current agreement requires sixty days' written notice before any material change to job classifications. She's not asking for anything. She's putting it in writing on your first morning, which is itself the message.

Project Clearpath is fourteen months old. Six point two million spent against a nine million approved budget. There is an RPA platform in production automating eligibility verification for two payers, covering roughly thirty percent of scheduled outpatient volume, and it has been running for five months. The project's last status report, from Doug, is dated eleven weeks ago and is marked green.

Doug left six weeks ago. The announcement said he'd accepted a role at a system in another state. Four people you haven't met yet know a different version.

The shared drive folder is called CLEARPATH_ALL. It has sixty-three documents in it.

---

## 2. Inherited documents

These sit in the project folder. Students can open any of them. Nothing flags which matter.

The charter, signed fourteen months ago. Names the objective as "transformation of revenue cycle operations to achieve top-quartile performance," names Okonkwo as sponsor and Doug as Program Director, and sets a benefit target of twelve million in annual run-rate savings. It does not define the baseline against which savings are measured. There is a line item for "process analysis and current state documentation" at four weeks, which is what the schedule actually spent on it.

The vendor selection summary, eleven months old. Four platforms evaluated, one selected. The evaluation criteria are weighted toward implementation speed and licensing cost. Ray Kubiak is not on the distribution list and IT does not appear in the signature block.

The last eleven status reports, all green. The final one has an open risk item, unchanged for six reports, that reads "exception volume higher than initial projection — under review."

The RPA pilot operating summary, produced by the vendor. Reports transactions processed, average handle time, and availability. It does not report exception rate. The number is derivable if a student divides two of the figures it does report.

Denial and A/R reporting, monthly, produced by finance. Initial denial rate 11.4 percent. Days in A/R 58. Cost to collect 4.2 percent of net patient revenue. Untimely-filing write-offs of 14.1 million for the prior year. These figures are accurate and nobody disputes them. What they don't show is composition.

The board presentation Doug gave four months ago. Twenty-two slides. Slide 14 shows savings realized to date at 3.1 million. Slide 15 shows the run-rate projection reaching twelve million by fiscal year end. The bridge between them is a slide that isn't there.

And one memo, filed under a name that gives nothing away.

---

## 3. The memo

Filed as ANALYSIS_DRAFT_v2_JR.docx. Four pages. No cover note, no distribution list, no evidence anyone responded to it.

---

To: G. Okonkwo
From: Janine Reyes, Operations Analysis
Re: Clearpath — request for reconsideration of project scope

I've spent six weeks on the Clearpath analysis you asked for and I want to put something in writing before my assignment ends, because I don't think the answer you're expecting is the right one.

You asked me to look at whether the eligibility verification automation is delivering. It is, on its own terms. It processes what it's given and it processes it faster than the people did. If the question is whether the bot works, the answer is yes.

I don't think that's the question.

Nobody on this project has drawn a picture of where revenue cycle sits in what this organization does. It's managed as an administrative cost center, and the reporting goes to finance, and the improvement targets are cost-per-transaction. But when authorization doesn't clear, a surgery gets moved. I sat in on scheduling for two days in the east tower and watched it happen four times. That's not a billing problem showing up late. That's a clinical delivery problem that we've classified as clerical, and the classification is why nobody with clinical authority has ever been in a Clearpath meeting.

Second, and I recognize this is uncomfortable: I don't believe anyone has established where the process is actually constrained. We chose eligibility verification because it was the most repetitive step and the easiest to automate, not because it was the step that was holding everything up. Those aren't the same criterion. I've asked three times for capacity and throughput figures by station and been told they aren't collected that way. If we automated a step that wasn't the constraint, the queue didn't go away, it moved, and we'd have no way of knowing because we don't measure where it sits.

My own view, and I hold it loosely because I couldn't get the data, is that the binding constraint is on the back end at claim submission. The submission team is carrying volume they can't clear and it shows in the untimely-filing write-offs.

Third, the exception rate. The vendor summary doesn't report it. I derived it at roughly nineteen percent. I asked who works those exceptions and was told the queue is handled. It's handled by three patient access representatives who stay after their shift. That is not in any report and I don't believe it's in the business case.

I'm not recommending we stop. I'm recommending we spend four weeks establishing where the work actually is before we spend the remaining budget making more of it faster.

I know the business case has been to the board. I know what reopening it costs. I'd rather say this now than have it come up later.

---

Janine Reyes was reassigned to supply chain analytics nine days after this was written. She is still with the organization. Nothing in the sim mentions this unless a student goes looking for her.

---

## 4. Design notes

The memo is deliberately part right and part wrong. Reyes correctly identifies that the project never worked above task level, correctly identifies the classification problem with clinical work, correctly derives the exception rate, and correctly names the unpaid overtime. She locates the constraint at claim submission, which is wrong — it's authorization — and she says herself that she holds it loosely and couldn't get the data. A team that treats the memo as an answer key inherits a wrong constraint and carries it into Week 3. A team that treats it as a lead does well.

The exception rate is derivable from the vendor summary without the memo. The memo is a shortcut, not the only path.

Reyes existing and being reachable is a discovery available to teams that ask. She is not on any list of stakeholders and no advisor mentions her.

The board presentation's missing bridge slide between 3.1 million realized and 12 million projected is the single most important document in the folder and it is defined by absence. Nothing points at it.

Okonkwo's Sunday 6:41 timestamp and the last sentence of his email are the entire pressure architecture of Week 1. No text anywhere states that his credibility is at stake.
