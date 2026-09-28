# Bruno Simon Portfolio 2025/2026 — Architecture & Topology

## 1. Overview
The site `https://bruno-simon.com/` is a real-time, fully interactive 3D WebGL/WebGPU application built with Three.js (using TSL - Three.js Shading Language), Rapier 3D physics (`@dimforge/rapier3d`), GSAP animation timelines, Howler.js spatial audio, and KTX/Basis texture compression.

Unlike traditional static web pages or simple CSS animations, the entire experience is an interactive sandbox game where the user drives a physics-driven toy vehicle across a sprawling 3D landscape to explore Bruno Simon's projects, career milestones, playground activities, achievements, and easter eggs.

---

## 2. Layer Hierarchy & Pipeline

### 1. HTML & DOM UI Layer (`sources/index.html`)
- **Fonts Preloader (`.fonts-loader`)**: Preloads `Nunito`, `Amatic SC`, and `Pally-Medium`.
- **Canvas Container (`canvas.js-canvas`)**: Dedicated WebGL/WebGPU context canvas.
- **Touch / Mobile On-Screen Controls (`.touch-buttons`)**: Responsive steering, gas/reverse, unstuck, next/previous buttons for mobile and touch devices.
- **Top Bar & Navigation Triggers**:
  - Menu Trigger (`.menu-trigger`): Drawer with navigation links, options, sound toggle, achievements.
  - Interactive Map Trigger (`.map-trigger`): Real-time minimap overlay showing vehicle position across regions (`ui/map/map-day.webp`, `ui/map/map-night.webp`).
- **Modals & Overlays**:
  - Project detail cards with interactive screenshots and external links.
  - Whispers / guestbook modal.
  - Achievements panel with unlockable car skins (Red, Orange, White, Black, Flames, Abyssal).
  - Career timeline viewer.

### 2. Rendering Engine & TSL Shaders (`sources/Game/Rendering.js`)
- **Renderer**: Three.js `WebGPURenderer` / `WebGLRenderer` fallback with ACESFilmicToneMapping and PCF soft shadow maps.
- **TSL (Three.js Shading Language)**: Next-generation node-based material and post-processing pipeline.
- **Post-Processing**: Depth of field, volumetric bloom, custom atmospheric fog, chromatic aberration, vignette, and screen-space reveal transitions.
- **Lighting Rig**: Dynamic sun/moon directional light with cascading shadow maps, sky hemilight, and local point/spot lights attached to lanterns and vehicle headlights.

### 3. Physics Simulation Engine (`sources/Game/Physics/`)
- **Engine**: Rapier 3D WebAssembly physics engine (`@dimforge/rapier3d`).
- **Vehicle Physics**: Custom raycast suspension vehicle with 4 independent wheel colliders, chassis rigid body, tire friction, spring stiffness, damping, and torque simulation.
- **Terrain Colliders**: Trimesh and heightfield colliders generated from compressed terrain meshes.
- **Dynamic Objects**: Rigid bodies with impulse restitution for explosive crates, fences, falling bricks, dominoes, and interactive balls.

### 4. Animation & Timeline Orchestration (GSAP)
- **Camera Rig**: Smooth spring-damped follow camera transitioning seamlessly to cinematic framing during project inspections or modal openings.
- **Time/Day Cycle**: Real-time diurnal cycle moving sun position, sky gradients, starfield opacity, and lighting temperature.
- **Yearly Seasons**: Dynamic weather changes (rain, snow, autumn leaf fall, summer breeze, thunderstorm, tornado).
- **Procedural Animations**: Swaying grass, waving foliage, fluttering banners, particle sparks, smoke trails, and water caustics.

### 5. Audio Pipeline (`sources/Game/Audio/`)
- **Engine**: Howler.js with spatial Web Audio API.
- **Vehicular SFX**: Dynamic pitch-shifted engine revs, wheel friction on pebbles, suspension squeaks, and collision impacts.
- **Ambient World**: Wind loops, crickets at night, ocean/lake waves, thunderstorm cracks, birds, and forest sounds.
- **Music & Jukebox**: Original compositions by Kounine (`Baguira.mp3`, `Boy.mp3`, `Sudo.mp3`) with interactive in-game jukebox control.

---

## 3. Game Loop Architecture

The application runs a prioritized, multi-phase loop on each animation frame:

```
[0] Inputs & Clock -> [1] Player Pre-Physics -> [2] Vehicle Pre-Physics -> 
[3] Rapier Physics Step -> [4] Objects Physics Update -> [5] Vehicle Post-Physics -> 
[6] Player Post-Physics -> [7] Camera View -> [8] Cycles & Weather -> 
[9] Wind & Lights -> [10] Terrain, Foliage, Particles & Objects -> 
[14] Audio Engine -> [998] Three.js Render -> [999] Stats & Monitoring
```
