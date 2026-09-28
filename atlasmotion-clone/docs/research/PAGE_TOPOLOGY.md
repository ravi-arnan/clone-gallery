# Page Topology & Architecture: Atlas Motion Systems

**Target:** https://atlasmotion.com/  
**Framework:** Astro SPA Architecture with Three.js WebGL Engine, GSAP Timelines, and Binary Buffer Geometries (.buf)  
**Status:** 100% Cloned, Self-Contained, and Verified Locally  

---

## 1. High-Level Page Layout

Atlas Motion Systems utilizes an interactive single-page application structure featuring stage-based WebGL scene rendering, 3D binary geometries, procedural terrain and clouds, exploded mechanical motor animations, and an SVG character flipper text system:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ UI Overlay (#ui)                                                        │
│ ├─ #site-header (Vector Logo, Process/Thesis/Writing/Contact, CTA)     │
│ ├─ #site-mobile-menu (Responsive Fullscreen Navigation Overlay)         │
│ ├─ #background-grid (Interactive Canvas with Procedural Grid/Markers)   │
│ └─ #background-grid-ref (Viewport Grid Alignment Guides)               │
├─────────────────────────────────────────────────────────────────────────┤
│ WebGL 3D Canvas (#canvas)                                               │
│ ├─ Three.js PerspectiveCamera & WebGL2 Hardware Context                 │
│ ├─ Postprocessing Pipeline (SMAA, Bloom, Specular, Depth Buffers)       │
│ └─ 3D Stages:                                                           │
│    ├─ HeroStage (Volumetric Clouds, Terrain Heightmap, Brush Texture)   │
│    ├─ DroneStage (DRONE_BASE.buf, DRONE_BLADE.buf, MOUNTAIN_FG.buf)     │
│    ├─ EngineStage (11 JDM Part Meshes, ENGINE_ANIMATION.buf Splines)    │
│    ├─ GalleryStage (6 Project Textures with 3D Displacement)            │
│    └─ RobotStage (ROBOT.webp, ROBOT_2.png Volumetric Render)            │
├─────────────────────────────────────────────────────────────────────────┤
│ DOM Scroll Container (#site-content / #pages-container)                 │
│ ├─ Home Route (#home)                                                   │
│ │  ├─ #home-hero (Hero video background, typography, scroll indicator) │
│ │  ├─ #home-intro (Mission statement banner)                            │
│ │  ├─ #home-drone (Drone 3D fly-in scene & supply-chain thesis)         │
│ │  ├─ #home-motor (Exploded motor 3D animation, JDM parts 01-04)        │
│ │  ├─ #home-thesis (Thesis teaser with desktop/mobile picture layers)   │
│ │  ├─ #home-gallery (Interactive 3D project showcase)                   │
│ │  ├─ #home-spec (Extreme specs: Ingress, Precision, Ally Scale)       │
│ │  ├─ #home-build-to-spec (Call to Action / Partner onboarding)        │
│ │  └─ #site-footer (Directory links, emails, legal, copyright 2026)     │
│ ├─ Thesis Route (/thesis)                                               │
│ ├─ Writing Archive Route (/writing)                                     │
│ ├─ Writing Article Route (/writing/atlas-testing)                       │
│ ├─ Contact Route (/contact)                                             │
│ └─ Order Storefront Route (/order)                                      │
├─────────────────────────────────────────────────────────────────────────┤
│ Overlays & Indicators                                                   │
│ ├─ #preloader (#preloader-canvas + brand typography)                    │
│ ├─ #scroll-indicator (#scroll-indicator__bar vertical progress)        │
│ └─ #video-overlay (Vimeo modal & local video fallback player)           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Interactive Sections & Components

### A. Header Navigation (`#site-header` & `#site-mobile-menu`)
- **Branding:** Vector SVG logo with `#logo-with-text` symbol reference.
- **Flipper Text Links:** Interactive character flipper links (`.is-flipper`) powered by GSAP `SplitText`.
- **CTA:** "Order Now" quick-action link with border outline styling.

### B. Background Grid Canvas (`#background-grid`)
- **Rendering:** Dedicated 2D canvas drawing dynamic coordinate grid lines, crosshairs, and ticks.
- **Responsiveness:** Auto-scales with device pixel ratio and tracks scroll delta.

### C. Home Hero Section (`#home-hero`)
- **Video Player:** Autoplaying HTML5 video (`/videos/video.mp4` / `video_MOBILE.mp4`) with lazy fallback poster.
- **Typography:** Staggered headline reveal: "The physical layer of autonomy".

### D. 3D Drone Flight Scene (`#home-drone`)
- **3D Assets:** `DRONE_BASE.buf` (main quadcopter chassis), `DRONE_BLADE.buf` (4 rotating prop meshes), and `MOUNTAIN_FG.buf` (foreground mountain ridge).
- **Parallax & Volumetrics:** `hero/CLOUD_A.webp`, `hero/CLOUD_B.webp`, `hero/CLOUD_C.webp`, and `hero/CLOUD_ALPHAS.webp`.

### E. 3D Motor Exploded Process Scene (`#home-motor`)
- **11 Modular Geometry Buffers:**
  - `JDM_part_01.buf` - `JDM_part_05.buf`
  - `JDM_part_06_a.buf` & `JDM_part_06_b.buf`
  - `JDM_part_07.buf` - `JDM_part_11.buf`
- **Timeline Spline Animation:** `ENGINE_ANIMATION.buf` driving smooth parts separation and reassembly across steps 01 to 04 ("Integrate", "Evaluate", "Manufacture", "Innovate").

### F. 3D Showcase Gallery (`#home-gallery`)
- **Textures:** `gallery/1.webp` through `gallery/6.webp`.
- **Thumbnails:** Fast preloaded thumbnails `1_THUMBNAIL.webp` through `6_THUMBNAIL.webp`.

### G. Subroutes & Storefront
- **/thesis:** Full manifest on the physical layer of autonomy.
- **/writing/atlas-testing:** Complete technical paper with interactive SVG charts (`thrust-over-time.svg`, `propulsion-system.svg`).
- **/order:** Storefront interface with technical specs and photos for Atlas motor lines (2207, 3115, 4112).
