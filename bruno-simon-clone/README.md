# Bruno Simon Portfolio Clone (2025/2026)

A 100% authentic, fully animated, and interactive 3D WebGL/WebGPU physics game clone of [https://bruno-simon.com/](https://bruno-simon.com/).

This is an interactive 3D sandbox portfolio driven by a toy car physics engine:
- **64 Draco/GLTF 3D Models (`.glb`)**: Sprawling playground, dynamic terrain, customizable toy vehicle, birch & cherry trees, domino bricks, explosive crates, benches, lanterns, and interactive checkpoints.
- **88 GPU-Compressed KTX Textures**: Pre-baked lighting and shaders optimized for WebGL/WebGPU via Three.js Shading Language (TSL).
- **88 Audio Stems & Original Soundtracks**: Engine revs, tire friction, terrain collisions, environmental rain/wind/thunder, and full music tracks by Kounine.
- **Rapier 3D WebAssembly Physics Engine**: Custom raycast vehicle suspension simulation with 4-wheel independent spring dampening, friction, and torque.
- **GSAP Timeline Orchestration**: Camera rigs, modal transitions, time-of-day sunlight progression, and seasonal weather cycles.
- **Zero External Runtime Asset Dependencies**: All 958 assets (193.25 MB) are stored locally in `static/` and bundled in `dist/`.

---

## Quick Start

### 1. Run Production Server (Zero Config)
```bash
npm run serve
# or
node server.mjs
```
The server will start at `http://localhost:3000`.

### 2. Run Vite Live Dev Server
```bash
npm run dev
```
Starts the Vite development server with Hot Module Replacement (HMR) and source map support.

### 3. Build for Production
```bash
npm run build
```
Compiles and optimizes assets into the `dist/` directory.

### 4. Verify Assets & Topology
```bash
npm run check
# or
node scripts/verify.mjs
```

---

## Technical Stack & Architecture
- **Rendering Engine:** Three.js (^0.183.2) with TSL (Three.js Shading Language) supporting both WebGL and WebGPU.
- **Physics Engine:** Rapier 3D WebAssembly (`@dimforge/rapier3d`).
- **Animation Orchestration:** GSAP (GreenSock Animation Platform).
- **Audio Engine:** Howler.js with spatial audio and HTTP range streaming.
- **Texture Format:** KTX / Basis Universal GPU compressed formats.
- **Camera Rig:** Spring-damped `camera-controls` with cinematic targets.

---

## Vehicle Controls
- **Accelerate / Reverse:** `W` / `S` or `Up` / `Down` arrows.
- **Steering:** `A` / `D` or `Left` / `Right` arrows.
- **Brake / Drift:** `Space`.
- **Interact / Checkpoint:** `E` or `Enter`.
- **Reset / Respawn:** `R`.
- **Touch / Mobile:** On-screen virtual joystick and touch controls.
- **Gamepad:** Full Xbox / PlayStation controller support.

---

## Directory Structure
```
bruno-simon-clone/
├── dist/                     # Production build output
├── sources/                  # Complete modular game source code
│   ├── Game/                 # Core engine, physics, vehicle, world, rendering
│   ├── data/                 # Projects, career milestones, console art
│   ├── style/                # Stylus responsive stylesheets
│   ├── index.html            # Main HTML markup and UI overlay
│   └── index.js              # Application entry point
├── static/                   # 958 static assets (193.25 MB)
│   ├── vehicle/              # 3D car models (.glb)
│   ├── playground/           # Playground 3D models and collision meshes
│   ├── terrain/              # Terrain geometry
│   ├── sounds/               # 88 audio stems and music
│   ├── ui/                   # Vector icons, maps, reward skins
│   └── basis/ & draco/       # WebAssembly decoders
├── docs/research/            # Topology and asset inventory documentation
├── scripts/                  # Verification and build scripts
├── server.mjs                # Production-grade Node.js server with range requests
├── package.json              # Project dependencies and npm scripts
└── .env                      # Runtime configuration
```
