# Behaviors & Animation Specification — Shopify Editions Winter 2026

## 1. Interaction Model Overview

The site combines:
1. **Continuous Scroll-Scrubbed 3D Background:** Driven by Three.js + Theatre.js. As the user scrolls vertically, each section triggers a specific Theatre.js Sheet Sequence. The virtual camera flies through 3D space with spline-interpolated position, rotation, and focal length.
2. **Interactive Rive Vector Animations:** 27 Rive `.riv` state machines embedded inside feature cards. These react directly to cursor movement, clicks, and hover states with real-time vector bone rigging and state machine transitions.
3. **Dynamic Post-Processing Pipeline:** Three.js effect composer running Sobel edge detection, inverted luminance fade, depth-of-field bloom, and particle lighting.
4. **GSAP & Smooth Scrolling:** Lenis / GSAP timeline choreography driving DOM card reveals, staggered heading typography fades, and pill button layout transitions.

---

## 2. 3D WebGL Engine & Theatre.js Sequences

- **Rendering Stack:** WebGL2 with Three.js (r160+) wrapped in custom Oxygen React components.
- **Scene State Management:** Each scene loads a dedicated `.theatre-project-state.json` file specifying:
  - Object positions `[x, y, z]`
  - Quaternion rotations
  - Scale transforms
  - Camera FOV and target lookAt vectors
  - Light intensities and color RGB vectors
- **Sobel Shader Effect:**
  - Fragments pass through an inverted Sobel filter with dynamic center falloff:
    `float dist = length((uv - uInvertedSobelFadeCenter) * uResolution);`
  - Creates the signature Shopify Editions pencil-sketch / architectural rendering aesthetic blending into photorealistic 3D shading.
- **Dynamic Particle Systems:**
  - Floating dust motes and glowing stars in the Sidekick and Hero scenes.
  - Instanced butterfly geometry (`Butterflies-DLjrCfBq.js`) animating wing-flaps via vertex shader sine wave deformation.

---

## 3. Rive Vector State Machines

The site features 27 custom Rive animations (`.riv`) across major feature highlights:
- `apps_1_12_16.riv`, `apps_2_12_9_v2.riv`, `apps_3_12_9_v2.riv`, `apps_4_12_9.riv`, `apps_5_12_9_v2.riv`: App Store and Extensibility interactive components.
- `chatgpt_12_10_v5.riv`: AI natural language prompt interface.
- `dev_dash_12_8.riv`: Developer dashboard real-time data viz.
- `flow_12_9.riv`: Shopify Flow trigger-action node simulation.
- `pulse_12_10.riv`: Store activity radar pulse.
- `rollouts_12_9_v2.riv`: Phased feature rollout progress indicator.
- `sim_gym_12_9.riv`: AI agent training simulation graphic.
- `themes_12_9_v9.riv`: Dynamic liquid theme customization preview.

All `.riv` files run with the official Rive Web runtime via Canvas element.

---

## 4. Navigation & DOM Micro-Interactions

- **Sticky Frosted Header:**
  - Blur: `backdrop-filter: blur(16px)`
  - Active section indicator underlines current section based on IntersectionObserver entry.
  - Quick-search modal with hotkey `⌘K` or `/`.
- **Feature Cards:**
  - Card hover triggers 3D tilt effect via CSS perspective `transform: rotateX(...) rotateY(...)`.
  - Nested badges illuminate with gradient border animation.
- **Drawer Overlays:**
  - Cart drawer slides from right with spring physics.
  - Key redemption popup triggers 3D key model spinning animation with gold particle fountain (`CoinRain-HBhd1OxE.js`).
