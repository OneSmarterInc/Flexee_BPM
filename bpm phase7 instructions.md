# Phase 7
## Three changes before the pilot

Cleanup accepted. 391 tests, documents reorganised, precedence rule in the README, section seeding working, and the operating note is the most useful document in the repository.

Three things in that note need changing. All three are classroom realities rather than design questions, and all three would otherwise be discovered in week one with twelve teams watching.

---

## 1. Instructor authentication

Instructor routes and the instructor API currently have no authentication. The operating note is right that the instructor URL is not a security boundary, but the mitigation cannot be that I remember to run in a controlled environment for ten weeks.

The instructor view exposes every team's state, submissions, transcripts, and debrief diagnostics. A student who finds the URL can read what every other team is doing.

What is needed is the smallest thing that actually works. A passphrase set per deployment through an environment variable, exchanged for a session, required on every instructor route and every instructor API endpoint including the diagnostics. Not a user system, not roles, not password reset.

Two properties matter. The check happens server-side on the API, not only in the interface, since the API is the thing worth protecting. And an unauthenticated request to an instructor endpoint returns the same response as a nonexistent one, so the instructor surface is not discoverable by probing.

---

## 2. Submissions must be correctable

Submissions are currently immutable once accepted, with no resubmission, no instructor edit, and no correction endpoint. The only remedy for an obvious error is starting a new game for everyone.

That is not workable across ten rounds and twelve teams. Someone will enter a figure with a misplaced decimal, or submit the wrong option, and the answer cannot be that everybody starts over.

What is needed is instructor-side correction while the round is open. Before the round closes, I can open a team's submission, change a lever value, and save it. The correction is recorded — what changed, from what to what, when, and that it was an instructor action rather than the team's.

Keep the line at round close. Once a round is closed and results are computed, the submission is final. That keeps replay honest and keeps the decision log meaningful, and it covers the real case, which is a team saying immediately that they submitted the wrong thing.

Teams still cannot resubmit on their own. Correction is mine.

The recorded correction should be visible in the instructor view and absent from the student view. A student should see their corrected submission as their submission.

---

## 3. A missing team must not block the round

Release is currently disabled until every team submits, with no force-release and no submit-on-behalf. Nothing breaks — the game waits — but eleven teams wait on one, and with ten rounds that will happen repeatedly.

Release must be possible with teams outstanding. Two requirements on how.

The default stays as it is. When all teams have submitted, release is enabled normally. When teams are outstanding, release is not enabled by default — it requires an explicit override, with the outstanding teams named, so I cannot release past a missing team by clicking the same button I always click.

A non-submitting team's round is recorded as a non-submission and resolves to the most passive value available for each open lever. Continue rather than change, defer rather than commit, empty sets, no allocation. A team that does not act has acted, and the consequences should follow normally through state and exposure.

The non-submission is marked as such in the decision log and in the instructor view, so the difference between choosing to defer and failing to submit is visible to me and in the debrief evidence.

One caution worth your judgement while implementing. A non-submission in Round 2 means no discovery allocation, which is close to unrecoverable for that team. I am accepting that consequence rather than softening it, but please confirm the passive-default path does not produce an invalid state or a crash anywhere, particularly where a lever is marked required.

---

## 4. What closes this phase

The three changes, and an updated operating note reflecting them. The note should say plainly what a correction can and cannot do, and what happens to a team that misses a round.
