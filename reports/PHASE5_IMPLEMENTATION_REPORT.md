# Phase 5 Implementation Report

## Status

Phase 5 implementation is complete for Sir's five requested areas. The cold run is prepared but has not been performed.

## Advisor consultation

- All six advisors remain visible together in the fixed order: Marchetti, Oyelaran, Castellanos, Brennan, Kowalczyk, Okonkwo.
- There is no stance-based sorting, grouping, consensus count, or aggregation.
- Students select an advisor and enter a free-form question.
- Questions and deterministic, scoring-grounded replies persist in the existing team transcript collection with their round and timestamp.
- Earlier-round consultations remain visible throughout the game and after persistence reload.
- The question supplies conversational context only. It does not change advisor scores, stance, focus, calibration, or simulation state.
- The existing local deterministic renderer remains the fallback; no external model, API key, or cloud dependency was added.

## Team selection

- Student entry requires a game ID and team-specific eight-character code.
- A successful join creates an opaque server-held session bound to exactly one game and one team.
- Every student read, submission, evidence-access, and conversation route enforces that binding server-side.
- The browser retains the selected session across refresh. It no longer chooses the newest game or first team.
- The public game listing omits team identities. Instructor controls are absent from the student workspace and use a separate instructor entry surface.
- New games retain legacy team IDs when available and receive collision-free persisted team IDs when earlier games already use them.

## People discoverability

- Resource navigation always shows the neutral signal `People · n available`.
- It reports existence only. It does not recommend a person, reveal importance or trust, expose gates or hidden knowledge, or suggest a question.

## Instructor view

- Teams appear in deterministic team-name ascending order, with no ranking, leaderboard, benefit sort, or outcome sort.
- The instructor selects a team, then a stakeholder, then reads the complete chronological transcript.
- Original student questions and stakeholder replies are shown verbatim with round and timestamp.

## Cold run

`NOT EXECUTED — SIR WILL SUPPLY THE PARTICIPANT`

The environment contains an active Round 1 game and unused team. `npm.cmd run seed` prepares or reuses a qualifying game and prints the game ID, team name, and team code. The production application opens at team entry and proceeds directly to Round 1 after valid entry. The protocol remains Round 2 or 40 minutes, whichever comes first; no gameplay cutoff was introduced.

## Changed implementation files

| File | Reason | Phase 5 requirement addressed |
|---|---|---|
| `src/application/access.ts` | Team-code derivation and server-side session binding | Safe team entry and ownership |
| `src/application/service.ts` | Avoid persisted team-ID collisions across games | Classroom-safe team creation |
| `src/application/projections.ts` | Preserve transcript rounds; neutral team-name ordering | Advisor history and instructor ordering |
| `src/server/index.ts` | Join endpoint and authorization on all student team routes | Server-enforced ownership |
| `src/web/api.ts` | Carry the opaque student session on team requests | Stable team session |
| `src/web/App.tsx` | Replace automatic selection with student/instructor entry flows | Game/team selection and separation |
| `src/web/components/Shell.tsx` | Remove student-visible role switching | Instructor/admin separation |
| `src/web/components/StudentDashboard.tsx` | Free-form advisor consultation, durable history, neutral People signal | Advisor and People requirements |
| `src/web/components/InstructorDashboard.tsx` | Team selector and stakeholder transcript reader | Instructor additions |
| `src/web/phase5.css` | Minimal styling for entry and instructor additions | Phase 5 interaction surfaces |
| `scripts/seed.ts` | Prepare or reuse an unused active Round 1 team and print entry details | Cold-run preparation |
| `test/phase5.test.ts` | Focused regression coverage | Required Phase 5 tests |

## Preserved mechanics

No changes were made to discovery, R2/R3/R4 recovery, Ntende, stakeholder trust or disclosure mechanics, benefits, crises, budgets, outcome logic, scenario content, advisor scoring/calibration, Phase 3 economics, Panel 2, Panel 3, or other approved Phase 4 mechanics. Artifact persistence remains team-scoped. No content was fabricated.

## Cold-run progression follow-up

The instructor dashboard already had a per-game `Close round` control backed by the authoritative `closeRound` transition. That existing mechanism releases the next round for every team after every team has submitted. It was retained and relabelled `Release Round n`; no duplicate progression system was added. Student navigation now labels unreleased future rounds `Locked`, labels the submitted current round `Submitted`, and explains that the next round opens when the instructor releases it.
