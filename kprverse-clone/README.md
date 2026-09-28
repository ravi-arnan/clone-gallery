# KPRVerse Clone

A 100% authentic, fully animated clone of [https://kprverse.com/](https://kprverse.com/).

This clone preserves the complete interactive 3D WebGL scenes, Draco mesh decompression, Basis/KTX2 texture transcoding, custom GLSL shaders, multi-layer sprite sheet animations, GSAP timeline orchestration, audio soundscape, and rich multimedia lore, running completely offline and self-contained.

---

## Highlights & Technical Architecture

- **Rendering Engine:** WebGL / Three.js with custom GLSL shaders, ACESFilmic tone mapping, and sRGB color encoding.
- **Interactive 3D Simulation & Binary Models:**
  - 5 Full 3D GLTF 2.0 Binary models (`.glb`) with Draco compression in 2048x2048 high-res, 1024x1024, and mobile variants:
    - **Tableaux-Keep:** `public/gltf/compressed/etc1s/tableaux-keep/tableaux-keep-2048.glb`
    - **Tableaux-Factions:** `public/gltf/compressed/etc1s/tableaux-factions/tableaux-factions-2048.glb`
    - **Tableaux-Universe:** `public/gltf/compressed/etc1s/tableaux-universe/tableaux-universe-2048.glb`
    - **Project Story:** `public/gltf/compressed/etc1s/project/project-2048.glb`
    - **Collection Showcase:** `public/gltf/compressed/etc1s/collection/collection-2048.glb`
  - Google Draco WebAssembly decompression (`draco_decoder.wasm`, `draco_wasm_wrapper.js`).
  - Basis Universal / KTX2 texture transcoder (`basis_transcoder.wasm`).
- **Textures & Shaders:**
  - KTX2 procedural noise maps (`pnoise0.ktx2`).
  - High-resolution WebP noise and flicker maps (`noise.webp`, `flick.webp`).
- **Multi-Layer 2D Sprite Sheet FX:**
  - 22 Frame-accurate sprite atlases and JSON coordinate maps:
    - Character light aura (`character-light-0`, `1`, `2`)
    - Beam ship propulsion (`beam-ship-0`, `1`, `2`)
    - Kai avatar animation sequence (`kai-0`, `1`, `2`, `3`)
    - Energy hand charges (`energy-left-0/1`, `energy-right-0/1`)
    - Quantum particle beam bursts (`beam-0`, `1`, `2`, `3`, `4`)
    - Magic pulse (`magic-0`)
    - Animated character lore hair & cloth (`female-cloth`, `female-hair`, `male-hair`)
    - Header sprite and logo intro animation (`header-sprite`, `logo-anim-low-res-0`)
- **GSAP & ScrollTrigger Timeline Orchestration:**
  - Scroll-scrubbed camera trajectory and FOV interpolation across all 5 scenes.
  - Interactive audio visualizer equalizer bars dynamically scaled with GSAP.
  - Cyberpunk HUD frame with responsive corner cutouts and live scroll coordinates.
- **Complete Audio Soundscape:**
  - Interactive UI sound effects (`UI_menu_OPEN.mp3`, `UI_menu_CLOSE.mp3`, `UI_menu_rollover.mp3`).
  - Intro and carousel audio sequences (`FX_ALT_intro_animation.mp3`, `FX_logo_intro_animation.mp3`, `FX_character_carousel_1/2/3.mp3`).
  - Interactive audio toggle in header.
- **Rich Media & Lore:**
  - Full 1080p video trailer (`videos/trailer/keepers-teaser-1080.mp4`).
  - Concept art, story chapters, brandbook archive, and rulebooks.
- **Typography:**
  - ABC Whyte Plus Variable, ABC Whyte Inktrap Variable, Hexaframe CF Bold, IBM Plex Mono, and PP Fraktion Sans web fonts.
- **Zero External Runtime Dependencies:** Runs 100% locally with zero external CDN dependencies.

---

## Quick Start

### 1. Run Local Dev Server
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
nice -n 19 python3 scripts/deep-scan-assets.py
```

---

## Directory Structure

```
kprverse-clone/
├── index.html                 # Main entry HTML with local asset references
├── server.mjs                 # High-performance server with HTTP range streaming, CORS, and MIME support
├── package.json               # Scripts and manifest
├── HANDOFF.md                 # Checkpoint status & handoff
├── README.md                  # Technical documentation & quick start
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout
│   └── BEHAVIORS.md           # WebGL, Draco, GSAP, and audio behaviors
├── public/                    # 100% self-contained static assets
│   ├── _nuxt/                 # Nuxt Vue/Three.js bundles, CSS, and web fonts
│   ├── gltf/                  # 3D GLB models (Keep, Factions, Universe, Project, Collection)
│   ├── draco/                 # Google Draco wasm decoder
│   ├── basis/                 # Basis Universal wasm transcoder
│   ├── images/                # KTX2, WebP textures, and 22 sprite sheets
│   ├── audio/                 # UI SFX and ambient audio tracks
│   ├── videos/                # Full 1080p video trailer
│   ├── svg/                   # Technical vector icons and markings
│   ├── data/                  # After Effects animation coordinates
│   └── storyblok/             # Lore art, wallpapers, PDFs, and character assets
└── scripts/
    ├── deep-scan-assets.py    # Automated asset discovery and downloader
    ├── download-secondary.py  # Secondary sprite, font, and texture downloader
    ├── download-project-story-and-storyblok.py # Project-story and lore downloader
    └── verify.mjs             # Integrity verification script
```

---

## Verification Summary
- **Total Critical Files:** 36 verified paths
- **Total Downloaded Assets:** 458 files (~693 MB)
- **Endpoint Status:** 100% verified via HTTP with `HTTP 200 OK` (0 errors, 0 missing).
