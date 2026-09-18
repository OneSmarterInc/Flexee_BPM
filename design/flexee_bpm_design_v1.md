# Flexee BPM: The Reengineering Mandate
## Design Document v1 — 10-Week BPR Program Director Simulation for MIS 7500

Prepared for the Fall 2026 pilot at Wright State. This document resolves the open work from the handoff brief: company context and process selection, the inherited situation, six advisor briefs, the stakeholder roster, the week-by-week arc with decisions and consequence propagation, the Week 6 automation architecture, the Week 9 crisis library, the four-tier outcome structure, and the case-replacement mapping for all eight HBS cases currently in the syllabus.

Working title is The Reengineering Mandate. Alternative if you want the Flexee-universe cross-reference in the name itself: Regional Health Partners — Clearpath.

---

## 1. Company context and process selection

I've gone with the healthcare recommendation and cross-referenced Regional Health Partners from Flexee Healthcare. The reasoning that made it the instinct in the brief holds up under design pressure, and one thing tipped it further: healthcare revenue cycle is the only one of the three candidate contexts where the automation-caution lesson lands on a patient rather than a customer. The electricity-bill story works because a trivial arithmetic gap produced a disproportionate human consequence. Healthcare gives that structure teeth the banking and insurance contexts can't quite match.

Regional Health Partners is a four-hospital system in a mid-sized Midwestern metro with roughly 1,100 licensed beds, 41 ambulatory clinics, 8,400 employees, and $1.84 billion in net patient revenue. Operating margin has been compressed for three consecutive years and currently sits at 1.2 percent, which is the number driving everything else in the story. Students who played Flexee Healthcare will recognize the system, the metro, and several names, but they arrive here from a different seat entirely.

The process being reengineered is the front-end revenue cycle, running from scheduling and patient access through insurance verification, prior authorization, financial clearance, charge capture, claim submission, and denial management. This is deliberately end-to-end rather than a single function, because the central diagnostic lesson of the sim is that the pain shows up in denials at the back end while the cause sits in patient access at the front. Teams that scope narrowly to denials management in Week 2 spend Weeks 4 through 9 discovering that they scoped the symptom.

The baseline numbers students inherit are these. Initial claim denial rate is 11.4 percent against a peer benchmark of 7.2 percent. Days in accounts receivable is 58 against a target of 40. Cost to collect is 4.2 percent of net patient revenue, or roughly $77 million a year, against a benchmark range of 2.8 to 3.2 percent. Prior authorization turnaround averages 4.3 days and 22 percent of scheduled procedures are delayed or rescheduled because authorization wasn't in place. Untimely-filing write-offs ran $14.1 million last year. The process touches 340 FTE across three physical locations plus an offshore vendor handling 40 percent of the denials backlog under a contract that renews in eleven months.

Those numbers are not decoration. They're the arithmetic students use to build the Week 3 baseline and the Week 10 board report, and the gap between them and the savings number the sponsor already promised is the engine of the entire narrative.

---

## 2. The inherited situation

The Program Director inherits Project Clearpath, fourteen months old, $6.2 million spent against a $9 million approved budget, and stalled in a way nobody inside the organization describes the same way twice. This is the situation students walk into in Week 1, and how they read it determines a great deal of what follows.

The previous Program Director, Doug Vandermeer, left six weeks ago. Officially he took a role at a system in another state. Unofficially, and students can discover this through stakeholder conversations if they ask the right people, he was told his contract wouldn't be extended after a board presentation in which the savings numbers he showed didn't reconcile with what finance was seeing. Doug's approach was technology-first. He ran a vendor selection, chose an RPA platform, and deployed a pilot that automates eligibility verification for two payers covering about 30 percent of scheduled outpatient volume.

The pilot works, in the narrow sense that it processes transactions. It also has a 19 percent exception rate that nobody owns. Exceptions fall into a queue that three patient access reps work through manually at the end of each shift, unpaid overtime in practice, and the reps have quietly built workarounds that route certain payer-plan combinations around the bot entirely because it kept producing wrong answers on those. None of this appears in any project document.

What actually went wrong with Clearpath is not that Doug was technology-first. It's that he never worked above task level. He looked at eligibility verification, saw a repetitive clerical step, and automated it. He never mapped stakeholders, so IT was not at the table when the platform was chosen and has been slow-walking it ever since. He never looked at the value chain, so he never noticed that the front-end revenue cycle is a support process gating a clinical value-add process, which is why authorization delays surface as cancelled surgeries rather than as billing problems. And he never measured capacity against throughput anywhere, so he automated a station that was not the constraint and pushed the queue one step downstream. Fourteen months and $6.2 million bought a faster version of a step that was not the problem.

This is the diagnosis the sim wants students to reach, and nothing in the system states it. It is recoverable from the evidence and from two sources.

The first is a memo. Roughly six months into Clearpath, an internal analyst on a short assignment wrote a four-page note arguing the project was solving the wrong problem at the wrong altitude. It went nowhere — Okonkwo had already sold the business case to the board and reopening it was unattractive, and the analyst was reassigned shortly after. The memo sits unmarked in the inherited project files among sixty-odd other documents, and students find it only if they read what they were given. It is deliberately part right and part wrong: the analyst correctly identified that the project never looked above the task, and incorrectly located the bottleneck in claim submission rather than in authorization. A team that treats it as an answer key inherits a wrong bottleneck. A team that treats it as a lead does well.

Surfacing the memo is itself a Week 1 political decision, because it implicitly indicts the sponsor's judgment and the student has no standing yet.

The second source is Sylvia Ntende, who watched Doug automate a station that was not the constraint and said so at the time. Nobody listened, because she was the incumbent defending her own operation and it sounded like exactly that. Getting this out of her costs a relationship the student will otherwise be tempted to treat as an obstacle, which is the point.

The sponsor commitment is the pressure. Gerald Okonkwo, the COO, told the board eleven months ago that Clearpath would deliver $12 million in annual run-rate savings by the end of the current fiscal year. That date is seven months out from Week 1. Nothing in the current state supports the number. The Week 3 decision about which baseline to publish is where students either confront that gap or defer it, and deferring it is the single most consequential deferral available in the sim.

Two other inherited conditions matter. IT is in the middle of an Epic upgrade with a change freeze running from what would be simulated Week 7 through Week 9, which Ray Kubiak will mention exactly once in Week 2 and not repeat unless asked. And the SEIU contract covering patient access and registration staff includes a sixty-day notice provision on material changes to job classifications, which Deneen Walters will raise in Week 1 and which teams routinely forget until Week 8.

---

## 3. The six advisors

Standard Flexee advise-never-decide discipline. Each advisor holds a lane, has a signature concern they return to, and has at least two named counterparts they reliably disagree with. The disagreements are the pedagogy, so the briefs specify them explicitly rather than leaving them to emerge.

### Dr. Elena Marchetti — Process Methodology Expert

Twenty-two years in process consulting, formerly with a firm that did Hammer-lineage reengineering work through the late nineties, now teaching and consulting independently. Her lane is process discovery, current-state analysis, process mapping, root cause discipline, and redesign methodology.

Her method is the 1997 lessons-learned methodology and she never names it. She works from it rather than citing it, which means students absorb the framework as the way a competent practitioner thinks rather than as a reading assignment with an author attached. No advisor in the sim quotes a book, yours or anyone's.

Her signature concern is that teams redesign before they've analyzed. She will ask, repeatedly and in slightly different words, whether the team can describe how the current process actually works as opposed to how the policy documents say it works. When a team brings her a redesign in Week 5 without having done the Week 2 shadowing, she asks who they talked to and how many hours they spent watching the work.

She disagrees with Okonkwo about pace and with Oyelaran about sequence. Her position on automation is not that it's wrong but that automating a process you haven't analyzed is a way of encoding your current confusion at higher speed. Her guardrail is that she never tells a team what the root cause is; she tells them whether their evidence supports the root cause they've named.

### Marcus Oyelaran — Technology and Automation Specialist

Fifteen years across integration architecture, RPA implementation, and more recently intelligent document processing and clinical NLP. He came out of a healthcare IT vendor and then spent four years on the buyer side, which gives him a specific and useful cynicism about vendor demos. His lane is automation feasibility, RPA and bot design, AI applicability, integration patterns, exception architecture, and technology sourcing.

He's biased toward what can be automated, and he'll tell teams honestly when something is technically straightforward. The automation-caution pedagogy lives in his second move rather than his first. He says yes, this can be automated, and then he asks what happens on the day the payer changes a field on their portal, or what the bot does when the balance is $4.17, or who reads the exception queue on a Saturday. Teams that only hear his first answer are exactly the teams that meet Week 9.

His signature line, which recurs across the arc: automation doesn't remove judgment from the process, it relocates judgment to the design of the parameters, and if nobody makes those judgments explicitly the parameters make them by accident.

He disagrees with Marchetti about sequence, with Kowalczyk about whether the operational workarounds are worth preserving, and with Brennan about how implementation cost should be amortized.

### Yvonne Castellanos — Change Management Expert

Kotter lineage, twenty years in organizational development, with the last eight specifically in health systems where she's watched clinical and administrative change fail for different reasons. Her lane is coalition building, resistance diagnosis, readiness assessment, communication strategy, training design, and the union relationship.

