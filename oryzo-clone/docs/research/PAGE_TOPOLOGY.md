# Oryzo.ai Clone: Page Topology

Target Site: [https://oryzo.ai/](https://oryzo.ai/)  
Clone Location: `/home/ravi/Projects/clone-gallery/oryzo-clone`

---

## 1. Viewport & Canvas Layout

Oryzo employs an advanced multi-canvas composition architecture where 6 specialized canvas layers coordinate real-time 3D WebGL2 rendering, Gaussian Splatting, WebAssembly sorting, Rive vector animations, and 2D canvas curves across a 49,967 px vertical layout:

```
[Viewport 1440x900]
  ├── [Canvas 0: #canvas] Fullscreen WebGL2 3D & Gaussian Splatting Canvas (1440x900)
  │     ├── 3D Gaussian Splats (`/splats/props.sog`, `/splats/table_reflection.sog`)
  │     ├── WebAssembly Splat Sorter worker (`_astro/splat_sorter_bg-BfJrILzx.wasm`, `_astro/SplatsWorker-DSMxtdkh.js`)
  │     ├── Binary 3D Mesh Buffers (`.buf` format):
  │     │     ├── Coaster & Flip animations (`coaster.buf`, `coaster_hero_animation.buf`, `COASTER_FLIP_ANIM.buf`)
  │     │     ├── AI Hand & Animation (`hand.buf`, `hand_animation.buf`)
  │     │     ├── Table & Props (`DESK.buf`, `PINBOARD.buf`, `WALL.buf`, `water_bear.buf`, `TRAY_COVERS.buf`)
  │     │     ├── Coffee & Accessories (`COFFEE_BEAN.buf`, `CUP.buf`, `COVER.buf`, `LABEL.buf`)
  │     │     ├── Camera trajectories (`hero_camera.buf`, `stack_camera.buf`, `CAMERA_ANIM.buf`)
  │     │     └── Sustainability text 3D geometry (`sustainability_text.buf`, `sustainability_text_outline.buf`)
  │     └── 40+ PBR Materials & Shaders (BaseColor, Metallic, Roughness, Normal, Gobo textures)
  ├── [Canvas 1: #wearable-main-canvas] Wearable 2D Interactive Canvas
  │     └── Dynamic interactive wearable preview layer
  ├── [Canvas 2: #features-curve-canvas] Features Curve Vector Canvas (1440x900)
  │     └── Real-time Bézier spline curves and connecting indicators
  ├── [Canvas 3: #sustainability-rive-canvas-harvesting] Rive Animation Canvas
  │     └── WebAssembly Rive runtime (`/libs/rive/rive.wasm`, `/rive/oryzo.riv`)
  ├── [Canvas 4: #sustainability-rive-canvas-text] Rive Typography Canvas
  │     └── Synchronized Rive vector typography
  ├── [Canvas 5: #preloader-canvas] Preloader Canvas (1440x900)
  │     └── Preloader rendering and scene initialization transition
  └── [DOM Layer] Astro Pre-rendered Semantic Content (49,967 px)
        ├── Fixed Site Header with SVG logo, flipper navigation, and mobile menu
        ├── Hero Chapter ("Oryzo-1 Model", "A physical product reimagined for the AI era")
        ├── Features Chapter (Microscopic Tardigrade/water bear analysis, desk items)
        ├── Wearable Product Showcase (Interactive gallery, video clips `bite.mp4`, `yoga.mp4`)
        ├── Product Comparison Grid
        ├── Open Weight Model Article & BibTeX citation
        └── Footer with Lusion identity and newsletter form
```

---

## 2. Media & Asset Mapping

- **3D Gaussian Splats:**
  - `/splats/props.sog` (3.02 MB)
  - `/splats/table_reflection.sog` (475 KB)
  - `/astro/splat_sorter_bg-BfJrILzx.wasm` (37.6 KB)
- **Binary 3D Model Buffers (`.buf`):**
  - 26 binary model buffers in `/models/`
- **Rive Runtime:**
  - `/rive/oryzo.riv` (57.8 KB vector model)
  - `/libs/rive/rive.wasm` (1.77 MB Rive runtime)
- **Typography:**
  - `DM-Mono-400-Latin.woff2`, `Literata.woff2`
  - MSDF Inter font bitmap (`/fonts/msdf/Inter.webp`, `Inter.json`)
  - Neue Haas Grotesk webfonts in `/fonts/typekit/`
- **Videos:**
  - `/images/wearable-gallery/bite.mp4` (2.5 MB)
  - `/images/wearable-gallery/yoga.mp4` (3.7 MB)
