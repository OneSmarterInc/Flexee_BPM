# Instructor pilot operating note

For the instructor, not students. Current implementation, not proposed controls.

## Prepare one game / twelve teams

From the repository root, install with `npm.cmd ci`. Provision a clean PostgreSQL pilot database and set its `DATABASE_URL` privately in **both** seed and server terminals; follow [SQL setup](../SQL/README.md), then run `npm.cmd run migrate`. Historical SQLite/cold-run files remain untouched and are not imported. Run `npm.cmd run seed -- --teams 12`: it creates one fresh game and prints its Game ID and twelve `Team 01 — <code>` lines. Copy each team its own code and the common Game ID; retain your distribution list privately. Repeating this command creates another game, not a reset or an overwrite. Do not use the legacy no-argument seed, which may reuse an untouched game in the configured PostgreSQL database.

## Instructor authentication

Before starting the backend, supply a strong, private deployment passphrase through the server process environment variable `FLEXEE_INSTRUCTOR_PASSPHRASE`. There is no default secret; missing or blank configuration denies instructor sign-in. Do not put the actual passphrase into source, documentation, a Vite-prefixed environment variable, URLs, or student communications. Copying `.env.example` alone does not load environment variables.

Run `npm.cmd run build`, then `npm.cmd run dev`; open `http://localhost:3001/`. Students enter the Game ID and their team code. Remote students need the host's reachable address, not their own localhost. Confirm institutional network access before class and use HTTPS for network deployment: the shared passphrase and bearer sessions require transport protection.

Open `http://localhost:3001/?view=instructor`, sign in with the deployment passphrase, select the Game ID, and click **Open instructor view**. Authentication is checked server-side on every instructor API, including game listing/creation, diagnostics, correction, and release. Unauthorized requests receive the same 404 body as nonexistent API resources. The browser retains only an opaque instructor session token, not the passphrase; student sessions are separate. There are no accounts, roles, registration, or password-reset features.

## Release and completion

The dashboard lists all teams with current-round Submitted/Outstanding status and correction indicators. Use **Refresh teams** to fetch new submissions without losing the selected game or reselecting it. There is no automatic polling. Once every team submits, **Release Round N** becomes enabled; release is manual. At R10 it reads **Complete game**. Students refresh to load the released round or completed debrief.

When any team is outstanding, normal release remains disabled and the normal backend close still rejects it. The separate **Release with outstanding teams** control names the outstanding teams and requires explicit confirmation. It never runs automatically. If the outstanding set changed, review and confirm the new list.

Override records a distinct **NON-SUBMISSION** (an absence, not a passive participant submission), uses genuinely existing passive lever values where available, resolves absent levers as specified below, and closes the round. It does not rewrite already-submitted payloads or previous rounds. Instructor submission history and student decision/debrief history identify NON-SUBMISSION; students do not receive instructor correction audits. The history shows the round and NON-SUBMISSION label without a JSON list of choices the team did not make. Existing passive values are internal resolution data, not participant-authored work.

Supported cases: R1 continue Clearpath/no savings commitment/no new memo action; R5 refine/empty design room/unassigned ownership; R6 depth A/retain internal/no authorization automation/blank parameters; R7 single-site pilot/empty coalition/zero training with remaining funds reserved, not spent; R8 defer/empty controls; R9 with actual crises let run/no disclosure/no rollback; R10 empty sustainment/vendor actions, inherited metrics, zero claimed benefit and empty disclosures. These follow existing rules, including their ordinary adverse or favorable effects; no new penalty or free discovery action is added.

**Authoritative absence behavior — bpm nonsubmission decision.md:** All ten rounds can now resolve explicit non-submissions. R2 allocation is absent, not a zero-summed participant payload, and contributes zero discovery. R3 has no claim, bottleneck map, metric set or analytical artifact; all claim components score zero and no analytical recovery is granted. Its existing passive baseline choice remains defer. R4 has no components, weights or framing; these score zero, with no framing stakeholder effect and no analytical recovery. No-crisis R9 has no presented figure or basis; disclosure/basis score zero and type is not applicable. The existing zero-score board/financial adjustments apply without a fabricated type or figure-shortfall effect. No R9 figure means no R9-to-R10 comparison or consistency penalty: absence is never treated as zero. A team with no R3 metric set arrives at R10 with no inherited metric data. Existing crisis-specific R9 passive behavior stays unchanged.

Ordinary participant schemas are unchanged: R2 still totals exactly 100, R3/R4 still require analytical work, and ordinary no-crisis R9 still requires nonempty basis text. Students cannot create absence records. Authenticated override confirmation remains mandatory, records are persisted through completion/debrief, and closed rounds remain final.

## Correct an accepted open-round submission

Select a team. Its accepted current-round submission appears under **Correct [team]'s open-round submission**. The normal round decision controls are prefilled with the submitted values. Edit the controls and choose **Save instructor correction**. The same server validation and messages as student submission apply; invalid data is rejected and shown in the form. This is correction of an existing accepted submission, not submitting on a missing team's behalf.

The correction preserves the original submission identity, submitter and submitted timestamp, and separately records game, team, round, each changed lever's old/new value, correction timestamp, and instructor action. Nested lever values are retained in full. The instructor sees the audit and Corrected indicator; the student simply sees the corrected submission. No historical result is recalculated.

Teams still cannot resubmit themselves. Only the current open round can be corrected; another round, a closed round, a non-submission, or a completed game cannot be edited. Closed rounds remain final.

## Errors and starting over

Before submission, teams can edit inputs. After acceptance, use the instructor correction above while the round is still open. There is no reset/delete/rollback endpoint. If a clean restart is necessary, create a **new game** with `npm.cmd run seed -- --teams 12` and distribute the new Game ID/codes. This starts everyone in that new game at R1; it does not transfer decisions or transcripts. Old games remain intact. Do not edit SQLite manually or delete participant data.

## Refresh, restart, and review

Browser refresh reloads saved state; unsubmitted local form edits are not durable drafts. After connection loss, reload and check whether the decision is marked submitted before trying again. Restart with the same DATABASE_URL and configured instructor passphrase. PostgreSQL retains saved decisions, correction audits, non-submission markers, access history, transcripts, and outcomes. Student and instructor sessions are in memory and expire on server restart. Students re-enter the same Game ID/team code; instructors use **Sign in again**. A full browser reload returns to authenticated game selection during the same server session; **Refresh teams** stays in the selected game.

Select a team to inspect **Submission history**, **Current state**, **Latest result**, and **Stakeholder transcripts**; select a stakeholder for chronological questions/replies. The authenticated instructor API also contains results and debrief diagnostics. Do not distribute diagnostic output to students. The shared deployment credential identifies the action as instructor, not a named individual.

During the pilot, do not change configuration, outcomes, Panel 3, source content, access history, or deferred JSON displays. Do not fabricate placeholder content, manually patch submissions, seed into the cold-run game, delete databases, or perform another cold run. Observe the existing Panel 3 question during the actual pilot only.
