# Floema® Offline Clone

An authentic, fully animated, offline clone of [https://floema.com/en](https://floema.com/en).

This clone preserves the complete digital experience: GSAP ScrollTrigger choreography, Lenis smooth scrolling, Three.js WebGL particle shadows in dedicated Web Workers, equirectangular EXR studio lighting, 3D glTF/GLB models with Draco compression, Pizzicato spatial ambient audio, and Zimula variable typography.

---

## Technical Highlights

- **Interactive 3D WebGL & Web Worker Rendering:**
  - **Ambient Particle Shadows:** Offloaded to `public/_nuxt/Shadows.worker-C5dCWLRm.js` using `packed_texture_3.png` and `noiseTexture.png`.
  - **High-Dynamic-Range Environment:** `public/3d/envmaps/HDR_Light_Studio_Free_HDRI_Design_13.exr` (1.31 MB) for realistic studio lighting and reflections.
  - **3D Models:** Decoded glTF binary models (`palmer-tee-sign.glb`, `byside-bench-plaza.glb`) with Draco WASM decoders (`draco_decoder.wasm`).
  - **Interactive 3D Viewer:** Full OrbitControls with dampening, polar angle limits, and smooth zoom manipulation.
- **GSAP & Scroll Choreography:**
  - ScrollTrigger timelines for parallax imagery, typography reveals, and section pinned views.
  - Smooth inertia scrolling integrated with Lenis.
- **Dynamic Ambient Soundscapes:**
  - Pizzicato Web Audio engine with 7 distinct high-fidelity environmental audio tracks (`public/audio/*.mp3`).
  - HTTP 206 Partial Content range streaming for instant audio playback without buffering.
- **Typography:**
  - Complete `Zimula-Variable.Cb2n2uX-.ttf` variable web font family.
- **Self-Contained HTTP Server:**
  - Zero-dependency Node.js HTTP server (`server.mjs`) featuring Range streaming, CORS headers, SPA client routing, and on-demand asset proxy cache.

---

## Quick Start

### 1. Start Local Server
```bash
npm run dev
# or
node server.mjs
```
Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3000/en](http://localhost:3000/en)) in your browser.

### 2. Verify Asset Integrity
```bash
npm run check
# or
node scripts/verify.mjs
```

### 3. Automated Server & Endpoint Test
```bash
python3 scripts/test-server.py
```

---

## Directory Structure

```
floema-clone/
├── index.html                 # Main entry HTML with localized asset references
├── server.mjs                 # Zero-dependency HTTP server with 206 streaming & CORS
├── package.json               # Project manifest & npm scripts
├── HANDOFF.md                 # Checkpoint status & handoff documentation
├── README.md                  # Technical architecture documentation
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout specification
│   └── BEHAVIORS.md           # 3D WebGL, GSAP, and audio behavior details
├── public/                    # 100% self-contained static assets
│   ├── _nuxt/                 # JS bundles, dynamic chunks, CSS stylesheets, and web workers
│   ├── 3d/                    # 3D shadow textures & HDR/EXR environment maps
│   ├── audio/                 # 7 ambient nature and spatial soundscapes
│   ├── draco/                 # Draco WASM and JS decompression libraries
│   ├── models/                # Decoded binary glTF (.glb) 3D product models
│   └── cdn.sanity.io/         # Cached Sanity product photography and SVG icons
└── scripts/
    ├── verify.mjs             # Integrity verification script (28 automated checks)
    ├── test-server.py         # Automated HTTP endpoint and range streaming test suite
    ├── download-sanity-images.py # Asset synchronization tool
    └── download-3d-models.py  # 3D model XOR-decode utility
```
