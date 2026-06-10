# 03 — Architecture (How the code will be organized)

You don't need this on day one, but having a target shape keeps the project from
turning into spaghetti as it grows. The key idea: **build a reusable *scenario
framework*, then author each field trip as data/content that plugs into it.** This
is what lets one MVP scenario become a product with many field trips.

## High-level pieces

```
Scene (e.g. BankLobby)
 ├─ XR Rig (Meta camera rig, controllers, hands)        ← from Meta XR SDK
 ├─ Environment (bank models, lighting, audio)          ← art/assets
 └─ ScenarioManager                                     ← your code
      ├─ runs an ordered list of ScenarioSteps
      ├─ shows narration / prompts
      ├─ checks answers via a Validator
      └─ logs results via a SessionLogger
```

## Core scripts (start here)

- **`ScenarioManager`** — drives a field trip: holds the ordered list of steps,
  advances when a step is completed, fires the debrief at the end.
- **`ScenarioStep`** — one beat of the experience (narration, a question, or a
  manipulation task). Define these as data (e.g. ScriptableObjects) so a
  non-programmer can author new scenarios later.
- **`MathProblem`** — the actual math: prompt, correct answer, acceptable
  tolerance, and a hint. Kept separate from any VR code so it's pure C# and
  **unit-testable** without a headset.
- **`AnswerValidator`** — compares the student's input (typed value, or the sum
  of money objects they placed) against the `MathProblem`.
- **`MoneyObject`** — a grabbable bill/coin with a denomination value; a
  `MoneyTray` sums what's placed in it.
- **`Narrator`** — plays audio + shows captions for each step (the non-reading
  path).
- **`SessionLogger`** — records attempts, hints, time, and success per step;
  later this feeds a teacher dashboard.

## Why split `MathProblem` out from VR

The math logic has nothing to do with VR. If you keep it in plain C# classes:
- you can write **automated tests** for it (Unity Test Framework) and trust your
  numbers are right without putting on a headset, and
- you can reuse it across scenarios and even a future 2D/web version.

## Suggested folder layout (inside `Assets/`)

```
Assets/
  Scenes/                 BankLobby.unity, etc.
  Scripts/
    Scenario/             ScenarioManager, ScenarioStep
    Math/                 MathProblem, AnswerValidator   (plain C#, testable)
    Interaction/          MoneyObject, MoneyTray
    Narration/            Narrator
    Telemetry/            SessionLogger
  Content/                ScriptableObject scenario definitions
  Audio/                  narration clips
  Art/                    models, materials
  Tests/                  EditMode tests for the Math/ classes
```

## Data, privacy, and the commercial path
- Because users are **minors**, treat any logged data carefully: store the
  minimum, prefer anonymous/teacher-assigned IDs over real names, and get
  COPPA/FERPA guidance before collecting anything off-device.
- Keep scenario content as **data** (ScriptableObjects / JSON), so adding the
  next field trip is mostly authoring, not re-coding — that's your path from one
  MVP scenario to a sellable library.

> This is a target, not a prerequisite. For Phase 1–2 you can be messier; start
> refactoring toward this shape once the MVP scenario in
> [`02-curriculum-design.md`](02-curriculum-design.md) actually works.