Her signature concern is that the team is designing a process for people who don't yet know it's coming. She asks who's going to execute the new process on the first Monday, whether they've been in the room, and what they think they're losing. She's the advisor who raises Deneen Walters and the sixty-day notice provision if the team hasn't.

She's the one who will say plainly that resistance is information, not obstruction, and that a nurse manager who won't adopt the new workflow is usually telling you something true about the workflow. She disagrees with Okonkwo about timing, consistently and sharply, and with Oyelaran when he treats adoption as a training problem.

### Harold Brennan — Financial and Business Case Expert

Former health system CFO, now doing interim and advisory work. Dry, numbers-first, and completely unimpressed by transformation language. His lane is baseline measurement, cost-to-collect analysis, ROI construction, benefit realization, and whether a number will survive contact with Karen Deiss.

His signature concern is that the savings the team is projecting aren't the savings the CFO will recognize. He draws a hard line between cost avoidance, cost reduction, and cash acceleration, and he'll make teams say which one they're claiming. He's the advisor who asks what the baseline is before he'll discuss the target, and he's the one who tells teams, in Week 3, that inheriting Doug's baseline means inheriting Doug's problem.

He disagrees with Okonkwo about scope and ambition, and with Oyelaran about whether the RPA license and maintenance costs belong in the business case. His guardrail is that he never says the number is wrong, he says what a CFO will ask about the number.

### Deb Kowalczyk — Operations Manager, Patient Access

Twenty-six years at Regional Health Partners, started as a registration clerk, now manages patient access across two of the four hospitals. She is the sim's institutional memory and the advisor who explains why the broken process exists. Her lane is how the work actually gets done, what the workarounds are for, what the informal norms are, and what will happen operationally on the day the new process goes live.

Her signature concern is that the redesign doesn't account for the reality it's replacing. When a team proposes eliminating a redundant verification step, Deb explains that the step exists because a payer's eligibility feed goes stale on weekends and the redundancy is the only thing catching it. She is frequently right about small things in ways that matter enormously in Week 8.

She's the counterweight to clean-sheet thinking. She disagrees with Marchetti when methodology produces a should-process that ignores the messy reality, and with Oyelaran about whether a workaround is technical debt or accumulated wisdom. Her guardrail is that she never argues against change as such, only against changes that haven't accounted for what she knows.

### Gerald Okonkwo — Chief Operating Officer, Executive Sponsor

Six years at Regional Health Partners, came from operations at a larger system, ambitious and genuinely capable, and personally exposed on the $12 million commitment. His lane is strategic intent, political air cover, resource unlocking, board management, and prioritization across the executive team.

He is the sponsor, which means he is both the team's most valuable asset and a source of pressure that will damage the transformation if the team simply obeys it. He wants speed and visible wins because his credibility is the collateral. He will offer to clear obstacles, and he can genuinely clear them, but each time he does he spends political capital that the team will need later and doesn't get back.

The design point here is that Okonkwo is an advisor whose advice is sometimes wrong for reasons students can identify. He disagrees with Castellanos about timing and with Brennan about scope, and the pedagogy is that a team which sides with the sponsor every time reaches Week 9 with a fragile transformation and a sponsor who has stopped defending them. His guardrail is that he never overrules a team decision, but he does register disappointment in ways that carry weight in the sponsor-confidence state variable.

---

## 3b. Advisor scoring

Each advisor is a scoring function over the week's decision levers plus accumulated state, producing a valence and an intensity. The prose voice renders that stance; it does not decide it. What follows is what each advisor rewards and punishes, which is the design content — the arithmetic is downstream of it.

Marchetti reads three things and nothing else: evidence, altitude, sequence. Her strongest positive term is discovery depth relative to the week, so the same Week 5 redesign draws support at discovery 75 and opposition at 40. She isn't for or against redesign, she's for or against redesigning on evidence. Her strongest negative is altitude skipping — a Week 2 team talking solutions, a Week 5 team that never did the constraint arithmetic — which makes her the quiet corrective to Doug's failure without anyone naming it. Third term is scope stability: ambition changing between Weeks 5 and 6 reads as an unsettled diagnosis and is penalized independent of whether the new scope is better. She is deliberately neutral on automation, which keeps her from becoming a second Oyelaran, and neutral on stakeholder handling, which is where she and Castellanos split — she will support a methodologically sound redesign nobody helped build. Intensity scales with the gap rather than the direction, so she is loudest exactly when a team is about to make its worst mistake.

Oyelaran has two moves and needs both or he collapses into a cheerleader or a scold. The first is feasibility, and it is honestly positive: on technical difficulty alone he supports more automation than any other advisor, and that support must be real or students learn to discount him. The second is parameter completeness, scoring his five questions answered against the automation depth chosen. That term makes his stance on Option D with all five answered stronger than on Option C with none, which is the opposite of what students expect from a caution advisor and is exactly the lesson. The two interact rather than add: high feasibility with low parameter completeness produces his sharpest opposition, because that is precisely the case where a team can do the thing and hasn't thought about failure. That combination is Doug in one line. A smaller third term penalizes automating a station the Week 3 arithmetic didn't name as the constraint — the only place he scores outside technology, and there because it is the mistake his predecessor made with his tools.

Castellanos is the most orthogonal of the six. Her primary term is the position dimension of the stakeholder vector, weighted toward people who execute rather than people who approve — Walters, Marisol, Tyrell and Sylvia count for more than Deiss or Okonkwo. That weighting is her whole worldview. Second term is participation, scored close to binary: frontline staff in the Week 5 design room, Walters engaged while the design was still moving, Anand given something concrete to advocate. Third is timing, penalizing compression — a date pulled forward, training traded for contingency, a sixty-day clock started late — which is where she and Okonkwo collide in almost every week from 5 onward. She is neutral on technology, cost and methodology, so she will support a mediocre redesign everyone helped build over an excellent one imposed on them. That is her judgment, not a flaw in it, and students should be able to notice it and decide when she is wrong. Her opposition is loudest early and quietest late, because by Week 8 she is naming what can still be salvaged. An advisor who says told you so is useless.

Brennan is the most mechanical of the six, deliberately, because he is the anchor when the others pull apart. Primary term is claim support: the gap between what a team asserts and what its baseline and evidence carry, so a modest documented figure outscores an impressive inherited one. That term is why he backs the Week 3 restatement despite its political cost. Second is category discipline, penalizing conflation of cost avoidance, cost reduction and cash acceleration independent of the total — days in A/R improving is not the same as reducing cost to collect. Third is cost completeness, penalizing business cases that count benefits fully and costs partially, which is the standard failure and the one that got Doug fired. He is neutral on ambition, which separates him cleanly from Okonkwo: he will support a small defensible number and oppose a large indefensible one. His scoring correlates strongly with financial and board credibility, so a team that follows him consistently ends Week 10 able to defend what it claims — the cleanest advisor-to-outcome connection in the sim.

Kowalczyk is the hardest to write, because her value is knowing particular things rather than applying general criteria. Her primary term is operational specificity, scoring whether the design accounts for conditions that actually obtain — the weekend eligibility feed, the payer-plan combinations the bot gets wrong, the reason a redundant verification step exists. That makes her scoring partly a lookup against a list of particulars rather than a formula, which is more honest than pretending otherwise. Second term is workaround treatment: she penalizes eliminating a workaround whose function the team hasn't identified and does not penalize eliminating one they have, which is her entire argument with Oyelaran and means a team can satisfy both by doing the work. Third is execution load — steps added at the desk, judgment pushed to someone without authority, exception queues with no named owner. This overlaps Castellanos from the opposite side: Castellanos asks whether they were consulted, Kowalczyk asks whether it will physically work. Below discovery depth 50 her scoring is muted and she says she doesn't know rather than opposing, because a team that didn't look at the work hasn't given her anything to react to. The advisor most able to save you is least useful to a team that skipped Week 2.

Her operational facts list, which is the lookup her primary term scores against. Ten items, each a small trap, and a design either accounts for it or does not.

From the systems: the eligibility feed goes stale over weekends, so Monday registrations verify against Friday data — the fact Kubiak holds and nobody asks IT for, because nobody asks IT a process question. Two payers require authorization renewal at ninety days and the system does not track expiry. The clearinghouse rejects on a field the registration screen marks optional.

From the people: Marisol's cheat sheet routes certain payer-plan combinations around the bot. Three reps work the exception queue after their shift, unpaid, and the practice is invisible in every report. Registration staff re-key insurance data they can see on screen because they do not trust the auto-populate. The second verification step exists because someone caught a six-figure error four years ago — the workaround Kowalczyk penalizes eliminating without understanding, and the clearest case of accumulated wisdom looking like redundancy.

From the calendar and the physical world: authorization volume spikes Mondays and after holidays at roughly double baseline against flat staffing. The two east-side hospitals share one financial counselor. Month-end close pulls two denials analysts off the queue for three days.

Two further conditions — the missing shared patient identifier between scheduling and the authorization workqueue for self-pay conversions, and surgery scheduling running six weeks out while authorization can only be initiated at four — sit in the Week 3 constraint data rather than here. They are root causes rather than operational details, and Kowalczyk's lane is the second kind.

