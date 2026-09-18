# Phase 4 Panel 3 Access Audit

Panel 3 now treats an item as seen only when its precise, source-supported access event is persisted in evidence, narrative, artifact sub-access, or an authoritative transcript. When access cannot be proven, the item is listed. Student output is limited to one prescribed sentence naming the person or object; the predicates below are developer/instructor review material.

## Reyes memo

**Access event:** The analyst memo itself is opened.  
**Current implementation predicate:** `analyst_memo.accessed` is true.  
**Seen when:** The evidence access record proves the memo was opened.  
**Not seen when:** The memo was not opened; new student submissions cannot choose a non-`not_found` handling value in that state.  
**Source/event used:** Existing evidence access state.

## Reyes

**Access event:** Reyes is contacted.  
**Current implementation predicate:** A persisted Reyes transcript exists.  
**Seen when:** The run contains an actual conversation with Reyes.  
**Not seen when:** The memo merely reveals that she exists.  
**Source/event used:** Existing conversation transcript.

## Marisol's card

**Access event:** The west-campus registration-desk observation reveals the card, the card is opened directly, or Ferrara actually discloses it in conversation.  
**Current implementation predicate:** `ferrara_cheat_sheet.accessed`, persisted `r3-observation-thread`, or Ferrara's authoritative card disclosure is present.  
**Seen when:** One of those exact events occurred.  
**Not seen when:** There is only an observation allocation, survey, interview request, meeting, or generic Ferrara contact.  
**Source/event used:** Existing evidence access, persisted narrative snapshot, or transcript.

## Tyrell's database

**Access event:** Denials-bench access opens the database, or Boyce answers the qualifying categorization/root-cause question.  
**Current implementation predicate:** `boyce_database.accessed` or Boyce's authoritative separate-twelve-month-view disclosure is present.  
**Seen when:** Direct evidence access or the exact disclosure is recorded.  
**Not seen when:** Only generic structured interviews, a denial-count question, or unrelated stakeholder activity occurred.  
**Source/event used:** Existing evidence access or transcript.

## Sylvia's disclosures

**Access event:** Ntende makes the full source-supported disclosure after the systemic readout, or actually delivers it in conversation.  
**Current implementation predicate:** Persisted `r5-sylvia-disclosure` or Ntende's authoritative month-four/queue-report statement is present.  
**Seen when:** The selected narrative or transcript proves disclosure.  
**Not seen when:** Trust is merely high or Ntende was contacted without making the disclosure.  
**Source/event used:** Persisted narrative snapshot or transcript.

## Kubiak's eligibility feed

**Access event:** The feed is opened, Kubiak answers the qualifying IT process question, or the non-accusatory Round 4 readout causes his spontaneous disclosure.  
**Current implementation predicate:** `stale_weekend_feed.accessed`, Kubiak's authoritative Sunday-night-feed statement, or Round 4 `system_condition` framing.  
**Seen when:** One of those exact source-supported events occurred.  
**Not seen when:** Technical partnership is high, contact is generic, or Round 4 framing accuses a function or individual.  
**Source/event used:** Existing evidence access, transcript, or persisted Round 4 submission that deterministically triggers the readout.

## Walters's early-clock offer

**Access event:** Walters actually offers to start the clock Monday if classification language arrives Friday.  
**Current implementation predicate:** The union is included in the Round 5 design room, or her authoritative offer is present in a persisted transcript.  
**Seen when:** The exact design-room choice deterministically causes the unprompted offer, or the offer was delivered in conversation.  
**Not seen when:** Walters was contacted about another subject or only notified later.  
**Source/event used:** Persisted Round 5 submission or existing conversation transcript.

## Version 3 board deck

**Access event:** Board-deck version 3 is opened through version history.  
**Current implementation predicate:** `doug_board_deck.accessedVersions` contains `v3`.  
**Seen when:** Exact version access is recorded.  
**Not seen when:** Only default version 4 or the general artifact was opened.  
**Source/event used:** Existing artifact version-access state.

