# 00 — Getting Started (Unity + Meta Quest)

This is the "install everything and see a VR scene on your screen" guide. You do
**not** need a headset to complete it — we use simulators.

> Version note: Unity and the Meta XR SDK update often. Don't hard-code a
> version from memory — always check Meta's current compatibility page before
> picking a Unity version: https://developers.meta.com/horizon/documentation/unity/unity-gs-overview/

## Accounts you'll need (all free to start)

1. **Unity account** + Unity Hub. The free *Personal* license is fine until you
   pass Unity's revenue threshold.
2. **Meta developer account** at https://developers.meta.com — required to use
   the Meta XR SDK and, later, to publish. You must create an **organization**
   and agree to the developer terms.

## Step 1 — Install the tooling

1. Download and install **Unity Hub**.
2. In Unity Hub → *Installs* → install a **Unity 6 LTS** editor (or whatever LTS
   Meta currently lists as supported). During install, check these modules:
   - **Android Build Support** (Quest runs Android)
   - **OpenJDK** and **Android SDK & NDK Tools** (sub-options of the above)
3. Install a code editor: **Visual Studio**, **VS Code**, or **JetBrains Rider**
   (Rider is free for non-commercial use and excellent for Unity).

## Step 2 — Create the project

1. Unity Hub → *New Project*.
2. Choose the **Universal 3D (URP)** template. URP is needed for Quest
   performance.
3. Name it (e.g. `VirtualFinancialFieldTrips`) and create it **inside this repo
   folder** so the Unity project lives next to these docs. The `.gitignore` here
   is already set up for Unity.

## Step 3 — Add the Meta XR SDK

1. Open **Window → Package Manager**.
2. Install the **Meta XR All-in-One SDK** (via the Asset Store / "My Assets", or
   the Unity registry, depending on the current distribution method — check the
   Meta docs link above).
3. Run the **Meta XR Project Setup Tool** (it appears as a checklist) and apply
   its recommended fixes — these configure the project for Quest automatically.

## Step 4 — Run a scene without a headset

You have two simulator options:

- **XR Device Simulator** (from Unity's XR Interaction Toolkit) — lets you fly a
  fake headset + controllers around the Scene with mouse/keyboard in Play mode.
- **Meta XR Simulator** — a desktop runtime that emulates a Quest, closer to the
  real thing.

Add the Meta **Camera Rig** / **OVRCameraRig** prefab to an empty scene, press
**Play**, and you should be "inside" the scene on your monitor. That's your VR
loop working — congratulations, the hardest part of starting is behind you.

## Step 5 — (Later) Put it on a real Quest

When you get a headset:

1. Enable **Developer Mode** on the Quest via the Meta Horizon mobile app (tied
   to your developer org).
2. Install **Meta Quest Developer Hub (MQDH)** on your computer.
3. In Unity: **File → Build Settings → switch platform to Android**, then
   **Build and Run** with the Quest connected by USB. The app sideloads to the
   headset.

## What to learn alongside this

- Unity's official **"Create with VR"** / XR learning pathway (free).
- Meta's **"First VR App" / Unity getting-started** tutorials.
- Enough **C#** to be comfortable with variables, classes, methods, and Unity's
  `MonoBehaviour` lifecycle (`Awake`, `Start`, `Update`). You don't need to be an
  expert — you need to be able to read and modify scripts.

Once this works, move on to [`01-roadmap.md`](01-roadmap.md).
