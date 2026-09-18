# Build Spec: Levers
## Typed decision records, rounds 1 through 10

Two lever kinds. A choice is a value the team selects or sets — enum, boolean, integer, currency, allocation, or set. A claim is an assertion the team submits that is scored against a hidden truth and never confirmed. Claims must be storable, scoreable, and invisible in their scoring.

Every lever has an id, a kind, a type, whether it is required, and which rounds it is open. Levers not open in a round are not rendered.

---

## Round 1

opening_posture — choice, enum, required.
Values: continue_clearpath, pause_pilot, restart_discovery, terminate_pilot.

savings_commitment_made — choice, boolean, required.

savings_commitment_usd — choice, currency, required if savings_commitment_made is true, otherwise null.
Free entry. No suggested value, no slider, no bands. The gap between this and the round 3 constraint arithmetic drives restatement exposure, and the gap must be the team's own.

memo_handling — choice, enum, required.
Values: not_found, found_suppressed, raised_okonkwo, raised_deiss, surfaced_public.
not_found is a value, not a null. It is set by the system if the team never opened the file, and it is information.

---

## Round 2

discovery_allocation — choice, allocation, required. Four keys summing to 100.
Keys: document_analysis, structured_interviews, process_mining, floor_observation.
Yield at full weight: document 8, interviews 20, mining 20, observation 30. Contribution is proportional to allocation.

discovery_scope — choice, enum, required.
Values: denials_only, denials_through_auth, full_front_end.
Scope multiplies rather than adds. Narrow scope concentrates yield onto a smaller surface, producing high confidence about a small piece.

No value chain lever. The classification is a claim about what the team noticed and lives in stakeholder engagement, not in a menu.

---

## Round 3

constraint_claim — claim, composite, required.
Fields: station (enum over the seven stations), shortfall_estimate (integer, cases per day), implication_text (free text).
Scored on three independent components. Location: authorization is correct, claim_submission is partial credit and must be scored as genuinely partial rather than wrong. Arithmetic: within tolerance of 91. Implication: whether the text identifies that verification was automated at 77 percent utilization, upstream of the constraint. Implication carries the most weight.

published_baseline — choice, enum, required.
Values: adopt_inherited, restate_documented, publish_range, defer.

Coupling: published_baseline is scored partly against constraint_claim. A team that located the constraint correctly and then chose adopt_inherited is scored more harshly by Brennan than a team that chose adopt_inherited without knowing. Same value, different meaning, and the scoring function must read both.

---

## Round 4

root_cause_claim — claim, composite, required.
Fields: primary_component (enum), secondary_component (enum), weights (two integers summing to ≤100), framing (enum: function, system_condition, named_individual).
Scored on component accuracy, weight proportionality against 34/27/21/18, and framing — which is scored independently of accuracy and carries the stakeholder consequences.

A team can be accurate and lose their coalition, or inaccurate and hold it. The framing axis must not be collapsed into the accuracy score.

---

## Round 5

redesign_ambition — choice, enum, required.
Values: refine, redesign_structure_intact, clean_sheet.

design_room — choice, set, required. May be empty.
Members: frontline_staff, union, physicians, it.
Castellanos scores composition as well as cardinality, so this is a set rather than a count.

process_ownership — choice, enum, required.
Values: unassigned, ntende, new_role, committee, it.
unassigned is the default if not set. committee must present neutrally and is scored at round 10, not here.

Derived constraint, computed not authored: if redesign_ambition is clean_sheet and union is not in design_room, the notice period cannot complete before the round 8 go-live date. This is arithmetic from the contract and the schedule, not a rule. Surface it nowhere.

---

## Round 6

automation_depth — choice, enum, required. Values: A, B, C, D.

sourcing — choice, enum, required. Values: retain_internal, cosource_denials, full_bpo.

parameter_set — choice, composite, five fields, each required to be either a real value or explicitly null.
threshold_usd: currency. Must accept a number. Must not offer a default, a suggested value, or a checkbox.
threshold_owner: text.
change_detection: text describing mechanism.
queue_owner_and_authority: text.
rollback_trigger: composite — threshold value, named authority.
patient_escalation_path: text.

All five are open at every automation_depth including A, because the inherited pilot is already operating against unspecified parameters. Answering them at depth A clears the inherited 18 points of debt.

Non-null does not mean scored well. A field containing "TBD" is null in substance and the scoring should treat it that way.

---

## Round 7

implementation_approach — choice, enum, required.
Values: pilot_single_site, phase_by_function, system_wide.
Each carries a duration that interacts with the freeze window and the notice clock. Durations belong in the config snapshot.

coalition_actions — choice, set, may be empty.
Members: anand_concrete_commitment, walters_negotiated_path, moreau_advance_brief, ntende_public_ownership.

budget_allocation — choice, allocation, required. Two keys summing to the remaining budget.
Keys: training, contingency_reserve.
Continuous, not banded. The tension only works if a team sets a number and defends it.

---

## Round 8

go_decision — choice, boolean, required.

cutover_controls — choice, set, may be empty, each item priced against remaining budget.
Members: command_center, parallel_running, manual_fallback, rollback_capability.

Interface requirement: the rollback_capability item renders with the team's own round 6 rollback_trigger value beside it, or "No rollback trigger on file." A team reads back what they wrote and then decides whether to fund it. Specified-and-unfunded scores worse than never specified.

---

## Round 9

Levers instantiate per fired crisis, not globally.

containment — choice, enum, required per crisis.
Values: let_run, contain_narrow, contain_broad, halt_process. Labels vary by crisis; the shape does not.

disclosure — choice, enum, required per crisis.
Values: none, okonkwo_only, executive_team, board_proactive, public.

rollback — choice, boolean, required per crisis. Gated on round 8 rollback_capability; available unfunded at substantially higher cost and delay.

attention_budget — system-enforced, not a lever. When two crises fire, contain_broad on one reduces what is available on the other. The second crisis must genuinely compete or the compounding is cosmetic.

---

## Round 10

sustainment — choice, set, may be empty, each independently funded.
Members: named_process_owner, monitoring_metrics, exception_review_cadence, change_governance.

monitoring_metrics renders pre-populated with the metric set defined in round 3, as the default, with rebuild available at cost. Nothing indicates that these are inherited. A team that chose poor baseline metrics is installing them permanently.

board_narrative — claim, composite, required.
Fields: claimed_benefit_usd (currency), disclosure_items (set: crisis_occurred, assumptions_stated, not_yet_working, two_quarter_lag).
Scored against defensible_benefit_usd, not realized.

vendor_governance — choice, set, conditional on round 6 sourcing != retain_internal.
Members: sla_operational_remedies, step_in_rights, process_ownership_named.

---

## Cross-round reads

Seven levers read an earlier round rather than standing alone. These are the compound consequence architecture and they belong in the lever definitions rather than in a separate mechanism.

published_baseline reads constraint_claim, same round.
The round 5 notice collision reads redesign_ambition and design_room against the schedule.
cutover_controls reads parameter_set.rollback_trigger.
disclosure reads published_baseline.
sustainment.monitoring_metrics reads the round 3 metric set.
board_narrative reads financial_credibility and board_credibility through defensible_benefit_usd.
Every risk register entry reads levers from two or more rounds.