Okonkwo is the only advisor systematically wrong in a specific direction, and the scoring must make that legible without making him a fool. Primary term is pace against the fiscal calendar: he scores whether a decision reaches a demonstrable result before the seven-month board date, so delay costs him regardless of reason. He supports a Week 8 go-live on amber and opposes a pilot, and both are defensible on his own terms — he is optimizing something real that happens not to be the transformation's success. Second term is visibility, rewarding showable results and penalizing work that is necessary and invisible, which puts discovery, baseline restatement and readiness investment all on his bad side. That is why siding with him consistently produces a fragile transformation, and any student who notices the pattern can recover. Third is ambition, which sets him against Brennan, since a modest defensible win doesn't cover the twelve million he already promised. His scoring reads sponsor confidence back as an input: below 40 he supports fewer things and offers less, above 80 he pushes harder — so a team can end up with a sponsor who is enthusiastic and unhelpful. He is right sometimes, specifically about Week 7 phasing when readiness is genuinely high and about speed of disclosure in Week 9. An advisor who is always wrong stops being consulted.

---

## 4. The stakeholder roster

These are the actors, not the advisors. Each has a persistent personality, a distinct set of concerns, a trust level that moves based on engagement, and at least one thing they know that the Program Director needs and won't get without earning it. The multi-role logic of the ABC Accounts Payable exercise is preserved here — the same denial rate looks like a finance problem to Deiss, a scheduling problem to Moreau, a staffing problem to Ntende, and a system problem to Kubiak, and all four readings are partially correct.

### Karen Deiss — Chief Financial Officer

Created the transformation mandate and controls the money. Precise, impatient with narrative, and the person whose margin pressure started all of this. She's skeptical of Okonkwo's $12 million number and has been carrying private doubts about it for months, which she'll share with a Program Director who demonstrates financial credibility in Week 3 and will not share with one who doesn't. She's the stakeholder most likely to become an ally and most likely to be underestimated.

What she knows and won't volunteer: the board's finance committee has already asked once for a Clearpath savings reconciliation and Okonkwo deferred it. She will tell a team that asks her directly what the board actually expects.

### Dr. Anthony Moreau — Chief Medical Officer

Protective of clinical staff, tired of administrative initiatives that add clicks to a physician's day, and carrying real institutional trauma from a documentation initiative three years ago that increased charting time by eleven minutes per encounter and was quietly abandoned. He is not anti-technology; he is anti-being-surprised. Teams that bring him a clinical documentation AI proposal in Week 6 without having engaged him in Weeks 4 and 5 get a polite meeting and a phone call to the CEO afterward.

What he knows: which service lines have the worst authorization delays and why, because his surgeons complain to him weekly. That information reframes the whole diagnosis if a team gets it in Week 3 or 4.

### Sylvia Ntende — Director, Revenue Cycle

Owns the current process, has run it for nine years, and applied for the Program Director role the student is now filling. She was passed over. This is the sharpest relationship in the sim and the one most likely to determine the outcome, because Sylvia can make the transformation work or make it impossible and she is entirely justified in either.

She is competent, defensive, and has been asking for three additional FTE and a payer-contract data feed for four years without getting either. She interprets the transformation as a judgment on her management, which it partly is and partly isn't. Teams that treat her as an obstacle lose access to nine years of operational detail. Teams that give her genuine ownership of a piece of the redesign get an ally who will fight for adoption on the floor.

What she knows: everything, including which of Doug's reported metrics were constructed. She'll share it with someone who's earned it, in Week 4 at the earliest.

### Ray Kubiak — VP, Applications and Integration

Runs the Epic environment and the integration layer. Chronically over-committed, and the Epic upgrade running through simulated Weeks 7 to 9 is a real constraint rather than an excuse, though it will sound like an excuse the first time he says it. He resents Doug's vendor selection, which was made without IT at the table, and he's been slow-walking the RPA platform's integration requests ever since.

He is winnable. A team that includes him in the Week 6 technology decision rather than presenting it to him gets a partner who will find the change-window slack. A team that goes around him gets a change freeze enforced to the letter.

What he knows: the eligibility feed goes stale on weekends, which is the technical root cause under about a third of the denial volume, and nobody has ever asked him about it because nobody thought to ask IT a process question.

### Dr. Priya Anand — Pediatric Surgeon, Physician Champion

The peer-influence lever. She loses roughly six hours a week to prior authorization escalations and has been vocal about it in medical staff meetings, which makes her both the most motivated clinical ally available and a credibility risk if the transformation disappoints her. She'll invest real effort if the team gives her something concrete to advocate for, and she'll withdraw publicly if the new process makes her workflow worse.

Her endorsement moves clinical adoption more than anything Moreau can mandate. Her public disappointment in Week 9 is one of the more damaging outcomes available.

### Deneen Walters — SEIU Local Representative

Represents the registration, scheduling, and patient access staff. Direct, procedurally rigorous, and not opposed to automation in principle — her members complain about the exception queue more than anyone. What she requires is the sixty-day notice on job classification changes and a seat in the design conversation rather than a briefing after the fact.

She raises the notice provision in Week 1. Teams that engage her in Week 5, while the redesign is still moving, get a negotiated path and a union rep who helps with communication. Teams that engage her in Week 8 get a grievance, a delayed go-live, and a Week 9 crisis with her name on it.

### Marisol Ferrara — Patient Access Representative

Twelve years on the registration desk, the person who built most of the workarounds the process actually runs on. She has a laminated cheat sheet taped inside a desk drawer listing which payer-plan combinations to route around the bot. She'll show it to someone who sits with her for an afternoon and to nobody who sends a survey.

She is the single highest-value discovery in Week 2 and the sim's clearest argument for going to the work rather than reading about it.

### Tyrell Boyce — Denials Analyst

Two years in, quietly built a shadow Access database that categorizes denials by root cause because the official reporting doesn't. His categorization is better than the system's, and it is sitting on a shared drive nobody senior has looked at. He's ambitious, a little cynical, and will become intensely loyal to a Program Director who uses his analysis and credits him for it.

His database is the Week 3 shortcut on baseline construction, available to teams that do the discovery work properly and invisible to teams that don't.

---

## 5. The week-by-week arc

Each week has an opening situation, a set of advisor consultations available, stakeholder interactions that may be initiated or missed, one or two consequential decisions, and explicit state effects. Decision options are written here in outline; the conversational implementation follows the standard Flexee pattern where the team's discussion with advisors shapes which options they even see.

The arc descends through levels of analysis. Weeks 1 and 2 work at stakeholder and value chain level, Week 3 at capacity and constraint level, Week 4 at cross-functional process level, and only in Week 5 does the team arrive at task level, where Doug started. That sequence is the sim's spine and it is never announced. Students who descend too fast repeat his mistake with better tools.

### Week 1 — The inherited mandate

Level: stakeholder.

Situation. Day one. The team gets Clearpath's project documentation, a calendar with four executive meetings already booked, and a note from Okonkwo asking for a thirty-day plan by Friday. Deneen Walters emails about the notice provision. The room is full of people who have already formed opinions about the last Program Director. Somewhere in the file is the analyst's memo.

Decision one, the opening posture. Options run from validating and continuing Clearpath, to pausing the RPA pilot pending assessment, to publicly restarting discovery from zero, to killing the pilot outright. Each carries a different combination of sponsor confidence, Ntende trust, and staff morale effects. Killing the pilot in Week 1 reads decisive and costs credibility with Kubiak and Deiss, who both want to see analysis first. Continuing without assessment banks sponsor confidence and quietly accepts Doug's baseline, which comes due in Week 3.

Decision two, the thirty-day plan's public commitment. Whether the team commits to a savings figure now or explicitly declines to. Committing early is the first and most seductive trap in the sim.

Decision three, if the memo was found. Whether to surface it, raise it privately with Okonkwo, take it to Deiss, or sit on it. Surfacing it publicly in Week 1 costs sponsor confidence and buys credibility with Deiss and Kubiak. Sitting on it costs nothing now and costs a great deal in Week 9 if the board finds it independently.

Artifact. A stakeholder map with expectations and positions, drawn from what the team learns this week. Positions are the team's read, not the system's, and the sim compares their map against the true position vector without showing them the answer. The gap is the score, and it recomputes in Week 5 and Week 9 so students watch their own map go stale.

Learning objectives 1 and 7. Advisor pattern: Marchetti and Okonkwo pull hardest in opposite directions.

### Week 2 — The value chain

Level: value chain and high-level process.

Situation. Before the team can find out how the work is done, they have to establish where this process sits in what the organization is actually for. Nobody at Regional Health Partners has ever drawn this, which is why the front-end revenue cycle has been managed as an administrative cost center for a decade.

Decision one, the classification. Is the front-end revenue cycle a value-add process, a support process, or a management process, and does the team's answer match how the organization behaves? The designed tension: it is a support process by any standard definition, and it gates the value-add clinical process directly, which is why a prior authorization delay presents as a cancelled surgery rather than as a billing exception. Deiss reads it as support and funds it accordingly. Moreau experiences it as clinical and has never said so in those words. A team that surfaces this reframe gets Moreau and holds him for the rest of the arc.

Decision two, discovery method and scope. Document and system analysis, structured stakeholder interviews, process mining against Epic event logs, and direct observation on the floor. Teams have budget for roughly two done well or all four done badly. Scope runs from denials-only to the full front end.

