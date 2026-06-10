# 01 — Build Roadmap (Crawl → Walk → Run)

The goal of the MVP is **one complete, polished field trip** — not four
half-finished ones. Depth beats breadth for proving the concept and for a store
submission.

## Phase 0 — Foundations (you, learning)
- [ ] Complete [`00-getting-started.md`](00-getting-started.md): project runs in a simulator.
- [ ] Finish Unity's "Create with VR" pathway.
- [ ] Comfortable reading/editing a C# `MonoBehaviour`.

**Done when:** you can add a cube to a scene, attach a script, and make it react
to a controller button press in the simulator.

## Phase 1 — Crawl: an empty institution
- [ ] Block out a **bank lobby** using simple primitives or free/low-cost
      Asset Store models (don't model your own art yet).
- [ ] Player can look around and **teleport/move** with the controllers.
- [ ] Add ambient audio + a friendly NPC or kiosk that "greets" the student.

**Done when:** you can walk into the bank and look around in VR. No math yet.

## Phase 2 — Walk: one interaction
- [ ] An interactable object — e.g., an **ATM/teller kiosk** with buttons.
- [ ] Pressing a button shows a UI panel in world space.
- [ ] Grab-and-place mechanic — e.g., pick up **bills/coins** and drop them in a
      tray.

**Done when:** the student can physically interact with money objects and UI.

## Phase 3 — Run: the MVP scenario (vertical slice)
Build the **"Make the Deposit & Get Correct Change"** scenario end to end (full
spec in [`02-curriculum-design.md`](02-curriculum-design.md)):
- [ ] Narrated setup ("You earned $50. You owe the bank $12.75…").
- [ ] Student manipulates money / answers a math step.
- [ ] **Validation**: right answer → progress + positive feedback; wrong answer →
      a gentle hint, not a fail screen.
- [ ] A short **debrief** that names the math concept they just used.
- [ ] Basic **session logging** (which problems, attempts, time) for teachers.

**Done when:** a 5th–8th grader can complete the whole field trip unassisted and
you can see how they did.

## Phase 4 — Polish & pilot
- [ ] Comfort options (vignette on movement, seated mode) — important for kids.
- [ ] Accessibility pass (text size, audio for non-readers, dominant hand).
- [ ] Test on a **real Quest** with 3–5 students; watch where they get stuck.
- [ ] Iterate on the scenario based on what you observe.

## Phase 5 — Toward commercial release
- [ ] Build out 2–3 more scenarios/institutions reusing the Phase 3 framework.
- [ ] Teacher dashboard / content packaging.
- [ ] Meta Horizon Store submission (developer org, store listing, review).
- [ ] Privacy/COPPA review — you're handling **data about minors**; budget real
      time for this with someone who knows education privacy law.

## Guiding principles
- **One scene, one concept.** Each scenario teaches a single clear math idea.
- **Never punish wrong answers.** Hints and retries, not game-over.
- **Reuse the framework.** The Phase 3 scenario system (see
  [`03-architecture.md`](03-architecture.md)) is what every later field trip plugs into.
