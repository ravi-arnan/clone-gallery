# Atlas Motion Systems Clone

A 100% authentic, fully animated clone of [https://atlasmotion.com/](https://atlasmotion.com/).

This clone preserves the complete interactive 3D WebGL engine, binary buffer geometry simulations, GSAP mechanical timeline animations, dynamic background grid canvas, character flipper text animations, and video showcase, running completely offline and self-contained.

---

## Highlights & Technical Architecture

- **Rendering Engine:** WebGL2 / Three.js with custom GLSL shaders (convolutional bloom, SMAA antialiasing, specular reflectance, and depth buffers).
- **16 3D Geometry Buffers (.buf):**
  - Quadcopter drone chassis (`DRONE_BASE.buf`) and 4 spinning blades (`DRONE_BLADE.buf`).
  - Foreground mountain ridge (`MOUNTAIN_FG.buf`).
  - Spline camera animation path (`CAMERA.buf`).
  - Exploded motor assembly with 11 individual parts (`JDM_part_01.buf` through `JDM_part_11.buf`).
  - Engine assembly spline timeline (`ENGINE_ANIMATION.buf`).
- **Textures & Volumetrics:**
  - Volumetric cloud layers (`hero/CLOUD_A.webp`, `CLOUD_B.webp`, `CLOUD_C.webp`, `CLOUD_ALPHAS.webp`).
  - Procedural terrain heightmap (`TERRAIN/HEIGHT.webp`) and base backdrop (`hero/BASE.webp`).
  - Robot inspection renders (`ROBOT/ROBOT.webp`, `ROBOT/ROBOT_2.png`).
  - Post-processing buffers (`smaa-search.png`, `smaa-area.png`, `specular.png`, `diffuse.png`, `brdf.png`, `LDR_RGB1_0.png`).
- **Typography & Brand Design:**
  - Suisse Intl web fonts (`SuisseIntl.woff`, `SuisseIntl-Book.woff`, `SuisseIntl-Medium.woff`).
  - GSAP `SplitText` interactive character rolling flippers (`.is-flipper`).
- **Rich Media Showcase:**
  - Autoplaying HTML5 showcase videos (`/videos/video.mp4` and `/videos/video_MOBILE.mp4`) with HTTP Range streaming support.
- **Single-Page Application (SPA) Navigation:**
  - Seamless route transitions across `/`, `/thesis`, `/writing`, `/writing/atlas-testing`, `/contact`, and `/order`.
- **Zero External Dependencies:** Runs 100% locally with zero CDN dependencies for runtime assets.

---

## Quick Start

### 1. Run Local Dev Server
```bash
npm run dev
# or
node server.mjs
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

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
python3 scripts/download-assets.py
```

---

## Directory Structure

```
atlasmotion-clone/
├── index.html                 # Main entry HTML
├── server.mjs                 # High-performance server with HTTP range streaming, CORS, and MIME support
├── package.json               # Scripts and manifest
├── HANDOFF.md                 # Checkpoint status & handoff
├── README.md                  # Technical documentation & quick start
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout
│   └── BEHAVIORS.md           # WebGL, GSAP, and timeline behaviors
├── public/                    # 100% self-contained static assets
│   ├── _astro/                # Core JS and CSS bundles
│   ├── models/                # 16 binary buffer 3D models (.buf)
│   ├── textures/              # 24 textures (hero, gallery, robot, terrain)
│   ├── fonts/                 # Suisse Intl web fonts
│   ├── videos/                # Autoplay showcase videos (.mp4)
│   ├── images/                # Fallback posters, thumbnails, and SVGs
│   └── meta/                  # Favicons and webmanifest
└── scripts/
    ├── download-assets.py     # Multi-threaded asset downloader
    └── verify.mjs             # Integrity verification script
```

---

## Verification Summary
- **Total Critical Files:** 85 files
- **Total Storage Size:** 27.32 MB
- **Endpoint Status:** 100% verified via HTTP with `HTTP 200 OK` (0 errors, 0 missing).
