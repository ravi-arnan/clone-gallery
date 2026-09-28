# Messenger Abeto Clone

A 100% authentic, fully animated clone of [https://messenger.abeto.co/](https://messenger.abeto.co/).

This clone preserves the complete interactive 3D WebGL stylized miniature planet, spherical gravity physics, customizable character delivery messenger, animated NPC dialogue quests, multi-layered spatial audio soundscape, 3D emoji drawer, and background Web Worker parallel decompression pipeline, running completely offline and self-contained.

---

## Highlights & Technical Architecture

- **Rendering Engine:** WebGL / Three.js with custom GLSL shaders, vertex skinning, radial spherical gravity, and ACES tone mapping.
- **3D World & Spherical Planet Simulation:**
  - Full chunked planet surface with 10 terrain regions (`full_0.drc` to `full_9.drc`) across 4 Level-of-Detail (LOD) tiers (`full-lod-1`, `full-lod-2`, `full-lod-3`).
  - 5 spherical collision hitmeshes (`hitmesh_0.drc` to `hitmesh_4.drc`) processed in a dedicated Web Worker thread.
  - Procedural and instanced nature systems:
    - 5 tree foliage chunks (`tree-leaves_0.drc` to `tree-leaves_4.drc`) with wind-sway shaders.
    - Animated grass blades (`grass.drc`, `grass-blades-highq.ktx2`).
    - Flocks of butterflies (`butterflies.drc`) and flying birds on 3D curves (`birds/1.drc`, `birds/2.drc`, `curve-1.drc`).
    - Real-time animated water, waterfalls, splashes, and beach foam VFX.
    - Volumetric clouds and background galaxy dust particles (`galaxy.ktx2`).
- **Playable Character & Customization:**
  - Skinned messenger character with skeletal bone rig (`avatar-bones.drc`).
  - Smooth animation blending across 8 distinct motion clips (idle, run, sprint, air, jump-start, jump-land, AFK loops).
  - Modular wardrobe customizer with interchangeable items:
    - 7 Hair styles (`hair1` to `hair7`)
    - 9 Tops (`top1` to `top9`)
    - 7 Bottoms (`bottom1` to `bottom7`)
    - 7 Shoes (`shoes1` to `shoes7`)
- **17 Interactive NPCs & Quest Deliveries:**
  - Unique stylized characters across the planet (Alien, Boss, Caveman, Chef, Diver, Factory Workers A/B/C, Scientists, Mountainman, Musician, Office Worker, Old Woman, Owl, Scout, Three-kid, Young Lady).
  - Quest items: Clothes, wet letter, note, sacred offering, postcard, and sample box.
- **Web Worker Parallel Pipeline (Zero Stutter):**
  - `dracoworker`: Decompresses Draco 3D geometry buffers in background threads using `draco_decoder.wasm`.
  - `bitmapworker`: Asynchronously decodes KTX2, PNG, and AVIF textures.
  - `collisionworker`: High-frequency spherical character raycasts and collision hull evaluations.
  - `geometryworker`: Precomputes vertex normals and tangents.
  - `glyphworker`: Renders vector typography and UI iconography via `glyph.wasm`.
- **Rich Spatial Soundscape (54 Audio Assets):**
  - Seamless spatial cross-fading across regional ambiances (Base Village, Factory, Forest, City, Beach, Waterfalls, Temple).
  - High-definition polyphonic soundtrack (`bgmusic-highq.ogg`) and interactive bard accompaniment.
  - Character footsteps (land vs water), jumping, speech voice snippets, and UI interaction audio.
- **Zero External Runtime Dependencies:** Runs 100% locally with all assets served locally.

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
nice -n 19 python3 scripts/download-assets.py
```

---

## Directory Structure

```
abeto-messenger-clone/
├── index.html                 # Main entry HTML with local asset references
├── server.mjs                 # High-performance server with HTTP range streaming, CORS, and MIME support
├── package.json               # Scripts and manifest
├── HANDOFF.md                 # Checkpoint status & handoff
├── README.md                  # Technical documentation & quick start
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout
│   └── BEHAVIORS.md           # WebGL, physics, workers, and audio behaviors
├── public/                    # 100% self-contained static assets
│   └── assets/                # 3D DRC, KTX2, WASM, Web Workers, fonts, icons, audio
└── scripts/
    ├── download-assets.py     # Multi-threaded asset downloader
    └── verify.mjs             # Integrity verification script
```

---

## Verification Summary
- **Total Downloaded Assets:** 360 files (~29 MB)
- **Total 3D Geometries (.drc):** 160 meshes
- **Total Audio Tracks (.ogg):** 54 sound files
- **Total Textures (.ktx2, .png, .avif):** 23 files
- **Web Workers & WASM Modules:** 8 workers + 6 WASM/transcoder libs
- **Endpoint Status:** 100% verified via HTTP with `HTTP 200 OK` (0 errors, 0 missing).
