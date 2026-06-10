# MBCMW

Two distinct math-education projects live in this repo, each in its own
top-level directory:

| Project | What it is | Stack | Status |
|---|---|---|---|
| [**MathWorld**](mathworld/) | Real-time competitive math battle game for classrooms (Kahoot-style rooms, character classes, live scoring) | Next.js, Supabase Realtime, Clerk | Playable MVP |
| [**Virtual Financial Field Trips**](field-trips/) | VR "field trip" to a bank/exchange/dealership where grades 5–8 students solve embedded math problems | WebXR (A-Frame) prototype now; Unity + Meta Quest later | Walk-phase prototype |

## MathWorld

A teacher creates a battle room; students join with a 6-character code, build a
character (4 classes with distinct scoring abilities), and compete on timed math
questions with a live leaderboard.

- Start here: [`mathworld/`](mathworld/) — Next.js app, Supabase migrations in
  [`mathworld/supabase/`](mathworld/supabase/)
- CI (type check + lint) runs via [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

## Virtual Financial Field Trips

A VR learning experience targeting Meta Quest. The long-term build is Unity
(see [`field-trips/docs/`](field-trips/docs/)); the current prototype is
browser-based WebXR, runnable today with zero installs:

- **Try it now:** open [`field-trips/web/index.html`](field-trips/web/index.html)
  in a browser — drag to look, WASD to walk, click the ATM.
- On merge to `main`, the prototype deploys to GitHub Pages via
  [`.github/workflows/deploy-field-trips.yml`](.github/workflows/deploy-field-trips.yml)
  for HTTPS access from a Quest headset.
- Docs: [getting started](field-trips/docs/00-getting-started.md) ·
  [roadmap](field-trips/docs/01-roadmap.md) ·
  [curriculum design](field-trips/docs/02-curriculum-design.md) ·
  [architecture](field-trips/docs/03-architecture.md)

## Repo conventions

- Each project keeps its own `README.md` and `.gitignore` inside its directory.
- CI workflows live at the repo root under `.github/workflows/` and are scoped
  to their project with `paths:` filters.
