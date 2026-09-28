# Alche Studio Clone

A 100% authentic, fully animated clone of [https://alche.studio/](https://alche.studio/).

This clone preserves the complete interactive 3D WebGL2 Three.js scene, binary GLB model meshes, CubeTexture environment reflections, GSAP ScrollTrigger camera orchestration over 22,780 px, Lenis smooth scrolling, Howler spatial sound effects, HTML5 video showcases, and Lottie animations, running completely offline and self-contained.

---

## Technical Highlights

- **3D WebGL2 Rendering Engine:**
  - Three.js WebGL2 context rendered onto fullscreen background canvas and dedicated outro canvas (`#outro-canvas`).
  - `common/scene.glb` containing 18 meshes (`CrackedLogo`, `Infinite`, `Alche_A`, `Alche_Outline`, `Alche_SideScreen`, `ThumbnailScreen`, etc.).
  - 6-face CubeTexture environment mapping (`envmap/px.png`, `nx.png`, `py.png`, `ny.png`, `pz.png`, `nz.png`).
- **Animation Orchestration:**
  - GSAP `ScrollTrigger` synchronizing 3D camera transforms, mesh deformations, and text scramble reveals with scroll progress.
  - Lenis smooth scrolling with sub-pixel interpolation.
- **Audio & Spatial SFX:**
  - Howler.js integration supporting ambient BGM (`/sounds/bgm.mp3`) and interactive sound effects (`mission_in.mp3`, `typing.mp3`, `works_in.mp3`) with mute toggle memory.
- **Video & Media Showcase:**
  - High-definition MP4 videos (`/top/service/stellla.mp4`, `/top/service/ue.mp4`, `/top/service/uefn.mp4`, `/stellla/kv.mp4`) with HTTP Range streaming support.
  - 24 CMS portfolio work cards in high-resolution AVIF format.
- **Multi-Route Architecture (Swup SPA):**
  - Seamless route transitions across `/`, `/about`, `/news`, `/works`, `/works/detail/*`, `/stellla`, `/contact`, `/privacypolicy`, and `/license`.
- **Zero External Runtime Dependencies:**
  - All critical assets, shaders, scripts, and audio files are self-hosted locally in `public/`.

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
alche-clone/
├── index.html                 # Main landing page entry
├── server.mjs                 # Node.js server with HTTP range streaming & MIME resolution
├── package.json               # Scripts and manifest
├── HANDOFF.md                 # Checkpoint status & next actions
├── README.md                  # Project documentation & quick start
├── docs/
│   ├── design-references/     # Verification screenshots and original captures
│   └── research/
│       ├── PAGE_TOPOLOGY.md   # Viewport & canvas layout hierarchy
│       ├── BEHAVIORS.md       # 3D WebGL, GSAP, and audio behaviors
│       ├── inspection.json    # DOM, canvas, and script inspection
│       └── network-requests.json # Raw network logs
├── public/                    # 100% self-contained static assets
│   ├── _astro/                # Core Astro JS & CSS bundles
│   ├── common/                # scene.glb 3D model, logos, and Lottie animations
│   ├── envmap/                # CubeTexture 6-sided environment map
│   ├── sounds/                # Howler BGM and interactive SFX (.mp3)
│   ├── top/                   # Video showcases (.mp4), titles, and graphics
│   ├── stellla/               # Stellla metaverse assets & video
│   ├── about/                 # Photos and collaboration logos
│   ├── cms-media/             # 24 portfolio work cards (.avif)
│   └── typekit/               # Typekit font loader SDK
└── scripts/
    ├── inspect-site.mjs       # Headless Playwright reconnaissance script
    ├── download-all-assets.py # Multi-threaded asset downloader
    ├── build-localized-html.py# HTML sanitizer and path localizer
    └── verify.mjs             # Integrity, HTTP, and WebGL verification script
```

---

## Verification Summary

- **Total Critical Files:** 68 files
- **Total Storage Size:** 31.71 MB
- **Endpoint Status:** 100% verified via HTTP with `HTTP 200 OK` (0 missing files)
- **WebGL Context:** Active and rendering (3 canvases detected)
