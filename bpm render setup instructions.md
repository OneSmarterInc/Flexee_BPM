# Setting Up the Test Database and Render
## How to get what the verification pass needs

You can arrange both yourself. This note covers how, and a few rules that matter because this system will hold student work.

Render's screens and plan names change from time to time, so follow their current documentation for the exact steps. What follows is what to set up and why, not a click-by-click guide.

---

## 1. The test database

The 26 PostgreSQL tests need a disposable database they are free to create, fill and wipe. It must never be the production database, since integration tests may drop or rewrite tables.

The simplest option is a local PostgreSQL running in Docker on your own machine. It costs nothing, involves no shared credentials, and can be deleted and recreated whenever you like. Use a PostgreSQL version that matches or is close to the one Render will run, so the tests reflect production.

Set its connection address as `TEST_DATABASE_URL` in your local environment only, then run the full suite. All 26 should run rather than skip. Report the output and the PostgreSQL version.

---

## 2. The Render account

Use the One Smarter organisation's Render account, not a personal one. The service and its database need to belong to the organisation, so access survives if anyone's role changes.

If you do not already have access to that account, ask for it through whoever administers One Smarter's hosting. You need permission to create services and view their settings, not billing ownership.

---

## 3. Before creating anything that costs money

Two resources are needed on Render: a PostgreSQL database and a web service for the application.

For a ten-week course the web service must stay running rather than sleeping when idle, and the database needs automated backups. On Render that generally means paid plans rather than free ones. Choose the smallest plans that meet those two requirements, note the monthly cost of each, and send me the total before creating them. I will confirm.

Pick a region in the United States.

---

## 4. Setting it up

Create the PostgreSQL database first, then the web service connected to the repository.

Configure the application through Render's environment variable settings, never through files in the repository. At minimum that means the database connection address, the instructor passphrase, and the production environment setting, plus whatever the existing `RENDER_PRODUCTION_PREPARATION.md` and `POSTGRES_SSL_CONFIGURATION.md` specify.

The instructor passphrase should be long and generated rather than chosen. Send it to me through a password manager share, not in chat or email.

Turn on automated backups for the database and note how long they are kept.

---

## 5. Then run the verification pass

Once both are in place, run the PostgreSQL and Render verification exactly as written in `bpm_postgres_render_verification.md`: the 26 tests against the test database, the migrations and a production startup on Render, the full instructor rehearsal against the deployed site, and the configuration report.

---

## 6. Rules for this system

The production database will contain what students type, including stakeholder conversations. Treat it that way from the first day.

Keep the list of people with access to the Render account and production database as short as possible. Do not copy production data to a local machine. Do not paste connection addresses or the passphrase into chat, email, commits, reports, or screenshots. If any credential is exposed by accident, tell me and rotate it straight away.

---

## 7. What to send back

The test output from section 1, the proposed plans and monthly cost from section 3 for approval, and then, after setup, the verification report.