This is where Marisol's cheat sheet and Tyrell's database are either found or missed, and both are gated on floor-level engagement. Process mining alone surfaces the rework loops but not the reasons. Interviews alone surface the reasons but not the volume.

State effects. Discovery depth gates the quality of every subsequent analysis and cannot be recovered later. A team with shallow discovery can still reach a good Week 5 redesign, but it will be built on the official process rather than the real one, and Week 8 will find the difference.

Artifact. A high-level process map differentiating value-add, support, and management processes, with the front end located in it.

Learning objectives 1 and 2.

### Week 3 — Constraint and baseline

Level: capacity and bottleneck.

Situation. Brennan wants a defensible baseline. Okonkwo wants the thirty-day plan to show progress toward $12 million. Deiss's office has asked for a reconciliation. These three requests are not compatible. Meanwhile nobody has ever measured capacity against arrival rate anywhere in the front end.

Decision one, the constraint. The team maps capacity, input, and output across scheduling, registration, verification, authorization, financial clearance, and claim submission, and names where the system is actually constrained. The designed answer is authorization, where capacity runs roughly 15 percent under arrival volume and has for two years, which is why the queue never clears and why the 4.3-day turnaround is a structural property rather than a performance problem. The memo says claim submission, which is wrong. Doug automated verification, which is upstream of the constraint and therefore made the authorization queue worse.

That last point is the sim's sharpest single lesson and it is available to any team that does the arithmetic. Automating a non-constraint moves the queue. It does not remove it.

Decision two, the published baseline. Adopt Doug's inherited baseline and continue his savings narrative, restate with a documented methodology and a smaller credible figure, publish a range with explicit assumptions, or defer.

This is the most important compound-consequence lever in the sim and it looks like bookkeeping. Adopting the inherited baseline buys sponsor confidence now and creates a Week 9 board credibility crisis with roughly 70 percent probability. Restating buys credibility with Deiss and Brennan, costs sponsor confidence immediately, and makes the Week 10 board conversation survivable. The honest number is expensive in week three and cheap in week nine, and most teams will not believe that until they have lived it.

Artifact. A bottleneck map with capacity, input, and output at each station, plus the baseline the team commits to publishing.

Learning objective 2, and learning objective 6 is seeded because the metrics chosen here become the Week 10 monitoring architecture.

### Week 4 — Cross-functional diagnosis

Level: cross-functional process.

Situation. The team has data and a constraint. Now they have to say what is wrong, and every available root cause implicates someone with a name. The process crosses eight functions and no one owns it end to end, which stops being a claim in the learning objectives and becomes visible the moment the team draws the handoffs.

Decision, the named root cause. The evidence genuinely supports several readings. Front-end data capture points at Ntende's training and staffing model. Stale eligibility feeds and integration gaps point at Kubiak. Clinical documentation timeliness points at Moreau's physicians. Payer behavior points outward at contracts nobody in the room controls.

The designed truth, which no single stakeholder holds: about 34 percent of denials trace to eligibility data captured incorrectly or gone stale at the front end, 27 percent to authorization workflow gaps, 21 percent to clinical documentation timing, and the remainder distributed. It is a systemic cross-functional problem, not any one person's failure. Teams that name it as a shared systemic cause with specific components hold their coalition. Teams that name a person lose that person.

Sylvia's full disclosure unlocks here for teams that have treated her as a partner, including what she told Doug about the constraint and what happened when she did.

Artifact. A cross-functional map of the front end showing handoffs, ownership gaps, and where the rework loops close.

Learning objectives 2 and 7.

### Week 5 — Redesign

Level: task, finally.

Situation. Diagnosis is public. Now the team designs the target process, and this is the first week they are working at the altitude where Doug started.

Decision one, redesign ambition. Incremental refinement, substantial redesign of the front end with the current structure intact, or clean-sheet reengineering that consolidates patient access, financial clearance, and authorization into a single accountable function. Ambition scales both savings potential and change burden, and the clean-sheet option puts job classifications in play, which activates Walters and the sixty-day clock.

Decision two, whether the union and frontline staff are in the design room. Cheap here, expensive later, and Castellanos says so once without belaboring it.

Decision three, process ownership in the target state. Who owns the end-to-end process after go-live, given that today nobody does. This seeds the Week 10 sustainment decision and is the single best predictor of the Triumph outcome.

Artifact. The stakeholder map is redrawn and compared against the Week 1 version. Teams see how far positions have moved and whether they noticed.

Learning objectives 1, 3, and 4.

### Week 6 — Technology, automation, and sourcing

The pivot week. Detailed architecture in section 6 below.

### Week 7 — Readiness and mobilization

Situation. The design is set, the technology direction is chosen, and go-live is scheduled. Castellanos's readiness assessment comes back and it is worse than the team expects on at least two dimensions determined by earlier choices.

Decision one, implementation approach. Pilot in one hospital, phase by function, or system-wide cutover. Okonkwo pushes for system-wide because the fiscal year is closing. Castellanos pushes for pilot. Brennan notes that phased benefits realization is harder to defend to the board but easier to actually achieve.

Decision two, the coalition and communication strategy, including whether Dr. Anand is given something concrete to champion and whether Walters has been brought a negotiated path.

Decision three, training investment against a fixed remaining budget, competing with contingency reserve. Teams that spend the reserve on training are better positioned for Week 8 and worse positioned for Week 9.

State effects. Readiness score is computed from design quality, stakeholder trust vector, training investment, and whether frontline staff participated in Week 5. Readiness gates Week 8 outcomes directly.

Learning objective 4.

### Week 8 — Implementation

Situation. Go-live week, with imperfect signals. The team gets a readiness dashboard where two indicators are green, one is amber, and one is either amber or red depending on earlier decisions. Kubiak's change freeze is either an obstacle or a managed constraint depending on Week 4 and Week 6.

Decision one, go or no-go. Delaying costs the fiscal-year savings window and sponsor confidence and materially reduces Week 9 crisis severity. Proceeding on amber is what most teams do and is not automatically wrong, but it must be paired with the second decision.

Decision two, cutover controls. Whether the team funds a command center, parallel running, manual fallback procedures, and a rollback trigger with a defined threshold. These cost money and time and are the difference between a Week 9 incident and a Week 9 catastrophe. This is where the automation-caution lesson gets its second test, because a team that chose aggressive automation in Week 6 and skips fallback design in Week 8 has now made the same mistake twice.

Learning objectives 3 and 4.

### Week 9 — The crisis

Situation. Something breaks. What breaks is determined by the team's accumulated risk flags rather than by chance. Full library in section 7.

Two crises can fire. If a team carries two risk flags above threshold, the second arrives in the back half of the week while the first is still open, and the compounding is the point — a team managing the $4.17 letter with the press calling does not have the attention to also manage a change freeze collision. The second crisis is not a punishment, it's what accumulated unresolved risk actually feels like, and teams that reach it will have earned it through four or five separate decisions.

Grading note. Since two crises put Disaster genuinely within reach, outcome tier should not drive the grade. Grade the decision quality and the reasoning trail, which the transcripts capture, and let the outcome tier be the narrative consequence students argue with in the debrief. A team that reasons well through a two-crisis Week 9 and still lands in Disaster has learned more than a team that coasted into Win with Scars, and the grading has to say so or students will optimize for the tier instead of the thinking.

Decision, the crisis response. Typically a three-part decision under compressed time: immediate containment, disclosure posture toward the board and, in some crises, the public, and whether to roll back. The disclosure decision is where teams that restated the baseline in Week 3 discover why that was worth doing.

Learning objectives 4 and 7, and the automation-caution lesson lands here or nowhere.

### Week 10 — Sustainment and handoff

Situation. The crisis is resolved or contained. The board presentation is in four days. The team is handing the process to whoever owns it going forward, and the fiscal year ends.

Decision one, the sustainment architecture. Process ownership model, the monitoring metrics that will run after the project team disbands, the exception-review cadence, and the governance for changing the automated rules when a payer changes a form. Teams that treat this as paperwork produce the Win with Scars outcome at best.

Decision two, the board narrative. What the team claims, what it discloses, and what it commits to next. Brennan and Deiss are both in the room, and the Week 3 baseline decision determines whether this conversation is a report or a defense.

Decision three, the external performer question if the team went that route in Week 6 — how the outsourced or co-sourced work is monitored, what the SLA architecture is, and who owns the process when the performer is a vendor.

Learning objectives 5, 6, and 7.

---

## 5b. Lever definitions

Two lever types. Choices are enums, booleans, numbers and allocations — things a team decides. Claims are assertions a team submits and the sim scores against a hidden designed truth without ever confirming it. Analytical conclusions are claims, not menus: a menu tells students there is something to notice, which is exactly what the sim must not do.

Week 1. Opening posture, a four-value enum — continue Clearpath, pause the pilot pending assessment, restart discovery publicly, terminate the pilot. These differ in kind rather than degree, so an enum rather than a scale. Savings commitment, a boolean plus a free dollar figure; the number is the team's own so the gap between what they committed and what the Week 3 arithmetic supports belongs to them. Memo handling, five values — not found, found and sat on, raised privately with Okonkwo, taken to Deiss, surfaced publicly. Not found is a value rather than a null, because whether a team read its inherited material is information the sim should carry.

