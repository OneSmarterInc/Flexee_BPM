# Pre-class instructor checklist

From the repository root; setup details: [README](../README.md).

- [ ] Set `FLEXEE_INSTRUCTOR_PASSPHRASE` in the backend environment; use the same `DATABASE_PATH` in server/seed terminals. Copying `.env.example` does not load it.
- [ ] Start the server: `npm.cmd run dev` (prepared production assets: `npm.cmd run build`).
- [ ] Confirm the server address is reachable from classroom devices; their `localhost` is not the instructor's server. Use HTTPS for network deployment.
- [ ] Seed the game: `npm.cmd run seed -- --teams 12` (creates a fresh game; do this for a new section, not each week's return).
- [ ] Confirm and securely retain the printed Game ID.
- [ ] Confirm 12 unique printed team codes and their Team 01–Team 12 ownership.
- [ ] Distribute each code privately to its correct team, with the Game ID and reachable address.
- [ ] Sign in at the server's `/?view=instructor` (local: `http://localhost:3001/?view=instructor`); select the game.
- [ ] Confirm all 12 teams are visible.
- [ ] Confirm the intended current round is ready; a fresh game starts at R1. Returning next week: use the existing game and [release schedule](TEN_WEEK_INSTRUCTOR_RELEASE_SCHEDULE.md).

## If something goes wrong

Do not modify existing participant data. Start over with a fresh game. A missing submission blocks ordinary release; the explicit outstanding-team override is available. Only the instructor can correct a submission, and only while its round is open. See the [operating note](INSTRUCTOR_PILOT_OPERATING_NOTE.md).
