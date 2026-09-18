# Final Cleanup
## Four items, one of which you will feel in the classroom

The dry run is accepted and it did the job a rehearsal is supposed to do — it surfaced operational friction rather than confirming that working things work. Hash-verifying all thirty existing databases before and after, and keeping the rehearsal on a separate port and database, was the right discipline.

Four items remain. The first is the only one that matters for teaching.

---

## 1. The correction editor

Correction currently uses a raw JSON editor requiring valid field names and values. That is the deferred readability item arriving in the one place it will actually be felt: an instructor correcting a team's submission, in an open round, with a class waiting.

This needs to be a form. The open round's levers, rendered as their normal controls, pre-filled with what the team submitted, editable, with the same validation and messages a student would see. Save writes the correction and records the audit exactly as it does now.

Nothing about the correction mechanism changes. Only the surface.

This is now ahead of both previously deferred readability items in priority, because it is the one an instructor uses under time pressure rather than one a student reads at leisure.

---

## 2. Instructor view refresh

The instructor view does not pick up submissions made in student sessions without a manual reload and game reselection. During a release window I will be watching for eleven or twelve teams to submit, and reloading repeatedly to find out.

A refresh control on the team list is sufficient — a button that re-fetches without losing the selected game. Polling would be better and is not required.

The related friction, that the game selector must finish loading before selection after a reload, should resolve on its own once a reselection is no longer needed every time.

---

## 3. Outstanding from the last closeout

Three items were asked for and have not been done.

The phase 7 implementation report still contains seven BLOCKED or PARTIALLY IMPLEMENTED mentions describing a state that no longer exists. Rewrite the top of the file to the current state and move the superseded material into a dated section at the end, or remove it.

`index.html` is still in the root with no README note. Determine whether vite resolves it by convention as the entry point. If yes, say so in the README so nobody removes it later. If no, remove it.

Two dead components remain in `src/web/components`: `StudentDashboard.tsx` and `DecisionWorkspace.tsx`, both superseded by their V6 versions and no longer imported by anything. Remove them. While there, the five stylesheets named by phase should be consolidated or at least renamed for what they style, since `phase4.css` tells a future reader nothing.

---

## 4. Not needed before the pilot

The Round 10 metric monitoring panel and the expanded decision log JSON stay deferred. Both are read rather than operated, and neither is touched under time pressure.

The editable-field behaviour on a completed game needs nothing.

---

## 5. What closes this

Items 1, 2 and 3. Then the build is done for the pilot and nothing further is needed unless the classroom turns something up.

Separately, I am deciding the scope of a full interface build and will send that as its own piece of work. Do not start any of it in this pass.
