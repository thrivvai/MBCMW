# Web (WebXR) Crawl Prototype

A browser-based VR prototype using **A-Frame** (JavaScript + HTML). This is the
**immediate, no-install path** while Unity isn't available — and it doubles as a
fast way to prototype scenarios before committing them to the heavier Unity
build.

> Stack note: this is **JavaScript + HTML**, not Java. A-Frame lets you describe
> a 3D/VR scene with HTML-like tags, so it's the gentlest possible on-ramp.

## What's here

- `index.html` — an empty **bank lobby** you can look around in (the "crawl"
  milestone from `../docs/01-roadmap.md`). Floor, walls, a welcome sign, a teller
  counter, and an ATM placeholder. No math or interaction yet.

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

## Next steps (turn crawl → walk)
- Add VR **locomotion** (teleport) so you can move with the controllers, not just
  WASD.
- Make the **ATM** interactive: gaze/controller click opens a world-space UI
  panel.
- Add grabbable **money objects** (bills/coins) and a tray that sums them.
- Then wire in the first **math step** from `../docs/02-curriculum-design.md`.

These map to Phases 2–3 in `../docs/01-roadmap.md`.