Week 2. Discovery allocation, roughly 100 points spread freely across document and system analysis, structured interviews, process mining, and floor observation. An allocation rather than a pick-two, so a team can spread thin and discover what thin buys. Scope, a three-value enum — denials only, denials through authorization, full front end from scheduling. Scope multiplies rather than adds, so narrow and deep produces a team that is confident and wrong, which is a more instructive failure than being vaguely uninformed. No value chain lever: the classification is a claim about what the team noticed, and it lives in how they engage Moreau rather than in a menu.

Week 3. The constraint, a claim, scored on three components — whether they named the right station, whether their capacity and arrival figures are close, and whether they drew the implication that Doug automated upstream of it. A team can get the location right and miss the implication, and that partial credit is worth distinguishing because the implication is the transferable lesson. The published baseline, a four-value choice — adopt inherited, restate with documented method, publish a range with assumptions, defer.

The two are coupled. The baseline is scored partly against the constraint claim, so a team that found the authorization constraint and then adopted Doug's baseline is doing something incoherent, and Brennan hits that harder than he hits a team that adopted it without knowing better. Same choice, different meaning, depending on what the team already established. This is the compound consequence mechanic operating inside a single week.

Week 4. Root cause, a claim with a primary and secondary component plus rough weights, scored against the designed distribution. Three scored dimensions: whether the named components are right, whether the weights are roughly proportionate, and — scored separately and mattering most — whether the framing attributes to a function, a system condition, or a named individual. That third axis is independent of accuracy. A team can correctly identify front-end capture as the largest component and still destroy its relationship with Sylvia by saying it in a way that lands on her staffing model. So a team can be accurate and lose, or inaccurate and hold its coalition, which is true of transformation work and the sim carries it without apology.

Week 5. Redesign ambition, three values — refine, redesign within the existing structure, clean-sheet consolidation of patient access, financial clearance and authorization into one accountable function. Design participation, a set of four — frontline staff, union, physicians, IT — because Castellanos scores composition as well as count, and including frontline while excluding the union is a specific and common mistake. Process ownership in the target state, five values — no named owner, Sylvia, a new end-to-end role, a committee, IT. Committee is the trap: it reads as consensus and delivers nobody accountable, and it should be the most attractive-looking wrong answer.

Clean-sheet ambition without the union in the design set starts the sixty-day clock in a state that cannot be satisfied before the Week 8 go-live. That is not a penalty applied later; it is an arithmetic impossibility created here, workable out in Week 5 by a team that thinks about the calendar.

Week 6. Automation depth, the four-value A through D enum. Sourcing, three values — retain internal, co-source the denials backlog under a restructured contract, full back-end BPO. Parameter set, five fields rather than five checkboxes, each requiring a real specification: the dollar threshold and who set it, change detection on payer portals, exception queue ownership and override authority, the rollback trigger and who can pull it, the patient-facing escalation path. The threshold requires an actual number, because the whole lesson is that somebody has to choose it and the default chooses when nobody does.

The parameter set drives automation risk debt, scaled by depth, and is the only lever set whose right answer is identical regardless of what else the team chose. The sim never punishes ambition, only unexamined ambition. The fields are available to a team choosing Option A, and answering them still clears the inherited debt from Doug's pilot — otherwise a team that adds no automation has no route to the 19 percent exception rate it inherited.

Week 7. Implementation approach, three values — pilot at one hospital, phase by function, system-wide cutover — each carrying a duration that interacts with the Epic freeze and the sixty-day clock, making this the first lever where the arithmetic is calendar rather than dollars. Coalition actions, a set of four — Anand given something concrete to champion, Walters given a negotiated path rather than a notification, Moreau briefed before the medical staff meeting rather than at it, Sylvia given public ownership of a component. Training investment, a continuous allocation against remaining budget competing directly with contingency reserve. One slider, two destinations, no allocation that does both. The correct answer is a function of the team's own accumulated risk, and nothing tells them that.

Week 8. Go or no-go, a boolean, read against a dashboard showing four decomposed readiness indicators rather than one score, so the team is interpreting a mixed signal rather than a threshold. Cutover controls, a set of four costed against what remains — command center staffing through the first week, parallel running, documented manual fallback, and a rollback trigger with a defined threshold and a named person who can pull it.

The rollback item pairs with Week 6. A team that specified a rollback trigger in the parameter set and then does not fund the ability to execute it is scored worse than a team that never specified one, because they knew. Proceeding on amber with full controls is defensible; proceeding on amber with none is the same lever value and a different act. The go decision alone reveals almost nothing about judgment; the pairing reveals everything.

Week 9. Containment, a four-value enum whose labels vary by crisis but whose shape does not — let it run, contain narrowly, contain broadly at cost, halt the affected process. Disclosure, five values ordered by scope and speed — say nothing, inform Okonkwo only, inform the executive team, inform the board proactively, disclose publicly. Its correct value depends almost entirely on Week 3: a team that restated can disclose early and survive, and a team carrying Doug's numbers finds that any disclosure opens a thread it cannot control. Same lever, same crisis, opposite right answers, determined six weeks earlier. Rollback, a boolean gated on Week 8 funding; unfunded teams can attempt it at much higher cost and delay.

Attention is an explicit budget in Week 9. Levers apply per crisis rather than globally, so when two fire a team that contains broadly on one has no capacity to do it twice. The second crisis has to genuinely compete with the first or the compounding is cosmetic.

Week 10. Sustainment architecture, a set of four independently funded items — a named process owner with authority, monitoring metrics that run after the team disbands, an exception review cadence with a real owner, and change governance for automated rules when a payer alters a form. Most teams will take one or two and believe they have done it.

The board narrative, a claim: what the team is asserting as annual run-rate benefit and what it is disclosing about how it got there, scored against the defensible figure rather than the realized one. Claiming more than they can defend takes board credibility damage in the final week, which is a hard place to learn it and the right place.

Vendor governance, conditional on external sourcing in Week 6 — SLA structure, operational remedies short of termination, and who owns the process when the performer is a vendor.

The monitoring metrics item is pre-populated with whatever the team chose in Week 3 rather than offered fresh. A team that picked poor baseline metrics is now installing them permanently, and nothing points that out. The Week 3 decision comes due a second time, in a different form, seven weeks later.

---

## 6. Week 6 — The automation decision architecture

This is where the sim becomes distinctly yours. The week presents two orthogonal decisions: how far to automate, and who performs the work. Both matter, and the interaction between them produces most of the Week 9 variance.

The four automation options are not a scale of ambition. They are a scale of altitude, and that is the reframe the levels structure buys. Option A intervenes at task level without technology. Option B automates tasks and redesigns the process around the exceptions. Option C restructures who performs the work by moving judgment into rules. Option D changes the stakeholder set, because an AI writing clinical documentation makes physicians participants in a process they currently only feed. Sourcing is the same question again: outsourcing does not change the process, it changes who is in the value chain. A team that picked its option by savings figure has chosen an altitude without knowing it.

### The automation axis

Option A, human-centered redesign with no new automation. Standardize the front-end work, fix data capture at registration, retire the failing RPA pilot, invest in training and role clarity. Delivers roughly $4.5 to $6 million in credible annual savings, low implementation risk, low crisis probability, and a genuine problem with Okonkwo's board commitment. Marchetti and Kowalczyk support it. Oyelaran will tell teams honestly that there is more available here and they're leaving it.

Option B, targeted automation with human-in-the-loop exceptions. Automate eligibility verification and authorization submission for the highest-volume, most rule-stable payers. Design explicit exception queues with named owners, service-level targets, and daily review. Roughly $7.5 to $9.5 million, moderate risk, and the option that most rewards good Week 8 design. This is the pedagogically correct answer, and the sim must not signal that it is.

Option C, aggressive automation with automated exception handling. Extend automation across most payers and let rules handle exceptions rather than routing them to humans. Roughly $11 to $13 million on paper, which is why teams take it, and it reaches Okonkwo's number. Risk depends almost entirely on whether the team specifies exception thresholds, monitoring, and change detection. Teams that discuss parameter design with Oyelaran and fund it in Week 8 can survive this. Teams that treat automated exception handling as a checkbox meet crisis one or crisis three.

Option D, full end-to-end automation including AI clinical documentation assistance and automated adjudication logic. Up to $15 million claimed, and the option that requires Moreau and Anand to have been engaged since Week 4. Highest crisis probability, and the only path where a clinical adoption revolt is available. It is not a trap — a team that has done the stakeholder work, funded the parameter design, and built rollback can land it — but the number of teams that will have done all three is small.

### The sourcing axis

Retain internal, co-source the denials backlog with the existing vendor under a restructured contract, or move the full back-end revenue cycle to a business process outsourcing arrangement. This is learning objective 5 made operational rather than discussed. The outsourcing option is financially attractive and creates a specific Week 10 obligation: the team must design how it will monitor a process it no longer performs, which is learning objective 6 with a live constraint attached. Teams that outsource and then treat the vendor relationship as procurement rather than process management get crisis eight.

### The parameter conversation