## Page nine of the readiness assessment

**Access event:** Page 9 is opened.  
**Current implementation predicate:** `readiness_assessment.accessedPages` contains `9`.  
**Seen when:** Exact page access is recorded.  
**Not seen when:** Only the artifact or another page was opened.  
**Source/event used:** Existing artifact page-access state.

## Anand's escalation spreadsheet

**Access event:** Anand discloses that her office manager has three years of escalation records.  
**Current implementation predicate:** Her authoritative escalation-records statement is present in a persisted transcript.  
**Seen when:** That exact disclosure was delivered.  
**Not seen when:** Anand was merely contacted or named in a coalition action.  
**Source/event used:** Existing conversation transcript.

## Load-Bearing Access Audit

| Artifact or information | Access event | Required for decision | Optional evidence | Current enforcement | Authoritative basis | Conclusion |
|---|---|---|---|---|---|---|
| Reyes memo | Open `ANALYSIS_DRAFT_v2_JR.docx` | Required for any R1 memo handling other than `not_found` | Its facts remain leads, not an answer key | Application submission rejects both unopened/non-`not_found` and opened/`not_found` mismatches | Design §Week 1 decision three; lever specification says `not_found` is set when the file was never opened | Load-bearing access prerequisite |
| Reyes | Contact her after discovering the memo author and asking where she went | No later lever requires contact | Yes | Availability and transcript gates | Voice brief: she must be found; working files open on contact | Optional discovery |
| Marisol's card | West-campus desk observation, exact card access, or actual disclosure | No lever requires it | Yes; it informs whether the redesign handles real desk work | Exact narrative/evidence/transcript event | Week 2 and voice brief | Optional evidence |
| Tyrell's database | Denials-bench access or qualifying categorization/root-cause question | No lever requires it | Yes; it supports diagnosis | Exact evidence/transcript event | Week 2 and voice brief | Optional evidence |
| Sylvia's disclosure | Full disclosure variant or actual month-four/queue-report statement | No lever requires it | Yes | Exact narrative/transcript event | Week 4/5 content and voice brief | Optional evidence |
| Kubiak's feed | Exact evidence access, qualifying IT process answer, or non-accusatory R4 readout | No lever requires it | Yes; it supports root-cause and design judgment | Exact evidence/transcript/R4 event | Design and voice brief | Optional evidence |
| Walters's offer | Union in R5 design room, where the offer is unprompted, or actual offer transcript | No later lever requires prior receipt | Yes; it exposes recoverable notice time | Exact R5 participation or transcript event | Week 5 says the offer occurs if the union is in the room | Deterministic information event, not a generic relationship proxy |
| Board deck v3 | Open v3 through version history | No baseline or savings choice requires it | Yes; it hands the team the savings-composition problem | Exact `accessedVersions` only | Artifact specification calls it discoverable through file properties | Optional evidence, not a prerequisite |
| Readiness page 9 | Open page 9 | No training allocation or R8 go/control choice requires it | Yes; it identifies the cheapest targeted readiness fix | Exact `accessedPages` only | Week 7 and artifact specification bury the fix on page 9 but state no gate | Optional evidence, not a prerequisite |
| Anand's spreadsheet | Receive her authoritative escalation-record disclosure | No coalition action requires it | Yes; it sharpens the clinical case | Exact transcript disclosure | Voice brief | Optional evidence |

### R1 memo enforcement finding

Previously, the service rejected `not_found` after opening the memo but did not reject the inverse. A student could therefore submit `raised_deiss`, `raised_okonkwo`, `found_suppressed`, or `surfaced_public` without opening it. That contradicted the lever specification: “not_found is a value ... set by the system if the team never opened the file.” The minimum application-layer correction now rejects a non-`not_found` value until the memo is opened. It does not change risk, benefit, or outcome calculations.

### Page 9 and board v3 findings

