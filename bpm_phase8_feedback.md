# Phase 8 Feedback
## One authorized mechanics fix, one blocked verification, one missing deliverable

The UI tidy is accepted. 529 tests. Five stylesheets are one, the decision log and Round 10 metrics read as content rather than JSON, packaging exclusions are in place, and the protected-requirements checklist is the most careful verification in the project.

Stopping on the Round 8 dashboard was exactly right. It crosses the mechanics boundary and needed authorization. You have it.

---

## 1. Round 8 readiness dashboard — authorized fix

The four readiness indicators are computed inside the Round 8 submission branch of the engine, so they exist only after a team submits its go/no-go decision. The projection shows them only while the active round is 8. The result is that a student deciding whether to go live sees an empty dashboard. Every student to date, including both cold-run participants, made the Round 8 decision without it.

The dashboard is the basis for that decision. The Week 8 content has the indicators arriving on Sunday afternoon before cutover, and the go decision is read against them. It is a pre-decision instrument.

The fix is a timing correction.

Compute the indicators when Round 8 opens, from state as of Round 7 close. That includes the risk register evaluated through the Round 7 submission, which supplies the fourth indicator. Store them so the Round 8 projection reads them before any submission.

The displayed dashboard must not reflect Round 8 levers. Cutover controls are decided in Round 8 and a dashboard that already accounts for them would be showing the team the consequence of a choice they have not made.

Leave Round 8 close unchanged. Risk calculation and crisis selection at the end of Round 8 continue exactly as now, including the effect of cutover controls. Only when the indicators are computed and shown changes, not what the crisis engine does.

The renderer is already correct and component-tested. Once real indicators are supplied, the existing protections apply: four separate indicators, no composite, the fourth showing label and consequence range and never a cause.

Replay must still reproduce persisted results. Golden fixtures may need regenerated expectations for the indicator snapshot only; if anything else in a golden result changes, stop and report it, because nothing else should.

Please add a test that fails on the current code: at Round 8 open, before submission, the student projection contains four indicators.

---

## 2. PostgreSQL and Render verification — blocked on credentials

The verification pass has not run because no disposable test database URL or Render access has been supplied. That is on our side, not yours, and I am arranging it.

When credentials arrive, run the verification pass as written: the 26 PostgreSQL integration tests against a live test database, a production startup on Render, the instructor dry run against the deployed instance, and the configuration report on service spin-down, backups, database expiry and environment variables.

Run it after the Round 8 fix, so the deployed instance is the one students will actually use.

---

## 3. Screenshots

Phase 8 asked for before-and-after screenshots of each student screen and the instructor view at laptop width. They were taken but kept outside the repository, which was correct for packaging, so they did not reach me.

Send them separately, not in the repository. After the Round 8 fix, include a screenshot of the Round 8 dashboard with four indicators showing before submission.

---

## 4. Noted, not changed

The Render SSL configuration keeps TLS on with certificate verification bypassed, documented honestly as a compatibility requirement. Acceptable for the pilot. Worth revisiting before the 2027 faculty release.

---

## 5. What closes this

The Round 8 fix with its failing-then-passing test and golden results otherwise unchanged. The screenshots. The PostgreSQL and Render verification once credentials are supplied.