Regardless of option, Oyelaran runs the same conversation, and whether the team engages with it is tracked as a distinct state variable called automation risk debt. He asks five things. What is the dollar threshold below which the system does not take collection action, and who chose that number. What does the bot do when a payer portal changes a field, and how would you know it had. Who reads the exception queue, on what cadence, and what is their authority to override. What is the rollback trigger and who can pull it. And what is the escalation path when the automated decision affects a patient rather than a claim.

A team that answers all five substantively carries zero automation risk debt regardless of which option they picked, which is the point. The lesson is not that automation is dangerous. The lesson is that automation relocates judgment into parameters, and unmade judgments become defaults that nobody chose.

---

## 7. The Week 9 crisis library

Eight crises, each with an explicit causal trace. The engine selects the crisis attached to the team's highest unresolved risk flag. If two flags exceed threshold, a second crisis fires at 50 percent probability in the back half of the week, which is where Disaster outcomes come from.

1. The $4.17 statement. An automated bad-debt referral is generated for a residual balance of $4.17 on a pediatric oncology patient whose family has already paid $31,400 out of pocket. The letter is form-generated, threatens collection, and the mother posts it. Local television picks it up on day three. Traces to Option C or D with no dollar threshold specified in the Week 6 parameter conversation. It is a task-level solution operating with no stakeholder-level view of who is on the other end of it, which is Doug's error committed a second time with a larger blast radius.

2. The duplicate posting. A remittance file processes twice, $2.3 million posts to patient accounts in error, and the cash figure reported to the finance committee last week was wrong. Traces to Option C or D combined with skipped reconciliation controls in Week 8.

3. The silent field change. A major payer modifies a field on its authorization portal. The bot continues submitting, receives acknowledgments, and 340 scheduled procedures across eleven days have no valid authorization. Nobody notices until the first denial batch returns. Traces to no change-detection monitoring in the parameter conversation, and it is the most technically instructive of the eight.

4. The grievance. SEIU files on the sixty-day notice provision, patient access staff work to rule, registration times double, and go-live is suspended. Traces to Week 5 clean-sheet redesign plus Walters engaged after the fact.

5. The freeze collision. Kubiak enforces the Epic change freeze to the letter, an integration defect cannot be patched for eleven days, and the team runs manual workarounds through a volume peak. Traces to naming IT as root cause in Week 4 or excluding Kubiak from the Week 6 decision.

6. The restatement. The board finance committee requests the Clearpath savings reconciliation Deiss mentioned, the inherited baseline does not survive it, and the team is now defending numbers it did not create but did publish. Traces directly to Week 3 adopting Doug's baseline. Sponsor confidence collapses fastest in this one.

7. The clinical revolt. Physicians reject the documentation AI, Dr. Anand withdraws her endorsement publicly at a medical staff meeting, and Moreau requires a suspension. Traces to Option D without sustained clinical engagement from Week 4 forward.

8. The vendor cliff. The outsourcing partner misses SLA badly in month two of transition, the denials backlog grows by 40 percent, and the team discovers its contract has no operational remedy short of termination. Traces to the sourcing decision without transition governance, and it teaches learning objectives 5 and 6 harder than any lecture will.

Every crisis narrative includes an explicit trace-back beat where a stakeholder or advisor names the earlier decision. Marisol saying she flagged that payer combination in Week 2 lands differently than a system message would, and teams that skipped the floor work in Week 2 hear it from someone they never met.

---

## 7b. Crisis exposure and selection

Each crisis carries its own exposure value, 0 to 100, accumulating across weeks from specific levers rather than from a general risk score. There is no single risk number. Eight independent accumulations, and the ones that got fed are the ones that fire, so a team reckless about automation and impeccable about the union has a Week 9 entirely about automation.

Selection runs at the end of Week 8. Exposures rank; the highest fires if above a floor of 40; the second fires only if also above 60, so two crises are the consequence of accumulating two separate problems rather than one bad week. Below 40 on everything, nothing fires — that outcome must exist, because a team that did the work should be able to reach Week 9 with a hard board conversation rather than a catastrophe. In that case Week 9 becomes an early benefit realization review, uncomfortable without being dangerous.

Severity is separate from selection. A crisis at exposure 80 does more damage than the same crisis at 45, so which crisis a team gets and how bad it is are two questions.

Exposure is never shown as a number. It surfaces as consequence — Kubiak's replies getting shorter, exception queue length appearing as a Week 8 dashboard indicator. A risk meter would tell students there is something to minimize and turn the sim into a gauge-management exercise.

1. The $4.17 statement. Dominated by one field: the dollar threshold left unspecified at Option C or D, about 45 on its own. Specified with a real number it contributes nothing regardless of automation depth, which is how stark that mapping should be. Inherited pilot never addressed adds about 10, since the existing bot already generates statements. No patient-facing escalation path adds about 15. Damage is not primarily financial — board credibility takes a hit, but the real cost is Moreau's position collapsing and Anand withdrawing, because clinical staff read this as exactly what they feared. Containable operationally in a day, and the rest of the sim goes to rebuilding relationships. The trace-back beat is Oyelaran's own Week 6 question about what happens when the balance is $4.17, sitting in the transcript with nothing pointing at it.

2. The duplicate posting. Driven by Week 8 rather than Week 6: absence of parallel running and command center together worth about 35 at Option C or D, with depth scaling rather than triggering. Exception queue ownership unspecified adds about 15, since a duplicate file is what a watched queue catches on day one and an unwatched one catches at month-end. Financial credibility below 45 adds exposure — not because low credibility causes duplicate postings, but because a team that has not been rigorous about numbers has a thin reconciliation design, and the variable stands in for a quality of attention nothing else tracks. Damage is the inverse of crisis one: almost no clinical consequence, severe financial and board credibility damage, Deiss's position dropping hard just when most teams were counting on her.

3. The silent field change. Concentrated like crisis one but on a different field: change detection unspecified, about 40 at Option C or D. The concentration is right because this crisis is undetectable without it — every other control passes, since the bot is doing exactly what it was built to do and receiving valid-looking responses. Technical partnership below 35 adds about 15, because Kubiak's team would have caught the portal change if they were talking to the project. Automating authorization specifically — the station the Week 3 arithmetic identifies as the constraint — adds exposure, which is a deliberate inversion: doing the right thing at the right station raises this risk, and the answer is not to avoid the constraint but to monitor what you automate. Damage is operational and clinical at once, 340 procedures meaning surgeons and rescheduling, landing during the freeze when repair is hardest. The most technically instructive of the eight, because the failure is not negligence — it is a well-built system in a world that moved.

4. The grievance. Entirely political. Clean-sheet ambition with the union outside the Week 5 design set is worth about 35 — the arithmetic impossibility arriving. Walters notified rather than negotiated with in Week 7 adds about 20, and this is the partial recovery path: a team that engages her late gets a delayed go-live instead of a work-to-rule. Her trust dimension below threshold adds about 15, since she will grieve a decision she disagrees with but escalates a process she was cut out of. That distinction is why trust and position are separate, and this crisis is where the split earns its keep. Damage is time first — go-live suspends, the fiscal window closes, Okonkwo's commitment becomes impossible — then money, as realization pushes past year end. The only crisis with no technical component at all, which keeps the sim from teaching that transformation risk is fundamentally about systems.

5. The freeze collision. The simplest mapping in the library: technical partnership below 35 climbs steeply, worth about 40 at the bottom, and above 60 contributes essentially nothing because Kubiak finds the window. Naming IT as root cause in Week 4 adds about 20 and is largely unrecoverable, since that relationship is slow to gain and fast to lose. Week 6 heavy integration build with Kubiak excluded adds about 15 — Doug's original mistake repeated. Damage is duration rather than severity: eleven days of manual workaround through a volume peak degrading morale, readiness and benefit at once, with no single dramatic event. Note that crises 3 and 5 both key off technical partnership, so a team that alienated Kubiak has two of eight loaded. That is correct. One badly handled relationship should produce a class of problems, which is what alienating an integration lead actually does.

6. The restatement. The most concentrated and the only deterministic one. Adopting Doug's baseline in Week 3 is worth about 50 alone — the original 70 percent probability expressed as exposure rather than a dice roll, which is better, because the reconciliation request was always coming. The Week 1 savings commitment adds up to about 20, scaled by the gap between what the team committed and what the constraint arithmetic supports, so the exposure is proportional to their own overreach rather than to a menu choice. That is where the free-number lever pays off. Memo found and sat on adds about 15, because a suppressed internal memo is a different conversation than a bad baseline. Damage is board credibility almost exclusively and severe — around 40 points from a starting 48. Sponsor confidence collapses fastest here of any crisis, because Okonkwo's exposure and the team's are the same exposure. This is what makes Week 3 the most consequential week, and nothing anywhere says so.

7. The clinical revolt. The only crisis with a hard prerequisite: unavailable below Option D, correctly, since clinical documentation AI is the only intervention that changes what a physician does at the keyboard. Given Option D, Moreau's position below threshold is worth about 30, Anand not given something concrete in Week 7 about 20, physicians absent from the Week 5 design set about 20. So a team can take the most aggressive option in the sim and carry almost no exposure here if it did the clinical work from Week 4 forward. Option D is not a trap; it is a commitment payable in a currency other than money. Damage is distinctive — the transformation suspends rather than degrades, because Moreau has the authority to stop it and will use it. Largest single hit to realized benefit in the library, with a narrow Week 10 recovery path. Note the asymmetry with crisis 1: both destroy clinical relationships, but crisis 1 finds a team that never thought about patients and crisis 7 a team that never thought about physicians.

