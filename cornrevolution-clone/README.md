# Pioneer – Corn. Revolutionized. (Clone)

A 100% authentic, fully animated, offline clone of [https://cornrevolution.resn.global/](https://cornrevolution.resn.global/) by Resn.

This clone preserves all interactive 3D WebGL scenes (Three.js), rigged plant armatures, instanced field rendering, Traer particle physics, MSDF typography, GSAP timeline animations, spritesheets, and GPU-compressed KTX textures (S3TC, ASTC, and PVRTC), running completely self-contained without external dependencies.

---

## Technical Highlights

- **Interactive 3D WebGL Rendering:**
  - **Corn Cob & Silk:** `models/landing/cobb_test.gltf` (69 KB) + `cobb_test.bin` (47 KB) & `models/landing/hair.gltf` (24 KB) + `hair.bin` (28 KB).
  - **Plant Biology & Stalk:** `images/stalk/stalk_rigged3.gltf` (46 KB) + `stalk_rigged3.bin` (74 KB) & `images/stalk/SingleStalk12_db.gltf` (27 KB) + `SingleStalk12_db.bin` (316 KB).
  - **Seedling & Lab Environment:** `assets/pot3.gltf` (69 KB) + `pot3.bin` (162 KB) & `assets/bg_pot.gltf` (4 KB) + `bg_pot.bin` (12 KB).
  - **Kernel Anatomy:** `models/kernel/KERNAL.gltf` (4 KB) + `KERNAL.bin` (91 KB).
- **GPU-Compressed Textures:**
  - Full suite of 38 textures in **S3TC** (desktop Chrome/Firefox/Edge DXT), **ASTC** (mobile/modern GPUs), and **PVRTC** (iOS).
- **Animation & Physics:**
  - GSAP timeline choreography with scroll synchronization.
  - Traer spring-mass physics driving floating cluster particles.
  - 1,200-frame spritesheet animations (`images/icons/icons-{0,1,2}.png`) at 30 FPS.
- **Typography & MSDF Rendering:**
  - Multi-channel Signed Distance Field fonts: Gilroy and Manifold.
  - Web fonts in `.woff2`, `.woff`, and `.ttf`.
- **Zero-Dependency Local Server:**
  - Native Node.js HTTP server (`server.mjs`) supporting HTTP 206 range streaming, CORS headers, SPA fallback, and proxy cache.

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
cornrevolution-clone/
├── index.html                 # Sanitized entry HTML with local asset references
├── index.original.html        # Original untouched entry HTML backup
├── server.mjs                 # Zero-dependency HTTP server with 206 streaming and CORS
├── package.json               # Manifest and npm scripts
├── HANDOFF.md                 # Checkpoint status & handoff documentation
├── README.md                  # Comprehensive technical documentation
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout specification
│   └── BEHAVIORS.md           # WebGL, GSAP, and shader behavior details
├── public/                    # 100% self-contained static assets (54.9 MB, 181 files)
│   ├── loader.*.js            # Entry runtime loader (patched for local paths)
│   ├── main.*.js              # Application logic and WebGL scenes
│   ├── vendors~main.*.js      # Vendor libraries (Three.js, GSAP)
│   ├── compressed/            # S3TC, ASTC, and PVRTC compressed textures
│   ├── models/                # 3D GLTF models and binary buffers
│   ├── fonts/                 # Gilroy and Manifold MSDF assets and web fonts
│   ├── images/                # UI icons, spritesheets, and placeholder imagery
│   ├── textures/              # Field maps, Corteva logos, and noise textures
│   ├── svg/                   # Vector icon sheets
│   └── favicon/               # Site favicons and manifests
└── scripts/
    ├── download-all-assets.py # Multi-threaded asset downloader
    ├── verify.mjs             # Integrity verification tool
    ├── deep-scan.py           # Asset scanner for JS bundles
    └── inspect-gltf.py        # GLTF dependency inspector
```
