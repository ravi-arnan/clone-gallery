# Floema® Behaviors & Animation Choreography

Target: [https://floema.com/en](https://floema.com/en)

## 1. 3D WebGL & Particle Shadows Engine

Floema uses dedicated Web Workers (`public/_nuxt/Shadows.worker-C5dCWLRm.js` and `public/_nuxt/ModelView.worker-ChHUB9To.js`) to offload 3D rendering and physics away from the main thread, maintaining smooth 60 FPS performance.

### Ambient Shadows & Particle Simulation
- **Worker:** `Shadows.worker-C5dCWLRm.js`
- **Canvas Container:** Mounted inside `.bottomGroupCanvasContainer` and `.shadows`.
- **Textures:**
  - `public/3d/shadows/packed_texture_3.png`: Atlas containing procedural shadow profiles.
  - `public/3d/shadows/noiseTexture.png`: Perlin noise distribution for natural ambient leaf and branch flutter shadows.
- **Behavior:**
  - Intercepts scroll and viewport events.
  - Generates organic dappled light and shadow movements reacting to mouse position and scroll velocity.

### Interactive 3D Product Viewer (`ModelView`)
- **Worker:** `ModelView.worker-ChHUB9To.js`
- **Environment Lighting:**
  - `public/3d/envmaps/HDR_Light_Studio_Free_HDRI_Design_13.exr` loaded as equirectangular IBL reflection map with 0.4 environment intensity.
- **Decompression & Obfuscation:**
  - Floema obfuscates models as `.buf` files with XOR 91.
  - Decoded into standard binary glTF (`.glb`) files and fed into `THREE.GLTFLoader` with `DRACOLoader` (`draco_decoder.wasm`).
- **Interactive Controls:**
  - Custom OrbitControls with damping factor `0.04`, polar angle restricted between `0.5` and `Math.PI / 2`.
  - Zoom interpolation with sensitivity thresholding (`0.8` to `1.5`).

## 2. GSAP & ScrollTrigger Animations

- **Scroll Interpolation (Lenis):**
  - Smooth inertia scrolling orchestrating page sections and triggering Pin and Scrub sequences.
- **Reveal Timelines:**
  - Staggered typography reveals on headings using CSS variable transforms and opacity transitions.
  - Parallax image displacement during scroll.
- **Magnetic Micro-Interactions:**
  - Interactive cursor follower with spring physics.
  - Navigation buttons and sound toggles reacting to hover coordinates.

## 3. Spatial Ambient Audio (Pizzicato Engine)

- Powered by Pizzicato Web Audio library with gain nodes and spatial volume attenuation.
- **Soundscapes:**
  - `about-foreground.mp3`: Warm organic nature background.
  - `kingfisher-assustou-se.mp3`: Reactive bird audio cue.
  - `olw-leaving.mp3`: Subtle breeze and foliage movement.
  - `sustainability-bike.mp3`: Urban kinetic audio cue.
  - `sustainability-foreground-0.mp3` & `sustainability-foreground-1.mp3`: Layered environmental textures.
  - `sustainability-foreground-synth.mp3`: Melodic ambient pad.
- **Behavior:**
  - Default muted on initial load respecting browser autoplay policies.
  - Unmute toggle smoothly fades in ambient tracks and cross-fades between sections.
