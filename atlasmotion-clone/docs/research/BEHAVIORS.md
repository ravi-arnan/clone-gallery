# Interaction Models & Behaviors: Atlas Motion Systems

## 1. WebGL 3D Engine & Rendering Pipeline

- **WebGL2 Context & Hardware Acceleration:**
  - Initialized on `<canvas id="canvas">`.
  - Supports `OES_draw_buffers_indexed` and floating-point render targets (`RENDER_TARGET_FLOAT_TYPE`).
- **Resolution & DPR Management:**
  - `DPR = Math.min(1.5, window.devicePixelRatio)` to maintain optimal frame rates and reduce laptop GPU thermal load.
- **Post-Processing Pipeline:**
  - SMAA antialiasing pass (`smaa-area.png`, `smaa-search.png`).
  - Specular reflectance (`specular.png`), BRDF calculations (`brdf.png`), and environment radiance (`LDR_RGB1_0.png`).
  - Convolutional Bloom effect with threshold filtering.

---

## 2. GSAP Animations & Mechanical Timeline

- **Character Flipper System (`.is-flipper`):**
  - Text splits into individual characters using GSAP `SplitText`.
  - On mouse hover or transition, extra character layers dynamically roll along the Y-axis with cubic-bezier easing.
- **3D Camera Choreography (`CAMERA.buf`):**
  - Camera position and look-at vectors interpolated from binary buffer keyframes as the user scrolls.
- **Drone Propeller Rotation:**
  - Four instances of `DRONE_BLADE.buf` continuously spinning with dynamic speed uniforms (`u_spin`) linked to delta time and scroll acceleration.
- **Exploded Motor Mechanism (`ENGINE_ANIMATION.buf`):**
  - 11 individual engine components (`JDM_part_01` to `JDM_part_11`) separate outwards from their core axis as the user scrolls through the `#home-motor` section.
  - Step indicators (01 - 04) synchronize with DOM titles ("Integrate", "Evaluate", "Manufacture", "Innovate").

---

## 3. Background Grid & Coordinates Canvas

- `<canvas id="background-grid">` continuously draws technical grid markings, crosshairs, and dynamic coordinates.
- Mouse movement introduces smooth inertia offsets to grid vertices.

---

## 4. Single-Page Application (SPA) Routing & Fallback

- **RouteManager Navigation:**
  - Click events on internal links (`/thesis`, `/writing`, `/contact`, `/order`) are intercepted.
  - History state updated via `history.pushState`.
  - Route HTML fetched asynchronously, extracting the `.page` container and replacing DOM contents with transition effects.
- **Static Fallback Protection:**
  - If WebGL2 context creation fails, the site gracefully degrades to `.is-static-fallback` mode with image posters and native scrolling.
- **Self-Contained Local Delivery:**
  - All 16 binary models, 24 textures, 3 fonts, 2 videos, and 21 images are served locally from `server.mjs`.
