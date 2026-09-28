# StringTune Clone: Page Topology

Target Site: [https://string-tune.fiddle.digital/](https://string-tune.fiddle.digital/)  
Clone Location: `/home/ravi/Projects/clone-gallery/string-tune-clone`

---

## 1. Viewport & Canvas Layout

StringTune employs a multi-canvas 3D WebGL2 architecture orchestrating interactive 3D models (Katana & Wakizashi), custom GLSL shaders, and GSAP ScrollTrigger animations across an extensive vertical interactive narrative:

```
[Viewport 1440x900]
  ├── [Canvas 0] 1x1 WebGL2 Offscreen / Utility Context
  ├── [Canvas 1] 1440x900 WebGL2 Hero 3D Stage (z-index: 1)
  │     ├── Interactive 3D Katana & Wakizashi mesh models (`/models/katana.glb`, `/models/Wakizashi.glb`)
  │     ├── PBR metallic, roughness, and normal texture mapping (`/models/k_txts/`)
  │     ├── HDR Radiance environment mapping (`/models/lightroom.exr`)
  │     └── Draco WASM geometry compression (`/libs/draco/`)
  ├── [Canvas 2] 1440x900 WebGL2 Mid-section Feature Scene (Top: ~18,484 px)
  │     └── Interactive 3D blade transforms, particles, and scroll dynamics
  ├── [Canvas 3] 1440x900 WebGL2 Blade Stage (Top: ~22,444 px)
  │     └── Dynamic perspective rotation and lighting orchestration
  ├── [Canvas 4] 387x41 WebGL2 Specialized Element Canvas (Top: ~23,670 px)
  ├── [Canvas 5] 1440x291 WebGL2 Wavy Bend Top Wave Canvas (`.wavy-bend__canvas`, Top: ~24,298 px)
  │     └── Real-time sinusoidal vertex/fragment grid wave distortion
  ├── [Canvas 6] 1178x193 WebGL2 Technique Display Canvas (Top: ~25,069 px)
  ├── [Canvas 7] 1440x291 WebGL2 Wavy Bend Bottom Wave Canvas (`.wavy-bend__canvas`, Top: ~27,045 px)
  │     └── Sine-wave ribbon and grid distortion
  └── [DOM Layer] Nuxt 3 Pre-rendered & Hydrated Semantic Content
        ├── Header with interactive status and package triggers
        ├── Hero Title: "STRING TUNE - MASTER THE STRINGS OF THE WEB"
        ├── Katana 3D interactive stage with model toggles (Katana / Wakizashi)
        ├── Dynamic Monologue, character avatars, and 8-bit sprites (Aika & Sensei Oji)
        ├── Storm atmosphere graphics (`storm.jpg`, `storm-graphics-*.jpg`)
        ├── Bamboo parallax layers (`bamboo-1.png` - `bamboo-4.png`, `tree.png`)
        ├── Masonry showcase cards (`fidoru.jpg`, `control-progress.jpg`, `ultra-optimized.jpg`)
        ├── Interactive video showcase (`slash.mp4`, `skill-hub-link.mp4`, `container.mp4`, `ripple.mp4`)
        ├── Interactive tutorial library (16 chapter video modules)
        └── Footer with polygon graphic backdrop and interactive links
```

---

## 2. Media & Asset Mapping

- **3D Geometry & Textures:**
  - `/models/katana.glb` (681.8 KB)
  - `/models/Wakizashi.glb` (172.5 KB)
  - `/models/lightroom.exr` (765.9 KB Radiance Environment Map)
  - 10 PBR texture maps in `/models/k_txts/` (BaseColor, Height, Metallic, Normal, Roughness)
- **Geometry Compression Engine:**
  - `/libs/draco/draco_decoder.wasm` (279.0 KB)
  - `/libs/draco/draco_wasm_wrapper.js` (57.4 KB)
  - `/libs/draco/draco_decoder.js` (702.5 KB)
- **Video Showcases & Tutorials:**
  - Hero & Core: `/videos/slash.mp4`, `/videos/skill-hub-link.mp4`, `/videos/container.mp4`, `/videos/ripple.mp4`
  - Presentation: `/videos/dev-guides/stdg-presentation.mp4`
  - Tutorials: 16 basics modules (`/videos/tutorials/basics/01.mp4` - `16.mp4`), layouts, typography, and specials
- **Typography:**
  - KHTeka Regular & Mono (`KHTeka-Regular.woff2`, `KHTekaMono-Regular.woff2`)
  - FDSI symbol font family (`fdsi.woff`, `fdsi.ttf`, `fdsi.svg`, `fdsi.eot`)
- **Atmosphere & Visual Art:**
  - High-res bamboo silhouettes, storm art, polygon backgrounds, and 8-bit sprite sheets
