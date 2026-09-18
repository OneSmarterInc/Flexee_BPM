# Phase 5 Cold Run Report

## Status

```text
SECOND COLD RUN COMPLETED — FOLLOW-UP VERIFICATION COMPLETED
```

This report records only observations supplied from the real participant sessions. No participant behavior, quote, or result is inferred or fabricated.

## Original cold-run observation

- The original participant initially lacked a clear mental model.
- The participant independently discovered Evidence/Documents, Advisors, and People.
- The participant understood that questions could be asked.
- The participant understood the decision workspace and successfully submitted Round 1.
- After submission, the participant attempted to select Round 2, which had not yet been released by the instructor.
- The interface did not communicate that instructor release was required, and the participant became stuck.

The progression rule itself was working as designed: rounds are released by the instructor after every team in the game submits. The original interface finding was that the student received no explanation of that rule and future rounds did not visibly read as locked.

The implemented response retained instructor-controlled progression and added the submission waiting message, visible locked future rounds, a submitted-state label, and a release control labelled for the next round. No student bypass or competing progression model was introduced.

## Second participant observations

### Entry and discovery

- The participant entered using the Game ID and team code.
- The participant read the opening material.
- The participant discovered Evidence, Documents, Advisors, and People without being explicitly instructed what each was for.
- The participant waited for instructor release between rounds, and instructor-controlled progression worked.

### Documents

- Documents generally appeared as readable student-facing documents rather than raw JSON.
- Round 3 Analysis initially failed to open during the participant session. The visible message was: `This document could not be opened. Please try again.`
- Other documents remained usable during the failure.

### Advisors and validation

- The participant asked advisors questions.
- Advisor responses progressed across turns rather than unnecessarily repeating the same follow-up question.
- Invalid decision inputs produced understandable red student-facing messages rather than raw JSON or schema errors.
- The participant corrected the invalid input and submitted successfully.

### R9, R10, and debrief

- The participant completed the Round 9 Benefit Review.
- The participant completed the Round 10 decision.
- The instructor completed the game.
- The participant then saw the final outcome and all three debrief panels: Decision Log, What Moved, and What You Never Saw.

## Round 3 Analysis investigation

The initial failure remained a factual participant observation. Investigation established that the participant browser was using the current Vite frontend on port 5173 but its API requests were reaching an old backend process on port 3001. The stale backend was PID 19260 and had started before the Round 3 Analysis source correction.

The persisted artifact was present and contained student-facing Bottleneck Map and Metric Set data. The failure was not caused by missing artifact data.

## Runtime correction

- The stale backend process was terminated.
- The current backend was started from the current workspace.
- No participant data was reset.
- No simulation mechanic was changed as part of the runtime correction.

## Follow-up verification

- With the correct backend running, the participant opened Round 3 Analysis successfully in Round 4.
- The same Round 3 Analysis opened successfully in Rounds 5, 6, 7, 8, 9, and 10.
- Once opened, it remained available through later rounds.
- It rendered readable Bottleneck Map and Metric Set content.
- No raw JSON was shown.

## Final assessment

The second cold run reached game completion. The original Round 3 Analysis failure is preserved in this report as an observed runtime incident, and the subsequent investigation, runtime correction, and successful follow-up verification are recorded separately. The issue was resolved after the stale backend process was replaced with the current backend.
