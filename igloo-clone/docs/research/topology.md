# Igloo Inc. — Architecture & Topology

## 1. Overview
The site `https://www.igloo.inc/` is a custom WebGL 3D single-page experience built with Three.js, GSAP (GreenSock), Svelte, Draco 3D geometry decoding, KTX2/Basis Universal texture compression, Web Workers, and an interactive spatial Web Audio system.

## 2. Layer Hierarchy
1. **HTML Background & Root CSS (`#app`)**:
   - Background Color: `#000000` / dynamic theme variables
   - ASCII Loading screen (`#loader`, `.ascii:before` keyframe animation)
2. **Three.js Canvas Layer (`canvas`)**:
   - WebGLRenderer with shadow maps, floating-point buffers, postprocessing
   - Camera Rig: Perspective camera controlled via GSAP timelines + mouse drag/touch gestures
   - Scene Meshes:
     - `igloo.drc` & `igloo/igloo_cage.drc` (Wireframe / solid / exploded view)
     - `igloo/patch.drc` & `igloo/igloo_outline.drc`
     - `ground.drc` & `mountain.drc` (Terrain and distant landscape)
     - `intro_particles.drc`, `ceilingsmoke.drc`, `smoke_trail.drc` (Particle & volumetric effects)
     - `shattered_ring.drc` & `shattered_ring2.drc`
     - `cubes/background_shapes.drc` & `blurrytext.drc`
   - Shaders & Materials:
     - Custom GLSL vertex & fragment shaders with LUT tetrahedral color grading (`igloo_scene.ktx2`)
     - Caustics, chromatic aberration, noise displacement, depth of field / bokeh
3. **Typography & MSDF Text Rendering**:
   - 3D Text rendered via Multi-channel Signed Distance Fields (MSDF)
   - Font: IBM Plex Mono Medium (`IBMPlexMono-Medium-datatexture.ktx2`, `IBMPlexMono-Medium.json`)
   - Web Font fallback: IBM Plex Mono Medium & Regular (`.woff2`, `.woff`)
4. **Interactive 2D/3D DOM Overlay & Events**:
   - Top Header: Igloo logo, Sound mute/unmute control, Close/Navigation
   - Hero / Manifesto: "Our mission is to build the next generation of consumer brands at the intersection of Community, AI, and crypto."
   - Portfolio Navigation:
     - PORTFOLIO_CO_01 Pudgy Penguins
     - PORTFOLIO_CO_02 Overpass
   - Footer: "Igloo, Inc. All Rights Reserved."
5. **Web Audio & SFX Engine**:
   - 18 dedicated audio stems managed by Web Audio API (`AudioContext`) and `audioworker`:
     - Ambient background: `wind.ogg`, `room.ogg`, `music-highq.ogg`
     - Interactive cues: `logo.ogg`, `manifesto.ogg`, `enter-project.ogg`, `click-project.ogg`, `leave-project.ogg`, `project-text.ogg`, `ui-short.ogg`, `ui-long.ogg`, `beeps.ogg`, `beeps2.ogg`, `beeps3.ogg`, `shard.ogg`, `particles.ogg`, `circles.ogg`, `igloo.ogg`

## 3. Timeline Orchestration (GSAP)
- Over 130 GSAP timelines orchestrating camera moves, exploded view morphs, wireframe glow fades, text animations, and transition timings.
- Initial load triggers `introTL` timeline:
  - Fades ASCII loader
  - Activates particle systems and camera zoom-in
  - Transitions `igloocage` to solid `igloo` mesh
  - Synchronizes ambient audio track with visual revelation