8. The vendor cliff. Gates on external sourcing in Week 6, with full BPO carrying roughly double the exposure of co-source. Thin accumulation by design: transition governance unspecified worth about 35, and discovery depth below 50 worth about 20 — because a team that never understood the process it handed over cannot write a meaningful SLA, having contracted for volumes and turnaround without knowing which exceptions consume the work. Pedagogically distinct because the team no longer has hands on the process. Containment narrows to escalate, renegotiate, or terminate and reabsorb, which is learning objectives 5 and 6 arriving as a lived limitation rather than a topic. Damage is operational and slow and lands hardest in Week 10, where sustainment becomes governing a relationship rather than owning a process.

Crises 7 and 8 both gate on Week 6, so a team taking Option B with internal sourcing has only six of eight available. That is correct rather than a gap: the safer path has a narrower risk surface and delivers less benefit, and the sim should not pretend otherwise.

---

## 8. Compound consequence through-lines

Six threads students can trace, which is what makes the arc feel authored rather than scored.

The baseline thread runs Week 1 commitment to Week 3 publication to Week 9 crisis six to Week 10 board narrative. The automation thread runs Week 6 option and parameter conversation to Week 8 cutover controls to Week 9 crises one, two, and three. The union thread runs Week 1 notice email to Week 5 design participation to Week 7 negotiated path to Week 9 crisis four. The IT thread runs Week 2 whether Kubiak was asked a process question, to Week 4 root cause naming, to Week 6 inclusion, to Week 9 crisis five. The Ntende thread runs the whole arc and gates both the Week 4 full disclosure and the Week 10 sustainment handoff, because she is the person the process goes back to. The clinical thread runs Week 4 engagement to Week 6 Option D availability to Week 7 champion activation to Week 9 crisis seven.

The altitude thread runs underneath all of them. A team that skipped the constraint analysis in Week 3 will automate the wrong station in Week 6 exactly as Doug did, and the sim never says so — the evidence is a queue that moves rather than shrinks, visible in the Week 8 readiness dashboard to anyone who looks.

The discovery thread is different in kind and worth flagging separately. Week 2 depth is not recoverable. It doesn't cause a specific crisis; it degrades the quality of every analysis downstream and shows up as a persistent modifier. That asymmetry is deliberate, and it is the strongest structural argument the sim makes for your methodology.

---

## 9. State variables and outcome tiers

Nine tracked variables, specified below. All point-scaled variables run 0 to 100.

Sponsor confidence. Starts at 62. Okonkwo hired this Program Director and wants them to succeed, but he has been burned once. Below 40 he stops spending political capital on the team's behalf, which shows up as declining to clear an obstacle he could clear. Below 25 he begins distancing, which is what makes the Week 9 disclosure decision dangerous. Above 80 he pushes harder, since a sponsor who trusts you asks for more — a pressure, not a reward. Movement is asymmetric: siding with him gains 3 to 6, declining him costs 8 to 12, delivering something he can show the board gains 15, being wrong in public costs 25. Drifts down 1 point a week, because sponsor patience is a depleting resource on a project with a deadline.

Board credibility. Starts at 48, a deficit the team inherits rather than earns, after fourteen months of Clearpath reporting that didn't reconcile. Moves rarely — four or five times across the arc — but in large amounts, because boards form impressions in single sittings. The Week 3 published baseline is the largest mover: restating with documented methodology gains about 20, while adopting Doug's baseline costs nothing immediately and arms the Week 9 restatement crisis, which takes 40 when it fires. Week 10's board narrative moves it up to 30 either way. No drift. It does not respond to effort or intention, only to whether claims survive scrutiny, which makes it the one variable relationship work cannot manage.

Financial credibility. Starts at 50. Doug's deficit attached to him personally, not to the office. Moves on method rather than outcome: a defensible Week 3 baseline gains whether or not the figure is impressive, claiming savings without separating cost avoidance from cost reduction from cash acceleration loses even when the total is right, and doing the Week 3 capacity arithmetic gains because it is evidence the team measures rather than asserts. Functions as a gate. Below 45, Deiss withholds what she knows about the finance committee's earlier reconciliation request and Brennan's advice turns procedural. Above 70, Deiss becomes an active ally, which is the most useful alliance in the sim and the one most teams overlook. Drifts up 0.5 a week — the one variable where time helps.

Stakeholder trust. Eight pairs rather than eight numbers. Each stakeholder carries trust, meaning do they believe you deal straight with them, and position, meaning are they for or against what you are doing. The divergence is the point: Sylvia can trust you personally and still oppose consolidating her function; Walters can favor automation and oppose how you are going about it. Trust moves on engagement — whether you came before deciding, told them something inconvenient rather than letting them find out, credited them. Position moves on what you decide, largely independent of handling.

Starting values differ by character. Sylvia opens near 30 trust and 35 position. Deiss neutral on trust, mildly positive on position, since the mandate was hers. Moreau moderate trust, negative position, carrying the documentation initiative from three years ago. Kubiak low trust, neutral position — he resents Doug, not the project. Marisol and Tyrell start higher on trust than anyone expects and near zero on position, because nobody has ever asked them anything. Disclosure gates are per character and key on trust rather than position; Sylvia's full disclosure needs trust above about 65.

Discovery depth. Starts at 0. Doug's documentation does not count, because it describes the official process rather than the real one. Accumulates almost entirely in Week 2: floor-level observation is worth about 30, process mining about 20 and yields different knowledge, interviews about 20, document analysis about 8 — which is what makes it the tempting cheap option that leaves a team at 40 when they needed 70. Functions as a multiplier rather than a gate, scaling Week 4 diagnosis and Week 5 redesign quality, so a team at 40 makes decent decisions about a process that doesn't quite exist and finds out in Week 8. Recoverable in Weeks 3 and 4 at a real cost in time and sponsor confidence, capped well below what Week 2 could have earned. A team that realizes late it didn't look hard enough should be rewarded for the realization without being made whole.

Readiness. Derived, not pushed. First computed in Week 7 from design quality, the position dimension of the stakeholder vector, whether frontline staff were in the Week 5 design room, discovery depth as a multiplier, and training investment as the one direct Week 7 lever. Stakeholder position and frontline participation carry roughly half the weight, training a quarter, design quality and discovery the rest. That says something specific: a technically excellent redesign nobody who has to execute it helped build scores badly. Above about 75, Week 8 is largely uneventful whatever is coming. Below about 40, go-live damages on its own before any crisis fires. The middle band is where the cutover controls decision matters, and it is where most teams land. The Week 8 dashboard shows readiness decomposed into four indicators rather than one number, so teams see the shape of their problem without being told its cause.

Automation risk debt. Starts at 18, not 0, because Doug's pilot is already running with a 19 percent exception rate nobody owns. A team that never touches the pilot carries that into Week 9. It does not accumulate from choosing aggressive automation. It accumulates from unanswered questions — each of Oyelaran's five parameter questions left unanswered adds debt scaled by how much automation the team chose, so Option D with all five answered carries less debt than Option C with none. That is the lesson in arithmetic: automation is not the risk, unmade judgments are, and they cost more the more you automate. Week 8 cutover controls reduce it. Retiring or fixing the inherited pilot clears the starting 18, which most teams will not think to do. Above 55, an automation crisis becomes the highest-exposure Week 9 candidate; above 75, likely one of the two that fire.

Technical partnership. Starts at 32, inherited resentment from a vendor selection made without IT at the table. Tracked separately from Kubiak's stakeholder pair because it governs something mechanical: the Epic change freeze across Weeks 7 to 9 is real, not an excuse. Above 60 Kubiak finds slack in the change windows and the freeze becomes a managed constraint; below 35 it is enforced to the letter and a one-day patch takes eleven. Moves on inclusion rather than warmth. Asking IT a process question in Week 2 rather than a technology question gains meaningfully and is how the stale weekend eligibility feed surfaces, which is a third of denial volume. Including Kubiak in the Week 6 decision gains substantially. Naming IT as root cause in Week 4 costs heavily. Slow to gain, fast to lose, more so than sponsor confidence — a relationship damaged by public accusation does not repair inside ten weeks.

Realized benefit. The only variable denominated in dollars, and fully derived. Previewed in Week 6, finalized in Week 10. Base comes from redesign scope and automation option together, then adjusted three ways: readiness scales it, because a good design executed badly does not deliver; crisis damage subtracts, both directly and through rollback delay; and Week 10 sustainment quality determines how much survives, since unmonitored benefits erode within two quarters.

Realized and defensible are tracked as separate numbers. A team can realize $8 million and only defend $6 million, because the baseline they published in Week 3 does not support the claim. Financial credibility and board credibility set the defensible figure. The outcome tiers key off defensible, not realized — otherwise a team that inherited Doug's baseline gets credit for savings measured against a number that was never real. That is the Week 3 lesson expressed as arithmetic, and it is the last thing the tiers read from.

