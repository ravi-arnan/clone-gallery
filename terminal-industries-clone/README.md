# Terminal Industries Clone

A 100% authentic, fully animated clone of [https://terminal-industries.com/](https://terminal-industries.com/).

This clone reproduces the exact digital twin yard operating system showcase, featuring multi-stage 3D canvas sequences, GSAP timeline choreography, Lenis virtual scroll smoothing, SplitText masked typographic transitions, Web Worker frame streaming, and responsive desktop/mobile interactive experiences, running completely offline and self-contained.

---

## Technical Architecture & Highlights

- **Multi-Stage 3D Canvas Sequences:**
  - **Hero Desktop Sequence:** 410 pre-rendered 3D frames (`public/static/frames/home/desktop/webp/hero_anim_desktop_60_{0..409}.webp`) scrubbed smoothly with GSAP ScrollTrigger.
  - **Hero Mobile Sequence:** 409 optimized frames (`public/static/frames/home/mobile/webp/hero_anim_mobile_60_{0..408}.webp`) with responsive aspect handling.
  - **Solutions Features Sequence:** 272 detailed yard hardware & automation frames (`public/static/frames/solutions/webp/{0..271}.webp`).
- **High-Performance Web Worker Pipeline:**
  - Dedicated background worker (`video-sequence.worker-B5BJOqje.js`) manages asynchronous frame chunk fetching and Blob conversion without freezing the UI thread.
  - High-DPI canvas scaling: `canvas.width = offsetWidth * window.devicePixelRatio` for razor-sharp rendering on Retina screens.
- **GSAP & ScrollTrigger Timeline Choreography:**
  - Scroll-scrubbed camera progression synchronized with value proposition text reveals.
  - Interactive floating cursor indicator (`ScrollIndicator`) with damped mouse interpolation.
  - SplitText line masks with exponential easing (`expo.out`).
  - Animated monospace KPI odometer counters.
- **Storyblok Headless Media & Videos:**
  - 6 High-resolution MP4 3D product renders and demos.
  - Enterprise partner marques and editorial imagery cached locally.
- **Typography:**
  - Suisse Intl (Regular, Book, Medium, Semibold) and Geist Mono (Regular, SemiBold, Bold) web fonts.
- **Zero-Dependency Local Server:**
  - Built-in Node.js HTTP server supporting HTTP 206 partial content range streaming (for seamless video scrubbing), CORS, dynamic Storyblok routing, and single-page routing fallbacks.

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
terminal-industries-clone/
├── index.html                 # Main entry HTML with local asset references
├── server.mjs                 # High-performance server with range streaming, CORS, and Storyblok routing
├── package.json               # Manifest and npm scripts
├── HANDOFF.md                 # Checkpoint status & handoff documentation
├── README.md                  # Comprehensive technical documentation
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Component hierarchy & layout specification
│   └── BEHAVIORS.md           # Canvas sequences, Web Worker, and GSAP details
├── public/                    # 100% self-contained static assets
│   ├── _nuxt/                 # Nuxt Vue bundles, CSS, and Web Worker
│   ├── static/                # 3D canvas sequences (hero & solutions), fonts, SVGs, and images
│   └── storyblok/             # Product showcase MP4 videos and high-res diagrams
└── scripts/
    ├── download-all-assets.py # Multi-threaded asset downloader
    ├── verify.mjs             # Integrity verification tool
    ├── sanitize-html.py       # HTML sanitizer and Storyblok localizer
    └── crawl-chunks.py        # Recursive Nuxt chunk crawler
```
