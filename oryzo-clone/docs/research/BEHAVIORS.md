# Oryzo.ai Clone: Interactive Behaviors & Technical Architecture

Target Site: [https://oryzo.ai/](https://oryzo.ai/)  
Clone Location: `/home/ravi/Projects/clone-gallery/oryzo-clone`

---

## 1. 3D WebGL2 & Gaussian Splatting Architecture

- **Gaussian Splatting Runtime:**
  - Employs `.sog` format Gaussian splat models (`/splats/props.sog`, `/splats/table_reflection.sog`).
  - WebAssembly radix sort worker (`splat_sorter_bg-BfJrILzx.wasm` via `SplatsWorker-DSMxtdkh.js`) sorting thousands of splats in real-time off the main thread.
  - Custom GLSL3 shader materials (`sogCombineMaterial`, `sogCombineSHMaterial`) decoding spherical harmonics and covariance matrices.
- **Binary Model Buffers (`.buf`):**
  - Custom high-speed binary mesh and animation format used by Lusion for instantaneous decoding without JSON/GLTF overhead.
  - Pre-baked camera paths (`hero_camera.buf`, `stack_camera.buf`) driving smooth transitions between narrative sections.
- **Image-Based Lighting & Post-Processing:**
  - Multi-sample antialiasing with SMAA (`smaa-area.png`, `smaa-search.png`).
  - Complex optical effects including Gobo lighting projection (`gobo_b_*.avif`, `gobo_c_*.avif`), thermal gradients, and smoke harmonics.

---

## 2. Animation & Scroll Orchestration

- **Scroll-Linked Narrative:**
  - Normalized scroll position across 49,967 px controlling continuous camera tracking, model disassembly, coaster flips, and tardigrade microscopic zooms.
- **Rive Vector Animations:**
  - Offline Rive WebAssembly engine (`/libs/rive/rive.wasm`) driving real-time state machines for sustainability harvest graphics on Canvas 3 and Canvas 4.
- **Interactive UI Flippers:**
  - Micro-interactions on navigation anchors (`.is-flipper`) with kinetic letter flipping transitions.

---

## 3. Video & Media Streaming

- **HTTP Range 206 Streaming:**
  - High-definition video showcases (`bite.mp4`, `yoga.mp4`) streamed on demand with byte-range partial content support.
  - Vimeo oEmbed requests mocked locally via `server.mjs` to ensure 100% functionality without network errors.

---

## 4. Offline & Self-Contained Deployment

- **Zero External Runtime Dependencies:**
  - All 147 assets (including WASM binaries, fonts, splat models, textures) run locally from `public/`.
  - External tracking and telemetries removed or stubbed locally.
