# Lusion Creative Studio Clone

A 100% authentic, fully animated clone of [https://lusion.co/](https://lusion.co/).

This clone preserves the complete interactive 3D WebGL experience, physics simulations, GSAP timeline animations, and spatial Web Audio engine, running completely offline and self-contained.

---

## Highlights & Technical Architecture

- **Rendering Engine:** WebGL2 / Three.js with custom GLSL shaders (bloom, SMAA, screen distortion, volumetric fog).
- **3D Geometry Buffers:** 56 binary buffer models (`.buf`) covering the interactive floating cross, spline lines, particle terrain, procedural rock formations with LODs, and deep space tunnel with astronaut suit components.
- **2.5D Depth Displacement Cards:** 12 interactive project showcase cards using depth maps (`home_depth.webp`) for realistic mouse-responsive depth parallax.
- **Spatial Web Audio API:** 16 interactive OGG audio stems (UI micro-interactions, low-pass filter modulation, ambient and cinematic music).
- **Face Particle Simulation:** 7 3D particle face models for the team section (`edan.buf`, `ffi.buf`, etc.) with real-time morphing shaders.
- **Typography:** Aeonik, IBM Plex Mono, and custom Lusion Mono web fonts.
- **Rich Media Showcase:** 31 showcase videos (`.mp4`) covering desktop and mobile viewport configurations across all 12 featured studio projects.
- **Zero External Runtime Dependencies:** Runs 100% offline with zero CDN dependencies for assets.

---

## Quick Start

### 1. Run Local Dev Server
```bash
npm run dev
# or
node server.mjs
```
Open `http://localhost:3001` in your browser.

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
lusion-clone/
├── index.html                 # Main entry HTML
├── server.mjs                 # High-performance server with HTTP range streaming, CORS, and MIME support
├── package.json               # Scripts and manifest
├── HANDOFF.md                 # Checkpoint status & handoff
├── README.md                  # Technical documentation & quick start
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout
│   └── BEHAVIORS.md           # WebGL, GSAP, and audio behaviors
└── scripts/
    ├── download-assets.py     # Multi-threaded asset downloader
    └── verify.mjs             # Integrity verification script
```

---

## Verification Summary
- **Total Assets:** 376 files
- **Total Storage Size:** 143.52 MB
- **Endpoint Status:** All 376 local assets verified via HTTP HEAD with `HTTP 200 OK` (0 errors, 0 missing).
