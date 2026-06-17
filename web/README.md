# Web (WebXR) Crawl Prototype

A browser-based VR prototype using **A-Frame** (JavaScript + HTML). This is the
**immediate, no-install path** while Unity isn't available — and it doubles as a
fast way to prototype scenarios before committing them to the heavier Unity
build.

> Stack note: this is **JavaScript + HTML**, not Java. A-Frame lets you describe
> a 3D/VR scene with HTML-like tags, so it's the gentlest possible on-ramp.

## What's here

- `index.html` — a **bank lobby** with a **start/sign-in screen** (asks the
  student's name, then enters), **teleport locomotion**, and an **interactive
  ATM** (`../docs/01-roadmap.md`). The interior has a ceiling with lights, carpet,
  a glass entrance with daylight, a branded accent wall, a reception desk with a
  teller, a branded ATM kiosk, welcome kiosks, and plants. Clicking the ATM opens
  a world-space panel that runs the first math step: a decimal-subtraction
  question ($50.00 − $12.75) with selectable answers, a hint on a wrong choice,
  and a success/debrief screen.

## On visual realism

This interior is built from A-Frame **primitives** (boxes, planes) with lighting
and materials — believable, but not photorealistic. Photoreal interiors like a
reference render come from **imported 3D model assets** (glTF/`.glb` files with
textures, e.g. free models from Poly Pizza / Sketchfab / Quaternius) or from the
Unity path. Dropping real furniture/ATM/teller models into this scene with
`<a-gltf-model>` is the next realism step whenever you want it — the interaction
code stays the same.

## Controls

Before the scene loads you get a **start screen**: type a name and click **Enter
the Bank** (the name is used for the attempt logging).

| | Desktop (no headset) | Quest headset |
|---|---|---|
| Look | drag the mouse | move your head |
| Walk | **W / A / S / D** | **teleport**: point a controller at the floor, press the thumbstick/trigger, release |
| Use the ATM | **click it** with the mouse | point a controller at it, pull the trigger |
| Close the panel | click **CLOSE** | point + trigger on **CLOSE** |

Dependencies (both loaded from a CDN, nothing to install): A-Frame core +
`aframe-blink-controls` for teleport.

## How to run it

### On your computer (no headset needed)
Just **open `index.html` in a browser** (Chrome/Edge/Firefox). Drag the mouse to
look around; use **W/A/S/D** to walk.

> Some browsers restrict features on `file://` pages. If anything looks off,
> serve the folder instead:
> ```
> cd web
> python3 -m http.server 8000
> ```
> then visit http://localhost:8000

### On a Quest headset (later)
WebXR needs **HTTPS**. Easiest options:
1. Push this folder to **GitHub Pages** (free) and open the URL in the Quest
   browser, or
2. Use a tunneling tool (e.g. `ngrok http 8000`) to expose your local server
   over https.

Then, in the Quest browser, open the page and tap the **VR goggles button** in
the bottom-right corner to enter immersive mode.

## Next steps (turn walk → run)
- [x] VR **teleport locomotion**.
- [x] Make the **ATM** interactive (opens a world-space panel).
- [x] First interactive **math step**: $50.00 − $12.75 with answer choices, a
      hint on wrong answers, and a debrief.
- [ ] Add grabbable **money objects** (bills/coins) and a tray that sums them
      (the "make change" manipulation step).
- [ ] Deposit step + on-screen ledger.
- [ ] Real attempt/time **logging** for teachers (currently just `console.log`).

The math logic lives in the `money-quiz` component in `index.html`, kept separate
from the scene markup per `../docs/03-architecture.md`. These map to Phase 3 (the
MVP vertical slice) in `../docs/01-roadmap.md`.
