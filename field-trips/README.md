# Virtual Financial Field Trips

A VR learning experience for **grades 5–8** where students take a "field trip" to a
financial institution — a bank, a currency exchange, a car dealership, a stock
exchange — and solve real math problems embedded in a believable scenario. The
financial situation is the *hook*; the math (decimals, percentages, ratios,
simple interest, linear growth) is the *learning*.

Target hardware: **Meta Quest** (Quest 2 / 3 / 3S).

## Try it now (no install, no headset)

A **WebXR prototype** built with A-Frame lives in [`web/`](web/) — open
[`web/index.html`](web/index.html) in any browser: drag to look, **WASD** to
walk, click the **ATM**. On a Quest, open the GitHub Pages deployment of this
folder in the headset browser and tap the VR goggles button. See
[`web/README.md`](web/README.md) for controls and details.

The prototype is the fast path while the Unity build below is the long-term
"graduation" target.

## Stack decision (long-term Unity build)

| Choice | Value | Why |
|---|---|---|
| Engine | **Unity** (C#) | Commercial endgame + Meta Horizon Store path; best docs/tutorials for Quest. |
| VR SDK | **Meta XR All-in-One SDK** | Official Meta package: camera rig, controllers, hand tracking, interaction. |
| Render pipeline | **URP** (Universal Render Pipeline) | Required for good performance on mobile Quest hardware. |
| Test without headset | **Meta XR Simulator** + Unity **XR Device Simulator** | Build and iterate on desktop until a Quest is on hand. |

See [`docs/00-getting-started.md`](docs/00-getting-started.md) for setup, and
[`docs/01-roadmap.md`](docs/01-roadmap.md) for the build plan.

## Status

Walk-phase WebXR prototype in [`web/`](web/) (teleport locomotion + clickable
ATM). No Unity project committed yet — that's the next step in the
getting-started guide.

## Documentation

- [`docs/00-getting-started.md`](docs/00-getting-started.md) — install Unity + Meta SDK, run a scene without a headset.
- [`docs/01-roadmap.md`](docs/01-roadmap.md) — crawl → walk → run milestones.
- [`docs/02-curriculum-design.md`](docs/02-curriculum-design.md) — scenarios mapped to grade 5–8 math standards; the MVP scenario spec.
- [`docs/03-architecture.md`](docs/03-architecture.md) — how the code and scenes will be organized.
