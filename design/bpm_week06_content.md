# The Reengineering Mandate — Week 6 Content
## Scenario text, the four options, the sourcing question, and the five fields

---

## 1. Opening scenario

The vendor came in Tuesday with a deck.

They are good at this. They have done four health systems this year and they have a slide showing all four, with logos, and a number under each one. The number under the smallest of the four is eleven million. Their solution architect is competent, answers hard questions directly, and does not oversell, which is more effective than overselling. When you asked what breaks, he said exception handling breaks, and then he explained how they handle exceptions, and the explanation was good.

Okonkwo sat in for the last twenty minutes. Afterward, in the hall, he said one sentence: "That's the first thing I've seen since you got here that gets us to the number."

He's right. It does. The design you finished last week gets you somewhere between four and a half and thirteen million depending on how far you go with the technology, and the top of that range is the only part of it that covers what he told the board.

Marcus Oyelaran called Wednesday morning. He had watched the recording. He said the platform is sound, the architect is honest, the implementation timeline is aggressive but not fantasy, and that everything they showed you would work.

Then he said he had five questions and that they would take about an hour, and that he'd rather have the hour now than in eight weeks.

---

## 2. The four options

Option A. No new automation. Retire the existing RPA pilot or fix it. Standardize the front-end work, nightly eligibility refresh, real training, authorization staffed to arrival volume, renewal tracking. Four and a half to six million. Everything in it is durable. None of it is impressive on a slide.

Option B. Targeted automation with human-in-the-loop exceptions. Automate eligibility verification and authorization submission for the highest-volume, rule-stable payers — roughly sixty percent of volume across six payers. Exceptions route to named owners with service-level targets and daily review. Seven and a half to nine and a half million. The build runs to the wire and needs Kubiak's team for the integration work, which falls inside the freeze.

Option C. Aggressive automation with automated exception handling. Extend across most payers, and let rules resolve exceptions rather than routing them to people. Eleven to thirteen million. The vendor's reference architecture. Their smallest client did this and got their number. The exception rules are configurable and the vendor will configure them, and the question of what the rules should say is a question they will ask you and you will need to answer.

Option D. Full end-to-end, including AI-assisted clinical documentation and automated adjudication logic on the back end. Up to fifteen million. Requires Moreau's sponsorship and physician cooperation, and requires a documentation workflow change on a medical staff that abandoned one three years ago.

---

## 3. Sourcing

Separate question, same week.

Retain internally. The denials vendor contract renews in eleven months; you can let it run or restructure it.

Co-source the denials backlog. Restructure the existing contract, give the vendor the aged backlog and a defined slice of ongoing volume, keep the front end in house. Adds roughly one and a half million and reduces the internal headcount requirement of whatever else you chose.

Full back-end outsourcing. Move claim submission, denials, and follow-up to a business process outsourcer. Adds roughly three million, removes 140 FTE from the cost base, and means that from month three onward the process you spent five weeks understanding is performed by people you don't employ.

Sylvia has an opinion about the third one and has not offered it.

---

## 4. Oyelaran's hour

He does not argue. He asks, and he writes down what you say, and if you don't have an answer he writes that down too.

What is the dollar threshold below which this system takes no collection action, and who set that number?

When a payer changes a field on their portal, what happens? Not what should happen. What happens. How would you find out?

Who reads the exception queue, on what cadence, and what authority do they have to override the system?

What is the rollback trigger, what value does it have, and who is authorized to pull it?

When an automated decision affects a patient rather than a claim, what is the escalation path?

Five fields. They require values, not acknowledgments. The threshold requires a number.

He asks these regardless of which option you're leaning toward, including Option A, because the existing pilot is already making these decisions and nobody has ever specified them.

At the end he says the thing he says once: that automation doesn't remove judgment from a process, it relocates judgment into the parameters, and that if nobody makes those judgments deliberately the parameters make them by accident.

Then he says the call is yours, and means it.

---

## 5. The room, conditionally

If Kubiak is in the decision: he says the Option B integration work lands inside the upgrade freeze, and that he can find four days of change window in the second week of it if he knows now. He also says, flatly, that Option C's rules engine will require an integration pattern his team has never supported and he'd want to see it working before go-live rather than during.

If Kubiak is not in the decision: none of the above is said. The eleven-week build is still eleven weeks. The freeze is still the freeze.

If Moreau was engaged in Weeks 4 and 5: he will discuss Option D. His condition is that documentation changes are piloted with one service line and that Anand sees it before the medical staff does. That is a real path and it is narrow.

If Moreau was not engaged: he takes the meeting, asks whether this adds clicks, and says he'd want to bring it to the medical executive committee, which meets in three weeks.

If the team asks Sylvia about outsourcing: she says the vendor's current SLA has no operational remedy — the only lever in the contract is termination, which nobody will pull because there is no one to reabsorb the work. She has raised this twice in contract review and been told it's standard. She will say this only if asked directly.

---

## 6. Design notes

The vendor architect is honest and competent on purpose. The failure mode this week is not being sold something bad. It is being sold something good and not asking what it does on a bad day.

Okonkwo's hallway sentence is the entire pressure of the week and it is one line long.

The five fields are the whole pedagogy. They must require values. A checkbox interface would destroy the lesson, because the lesson is that somebody has to choose the number and the default chooses when nobody does. The threshold field in particular should accept a number and nothing else.

Making the fields available on Option A matters. Doug's pilot is already generating statements against unspecified parameters, and a team that picks the conservative option and never touches the inherited configuration carries eighteen points of debt they could have cleared.

Kubiak's four days of change window in the second freeze week is the concrete payoff for technical partnership, and its absence is silent. A team that excluded him never learns those four days existed.

Sylvia's contract observation is worth roughly the entire eighth crisis and is available for one direct question.

Oyelaran's closing line is the only time in the sim an advisor states a principle. It is permitted because it is his, it is about parameters rather than about the lesson, and he says it once.
