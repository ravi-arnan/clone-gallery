# Igloo Inc. Clone

A 100% authentic, fully animated WebGL 3D clone of [https://www.igloo.inc/](https://www.igloo.inc/).

This clone is not a static screenshot or simplified CSS mock. It preserves the complete interactive 3D WebGL experience:
- 16 Draco 3D geometries (`.drc`), including the interactive 3D igloo with wireframe entrance cage, exploding segments, terrain, and floating rings.
- 35 GPU-compressed KTX2/Basis textures, EXR environment maps, and volumetric noise fields.
- Over 130 GSAP timeline animations controlling camera movements, mesh visibility transitions, wireframe fades, and particle systems.
- Complete spatial Web Audio engine with 18 audio stems and dedicated Web Worker.
- Multi-channel Signed Distance Field (MSDF) 3D typography using IBM Plex Mono.
- WebAssembly decoders for Google Draco and Basis Universal transcoders.
- Zero external runtime dependencies for assets (runs completely offline and self-contained).

---

## Quick Start

### 1. Run Local Dev Server
```bash
npm run dev
# or
node server.mjs
```
The server will start at `http://localhost:3001` (or custom `PORT=...`).

### 2. Verify Assets Integrity
```bash
npm run check
# or
node scripts/verify.mjs
```

### 3. Re-download / Sync Assets
```bash
npm run download:assets
```

---

## Technical Stack & Architecture
- **Rendering Engine:** WebGL / Three.js
- **Animation Orchestration:** GSAP (GreenSock Animation Platform)
- **3D Compression:** Google Draco 3D Geometry (.drc)
- **Texture Compression:** KTX2 (Khronos Texture) + Basis Universal Transcoder (WASM)
- **Background Multithreading:** Web Workers (`audioworker`, `bitmapworker`, `exrworker`, `msdfworker`)
- **Typography:** MSDF 3D Font Geometry (`IBMPlexMono-Medium`) + WOFF2 Web Fonts
- **Audio Pipeline:** Web Audio API with range-streaming support

---

## Directory Structure
```
igloo-clone/
├── index.html                 # Main entry HTML
├── server.mjs                 # Lightweight high-performance dev server with full MIME type support
├── package.json               # Project manifest and scripts
├── public/
│   ├── index.html             # Public entry file
│   └── assets/
│       ├── index-2eb69c09.js  # Bootstrapper, CSS, and ASCII loader
│       ├── App3D-f554a111.js  # Three.js + GSAP 3D application logic
│       ├── audio/             # 18 OGG audio stems
│       ├── geometries/        # 16 Draco .drc 3D models
│       ├── images/            # 35 KTX2, EXR, and PNG textures
│       ├── fonts/             # MSDF font JSON and data textures
│       └── libs/              # Draco and Basis WASM decoders
├── docs/
│   └── research/              # Topology, asset inventory, and architecture specs
└── scripts/
    ├── download-igloo-assets.py # Complete asset downloader
    └── verify.mjs             # Integrity verification script
```
