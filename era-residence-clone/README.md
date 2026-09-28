# ERA Residence Clone

A 100% authentic, fully animated, offline clone of [https://www.era-residence.com/](https://www.era-residence.com/).

This clone preserves the complete interactive experience: transparent 3D bougainvillea flower simulations, GSAP 3.15 timeline choreography, CustomEase bezier curves, SplitText luxury editorial typography reveals, Lenis virtual smooth scrolling, Barba.js page transitions, interactive apartment unit filters, and Lottie vector branding, running completely self-contained without external dependencies.

---

## Technical Highlights

- **3D Bougainvillea Flower Simulations:**
  - 7 Alpha-channel transparent video layers (`bougainvillea-flowers_01.webm` through `07.webm` for Chromium/Firefox/Linux, and `01.mov` through `07.mov` for Safari/Apple platforms).
  - Pinned and parallax-scrubbed across hero, location, interior, and architecture sections.
- **GSAP 3.15 Choreography & Custom Easing:**
  - Custom cubic-bezier registrations: `InOut`, `Out`, `In`, `Ease`, `Write`, `diveIn`, `horScroll`.
  - Horizontal track scroll translating vertical wheel motion to horizontal translation on `.loc-scroll-area_track`.
  - Morphing polygonal clip-paths on `.arch-intro-s_bg_l` and `.arch-intro-s_bg_r`.
  - Dynamic expanding circular typography on `[data-circle-text]` (`wordSpacing: 0rem` to `10rem`).
  - Footer morphing inset masks (`[data-footer-clip]`).
- **Typography & Fonts:**
  - `ambroise-francois-std`: Luxury editorial serif display font.
  - `sloop-script-three`: Elegant calligraphic script accent font.
  - `Maison Neue Extended`: Clean architectural geometric sans-serif for unit specifications and navigation.
  - All fonts bundled locally in `public/use.typekit.net/` and `public/cdn.prod.website-files.com/`.
- **Lottie Vector Branding:**
  - `tftl-logo_white.json` (772 KB) interactive vector animation for TFTL developer signature.
- **Interactive Multi-Route SPA:**
  - `/`: Main interactive landing page.
  - `/apartments`: Complete inventory selector with interactive filters (bedrooms, floor, orientation) and sorting.
  - `/apartments/:id`: 25 individual unit detail views (`011` through `224`) with architectural floor plans, gallery sliders, and area breakdowns.
  - `/contact`: Sales gallery booking and inquiry portal.
  - `/coming-soon`: Teaser portal.
- **Zero-Dependency Local Server:**
  - Native Node.js HTTP server (`server.mjs`) supporting HTTP 206 Partial Content range requests, CORS, and clean URL routing.

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
era-residence-clone/
├── index.html                 # Main entry HTML with local asset references
├── apartments/                # Inventory and individual apartment unit pages
│   ├── index.html             # Apartments selector & filter UI
│   ├── 011/ ... 224/          # 25 Dedicated apartment unit views
├── contact/                   # Contact & inquiry page
├── coming-soon/               # Coming soon teaser page
├── server.mjs                 # Zero-dependency HTTP server with 206 streaming and CORS
├── package.json               # Manifest and npm scripts
├── HANDOFF.md                 # Checkpoint status & handoff documentation
├── README.md                  # Comprehensive technical documentation
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout specification
│   ├── BEHAVIORS.md           # GSAP timelines, CustomEase, and interaction specifications
│   ├── assets-manifest.json   # Inventory of all 358 assets
│   └── raw_pages/             # Original raw scraped HTML pages
├── public/                    # 100% self-contained static assets (150 MB)
│   ├── assets.era-residence.com/  # 3D Bougainvillea WebM & MOV simulations
│   ├── cdn.prod.website-files.com/# Images, Webflow bundles, Maison Neue fonts
│   ├── cdn.jsdelivr.net/      # GSAP, ScrollTrigger, SplitText, CustomEase, Lottie
│   ├── unpkg.com/             # Lenis smooth scroll, Barba core
│   ├── assets.slater.app/     # Slater custom motion engine (20164 / 60900)
│   ├── pub-157506367d4c4fa1825d7a6d26b687a2.r2.dev/ # TFTL Lottie JSON
│   ├── use.typekit.net/       # Ambroise François & Sloop Script font files
│   └── css/fonts.css          # Local offline font face declarations
└── scripts/
    ├── deep-scan.py           # Sitemap discovery & asset scraper
    ├── download-all-assets.py # Multi-threaded asset downloader
    ├── build-pages.py         # HTML sanitizer and route localizer
    └── verify.mjs             # Integrity verification tool
```
