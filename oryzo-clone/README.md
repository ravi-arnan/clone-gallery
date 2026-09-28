# Oryzo.ai Clone

A 100% authentic, fully animated clone of [https://oryzo.ai/](https://oryzo.ai/).

This clone preserves the complete multi-canvas 3D WebGL2 rendering pipeline, 3D Gaussian Splatting engine with WebAssembly sorting worker, binary `.buf` model meshes and camera trajectories over 49,967 px, Rive vector WebAssembly animations, HTTP Range 206 video pipelines, and custom typography, running completely offline and self-contained.

---

## Technical Highlights

- **3D WebGL2 & Gaussian Splatting Engine:**
  - 6 coordinated canvas layers including fullscreen WebGL2 context (`#canvas`).
  - 3D Gaussian Splats (`props.sog`, `table_reflection.sog`) with WebAssembly splat sorter (`splat_sorter_bg-BfJrILzx.wasm`).
  - 26 binary model buffers (`.buf`) containing coaster, hand, desk, coffee, and tardigrade geometries.
  - 40+ high-resolution PBR textures, Gobo light projections, and SMAA antialiasing.
- **Rive Vector Animation Engine:**
  - Local Rive WebAssembly engine (`rive.wasm`) driving real-time interactive vector graphics (`oryzo.riv`).
- **Rich Media & Video Pipelines:**
  - HTTP Range 206 partial streaming for showcase clips (`bite.mp4`, `yoga.mp4`).
  - Local mock handler for Vimeo oEmbed requests.
- **Typography & Brand Assets:**
  - DM Mono, Literata, MSDF Inter bitmap, and Neue Haas Grotesk webfonts loaded locally.
- **Zero External Dependencies:**
  - 147 self-contained static assets in `public/` (23.77 MB).
  - Clean console output with zero errors.

---

## Quick Start

### 1. Run Local Development Server
```bash
npm run dev
# or
node server.mjs
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

### 2. Verify System & Asset Integrity
```bash
npm run check
# or
node scripts/verify.mjs
```

### 3. Re-download or Sync Assets
```bash
npm run download:assets
# or
python3 scripts/download-all-assets.py
```

---

## Directory Structure

```
oryzo-clone/
├── index.html                 # Main localized entry HTML
├── server.mjs                 # Node.js server with HTTP range streaming & MIME resolution
├── package.json               # Scripts and manifest
├── HANDOFF.md                 # Checkpoint status & next actions
├── README.md                  # Project documentation & quick start
├── docs/
│   ├── design-references/     # Verification screenshots and original captures
│   └── research/
│       ├── PAGE_TOPOLOGY.md   # Viewport & canvas layout hierarchy
│       ├── BEHAVIORS.md       # 3D WebGL2, Gaussian Splats, and Rive behaviors
│       ├── inspection.json    # DOM, canvas, and script inspection
│       └── network-requests.json # Raw network logs
├── public/                    # 100% self-contained static assets (23.77 MB)
│   ├── _astro/                # Astro core bundles & WASM splat sorter
│   ├── splats/                # Gaussian splat models (.sog)
│   ├── models/                # Binary model buffers (.buf)
│   ├── rive/                  # Rive animations (.riv)
│   ├── libs/rive/             # Rive WASM runtime
│   ├── fonts/                 # DM Mono, Literata, MSDF Inter, Typekit
│   ├── images/                # Video clips, social cards, gallery
│   ├── textures/              # PBR textures, gobo, smaa, smoke
│   └── meta/                  # Favicons and webmanifest
└── scripts/
    ├── inspect-site.mjs       # Headless Playwright reconnaissance script
    ├── download-all-assets.py # Multi-threaded asset downloader
    ├── build-localized-html.py# HTML localizer & telemetry neutralizer
    └── verify.mjs             # Integrity, HTTP, and WebGL verification script
```

---

## Verification Summary

- **Total Critical Files Sample Checked:** 51 files
- **Total Storage Size:** 23.77 MB (147 asset files)
- **Endpoint Status:** 100% verified via HTTP with `HTTP 200 OK` and `HTTP 206 Partial Content` (0 missing files)
- **Canvases Active:** 6 canvases detected, WebGL2 context active on `#canvas`
- **Console Errors:** 0 errors
