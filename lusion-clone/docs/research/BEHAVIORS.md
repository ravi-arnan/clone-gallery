# Interaction Models & Behaviors: Lusion.co

## 1. WebGL 3D Engine & Rendering Pipeline

- **Three.js WebGL2 Context:** Uses WebGL2 when supported with float buffer packing fallback.
- **DPR Scaling:** `Math.min(1.5, window.devicePixelRatio)` capped to avoid GPU thermal load.
- **Custom Post-Processing Queue:**
  - Screen space ambient occlusion & SMAA antialiasing (`smaa-area.png`, `smaa-search.png`).
  - Bloom filter pass with adjustable threshold, radius, and smooth width.
  - Screen paint distortion and chromatic aberration RGB shift on route transitions.

---

## 2. Animation & Physics Choreography

- **GSAP (GreenSock Animation Platform):**
  - Camera interpolation along spline paths (`camera_spline.buf`).
  - DOM title staggered text reveals using split characters.
  - Section transitions linked to scroll progression.
- **Second-Order Dynamics:**
  - Custom spring physics (`SecondOrderDynamics`) used for smooth mouse follower, focus position, and card zoom dynamics.
  - Smooth damping prevents jittery movement during high-frequency mouse movements.
- **Depth Texture Parallax:**
  - The project cards in `#home-featured` bind `home.webp` and `home_depth.webp` into a custom fragment shader.
  - Mouse coordinates offset the sample coordinates weighted by the depth value, creating realistic 3D motion parallax without requiring high-poly geometry.

---

## 3. Web Audio Spatial Sound Engine

- **Audio Stems & Sound Synthesis:**
  - 16 total OGG audio files.
  - Micro-interactions: `hover_0.ogg`, `hover_1.ogg`, `hover_2.ogg`, `click_0.ogg`, `click_1.ogg`, `focus_0.ogg`, `focus_1.ogg`, `focus_2.ogg`, `glass_broken.ogg`, `page_0.ogg`, `page_1.ogg`.
  - Ambient Soundtracks: `generic.ogg`, `cinematic_0.ogg`, `cinematic_2.ogg`, `cinematic_3.ogg`, `generic_end.ogg`.
- **Audio Lifecycle:**
  - Interactive audio unlock: Starts on user first click/tap to respect browser autoplay policies.
  - Low-pass filter modulation: Dynamically adjusts cutoff frequency based on scroll speed and modal state.

---

## 4. Single-Page Application (SPA) Routing

- **Route Manager:**
  - Intercepts clicks on internal links (`/`, `/about`, `/projects`, `/projects/*`).
  - Updates URL with `history.pushState`.
  - Fetches the target route HTML asynchronously, replaces `#page-container-inner`, updates document title, and signals the 3D stage manager to transition camera and lighting.
- **Local Fallback:**
  - Server supports both clean URL direct hits (`/about`) and client-side transitions.
