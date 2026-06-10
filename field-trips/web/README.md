# Web (WebXR) Crawl Prototype

A browser-based VR prototype using **A-Frame** (JavaScript + HTML). This is the
**immediate, no-install path** while Unity isn't available — and it doubles as a
fast way to prototype scenarios before committing them to the heavier Unity
build.

> Stack note: this is **JavaScript + HTML**, not Java. A-Frame lets you describe
> a 3D/VR scene with HTML-like tags, so it's the gentlest possible on-ramp.

## What's here

- `index.html` — a **bank lobby** with the "walk" features now in place
  (`../docs/01-roadmap.md`): **teleport locomotion** and a **clickable ATM** that
  opens a world-space info panel. Floor, walls, welcome sign, teller counter, and
  the interactive ATM. The first math step is teased in the panel but not yet
  wired up.

## Controls

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
- [ ] Add an interactive **math step** in the panel: show "How much is left after
      paying $12.75?" with selectable answers and right/wrong feedback.
- [ ] Add grabbable **money objects** (bills/coins) and a tray that sums them.
- [ ] Log attempts/time for teachers.

These map to Phase 3 (the MVP vertical slice) in `../docs/01-roadmap.md`.
