# Page Topology & Architecture: Lusion.co

**Target:** https://lusion.co/  
**Framework:** Astro SPA Architecture with Three.js WebGL Engine, GSAP Timelines, and Web Audio API  
**Status:** 100% Cloned, Self-Contained, and Verified Locally  

---

## 1. High-Level Page Layout

The site is built as an interactive, single-page application with stage-based WebGL scene rendering overlaid with DOM elements:

```
┌─────────────────────────────────────────────────────────────┐
│ UI Overlay (#ui)                                            │
│ ├─ #header-container (Logo, Audio Mute/Play, Menu Trigger)  │
│ └─ #header-menu (Fullscreen Overlay Navigation & Newsletter)│
├─────────────────────────────────────────────────────────────┤
│ Stage / Canvas Container                                    │
│ ├─ Three.js PerspectiveCamera & WebGL2 Renderer             │
│ ├─ Postprocessing Pipeline (SMAA, Bloom, UFX, Screen Distort)│
│ └─ 3D Stages:                                               │
│    ├─ HomeHeroStage (Cross model, Matcap, Particle field)   │
│    ├─ LinesStage (4 spline lines with AO shaders)           │
│    ├─ ProjectsStage (12 WebGL depth displacement cards)     │
│    ├─ GoalTunnelStage (Astronaut, Diamond, Glass, Grids)    │
│    └─ AboutHeroStage (Terrain, Rocks, Spline, 7 Face Meshes)│
├─────────────────────────────────────────────────────────────┤
│ DOM Scroll Container (#page-container)                     │
│ ├─ Home Route (#home)                                       │
│ │  ├─ #home-hero (Hero title, studio tagline, scroll CTA)  │
│ │  ├─ #home-reel (Showreel preview, play button trigger)   │
│ │  ├─ #home-featured (12 selected interactive project items)│
│ │  ├─ #home-goal (Tunnel section, astronaut, vision text)  │
│ │  ├─ #end-section (Call to action / collaboration banner) │
│ │  └─ #footer-section (Address, socials, contacts, form)   │
│ ├─ About Route (#about)                                     │
│ │  ├─ #about-who (Studio manifesto & 7 team member faces)  │
│ │  ├─ #about-capability (Services, capability cards)       │
│ │  └─ #about-clients (Clients list and awards)             │
│ └─ Projects Route (#projects & #projects/<id>)              │
│    ├─ Portfolio archive grid                               │
│    └─ Rich media project detail showcase (12 projects)     │
├─────────────────────────────────────────────────────────────┤
│ Modal & Preloader Overlays                                  │
│ ├─ #preloader (3D numeric counter digits 0-100%)            │
│ ├─ #video-overlay (Custom video player modal & cursor)      │
│ └─ #scroll-indicator (Vertical progress bar)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Interactive Sections & Components

### A. Header Navigation (`#header-container` & `#header-menu`)
- **Logo:** Vector branding with hover audio click triggers.
- **Audio Toggle:** Audio synthesizer engine with real-time sound mute/unmute state.
- **Full Menu:** Slide-down fullscreen menu with split-text clones, newsletter input, and labs link.

### B. Home Hero Section (`#home-hero`)
- **3D Elements:** `cross.buf` / `cross_ld.buf` loaded into floating space.
- **Lighting & Shaders:** `matcap.exr` / `matcap_ld.exr` environment mapping.
- **Interaction:** Dynamic mouse parallax and smooth scroll response.

### C. Showreel Section (`#home-reel`)
- **3D Elements:** `line_reel.buf` animated along spline trajectory.
- **Interaction:** Watch Showreel button triggers `#video-overlay` modal with custom controls.

### D. Featured Projects (`#home-featured`)
- **12 Interactive Cards:** `oryzo_ai`, `atlas_motion`, `devin_ai`, `of_the_oak`, `everswap`, `porsche_dream_machine`, `synthetic_human`, `spatial_fusion`, `spaace`, `ddd_2024`, `choo_choo_world`, `soda_experience`.
- **WebGL Depth Mapping:** Each card uses `home.webp` (diffuse) and `home_depth.webp` (displacement depth map) for mouse-following 2.5D tilt and parallax distortion.

### E. Goal Tunnel (`#home-goal`)
- **3D Assets:** Procedural grid (`grid_base_hd.buf`, `grid_structure_hd.buf`, `greeble_*.webp`), floating astronaut (`astronaut_helmet.buf`, `astronaut_wearpack.buf`, etc.), broken glass fragments (`broken_glass.buf`), and animated diamond (`diamond.buf`).
- **Camera:** Dynamic camera dolly and spline flight through the dark tunnel.

### F. About Page & Team Faces (`#about-who`)
- **Volumetric Terrain:** `about/terrain.buf` and `about/terrain_lines.buf`.
- **Procedural Rocks:** 4 rock variations with low/high LODs and rotation animation buffers.
- **Team Morphing:** 7 3D particle face models (`edan.buf`, `ffi.buf`, `pierre.buf`, `yannic.buf`, `paul.buf`, `andrii.buf`, `sunny.buf`) driven by `AboutHeroFaces` particle simulation.
