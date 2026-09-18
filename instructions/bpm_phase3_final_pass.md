# Phase 3 Final Pass
## One correction: the Win with Scars gate

The revision pass is otherwise accepted. Four items were asked for and all four are correctly fixed.

Marchetti now renders distinct lines that track her focus lever across the arc — the seventy-six percent utilisation line in R3, the consolidation question in R5, the scope-instability observation in R6 — which is her voice brief working rather than two sentences alternating. Discovery depth is monotonic at 0, 64.7, then the capped recovery to 74.7, exactly as specified. The Ntende contradiction is gone, and her trust running 30 to 35 on the disciplined path is a better outcome than the bug was: a team can be analytically strong and still never earn her, which is true and worth teaching. Triumph is demonstrably reachable on Path D and its gate reads the full section 9 definition.

One item remains.

---

## The problem

The Win with Scars gate currently reads:

```
if (defensible >= 5000000 && crises.length <= 1) return 'win_with_scars'
```

Benefit and crisis count only. The design defines the tier as one crisis absorbed with visible damage, two of four sustainment items funded, and at least two stakeholder relationships materially damaged.

Path A fires no crisis at all, ends with an intact if distant stakeholder set, and lands in Win with Scars at $5.57M defensible. That team has no scars. It ran clean and delivered thin, which is Squeak Through — the process transformed on paper, the board accepts the report, no phase two commissioned.

This matters more than a threshold usually would because the tier name is the last thing a student reads and they read it as a description of what happened to them. Telling a team they were scarred when nothing went wrong is a false account of their own game, and it undercuts the debrief, where they are being asked to reconstruct cause from their own record.

---

## The correction

Win with Scars requires damage, not just a modest number.

```
scarred = crises.length === 1
       || damagedRelationships >= 2
       || sustainment.length <= 2

if (defensible >= 5000000 && crises.length <= 1 && scarred)
   return 'win_with_scars'
```

A run with no crisis, no materially damaged relationships, and three or more sustainment items funded is not scarred. If its defensible benefit is below the Triumph threshold it falls through to Squeak Through, which is the correct account of a clean, thin result.

Note that `damagedRelationships` is already computed and passed into `determineOutcome` — it is currently accepted and unused. The signature does not need to change.

Keep the descending ladder and keep the absence of an upper bound on Win with Scars. A team that takes a real crisis, absorbs it, and still delivers $11M belongs in that tier, and Path C is correct as it stands.

---

## Expected result

Path A moves from Win with Scars to Squeak Through. Paths B, C and D are unaffected. Please confirm that in the regenerated coverage report, and add a test asserting that a zero-crisis, undamaged, well-sustained run above $5M does not resolve to Win with Scars.

---

## After this

Phase 3 closes. The three deferred content gaps stay as they are — I will supply the forty-five filenames, and the readiness notes and unrendered vendor slides remain placeholders by design. Next instructions will cover the debrief and the interface layer, and the debrief has constraints that are easy to violate by accident, so please do not build ahead of them.