Tiers key off defensible benefit, not realized. Defensible is realized scaled by a credibility factor derived from financial credibility and board credibility, so a team that inherited Doug's baseline can realize $8 million and defend $6 million. That gap is the Week 3 lesson arriving as a grade band.

Triumph. Defensible benefit above $8 million, no crisis fired or one fired below severity threshold and fully contained by team action, at least three of four sustainment items funded including a named process owner, board credibility at 60 or above, and at least five of eight stakeholders positive on both trust and position. Rare, and the common route to it is Option B with all five parameter fields answered and the clinical and union work done — not Option D pursued ambitiously. Teams that reach Triumph through the aggressive path did the stakeholder work to earn it, which is the finding worth surfacing in debrief.

Win with scars. Defensible benefit between $5 and $8 million, one crisis absorbed with visible damage, two of four sustainment items funded, and at least two stakeholder relationships materially damaged. Most competent teams land here and should feel it was earned rather than settled for. The scars are specific and nameable, which matters for debrief — a team should be able to say which relationship they spent and what it bought.

Squeak through. Defensible benefit below $5 million, or realized benefit that substantially exceeds what the team can defend, or a crisis contained by executive intervention rather than team action. Sustainment nominal at one item or none. The process is transformed on paper and reverting in practice, the board accepts the report, and no phase two is commissioned. This is the tier for teams that made reasonable decisions in the wrong order.

Disaster. Two crises fired, or one crisis at high severity with a public dimension, or board credibility below 20 at Week 10. Program suspended, sponsor's credibility spent, and in the worst branch Okonkwo's departure is reported in Week 10. It should be reachable, because the sim's honesty depends on failure being possible, and it is now more reachable than in the single-crisis design. See the Week 9 grading note: outcome tier must not drive the grade, or students optimize for the tier instead of the thinking.

Two structural properties worth preserving. First, the no-crisis path exists — a team below 40 exposure on all eight reaches Week 9 with a benefit realization review rather than a catastrophe, and can reach Triumph from there. Second, the ceiling on defensible benefit is set in Week 3 rather than Week 6. A team that adopted Doug's baseline cannot reach Triumph regardless of what it realizes, because the credibility factor caps what it can defend. That is the single most important arithmetic property in the outcome model, and nothing in the sim states it.

## 9b. The debrief

What it withholds first, because that is the harder half. It never shows exposure values, designed truths, or causal traces. No statement that the Week 3 baseline decision produced the crisis. No revealing that authorization was the constraint or that the root cause distribution was 34, 27 and 21. A team that got the constraint wrong finishes without being told they got it wrong. That is uncomfortable and correct — the evidence was available all along, and supplying it now converts a discovery into a fact they were handed.

What it shows is their own record, arranged so the connections are findable. Three panels.

The decision log. Every lever value they set, in week order, with date and submitting team member. Nothing interpreted, nothing annotated. What they did.

What moved. The nine state variables plotted across ten weeks, with no labels on the inflection points. A team seeing sponsor confidence drop fourteen points in Week 3 knows it happened and has to go back to the first panel to find out what they did that week. The pairing is the entire mechanism: one panel holds actions, the other holds consequences, and the student supplies the arrow between them.

What they never saw. An inventory of what existed and was never accessed — the memo if unfound, Marisol's cheat sheet, Tyrell's database, Sylvia's disclosure, the stale weekend feed. Named without content. "Sylvia had information she never shared with you," and nothing further. Not what it was, not what it was worth. This is the panel that earns the debrief, because it is an inventory of closed doors rather than a lesson, and it produces the most useful discomfort available.

The classroom session is where the reconstruction happens. The system provides the material and stops. The instructor asks what connects panel one to panel two, and the room works it out or doesn't, which is the same discipline the sim applies to every other lesson in it.

---

## 10. Case replacement mapping

The case-replacement claim has to survive scrutiny from other faculty, so here is the mapping stated directly.

| HBS case | Its learning function | Replacing sim experience |
|---|---|---|
| IBM / Rometty | Enterprise transformation leadership at scale, inherited mandate, portfolio reshaping | Week 1 inherited Clearpath mandate and Week 10 board narrative under a predecessor's commitments |
| Tesla: Software on Wheels | Process as continuously updated product, agile process enablement | Week 5 agile redesign option and Week 10 change governance for automated rules |
| TradeIX blockchain trade finance | Interorganizational process redesign, technology-enabled multi-party workflow | Week 6 payer-provider interface automation and the eligibility and authorization integration decisions |
| Google / Fitbit | Data integration, regulatory constraint, and integration risk in technology-driven change | Week 6 HIPAA and data governance constraints on automation design, plus Week 9 crisis two |
| VITAL Singapore | Public agency shared services, transition of processes to external performers | Week 6 sourcing axis and Week 10 monitoring of transitioned processes, learning objective 5 and 6 |
| Lemonade | AI-native process design, clean-sheet reengineering of an incumbent workflow | Week 5 clean-sheet option and Week 6 Option D, with the adoption consequences the case doesn't show |
| HubSpot / Motion AI | Bots in customer-facing process, automation boundary judgment | Week 6 patient-facing scheduling and financial clearance bot options, Week 9 crises one and three |
| ABC Inc Accounts Payable, five parts | Multi-role as-is analysis, functional perspective conflict, AP reengineering | The entire stakeholder mechanic, plus Weeks 2 to 5 discovery, diagnosis, and redesign |

Two of these are stronger in the sim than in the case, and I'd claim that openly. Lemonade shows a clean-sheet AI-native process succeeding as a startup, which is a poor analogy for an incumbent; the sim makes students attempt it inside an organization with a union, a medical staff, and an Epic instance. HubSpot/Motion AI discusses where bots should stop; the sim makes students set the threshold and then shows them the $4.17 letter.

One is weaker and worth naming honestly. IBM under Rometty carries a scale and a strategic-portfolio dimension the sim doesn't reach, since a $1.8 billion health system isn't a global technology conglomerate. If you want that dimension preserved, the cheapest fix is a fifteen-minute lecture rather than restoring the case.

---

## 11. Learning objective coverage

| Objective | Primary weeks | Mechanism |
|---|---|---|
| 1. Organizations as process collectives | 1, 2, 5 | Discovery reveals the process crossing eight functions nobody owns |
| 2. Analyze processes and business performance contribution | 2, 3, 4 | Baseline construction and root cause diagnosis with real arithmetic |
| 3. Transform using process language and skills | 5, 6, 8 | Redesign, automation architecture, implementation |
| 4. Enable agile processes and change future paths | 7, 8, 9 | Mobilization, cutover, crisis response |
| 5. Transition processes to external performers | 6, 10 | Sourcing axis and vendor governance |
| 6. Manage transitioned processes as assets | 3, 10 | Metrics chosen in Week 3 become the monitoring architecture in Week 10 |
| 7. Process think | All | Compound consequence traces make the interrelation visible |

---

## 12. Rolling MVP build sequence for Fall 2026

Weeks 1 through 3 need to be complete before the first class meeting, because they carry the baseline decision that everything else hangs on and because the first three weeks set student expectations for what the sim is. That block also needs all six advisor briefs written and all eight stakeholder personalities established, since the characters persist and cannot be retrofitted.

Weeks 4 and 5 can be built during semester weeks 1 and 2. Week 6 is the heaviest single build and should be started early regardless of its position in the arc, because the automation architecture and parameter conversation drive the crisis library. Weeks 7 and 8 build during semester weeks 4 and 5. The crisis library needs at least four of the eight crises live before semester week 6, with the remaining four added if time allows; the selection engine degrades gracefully to the highest-severity available crisis. Week 10 and the debrief traces build last.

Existing Flexee architecture carries the advisor agents, character persistence, and compound consequence tracking, so the marginal build is scenario content and the state model rather than platform work. That's what makes the rolling approach realistic on Priyanshu's queue or with a single added developer.

---

## 13. Resolved design decisions

Sylvia Ntende stays as written. She applied for the job the student is filling and was passed over, and she is competent and justified in her resentment. The discomfort is the pedagogy — a Program Director who cannot work productively with someone who has reason to resent them is not ready for the role, and no case reading produces that feeling.

Week 9 can fire two crises. See the Week 9 grading note above, which is the one thing that has to be true for this to work in a graded course.

The sim makes things implicit. This is the governing design principle rather than a single decision about a citation, so it's stated here as a rule that applies everywhere.

Nothing in the sim announces its own lesson. Advisors work from a methodology without naming it. Stakeholders hold partial views and never summarize the system. The Week 9 crisis narrative shows the consequence and does not state which decision caused it — the trace is discoverable through the stakeholder who mentions having flagged it, and through the student's own record of what they chose. Debrief poses the question rather than delivering the answer: not here is how your Week 3 baseline decision produced this, but here is the crisis and here is your decision log, what connects them.

This costs something and it's worth naming. Some students will miss the connection entirely. That's acceptable, because a student who works out the trace themselves has learned a transferable habit of causal thinking, and a student who is told the trace has learned a fact about a simulation. The instrument for catching the ones who missed it is the debrief discussion, which is where you are, not where the software is.

The same rule governs the Week 6 automation decision. The sim never states that judgment-bearing steps are where automation gets dangerous. It presents Oyelaran's five parameter questions and lets the team answer them well or badly, and the consequence arrives in Week 9 without a caption.
