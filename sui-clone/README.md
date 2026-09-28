# Sui.io Clone (Fully Animated)

Kloning lengkap dan mandiri dari website resmi Sui (`https://www.sui.io/`), lengkap dengan seluruh engine animasi GSAP, 3D Canvas Image Sequence, animasi interaktif Rive WASM, animasi vektor Lottie JSON, filmic grain procedural noise, dan Lenis smooth scroll.

## Fitur & Engine Terpasang

1. **GSAP 3.15 Animation Suite:**
   - GSAP Core, ScrollTrigger, SplitText, CustomEase, InertiaPlugin, Observer, Draggable, DrawSVGPlugin, ScrambleTextPlugin, MorphSVGPlugin, dan Flip plugin.
   - Menggerakkan efek scroll-driven reveal, typography stagger, SVG grid animation, text scramble decode, dan shuffle hover.

2. **3D Image Sequence Player (Canvas 2D):**
   - 76 Frame sequence WebP beresolusi tinggi (`sequences/homepage-scroll/frame_0000.webp` s/d `frame_0075.webp`).
   - Sinkronisasi canvas scrubbing dan looping pada timeline seksi "The stack autonomous systems run on".

3. **Rive WASM Canvas Interactive Animations:**
   - 6 File model animasi Rive (`.riv`) untuk arsitektur kartu stack Sui:
     - `Data Storage.riv` (Walrus - Agent knowledge store)
     - `Verifiable Off Chain.riv` (Nautilus - Verifiable agent compute)
     - `Identity Management.riv` (SuiNS - Verifiable agent identity)
     - `Asset and Service Coordination.riv`
     - `Data Security.riv`
     - `Liquidity Management.riv`
   - Terintegrasi langsung dengan Rive WASM runtime lokal (`public/vendor/rive.min.js`).

4. **Lottie Vector Animations:**
   - 13 File JSON animasi Lottie untuk seksi industri dan fitur interaktif (DeFi, AI, Gaming, Institutions, Onchain Validation, Security, Developer, Community).
   - Terintegrasi dengan Lottie Web runtime lokal (`public/vendor/lottie.min.js`).

5. **Video Streaming & Filmic Noise:**
   - Hero video background loops (`.mp4` dan `.webm`) dengan dukungan HTTP 206 Partial Content range requests.
   - Canvas procedural noise overlay untuk efek grain sinematik.

6. **Lenis Smooth Scroll:**
   - Smooth inertia scroll tersinkronisasi dengan GSAP ticker (`lerp: 0.12`).

7. **Tipografi Resmi:**
   - Font TWK Everett dan TWK Everett Mono (19 varian WOFF2 & OTF) terpasang lokal.

## Panduan Menjalankan

Server menggunakan Node.js native tanpa dependensi eksternal (zero-dependency).

### Menjalankan Server
```bash
npm run dev
# atau
node server.mjs
```
Akses di browser: `http://localhost:3000`

### Menjalankan Tes Verifikasi
```bash
npm run check
# atau
node scripts/verify.mjs
```

## Struktur Proyek

```
sui-clone/
├── index.html                   # HTML entry point terlokalisasi
├── server.mjs                   # Server Node.js mandiri dengan HTTP 206 streaming
├── package.json                 # Manifest scripts: dev, start, check, build
├── README.md                    # Dokumentasi proyek
├── HANDOFF.md                   # Status checkpoint dan handoff
├── docs/
│   └── research/
│       ├── PAGE_TOPOLOGY.md     # Arsitektur seksi DOM
│       ├── BEHAVIORS.md         # Spesifikasi motion, GSAP, Rive, Canvas
│       ├── assets-inventory.json# Inventaris lengkap aset
│       └── url-to-local-map.json# Pemetaan URL remote ke lokal
├── scripts/
│   ├── verify.mjs               # Test runner integritas (51 checks)
│   ├── build-localized-html.py  # Builder index.html lokal
│   ├── download-all-assets.py   # Multi-threaded asset downloader
│   └── patch-css.py             # CSS asset patcher
└── public/
    ├── css/                     # Stylesheet sui-v2
    ├── fonts/                   # TWK Everett & TWK Everett Mono (19 varian)
    ├── images/                  # Visual WebP, AVIF, PNG
    ├── js/                      # Bundle Webflow dan script animasi Slater
    ├── lottie/                  # 13 Animasi JSON
    ├── rive/                    # 6 Model Rive (.riv)
    ├── sequences/               # 76 Frame 3D sequence
    ├── svg/                     # Ikon & vektor grafis
    ├── vendor/                  # GSAP suite, Lenis, Rive, Lottie, jQuery
    └── videos/                  # Hero background loops & cutdown videos
```
