# Technical Behaviors & WebGL Mechanics

**Project:** `cornrevolution-clone`  
**Original URL:** `https://cornrevolution.resn.global/`

---

## 1. WebGL & Three.js Architecture

- **Engine:** Three.js custom build with specialized Gozer utils and extended standard materials.
- **Dynamic Compression Detection:**
  The runtime probes GPU WebGL extensions via `Hn(renderer)`:
  - Desktop Chrome/Firefox: `WEBGL_compressed_texture_s3tc` (`.ktx` S3TC DXT1/DXT5 format)
  - Mobile/Modern Devices: `WEBGL_compressed_texture_astc` (`.ktx` ASTC format)
  - iOS/Legacy Devices: `WEBGL_compressed_texture_pvrtc` (`.ktx` PVRTC format)
  All formats are downloaded and served locally with instant streaming.
- **GLTF Loading Pipeline:**
  - GLTF 2.0 JSON structures load external `.bin` files via relative URI resolution.
  - Custom armature manipulation (`cornArmature.getObjectByName("Armature_Bone")`) syncs bone rotation with user scroll position.

---

## 2. GSAP Timeline Choreography

- **Library:** GreenSock Animation Platform (GSAP 2.1.2) with TweenLite, TimelineLite, and custom easing functions (`Power3.easeOut`, `Quad.easeInOut`).
- **Scroll Synchronization:**
  - `scrollProxy` monitors wheel, drag, and touch gestures.
  - Normalizes scroll distance to progress intervals `[0.0 .. 1.0]`.
  - Camera positions, focal lengths, and scene visibility blend smoothly across sections.
- **Micro-interactions:**
  - Dynamic hotspot projection: 3D world positions mapped to 2D screen coordinates with pulsing radar rings.
  - Hover states on side-nav buttons scrub directly to target sections.
  - Spritesheet animation sequences (1200 frames @ 30 FPS) trigger on active section states.

---

## 3. Shaders & Rendering Techniques

- **MSDF (Multi-channel Signed Distance Field) Typography:**
  Renders crisp typography at any resolution and perspective distortion without raster pixelation or heavy font payloads.
  Shaders: `letter-msdf.vs`, `letter-msdf.fs`.
- **Instanced Field Rendering:**
  Renders expansive fields of crops by instancing transform matrices on the GPU (`tile-instances-vs.glsl`, `tile-instances-fs.glsl`).
- **Post-Processing & Atmosphere:**
  Grain noise, chromatic aberration, vignette, and tone-mapping passes compose the filmic aesthetic of the experience.

---

## 4. Offline Autonomy & Resilience

- **Complete Asset Self-Containment:** All 181 assets (54.9 MB) are stored locally in `public/`.
- **Zero CloudFront Dependencies:** Hardcoded remote URLs inside compiled bundles have been rewritten to local absolute paths (`/`).
- **On-Demand Proxy Fallback:** `server.mjs` retains transparent fetching for any future edge-case requests, automatically persisting retrieved assets locally.