Neither source establishes a prerequisite. Page 9 supplies a $200,000 targeted remediation insight, but the R7 lever remains a continuous training/readiness allocation and R8 decisions remain available without page access. Version 3 supplies savings composition and the missing licensing row, but baseline and commitment decisions can be reached from other evidence or judgment. Both remain optional evidence and are listed when unopened.

The investigation also found that evidence availability was refreshed only during Round 2. Later artifacts appeared in the document browser, but access could be rejected because their evidence record remained unavailable. Evidence availability now advances deterministically when each round opens, allowing the accepted page-level readiness interaction at Round 7. This changes access recording only; it does not alter readiness, benefits, budgets, risks, or outcomes.

## Persisted Path Interpretation

The four saved Phase 4 browser paths contain submissions and persisted scenario narratives but no artifact/evidence openings and no conversation transcripts. They were scripted before the corrected memo submission gate, so each contains a non-`not_found` memo value without a memo access record. The historical records are not rewritten. In a new student run, that mismatch is rejected.

### Path A — Disciplined (`squeak_through`)

- Reyes memo — **LISTED**; no memo access record.
- Reyes — **LISTED**; no Reyes transcript.
- Marisol's card — **NOT LISTED**; persisted `r3-observation-thread` proves the west-campus desk event.
- Tyrell's database — **LISTED**; interview allocation does not prove denials-bench/database access.
- Sylvia's disclosures — **LISTED**; no disclosure variant or authoritative transcript.
- Kubiak's eligibility feed — **NOT LISTED**; systemic Round 4 framing triggers the source-specified spontaneous readout.
- Walters's early-clock offer — **NOT LISTED**; union inclusion in the R5 design room deterministically produces the unprompted offer.
- Version 3 board deck — **LISTED**; no v3 access record.
- Page nine of the readiness assessment — **LISTED**; no page-9 access record.
- Anand's escalation spreadsheet — **LISTED**; coalition action does not prove the records were disclosed.

Panel 3 inventory: The Reyes memo contained information you never saw; Reyes had information she never shared; Tyrell had information he never shared; Sylvia had information she never shared; version 3 contained information you never saw; page nine contained information you never saw; Anand had information she never shared.

### Path B — Automation Risk (`disaster`)

All ten items are **LISTED**. The run has no exact evidence/artifact access or transcripts, no west-campus observation narrative, no union design-room event, and accusatory functional Round 4 framing does not trigger Kubiak's spontaneous disclosure.

### Path C — Option D (`win_with_scars`)

The inventory matches Path A. Marisol's card is not listed because the persisted west-campus observation fired, Kubiak's feed is not listed because systemic Round 4 framing triggered the spontaneous readout, and Walters's offer is not listed because the union was in the R5 design room. The other seven items are **LISTED**.

### Path D — Triumph (`triumph`)

The inventory matches Path A and Path C for the same exact-event reasons. Path D did not open the memo, board-deck v3, readiness page 9, or any other listed artifact, and it contains no stakeholder transcripts. Its strong decisions were scripted without browsing; v3 and page 9 are optional evidence, while the memo submission is a historical bypass now prevented for new student submissions. Triumph does not imply exhaustive discovery, so identical inventories are otherwise expected.

## Regression result

The focused Panel 3 suite verifies exact access, rejects generic allocations and score thresholds, preserves the prescribed one-line student output, and confirms different event histories produce different inventories.

- Full suite: 250/250 passed.
- Golden suite: 9/9 passed.
- Typecheck: passed.
- Lint: passed with zero warnings.
- Production build: passed.
- Fresh production-server verification: all four persisted paths were completed at R10 with outcomes A `squeak_through`, B `disaster`, C `win_with_scars`, and D `triumph`.
- Panel 3 security: no access predicate, event identifier, hidden gate, score, causal explanation, variant ID, advisor metadata, or crisis metadata was present.
- Rendered browser check: the one-line sentences were present, including “Sylvia had information she never shared with you.” No causes, values, explanations, or hints were shown.
