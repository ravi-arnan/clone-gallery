# Pear Clone: Behaviors & Animation Orchestration

Target Site: [https://pear.no/](https://pear.no/)

---

## 1. 3D WebGL Volumetric Model Engine

- **Architecture:** Custom low-level WebGL / GLSL pipeline operating on `<canvas class="gl">`.
- **Model Tiers & Manifests:**
  - `films/model/renaissance/manifest.json`: 362 high-resolution 3D volumetric rotation frames.
  - `films/model/v28/manifest.json`: 121 transition frames.
  - `films/model/v51/manifest.json`: 121 transition frames.
  - `films/model/v61/manifest.json`: 121 transition frames.
- **Responsive Quality Selection:** Automatic resolution switching between desktop (`1440/`) and mobile (`768/`) based on `matchMedia('(max-width: 820px)')`.

---

## 2. Dynamic Scroll Interpolation & Canvases

- **Scroll Tracking:** Sub-pixel smooth scroll listener calculating exact normalized scroll progress `scrollY / (documentHeight - innerHeight)` over 48,150 px.
- **Lookahead Frame Decoding:** Proactive image pre-decoding via `img.decode()` on upcoming frames (±3 frames from current viewport) to guarantee zero drop-frames during fast scrolling.
- **Particle & Flight Simulation:** `<canvas class="fly">` runs a requestAnimationFrame loop rendering depth-interpolated particles floating in 3D perspective.
- **Warp Transition Compositor:** `<canvas class="trans">` renders GLSL post-process distortion shaders blending 3D volumetric renders into live video backgrounds.

---

## 3. High-Definition Video Pipelines

- **Adaptive Playback:** Videos are synchronized with viewport visibility:
  - `/films/footer-loop.mp4` loops in muted background at page terminus.
  - `/films/reveal.mp4`, `/films/signal.mp4`, `/films/colossus.mp4` play seamlessly with HTTP Range 206 streaming support.
