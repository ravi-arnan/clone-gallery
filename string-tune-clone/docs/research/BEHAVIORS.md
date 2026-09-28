# StringTune Clone: Interactive Behaviors & Technical Architecture

Target Site: [https://string-tune.fiddle.digital/](https://string-tune.fiddle.digital/)  
Clone Location: `/home/ravi/Projects/clone-gallery/string-tune-clone`

---

## 1. 3D WebGL2 Rendering Engine

- **Three.js Pipeline:**
  - Multiple active WebGL2 canvases coordinated across the scroll layout.
  - GLTF/GLB binary parsing through Draco WebAssembly decoders (`draco_wasm_wrapper.js` & `draco_decoder.wasm`).
  - Supports model variant switching between the master Katana (`/models/katana.glb`) and the Wakizashi companion dagger (`/models/Wakizashi.glb`).
- **PBR Materials & Texturing:**
  - High-precision Katana and Sheath materials using 10 dedicated maps:
    - BaseColor, Metallic, Roughness, Normal, and Height displacement for both blade and sheath components.
  - Image-Based Lighting (IBL) environment reflections powered by `/models/lightroom.exr`.
- **Procedural Shaders (`SceneCanvas` & `wavy-bend`):**
  - High-performance `#version 300 es` GLSL vertex and fragment shaders rendering instanced grid coordinates, color attributes, and real-time sinusoidal wave ribbons.

---

## 2. Animation & GSAP Orchestration

- **ScrollTriggers:**
  - Seamless interpolation of 3D camera transforms, katana blade unsheathing from its sheath, and blade tilt tied directly to scroll progress.
  - Inview triggers on text split lines (`.-a-split`, `.-s-line`, `.-s-word`) with cubic easing transitions.
- **Parallax Atmosphere:**
  - Multi-tier parallax movement across bamboo elements (`bamboo-1.png` through `bamboo-4.png`) and storm clouds (`storm.jpg`).
- **Custom Cursor & Interactions:**
  - Dynamic attribute-driven custom cursor with contextual state changes (`cursor-route`, `cursor-download`, `cursor-modal`).

---

## 3. Video Streaming & Media Pipeline

- **HTTP Range 206 Support:**
  - Supported by `server.mjs` for seamless seeking in showcase clips (`slash.mp4`, `skill-hub-link.mp4`, `container.mp4`, `ripple.mp4`, `dev-guides/stdg-presentation.mp4`).
  - 16 interactive basics tutorial videos loaded on demand.

---

## 4. Offline & Self-Contained Deployment

- **Zero External Runtime Dependencies:**
  - All fonts (`KHTeka`, `KHTekaMono`, `fdsi`), Draco decoders, 3D models, textures, styles, and scripts run 100% locally from `public/`.
  - External telemetry calls (PostHog / GTag / Cloudflare Insights) are neutralized or routed locally, ensuring completely clean browser console logs.
