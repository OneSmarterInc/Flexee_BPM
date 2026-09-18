# Deferred Items — Decisions

Phase 6 closeout accepted. 362 tests.

The completed game now ends correctly: outcome, three panels, closing beat, nothing below. Server-side rejection before any other check, verified with a real 400 response rather than inferred from the interface. That closes the gap between hiding the form and refusing the submission.

Finding the closing beat unwired was the better catch. It sat in the Week 10 content file and was never rendered, so every run to date — both cold runs included — ended on a score instead of the east tower desk opening on a Monday morning without them. That was the last line of the design and nobody had seen it. Rendering it verbatim, with nothing following it, is exactly right.

Four items were deferred for decision. Here they are.

---

## 1. Canonical access history — fix this one

Version and page access history may be lost during round closure. This affects panel three.

This is the one that matters and it should be fixed before the pilot.

Panel three is the inventory of doors a team never opened, and we spent a full pass tightening its predicates so each item resolves on a specific access event rather than a proxy. If a team's record of having opened version 3 of the board deck, or reached page nine of the readiness assessment, does not survive round close, panel three will list things they genuinely found.

That is the failure I named as the serious one back in the small pass, and it would arrive from the other direction. The predicates would be correct and the evidence they read would be gone.

Access history must be durable for the life of the game. Once a team has opened something, that fact persists through round closure, game completion, and reload, and panel three at Round 10 reads the same record that existed when the document was opened.

Please confirm the scope while fixing it: whether this affects only version and page history, or any other evidence panel three reads.

---

## 2. Round 10 metric monitoring JSON — defer

Readability, not leakage, and it appears once in one round.

Worth doing if there is time before the pilot. Not worth doing instead of item 1.

---

## 3. Expanded decision log JSON — defer

Same judgment, with one caveat. The decision log is panel one of the debrief, and panel one exists so a student can read what they actually chose and pair it against panel two. JSON makes that harder than it should be.

Not urgent enough to precede item 1, but it is the more valuable of the two readability fixes, because it sits inside the debrief rather than inside a round.

---

## 4. Locally editable fields on a completed game — defer

Cosmetic now that the server refuses the submission. A student can type into a field and nothing will happen. Leave it.

---

## Order of work

Item 1 before the pilot. Items 2 and 3 if time allows, 3 before 2. Item 4 not at all.

After item 1, development is done and the remaining work is pilot logistics.
