# Web (WebXR) Crawl Prototype

A browser-based VR prototype using **A-Frame** (JavaScript + HTML). This is the
**immediate, no-install path** while Unity isn't available — and it doubles as a
fast way to prototype scenarios before committing them to the heavier Unity
build.

> Stack note: this is **JavaScript + HTML**, not Java. A-Frame lets you describe
> a 3D/VR scene with HTML-like tags, so it's the gentlest possible on-ramp.

## What's here

- `index.html` — the full bank scene and all interaction logic.
- `assets/models/*.glb` — imported 3D models (teller desk/counter, ATM, teller
  NPC) used for the lobby. The shell (walls, floor, ceiling, lights, glass
  entrance, plants) is still A-Frame primitives.

### The complete MVP scenario flow
1. **Start / sign-in screen** — student enters a name, clicks *Enter the Bank*.
2. **ATM (decimal subtraction)** — click the ATM → a world panel poses
   "$50.00 − $12.75 = ?" with answer choices; wrong answers give a hint and
   allow retries.
3. **Teller deposit (make change)** — at the desk, tap bills/coins ($20/$10/$5/$1
   and 25¢) to assemble exactly **$37.25**, then press **DEPOSIT**. The tray total
   and the **Savings ledger** update; the field trip completes.

Attempt/selection data is logged to the browser console (open with F12) as a
stand-in for a future teacher dashboard.

## On visual realism

The lobby now uses imported **glTF/`.glb` models** for the desk, ATM, and teller,
which is a big step up from primitives. For the surrounding shell and for even
higher fidelity, you can keep swapping in more `.glb` assets (free sources: Poly
Pizza / Sketchfab / Quaternius) — the interaction code stays the same.

> Model orientation: these `.glb` files are authored **Z-up**, so each model sits
> inside a wrapper that rotates it −90° on X to stand upright. If a model faces
> the wrong way, change the **outer** entity's yaw (the middle rotation number)
> in `index.html` — each has a comment showing exactly where. Positions may also
> need small nudges to sit flush with the walls/floor.

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

> ⚠️ **You must serve the folder over http — do NOT double-click the file.**
> Browsers block loading local `.glb` 3D models over `file://`, so opening
> `index.html` directly makes the desk, ATM, and teller silently disappear (the
> walls/floor still show). Run a tiny local server instead:
> ```
> cd web
> python3 -m http.server 8000
> ```
> then visit **http://localhost:8000**. Drag the mouse to look, W/A/S/D to walk.

Open the browser console (F12) — you should see `[model] LOADED ...` for each of
the three models. A `[model] FAILED` line means the page can't reach the `.glb`
files (almost always the `file://` problem above).

### On a Quest headset (later)
WebXR needs **HTTPS**. Easiest options:
1. Push this folder to **GitHub Pages** (free) and open the URL in the Quest
   browser, or
2. Use a tunneling tool (e.g. `ngrok http 8000`) to expose your local server
   over https.

Then, in the Quest browser, open the page and tap the **VR goggles button** in
the bottom-right corner to enter immersive mode.

## Status & next steps
- [x] VR **teleport locomotion**.
- [x] Interactive **ATM** with a decimal-subtraction question (hint + retries).
- [x] **Make-change deposit** step at the teller + a savings **ledger**.
- [x] Imported **glTF models** (desk, ATM, teller).
- [x] **Start/sign-in** screen capturing the student name.
- [ ] Tune model **orientation/placement** to sit flush (needs a visual pass).
- [ ] **Bill/coin objects** you physically grab (vs. tap) for stronger VR feel.
- [ ] Persist attempt/time **logging** off the console for teachers.
- [ ] More scenarios (currency exchange, dealership) reusing these components.

The math/flow logic lives in the `money-quiz` and `deposit-station` components in
`index.html`, kept separate from the scene markup per
`../docs/03-architecture.md`. This completes the Phase 3 MVP vertical slice in
`../docs/01-roadmap.md`.
