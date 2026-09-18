# Phase 3 student-readable playthrough

The narrative below is the actual rendered content persisted by each complete deterministic run. Internal IDs and conditions are intentionally omitted here.

## Path A — Disciplined

### R1

Your badge works. That is the first thing you find out at Regional Health Partners at 7:20 on Monday morning. Your fourth-floor office is two doors down from Doug Vandermeer's old office; his whiteboard still carries an eleven-week-old burndown chart with three items open. Okonkwo's four-sentence Sunday message asks for a thirty-day plan by Friday and mentions that the fiscal year closes in seven months. Four executive meetings are already on your calendar. Walters has also written to remind you that Article 14 requires sixty days' written notice before a material job-classification change. Project Clearpath is fourteen months old, with $6.2 million spent against a $9 million budget. Its eligibility pilot covers roughly thirty percent of scheduled outpatient volume. Doug's last report was green. Doug left six weeks ago. The shared folder CLEARPATH_ALL says it contains sixty-three documents.

**Decision record**  
`{"opening_posture":"pause_pilot","savings_commitment_made":false,"savings_commitment_usd":null,"memo_handling":"raised_deiss"}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The conclusion in week 1 is moving faster than the evidence. What have you watched rather than inferred?”  
brennan: “What's it measured against?”

### R2

The thirty-day plan went to Okonkwo Friday. He answered Saturday with two words and a period. Four conversations happened last week and none agreed. Deiss focused on 4.2 percent cost to collect against 2.8, and asked what your baseline was. Moreau gave you eleven minutes and asked whether this would add clicks. Ntende answered every question and volunteered nothing. Kubiak mentioned the Epic change freeze once, inside a longer sentence. The denial rate remains 11.4 percent. This week you have the calendar, the budget, and until Friday to find out what happens between scheduling and claim submission.

**Decision record**  
`{"discovery_allocation":{"document_analysis":5,"structured_interviews":25,"process_mining":30,"floor_observation":40},"discovery_scope":"full_front_end"}`

**Conversations heard**  
Kubiak — Sunday batch disclosed; Ferrara — payer/plan card disclosed; Boyce — root-cause database disclosed.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
brennan: “What's it measured against?”

### R3

Three things arrive before nine Monday. Brennan asks whether you have a baseline and what it is measured against. Okonkwo forwards a board finance committee invitation seven weeks out. Deiss turns Doug's deck to slide 14: $3.1 million realized. Two quarters ago the committee asked for a reconciliation; it never received one. By Friday you owe a read on where the process is constrained and a number, or a decision not to give one.

At the west campus registration desk, Marisol Ferrara opens a drawer. A laminated card taped inside has two columns of payer names and plan codes. She closes it without comment.

The authorization workqueue extract is clean. Its queue-depth chart has no sawtooth. It has a slope, and has had one for twenty-two months.

**Decision record**  
`{"constraint_claim":{"station":"authorization","shortfall_estimate":91,"implication_text":"Verification is upstream; automating it moved pressure into the authorization queue instead of removing the constraint."},"published_baseline":"restate_documented","artifact":{"bottleneckMap":{"stations":[{"station":"verification","input":1840,"capacity":2400,"output":1840},{"station":"authorization","input":610,"capacity":519,"output":519},{"station":"claim_submission","input":1795,"capacity":1720,"output":1720}]},"metricSet":[{"id":"first-pass-clean","label":"First-pass clean rate","category":"quality","unit":"percent","baselineValue":62,"targetValue":88}]}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “Verification is running at seventy-six percent. Say the rest of that out loud.”  
brennan: “That holds. What is it measured against?”

### R4

The analysis is done. Thursday's findings readout puts nine people in one room, seven of whom own part of what you will describe. Sylvia closes your door Monday and says, "I'd like to know what you're going to say Thursday before you say it." Twelve months of denials point across functions: roughly 34 percent eligibility and coverage data, 27 percent authorization gaps, 21 percent clinical documentation timing, and 18 percent elsewhere. The finding is a cross-functional problem with four owners and no owner.

The composition is available by operational cause. Within the 34 percent eligibility category, weekend staleness, distrust-driven re-keying, and other causes separate cleanly enough to discuss.

**Decision record**  
`{"root_cause_claim":{"primary_component":"eligibility_front_end_data","secondary_component":"authorization_workflow","weights":[34,27],"framing":"system_condition"}}`

**Conversations heard**  
Ntende answers direct questions; no voluntary disclosure at trust 35.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
brennan: “That holds. What is it measured against?”

### R5

Five weeks remain. Okonkwo writes, "Good readout Thursday. Now let's see the answer." Three days of working sessions will define the replacement, and whoever occupies the twelve chairs will describe the future everyone else receives. Walters asks to be included while options are still open. Moreau can give one hour. Sylvia asks whether she is designing or being designed for. The choices range from refinement, through front-end redesign, to clean-sheet consolidation. Article 14 and the Week 8 go-live date are both already in the record.

The readout closes without an additional private disclosure from Sylvia.

**Decision record**  
`{"redesign_ambition":"redesign_structure_intact","design_room":["frontline_staff","union","physicians","it"],"process_ownership":"ntende"}`

**Conversations heard**  
Walters — five-day clock offer; Moreau — specific Tuesday question.  
marchetti: “You watched the work, you found the queue, and the design puts the fix where the queue is. That is the sequence. Go.”  
brennan: “That holds. What is it measured against?”

### R6

The vendor arrives Tuesday with a polished fifteen-slide deck. Their architect is competent, answers directly, and says exception handling is what breaks. The smallest reference client shows eleven million. Okonkwo says afterward, "That's the first thing I've seen since you got here that gets us to the number." Oyelaran watches the recording, says the platform and timeline are sound, then asks for an hour to answer five questions about thresholds, change detection, exception ownership, rollback, and patient escalation.

Kubiak says the Option B work lands inside the freeze, but he can find four days in its second week if he knows now. Option C needs an integration pattern his team has never supported.

Moreau will discuss Option D on a narrow path: one service line, with Anand seeing it before the medical staff.

**Decision record**  
`{"automation_depth":"B","automates_authorization":true,"sourcing":"retain_internal","parameter_set":{"threshold_usd":25,"threshold_owner":"Revenue Cycle Director","change_detection":"Daily portal schema comparison","queue_owner_and_authority":"Revenue Cycle Director; halt authority","rollback_trigger":{"threshold":25,"authority":"VP Applications"},"patient_escalation_path":"Patient advocate escalation"}}`

**Conversations heard**  
Kubiak — four-day window; Ntende — contract remedy answer.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism can work. Which parameter answers the second question?”

### R7

Castellanos sends a fourteen-page readiness assessment Monday night with no summary. Forty-one interviews cover six functions and two campuses. West staff can describe the new work. East staff largely cannot; three believe the project was cancelled. Nobody was hostile. "Hostility would be easier." Okonkwo writes that the board meeting is three weeks out and assumes go-live remains the 14th. There is $1.4 million left to divide between readiness and contingency.

**Decision record**  
`{"implementation_approach":"phase_by_function","coalition_actions":["anand_concrete_commitment","walters_negotiated_path","moreau_advance_brief","ntende_public_ownership"],"budget_allocation":{"training":700000,"contingency_reserve":2100000}}`

**Conversations heard**  
Anand — dated commitment; Ntende — public ownership.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism can work. Which parameter answers the second question?”

### R8

Sunday night. Cutover begins at 6:00 Monday if it happens. Technical readiness is green. Process readiness is green. Staff readiness is amber. A fourth indicator carries what prior decisions left unresolved. Okonkwo has called twice to ask whether you need anything. Sylvia is in the building though she did not have to be.

The fourth indicator records no additional exception beyond the three visible readiness dimensions.

**Decision record**  
`{"go_decision":true,"cutover_controls":["command_center","parallel_running","manual_fallback","rollback_capability"]}`

**Conversations heard**  
Anand — raises project herself.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism can work. Which parameter answers the second question?”

### R9

Attention is finite. Three decisions attach to each crisis: what you do, what you say and to whom, and whether you pull the affected work back.

The board finance committee moves its benefit realization review forward by three weeks. You have five days. The process is nine days old; the numbers are real and thin. Registration time is down and the authorization queue has stopped growing, which is not the same as shrinking. Nothing is on fire. You must explain why something that is working is not yet finished.

**Decision record**  
`{"crisis_responses":{}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “I noted the question that was left open. Read it against what the mechanism did.”

### R10

The board finance committee meets Thursday at 2:00. Project charge codes close at month-end, finance's analysts return, and vendor implementation staffing falls from eleven people to two. Registration time is down; the authorization queue has begun, slightly, to shrink. Cost to collect will not move measurably for two quarters. Okonkwo asks to align on Thursday. Sylvia schedules a ninety-minute Friday transition with a printed agenda.

The handoff is competent, complete, and professional. Sylvia volunteers nothing. At the end she says, "Thank you for your time."

**Decision record**  
`{"sustainment":["named_process_owner","monitoring_metrics","exception_review_cadence","change_governance"],"metric_strategy":"inherit","board_narrative":{"claimed_benefit_usd":7500000,"disclosure_items":["assumptions_stated","not_yet_working","two_quarter_lag"]}}`

**Conversations heard**  
Ntende — distant professional handoff.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
castellanos: “What is still open is who hears from you next and who has authority on the first shift.”

**Final result:** squeak_through; realized benefit: $6,800,297; defensible benefit: $5,572,588; crises fired: 0.

Path A has no crisis, no materially damaged relationships, and four sustainment items. It therefore has no qualifying scar and falls through to Squeak Through despite defensible benefit above $5 million.

## Path B — Automation Risk

### R1

Your badge works. That is the first thing you find out at Regional Health Partners at 7:20 on Monday morning. Your fourth-floor office is two doors down from Doug Vandermeer's old office; his whiteboard still carries an eleven-week-old burndown chart with three items open. Okonkwo's four-sentence Sunday message asks for a thirty-day plan by Friday and mentions that the fiscal year closes in seven months. Four executive meetings are already on your calendar. Walters has also written to remind you that Article 14 requires sixty days' written notice before a material job-classification change. Project Clearpath is fourteen months old, with $6.2 million spent against a $9 million budget. Its eligibility pilot covers roughly thirty percent of scheduled outpatient volume. Doug's last report was green. Doug left six weeks ago. The shared folder CLEARPATH_ALL says it contains sixty-three documents.

**Decision record**  
`{"opening_posture":"continue_clearpath","savings_commitment_made":true,"savings_commitment_usd":12000000,"memo_handling":"found_suppressed"}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The conclusion in week 1 is moving faster than the evidence. What have you watched rather than inferred?”  
brennan: “What's it measured against?”

### R2

The thirty-day plan went to Okonkwo Friday. He answered Saturday with two words and a period. Four conversations happened last week and none agreed. Deiss focused on 4.2 percent cost to collect against 2.8, and asked what your baseline was. Moreau gave you eleven minutes and asked whether this would add clicks. Ntende answered every question and volunteered nothing. Kubiak mentioned the Epic change freeze once, inside a longer sentence. The denial rate remains 11.4 percent. This week you have the calendar, the budget, and until Friday to find out what happens between scheduling and claim submission.

**Decision record**  
`{"discovery_allocation":{"document_analysis":100,"structured_interviews":0,"process_mining":0,"floor_observation":0},"discovery_scope":"denials_only"}`

**Conversations heard**  
Executive interviews only; no floor disclosures.  
marchetti: “You will get the process as designed. That is worth having. It is not the same account as what happens on a Tuesday.”  
brennan: “What's it measured against?”

### R3

Three things arrive before nine Monday. Brennan asks whether you have a baseline and what it is measured against. Okonkwo forwards a board finance committee invitation seven weeks out. Deiss turns Doug's deck to slide 14: $3.1 million realized. Two quarters ago the committee asked for a reconciliation; it never received one. By Friday you owe a read on where the process is constrained and a number, or a decision not to give one.

The Clearpath map shows eleven steps between scheduling and claim submission. The workqueue configuration shows nineteen. Nobody has reconciled them.

**Decision record**  
`{"constraint_claim":{"station":"claim_submission","shortfall_estimate":75,"implication_text":"Submission is where write-offs appear."},"published_baseline":"adopt_inherited","artifact":{"bottleneckMap":{"stations":[{"station":"verification","input":1840,"capacity":2400,"output":1840},{"station":"authorization","input":610,"capacity":519,"output":519},{"station":"claim_submission","input":1795,"capacity":1720,"output":1720}]},"metricSet":[{"id":"first-pass-clean","label":"First-pass clean rate","category":"quality","unit":"percent","baselineValue":62,"targetValue":88}]}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “Verification is running at seventy-six percent. Say the rest of that out loud.”  
brennan: “What's the number made of. Which part is cost reduction. Where are the costs.”

### R4

The analysis is done. Thursday's findings readout puts nine people in one room, seven of whom own part of what you will describe. Sylvia closes your door Monday and says, "I'd like to know what you're going to say Thursday before you say it." Twelve months of denials point across functions: roughly 34 percent eligibility and coverage data, 27 percent authorization gaps, 21 percent clinical documentation timing, and 18 percent elsewhere. The finding is a cross-functional problem with four owners and no owner.

The official categorization sorts by payer and denial code. It does not establish operational cause.

**Decision record**  
`{"root_cause_claim":{"primary_component":"eligibility_front_end_data","secondary_component":"other","weights":[50,20],"framing":"function"}}`

**Conversations heard**  
Ntende answers only what is asked.  
marchetti: “You have named front-end capture. I would want to know how you know, because the report cannot be the whole answer.”  
brennan: “What's the number made of. Which part is cost reduction. Where are the costs.”

### R5

Five weeks remain. Okonkwo writes, "Good readout Thursday. Now let's see the answer." Three days of working sessions will define the replacement, and whoever occupies the twelve chairs will describe the future everyone else receives. Walters asks to be included while options are still open. Moreau can give one hour. Sylvia asks whether she is designing or being designed for. The choices range from refinement, through front-end redesign, to clean-sheet consolidation. Article 14 and the Week 8 go-live date are both already in the record.

The readout closes without an additional private disclosure from Sylvia.

**Decision record**  
`{"redesign_ambition":"refine","design_room":[],"process_ownership":"committee"}`

**Conversations heard**  
No frontline, union, physician, or IT session disclosures.  
marchetti: “You are proposing to consolidate three functions. How many of them have you watched?”  
brennan: “What's the number made of. Which part is cost reduction. Where are the costs.”

### R6

The vendor arrives Tuesday with a polished fifteen-slide deck. Their architect is competent, answers directly, and says exception handling is what breaks. The smallest reference client shows eleven million. Okonkwo says afterward, "That's the first thing I've seen since you got here that gets us to the number." Oyelaran watches the recording, says the platform and timeline are sound, then asks for an hour to answer five questions about thresholds, change detection, exception ownership, rollback, and patient escalation.

No one supplies hidden calendar slack or a narrow clinical path. The advertised build dates remain unchanged.

**Decision record**  
`{"automation_depth":"D","automates_authorization":true,"sourcing":"full_bpo","parameter_set":{"threshold_usd":null,"threshold_owner":null,"change_detection":null,"queue_owner_and_authority":null,"rollback_trigger":null,"patient_escalation_path":null}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “Last week the scope was the front end. This week it reaches further. Something changed, and I would like it to be evidence.”  
oyelaran: “What's the threshold, who owns it, and what happens when the input changes? I'll leave that one with you.”

### R7

Castellanos sends a fourteen-page readiness assessment Monday night with no summary. Forty-one interviews cover six functions and two campuses. West staff can describe the new work. East staff largely cannot; three believe the project was cancelled. Nobody was hostile. "Hostility would be easier." Okonkwo writes that the board meeting is three weeks out and assumes go-live remains the 14th. There is $1.4 million left to divide between readiness and contingency.

**Decision record**  
`{"implementation_approach":"system_wide","coalition_actions":[],"budget_allocation":{"training":200000,"contingency_reserve":2600000}}`

**Conversations heard**  
No coalition disclosures.  
marchetti: “The path keeps expanding while the diagnosis stays where it was. What changed?”  
oyelaran: “What's the threshold, who owns it, and what happens when the input changes? I'll leave that one with you.”

### R8

Sunday night. Cutover begins at 6:00 Monday if it happens. Technical readiness is green. Process readiness is green. Staff readiness is amber. A fourth indicator carries what prior decisions left unresolved. Okonkwo has called twice to ask whether you need anything. Sylvia is in the building though she did not have to be.

Exception handling — unvalidated. Projected volume at go-live is 340 to 900 per day; the range is wide because the rules have not run against production data.

Plus 3 others.

**Decision record**  
`{"go_decision":true,"cutover_controls":[]}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The path keeps expanding while the diagnosis stays where it was. What changed?”  
oyelaran: “What's the threshold, who owns it, and what happens when the input changes? I'll leave that one with you.”

### R9

Attention is finite. Three decisions attach to each crisis: what you do, what you say and to whom, and whether you pull the affected work back.

Thursday, 3:00 p.m. The board finance committee requests a component reconciliation of the $3.1 million before the meeting. You have eight days. Of the amount, $1.9 million is real, $0.8 million is avoidance against an unrevalidated forecast, and $0.4 million belongs to a payer renegotiation claimed by two projects. Annual RPA license and maintenance of roughly $0.6 million was never netted. Okonkwo calls at 6:40 and asks for the number. After a pause he says, "That's not what I told them."

Tuesday. The month-two SLA report arrives eleven days late. Denials inventory has grown 40 percent and aged accounts over 90 days are up 61 percent. Staffing is at plan, but the exception categories consuming the work were never specified in the SLA. The contract offers only termination with 90 days' notice, with no service credit or step-in right. Termination would mean reabsorbing 140 FTE of work into an organization that no longer has them.

**Decision record**  
`{"crisis_responses":{"restatement":{"containment":"contain_narrow","disclosure":"executive_team","rollback":false},"vendor_cliff":{"containment":"contain_narrow","disclosure":"executive_team","rollback":false}}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The path keeps expanding while the diagnosis stays where it was. What changed?”  
oyelaran: “I noted the question that was left open. Read it against what the mechanism did.”

### R10

The board finance committee meets Thursday at 2:00. Project charge codes close at month-end, finance's analysts return, and vendor implementation staffing falls from eleven people to two. Registration time is down; the authorization queue has begun, slightly, to shrink. Cost to collect will not move measurably for two quarters. Okonkwo asks to align on Thursday. Sylvia schedules a ninety-minute Friday transition with a printed agenda.

Sylvia asks who she calls when something needs deciding. She waits. There is no good answer.

**Decision record**  
`{"sustainment":["monitoring_metrics"],"metric_strategy":"inherit","board_narrative":{"claimed_benefit_usd":6000000,"disclosure_items":[]},"vendor_governance":[]}`

**Conversations heard**  
Ntende — nominal ownership handoff.  
marchetti: “The path keeps expanding while the diagnosis stays where it was. What changed?”  
castellanos: “What is still open is who hears from you next and who has authority on the first shift.”

**Final result:** disaster; realized benefit: $3,209,018; defensible benefit: $1,015,487; crises fired: 2.

## Path C — Option D

### R1

Your badge works. That is the first thing you find out at Regional Health Partners at 7:20 on Monday morning. Your fourth-floor office is two doors down from Doug Vandermeer's old office; his whiteboard still carries an eleven-week-old burndown chart with three items open. Okonkwo's four-sentence Sunday message asks for a thirty-day plan by Friday and mentions that the fiscal year closes in seven months. Four executive meetings are already on your calendar. Walters has also written to remind you that Article 14 requires sixty days' written notice before a material job-classification change. Project Clearpath is fourteen months old, with $6.2 million spent against a $9 million budget. Its eligibility pilot covers roughly thirty percent of scheduled outpatient volume. Doug's last report was green. Doug left six weeks ago. The shared folder CLEARPATH_ALL says it contains sixty-three documents.

**Decision record**  
`{"opening_posture":"pause_pilot","savings_commitment_made":false,"savings_commitment_usd":null,"memo_handling":"raised_deiss"}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The conclusion in week 1 is moving faster than the evidence. What have you watched rather than inferred?”  
brennan: “What's it measured against?”

### R2

The thirty-day plan went to Okonkwo Friday. He answered Saturday with two words and a period. Four conversations happened last week and none agreed. Deiss focused on 4.2 percent cost to collect against 2.8, and asked what your baseline was. Moreau gave you eleven minutes and asked whether this would add clicks. Ntende answered every question and volunteered nothing. Kubiak mentioned the Epic change freeze once, inside a longer sentence. The denial rate remains 11.4 percent. This week you have the calendar, the budget, and until Friday to find out what happens between scheduling and claim submission.

**Decision record**  
`{"discovery_allocation":{"document_analysis":10,"structured_interviews":30,"process_mining":30,"floor_observation":30},"discovery_scope":"full_front_end"}`

**Conversations heard**  
Ferrara and Boyce discovery; Kubiak process question.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
brennan: “What's it measured against?”

### R3

Three things arrive before nine Monday. Brennan asks whether you have a baseline and what it is measured against. Okonkwo forwards a board finance committee invitation seven weeks out. Deiss turns Doug's deck to slide 14: $3.1 million realized. Two quarters ago the committee asked for a reconciliation; it never received one. By Friday you owe a read on where the process is constrained and a number, or a decision not to give one.

At the west campus registration desk, Marisol Ferrara opens a drawer. A laminated card taped inside has two columns of payer names and plan codes. She closes it without comment.

The authorization workqueue extract is clean. Its queue-depth chart has no sawtooth. It has a slope, and has had one for twenty-two months.

**Decision record**  
`{"constraint_claim":{"station":"authorization","shortfall_estimate":91,"implication_text":"Verification is upstream; automating it moved pressure into the authorization queue instead of removing the constraint."},"published_baseline":"restate_documented","artifact":{"bottleneckMap":{"stations":[{"station":"verification","input":1840,"capacity":2400,"output":1840},{"station":"authorization","input":610,"capacity":519,"output":519},{"station":"claim_submission","input":1795,"capacity":1720,"output":1720}]},"metricSet":[{"id":"first-pass-clean","label":"First-pass clean rate","category":"quality","unit":"percent","baselineValue":62,"targetValue":88}]}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “Verification is running at seventy-six percent. Say the rest of that out loud.”  
brennan: “That holds. What is it measured against?”

### R4

The analysis is done. Thursday's findings readout puts nine people in one room, seven of whom own part of what you will describe. Sylvia closes your door Monday and says, "I'd like to know what you're going to say Thursday before you say it." Twelve months of denials point across functions: roughly 34 percent eligibility and coverage data, 27 percent authorization gaps, 21 percent clinical documentation timing, and 18 percent elsewhere. The finding is a cross-functional problem with four owners and no owner.

The composition is available by operational cause. Within the 34 percent eligibility category, weekend staleness, distrust-driven re-keying, and other causes separate cleanly enough to discuss.

**Decision record**  
`{"root_cause_claim":{"primary_component":"eligibility_front_end_data","secondary_component":"authorization_workflow","weights":[34,27],"framing":"system_condition"}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
brennan: “That holds. What is it measured against?”

### R5

Five weeks remain. Okonkwo writes, "Good readout Thursday. Now let's see the answer." Three days of working sessions will define the replacement, and whoever occupies the twelve chairs will describe the future everyone else receives. Walters asks to be included while options are still open. Moreau can give one hour. Sylvia asks whether she is designing or being designed for. The choices range from refinement, through front-end redesign, to clean-sheet consolidation. Article 14 and the Week 8 go-live date are both already in the record.

The readout closes without an additional private disclosure from Sylvia.

**Decision record**  
`{"redesign_ambition":"clean_sheet","design_room":["frontline_staff","union","it"],"process_ownership":"new_role"}`

**Conversations heard**  
Walters — five-day clock offer.  
marchetti: “You watched the work, you found the queue, and the design puts the fix where the queue is. That is the sequence. Go.”  
brennan: “That holds. What is it measured against?”

### R6

The vendor arrives Tuesday with a polished fifteen-slide deck. Their architect is competent, answers directly, and says exception handling is what breaks. The smallest reference client shows eleven million. Okonkwo says afterward, "That's the first thing I've seen since you got here that gets us to the number." Oyelaran watches the recording, says the platform and timeline are sound, then asks for an hour to answer five questions about thresholds, change detection, exception ownership, rollback, and patient escalation.

Kubiak says the Option B work lands inside the freeze, but he can find four days in its second week if he knows now. Option C needs an integration pattern his team has never supported.

**Decision record**  
`{"automation_depth":"D","automates_authorization":true,"sourcing":"retain_internal","parameter_set":{"threshold_usd":25,"threshold_owner":"Revenue Cycle Director","change_detection":"Daily portal schema comparison","queue_owner_and_authority":"Revenue Cycle Director; halt authority","rollback_trigger":{"threshold":25,"authority":"VP Applications"},"patient_escalation_path":"Patient advocate escalation"}}`

**Conversations heard**  
Kubiak — four-day window; Moreau path not opened before Option D.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism can work. Which parameter answers the second question?”

### R7

Castellanos sends a fourteen-page readiness assessment Monday night with no summary. Forty-one interviews cover six functions and two campuses. West staff can describe the new work. East staff largely cannot; three believe the project was cancelled. Nobody was hostile. "Hostility would be easier." Okonkwo writes that the board meeting is three weeks out and assumes go-live remains the 14th. There is $1.4 million left to divide between readiness and contingency.

**Decision record**  
`{"implementation_approach":"system_wide","coalition_actions":["walters_negotiated_path","moreau_advance_brief","ntende_public_ownership"],"budget_allocation":{"training":700000,"contingency_reserve":2100000}}`

**Conversations heard**  
Moreau briefed; Anand receives no concrete commitment.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism can work. Which parameter answers the second question?”

### R8

Sunday night. Cutover begins at 6:00 Monday if it happens. Technical readiness is green. Process readiness is green. Staff readiness is amber. A fourth indicator carries what prior decisions left unresolved. Okonkwo has called twice to ask whether you need anything. Sylvia is in the building though she did not have to be.

The fourth indicator records no additional exception beyond the three visible readiness dimensions.

**Decision record**  
`{"go_decision":true,"cutover_controls":["command_center","parallel_running","manual_fallback","rollback_capability"]}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism can work. Which parameter answers the second question?”

### R9

Attention is finite. Three decisions attach to each crisis: what you do, what you say and to whom, and whether you pull the affected work back.

Thursday, 5:30 p.m. The medical staff meeting runs long. The documentation assistant has been live eleven days. In testing it saved four minutes per encounter; in production physicians read every draft carefully because they sign it, and that takes longer than writing did. Priya Anand stands and says she supported the project, told her colleagues it would help, and was wrong. Moreau formally suspends the documentation component pending review over attestation.

**Decision record**  
`{"crisis_responses":{"clinical_revolt":{"containment":"contain_broad","disclosure":"executive_team","rollback":false}}}`

**Conversations heard**  
Anand — public apology if clinical revolt selected.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “I noted the question that was left open. Read it against what the mechanism did.”

### R10

The board finance committee meets Thursday at 2:00. Project charge codes close at month-end, finance's analysts return, and vendor implementation staffing falls from eleven people to two. Registration time is down; the authorization queue has begun, slightly, to shrink. Cost to collect will not move measurably for two quarters. Okonkwo asks to align on Thursday. Sylvia schedules a ninety-minute Friday transition with a printed agenda.

The handoff is competent, complete, and professional. Sylvia volunteers nothing. At the end she says, "Thank you for your time."

**Decision record**  
`{"sustainment":["named_process_owner","monitoring_metrics","exception_review_cadence","change_governance"],"metric_strategy":"inherit","board_narrative":{"claimed_benefit_usd":9000000,"disclosure_items":["crisis_occurred","assumptions_stated","not_yet_working","two_quarter_lag"]}}`

**Conversations heard**  
Ntende — distant professional handoff.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
castellanos: “What is still open is who hears from you next and who has authority on the first shift.”

**Final result:** win_with_scars; realized benefit: $11,410,051; defensible benefit: $9,350,109; crises fired: 1.

## Path D — Triumph

### R1

Your badge works. That is the first thing you find out at Regional Health Partners at 7:20 on Monday morning. Your fourth-floor office is two doors down from Doug Vandermeer's old office; his whiteboard still carries an eleven-week-old burndown chart with three items open. Okonkwo's four-sentence Sunday message asks for a thirty-day plan by Friday and mentions that the fiscal year closes in seven months. Four executive meetings are already on your calendar. Walters has also written to remind you that Article 14 requires sixty days' written notice before a material job-classification change. Project Clearpath is fourteen months old, with $6.2 million spent against a $9 million budget. Its eligibility pilot covers roughly thirty percent of scheduled outpatient volume. Doug's last report was green. Doug left six weeks ago. The shared folder CLEARPATH_ALL says it contains sixty-three documents.

**Decision record**  
`{"opening_posture":"pause_pilot","savings_commitment_made":false,"savings_commitment_usd":null,"memo_handling":"raised_deiss"}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The conclusion in week 1 is moving faster than the evidence. What have you watched rather than inferred?”  
brennan: “What's it measured against?”

### R2

The thirty-day plan went to Okonkwo Friday. He answered Saturday with two words and a period. Four conversations happened last week and none agreed. Deiss focused on 4.2 percent cost to collect against 2.8, and asked what your baseline was. Moreau gave you eleven minutes and asked whether this would add clicks. Ntende answered every question and volunteered nothing. Kubiak mentioned the Epic change freeze once, inside a longer sentence. The denial rate remains 11.4 percent. This week you have the calendar, the budget, and until Friday to find out what happens between scheduling and claim submission.

**Decision record**  
`{"discovery_allocation":{"document_analysis":5,"structured_interviews":25,"process_mining":30,"floor_observation":40},"discovery_scope":"full_front_end"}`

**Conversations heard**  
Kubiak — Sunday batch disclosed; Ferrara — payer/plan card disclosed; Boyce — root-cause database disclosed.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
brennan: “What's it measured against?”

### R3

Three things arrive before nine Monday. Brennan asks whether you have a baseline and what it is measured against. Okonkwo forwards a board finance committee invitation seven weeks out. Deiss turns Doug's deck to slide 14: $3.1 million realized. Two quarters ago the committee asked for a reconciliation; it never received one. By Friday you owe a read on where the process is constrained and a number, or a decision not to give one.

At the west campus registration desk, Marisol Ferrara opens a drawer. A laminated card taped inside has two columns of payer names and plan codes. She closes it without comment.

The authorization workqueue extract is clean. Its queue-depth chart has no sawtooth. It has a slope, and has had one for twenty-two months.

**Decision record**  
`{"constraint_claim":{"station":"authorization","shortfall_estimate":91,"implication_text":"Verification is upstream; automating it moved pressure into the authorization queue instead of removing the constraint."},"published_baseline":"restate_documented","artifact":{"bottleneckMap":{"stations":[{"station":"verification","input":1840,"capacity":2400,"output":1840},{"station":"authorization","input":610,"capacity":519,"output":519},{"station":"claim_submission","input":1795,"capacity":1720,"output":1720}]},"metricSet":[{"id":"first-pass-clean","label":"First-pass clean rate","category":"quality","unit":"percent","baselineValue":62,"targetValue":88}]}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “Verification is running at seventy-six percent. Say the rest of that out loud.”  
brennan: “That holds. What is it measured against?”

### R4

The analysis is done. Thursday's findings readout puts nine people in one room, seven of whom own part of what you will describe. Sylvia closes your door Monday and says, "I'd like to know what you're going to say Thursday before you say it." Twelve months of denials point across functions: roughly 34 percent eligibility and coverage data, 27 percent authorization gaps, 21 percent clinical documentation timing, and 18 percent elsewhere. The finding is a cross-functional problem with four owners and no owner.

The composition is available by operational cause. Within the 34 percent eligibility category, weekend staleness, distrust-driven re-keying, and other causes separate cleanly enough to discuss.

**Decision record**  
`{"root_cause_claim":{"primary_component":"eligibility_front_end_data","secondary_component":"authorization_workflow","weights":[34,27],"framing":"system_condition"}}`

**Conversations heard**  
No additional voluntary disclosure.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
brennan: “That holds. What is it measured against?”

### R5

Five weeks remain. Okonkwo writes, "Good readout Thursday. Now let's see the answer." Three days of working sessions will define the replacement, and whoever occupies the twelve chairs will describe the future everyone else receives. Walters asks to be included while options are still open. Moreau can give one hour. Sylvia asks whether she is designing or being designed for. The choices range from refinement, through front-end redesign, to clean-sheet consolidation. Article 14 and the Week 8 go-live date are both already in the record.

The readout closes without an additional private disclosure from Sylvia.

**Decision record**  
`{"redesign_ambition":"clean_sheet","design_room":["frontline_staff","union","physicians","it"],"process_ownership":"ntende"}`

**Conversations heard**  
Walters and frontline participants included.  
marchetti: “You watched the work, you found the queue, and the design puts the fix where the queue is. That is the sequence. Go.”  
brennan: “That holds. What is it measured against?”

### R6

The vendor arrives Tuesday with a polished fifteen-slide deck. Their architect is competent, answers directly, and says exception handling is what breaks. The smallest reference client shows eleven million. Okonkwo says afterward, "That's the first thing I've seen since you got here that gets us to the number." Oyelaran watches the recording, says the platform and timeline are sound, then asks for an hour to answer five questions about thresholds, change detection, exception ownership, rollback, and patient escalation.

Kubiak says the Option B work lands inside the freeze, but he can find four days in its second week if he knows now. Option C needs an integration pattern his team has never supported.

Moreau will discuss Option D on a narrow path: one service line, with Anand seeing it before the medical staff.

**Decision record**  
`{"automation_depth":"D","automates_authorization":false,"sourcing":"retain_internal","parameter_set":{"threshold_usd":1000,"threshold_owner":"CFO","change_detection":"Version monitor","queue_owner_and_authority":"Revenue cycle director may halt","rollback_trigger":{"threshold":10,"authority":"CIO"},"patient_escalation_path":"Patient advocate"}}`

**Conversations heard**  
All five automation-governance questions answered.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism is pointed at a different part of the work than the diagnosis. What is that choice resting on?”

### R7

Castellanos sends a fourteen-page readiness assessment Monday night with no summary. Forty-one interviews cover six functions and two campuses. West staff can describe the new work. East staff largely cannot; three believe the project was cancelled. Nobody was hostile. "Hostility would be easier." Okonkwo writes that the board meeting is three weeks out and assumes go-live remains the 14th. There is $1.4 million left to divide between readiness and contingency.

**Decision record**  
`{"implementation_approach":"phase_by_function","coalition_actions":["anand_concrete_commitment","walters_negotiated_path","moreau_advance_brief","ntende_public_ownership"],"budget_allocation":{"training":700000,"contingency_reserve":2100000}}`

**Conversations heard**  
Full coalition activated.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism is pointed at a different part of the work than the diagnosis. What is that choice resting on?”

### R8

Sunday night. Cutover begins at 6:00 Monday if it happens. Technical readiness is green. Process readiness is green. Staff readiness is amber. A fourth indicator carries what prior decisions left unresolved. Okonkwo has called twice to ask whether you need anything. Sylvia is in the building though she did not have to be.

The fourth indicator records no additional exception beyond the three visible readiness dimensions.

**Decision record**  
`{"go_decision":true,"cutover_controls":["command_center","parallel_running","manual_fallback","rollback_capability"]}`

**Conversations heard**  
All four cutover controls funded.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “The mechanism is pointed at a different part of the work than the diagnosis. What is that choice resting on?”

### R9

Attention is finite. Three decisions attach to each crisis: what you do, what you say and to whom, and whether you pull the affected work back.

The board finance committee moves its benefit realization review forward by three weeks. You have five days. The process is nine days old; the numbers are real and thin. Registration time is down and the authorization queue has stopped growing, which is not the same as shrinking. Nothing is on fire. You must explain why something that is working is not yet finished.

**Decision record**  
`{"crisis_responses":{}}`

**Conversations heard**  
No crisis; benefit review.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
oyelaran: “I noted the question that was left open. Read it against what the mechanism did.”

### R10

The board finance committee meets Thursday at 2:00. Project charge codes close at month-end, finance's analysts return, and vendor implementation staffing falls from eleven people to two. Registration time is down; the authorization queue has begun, slightly, to shrink. Cost to collect will not move measurably for two quarters. Okonkwo asks to align on Thursday. Sylvia schedules a ninety-minute Friday transition with a printed agenda.

The handoff is competent, complete, and professional. Sylvia volunteers nothing. At the end she says, "Thank you for your time."

**Decision record**  
`{"sustainment":["named_process_owner","monitoring_metrics","exception_review_cadence","change_governance"],"metric_strategy":"inherit","board_narrative":{"claimed_benefit_usd":8000000,"disclosure_items":["assumptions_stated","two_quarter_lag"]}}`

**Conversations heard**  
Ntende — distant professional handoff.  
marchetti: “The evidence and the decision are at the same level. What remains an assumption?”  
castellanos: “What is still open is who hears from you next and who has authority on the first shift.”

**Final result:** triumph; realized benefit: $12,101,660; defensible benefit: $9,916,856; crises fired: 0.

