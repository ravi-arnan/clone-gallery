# Pear Clone: Page Topology

Target Site: [https://pear.no/](https://pear.no/)  
Clone Location: `/home/ravi/Projects/clone-gallery/pear-clone` (symlinked at `/home/ravi/Projects/pear-clone`)

---

## 1. Viewport & Canvas Layout

Pear utilizes a high-precision multi-canvas composition architecture where 5 distinct HTML5 canvas elements interact with DOM content over a 48,150 px vertical layout:

```
[Viewport 1440x900]
  ├── [Canvas 0: .gl] Fullscreen WebGL 3D Volumetric Canvas (z-index: 1)
  │     ├── Interactive 3D Golden Pear reconstruction
  │     ├── Multi-tier volumetric model layers (renaissance, v28, v51, v61)
  │     └── GLSL fragment shaders (specular lighting, diffuse shading, depth mapping)
  ├── [Canvas 1: .fly] Flying Particle & Debris 2D Canvas (z-index: 2)
  │     └── Volumetric atmosphere particles and dynamic depth layers
  ├── [Canvas 2: .trans] Morphing Transition WebGL2 Canvas (z-index: 3)
  │     └── Sectional spatial warping between chapters
  ├── [Canvas 3: .ftx] Film & Texture WebGL2 Canvas (z-index: 4)
  │     └── Real-time video-to-texture compositing
  ├── [Canvas 4: .lines] Geometric Vector Wireframe Canvas (z-index: 5)
  │     └── Data-driven connecting lines, metrics, and radar rings
  └── [DOM Layer] Semantic Content (z-index: 10, Height: 48,150 px)
        ├── Hero Title: "Not an agency on the clock, a partner in the upside"
        ├── The Philosophy & Model Section
        ├── Video Reveal Showcase (signal, colossus, reveal, footer-loop)
        ├── Client Proof, Numbers, and Interactive Metric Cards
        ├── FAQ Accordion
        └── Closing CTA & Neoclassical Artwork Pedestal
```

---

## 2. Media & Asset Mapping

- **Core Film Sequences:**
  - `/films/coda/`: 89 frames
  - `/films/flysky/`: 121 frames
  - `/films/plan/`: 121 frames
  - `/films/trans/`: 121 frames
  - `/films/tree/`: 121 frames
  - `/films/model/renaissance/1440`: 362 frames
  - `/films/model/v28/1440`: 121 frames
  - `/films/model/v51/1440`: 121 frames
  - `/films/model/v61/1440`: 121 frames
- **Showcase Videos:**
  - `/films/footer-loop.mp4` (7.55 MB)
  - `/films/reveal.mp4` (13.71 MB)
  - `/films/signal.mp4` (11.28 MB)
  - `/films/colossus.mp4` (5.60 MB)
- **Typography:**
  - GT Standard & Flecha custom webfont families
