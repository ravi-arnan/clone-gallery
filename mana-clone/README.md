# Mana Yerba Maté Clone

A 100% authentic, fully animated clone of [https://en.manayerbamate.com/](https://en.manayerbamate.com/).

This clone preserves the complete interactive 3D WebGL can simulation, HDR environment reflections, GSAP mechanical timeline orchestration, ScrollTrigger pinned benefits dial, Lottie animations, Swiper product showcase, and the playable footer runner mini-game, running completely offline and self-contained.

---

## Highlights & Technical Architecture

- **Rendering Engine:** WebGL / Three.js with custom GLSL shaders, ACESFilmic tone mapping, and sRGB encoding.
- **Interactive 3D Can Simulation:**
  - GLTF 2.0 binary buffer model (`MANA_canettes__v5_WEBGL.gltf` and `MANA_canettes__v5_WEBGL.bin`) created by Jeff Clermont.
  - Equirectangular 32-bit HDR reflection environment map (`MANA_hdr.hdr`) with real-time metallic reflections.
  - Normal map (`MANA_canette_top_normal copy_exr.png`) and roughness/metal maps (`MANA_canette_pamp_roughness__metal_maps.png`).
  - Real-time PBR material texture swapping across 4 flavors:
    - Pamplemousse (Grapefruit): `MANA_canette_pamp_color_for_mat_v2.png`
    - Hibiscus: `MANA_canette_hibiscus_color_for_mat.png`
    - Tropical: `MANA_canette_tropical_color_for_mat.png`
    - Melon Mint: `MANA_canette_melon_mint_mat.png`
- **GSAP & ScrollTrigger Timeline Orchestration:**
  - Scroll-scrubbed can rotation, scaling, and camera trajectory across the hero section.
  - Elastic easing transitions (`elastic.out(0.34, 0.26)`) on interactive flavor changes.
  - Scroll-pinned circular dial (Part 2) pinning the benefits container while rotating the radial card deck `-130deg`.
  - Staggered rainbow letter animations and parallax layer displacements.
- **23 Vector Lottie Animations:**
  - Flavor sticker micro-animations (`lottie_pamp_*`, `lottie_hibi_*`, `lottie_trop_*`, `lottie_melo_*`).
  - Nutritional and energy benefit cards (`carte_crash`, `carte_caf`, `carte_antiox`, `carte_vege`).
  - Page loader and curtain reveal transitions (`transition-faster.json`, `bubbles.json`).
  - Playable footer runner game characters (`jeu_walk`, `jeu_jump`, `jeu_happy`, `jeu_sad`, `jeu_paysage`).
- **Playable Footer Runner Mini-Game:**
  - Interactive browser game with keyboard (Spacebar) and touch controls.
  - Real-time collision / assimilation detection when catching yerba mate items.
- **Typography & Brand Assets:**
  - Neue Montreal 2020 web fonts (Book, Regular, Medium weights in WOFF2 and WOFF formats).
- **Zero External Runtime Dependencies:** Runs 100% locally with zero external CDN dependencies.

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
mana-clone/
├── index.html                 # Main entry HTML with local asset references
├── server.mjs                 # High-performance server with HTTP range streaming, CORS, and MIME support
├── package.json               # Scripts and manifest
├── HANDOFF.md                 # Checkpoint status & handoff
├── README.md                  # Technical documentation & quick start
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout
│   └── BEHAVIORS.md           # WebGL, GSAP, Lottie, and game behaviors
├── public/                    # 100% self-contained static assets
│   ├── assets/                # 3D GLTF, BIN, HDR, textures, fonts, SVGs, Lottie JSON
│   └── cdn/shop/files/        # Product, lifestyle, and photography images
└── scripts/
    ├── download-assets.py     # Multi-threaded asset downloader
    └── verify.mjs             # Integrity verification script
```

---

## Verification Summary
- **Total Critical Files:** 48 verified paths
- **Total Downloaded Assets:** 120 files
- **Endpoint Status:** 100% verified via HTTP with `HTTP 200 OK` (0 errors, 0 missing).
