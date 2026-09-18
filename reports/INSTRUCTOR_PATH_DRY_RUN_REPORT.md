# Instructor-path dry run

This was a disposable instructor-path rehearsal and not a participant cold run.

## Purpose and isolation

Rehearsed the existing instructor operating sequence on 2026-09-16, without new development or another scoring validation. Disposable game ID: `5e9e0c4d-6440-4cfa-accb-b4901fc9f6c4`. A separate temporary `rehearsal.sqlite` and local server on port 3128 were used; no existing class, pilot or cold-run database was opened by that server. No real participant accounts were created.

## Results

| Step | Observed result |
|---|---|
| Seed | `npm.cmd run seed -- --teams 12` created one fresh game and twelve teams. The Game ID, twelve unique codes and Team 01–Team 12 ownership were captured internally for the rehearsal. No credentials are included here. |
| Instructor sign-in | Actual instructor browser sign-in succeeded; selecting the disposable game showed all twelve teams and R1. |
| Outstanding team | Eleven synthetic R1 decisions were submitted through the student API; Team 12 intentionally remained outstanding. The UI disabled ordinary Release Round 2. |
| Explicit override | The separate override named Team 12 before confirmation. Confirmation advanced the game to R2. |
| Non-submission | Team 12's R1 record had `kind: non_submission`, not an invented student decision. Only existing genuine R1 passive resolution values were retained internally. The eleven accepted submission records matched their pre-override snapshots exactly. |
| Open-round correction | In R2, the instructor UI changed Team 01's submitted `discovery_scope` from `full_front_end` to `denials_through_auth`; the other allocation values were unchanged. Save succeeded and the team/history showed Corrected. |
| Audit | The persisted/API instructor record retained the old and new field values, instructor actor, round and timestamp (`2026-09-16T11:45:13.161Z`). The corrected value was stored in the submission. |
| Student secrecy | A fresh authenticated Team 01 student projection did not contain the checked correction metadata (`corrections`, `instructor_correction`, `oldValue`, `newValue`) or diagnostic markers (`ruleTrace`, `weightedScore`, `rationaleTags`). No student-facing audit was added. This is a targeted observation, not a replacement for the accepted security tests. |
| Normal completion | Subsequent ordinary disposable submissions were staged through the student API. All instructor releases were performed through the browser UI, ordinarily from R2 onward. R10 Complete game succeeded; the screen showed status completed, twelve teams marked R10 complete and a disabled Complete game control. |
| Browser observation | The completed instructor screen was visually inspected. No captured browser warning/error entries were reported. |

This exercised one outstanding-team override and one correction. It did not repeat the accepted all-round twelve-team override/scoring/replay regression. Synthetic submissions were operational fixtures, not participant observations or new authoritative content.

## Operational friction

The instructor view needed a refresh and game reselection to pick up submissions made in separate student sessions; no automatic refresh was assumed. After reload, the game selector must finish loading before selection. Correction uses the existing JSON editor, requiring valid field names/values. Backend environment variables must be set in the server process, and seed/server must point at the same database. None of these observations triggered an implementation change; deferred readability and completed-game editable-field behavior remain untouched.

## Cleanup and preservation

The rehearsal server was stopped and its browser tab closed. Its exact temporary directory and database were removed after resolving/checking the target; the directory no longer exists and port 3128 has no listener. No disposable records remain in that fixture. They were never stored in an existing database.

All 30 pre-existing SQLite databases matched their pre-rehearsal SHA-256 hashes. The complete protected workspace snapshot also matched before documentation edits. No existing participant/cold-run data was deleted or changed. Credentials and team-code values are not retained in this report.

Closeout is documentation and pilot preparation only. See the [checklist](PRE_CLASS_INSTRUCTOR_CHECKLIST.md), [release schedule](TEN_WEEK_INSTRUCTOR_RELEASE_SCHEDULE.md), and [accepted implementation report](PHASE7_IMPLEMENTATION_REPORT.md).

## Post-rehearsal verification

All required commands passed on 2026-09-16: `npm.cmd test` (468/468, 17 files), `npm.cmd test -- --run test/golden.test.ts` (9/9), `npm.cmd run typecheck`, `npm.cmd run lint` (zero warnings), and `npm.cmd run build`. No tests or timeouts were changed. The test runtime emitted Node's existing experimental SQLite warning; this was not a lint warning or test failure. Build regenerated only the normal ignored build output.
