# FS 60P - The Watch Clone (60fps)

A 100% authentic, fully animated, offline clone of [https://thewatch.60fps.fr/](https://thewatch.60fps.fr/).

This clone preserves the complete interactive 3D WebGL scenes, high-precision watch geometry, EXR environment reflections, GSAP timeline choreography, dynamic color material customization, exploded mechanism disassembly, and responsive product gallery, running completely self-contained without external dependencies.

---

## Technical Highlights

- **Interactive 3D WebGL Rendering:**
  - **Full Watch GLTF 2.0 Binary Model:** `public/assets/watch-DXFPNOEl.glb` (9.0 MB) with PBR transmission, IOR, and WebP texture extensions.
  - **Secondary Model:** `public/assets/model-BhXOvGiC.glb` (209 KB).
  - **PBR Materials Config:** `public/assets/default-Bo472-CV.json` specifying roughness, metalness, and anisotropic properties.
  - **High-Dynamic-Range Environment Maps:**
    - `public/assets/envmap-kW4EmG7W.exr` (1.43 MB)
    - `public/assets/metal-B47qzO42.exr` (396 KB)
    - `public/assets/sunrise-B8ECBLua.exr` (1.45 MB)
- **GSAP 3.15.0 Timeline Choreography:**
  - Scroll-scrubbed camera orientation and smooth focal length shifts.
  - Interactive watch disassembly with real-time screen-projected pin indicators.
  - Interactive cursor guidance and state transitions.
- **Dynamic Color Material Customizer:**
  - 4 Finish palettes: Silver Steel, Deep Black, Pure Gold, Rose Gold.
  - Synchronized update of 3D materials and 20 responsive photography frames (`public/assets/the-watch/img/images-section/{first,second,third,fourth}_{1..5}.webp`).
- **Typography:**
  - Full suite of `Nekst` and `Inter` web fonts in `.woff2`, `.woff`, and `.ttf`.
- **Zero-Dependency Local Server:**
  - Native Node.js HTTP server (`server.mjs`) supporting HTTP 206 partial content range streaming, CORS headers, SPA client routing, and on-demand asset proxy cache.

---

## Quick Start

### 1. Start Local Server
```bash
npm run dev
# or
node server.mjs
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Verify Asset Integrity
```bash
npm run check
# or
node scripts/verify.mjs
```

### 3. Re-download / Sync Assets
```bash
npm run download:assets
# or
nice -n 19 python3 scripts/download-all-assets.py
```

---

## Directory Structure

```
thewatch-clone/
├── index.html                 # Main entry HTML with local asset references
├── server.mjs                 # Zero-dependency HTTP server with 206 streaming and CORS
├── package.json               # Manifest and npm scripts
├── HANDOFF.md                 # Checkpoint status & handoff documentation
├── README.md                  # Comprehensive technical documentation
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout specification
│   └── BEHAVIORS.md           # WebGL, GSAP, and material behavior details
├── public/                    # 100% self-contained static assets
│   ├── assets/                # JS bundles, CSS, 3D GLB models, EXR envmaps, and fonts
│   │   ├── fonts/             # Nekst & Inter font families
│   │   └── the-watch/         # Color variant gallery WebP images & parts
│   ├── favicon.png            # Site favicon
│   └── share-image.webp       # OpenGraph social share card
└── scripts/
    ├── download-all-assets.py # Multi-threaded asset downloader
    ├── verify.mjs             # Integrity verification tool
    ├── deep-scan.py           # Asset scanner for JS/CSS bundles
    └── audit-assets.py        # Codebase asset reference auditor
```
