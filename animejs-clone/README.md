# Anime.js v4 Clone (Fully Animated)

Kloning lengkap, mandiri, dan 100% offline dari website resmi Anime.js v4 (`https://animejs.com/`), lengkap dengan engine 3D WebGL Three.js r172, seluruh 22 model 3D GLB modular, Draco WASM geometry decompression, interactive canvas demos, live easings visualizer, dan typography resmi.

## Fitur & Engine Terpasang

1. **Three.js r172 WebGL 3D Modular Engine:**
   - Background 3D Engine canvas (`<canvas id="renderer">`) dengan rendering beresolusi retina.
   - Menggerakkan floating modular nodes yang saling terhubung secara dinamis via SVG lines saat scroll.

2. **22 Model 3D GLB Modular (Draco Compressed):**
   - Seluruh 22 model GLB terpasang lokal di `public/assets/models/`:
     - `module-animate-01.glb`
     - `module-draggable-01.glb` & `module-draggable-02.glb`
     - `module-easing-01.glb`
     - `module-engine-01.glb`
     - `module-renderer-01.glb`
     - `module-scope-01.glb`
     - `module-scroll-01.glb`
     - `module-shield-01.glb` & `module-shield-02.glb`
     - `module-spring-01.glb`
     - `module-stagger-01.glb` & `module-stagger-02.glb`
     - `module-svg-01.glb`
     - `module-timeline-01.glb` & `module-timeline-02.glb`
     - `module-timer-01.glb` s/d `module-timer-05.glb`
     - `module-waapi-01.glb`
   - Draco WASM decompression binaries (`draco_decoder.wasm`, `draco_wasm_wrapper.js`, `draco_decoder.js`) terpasang lokal di `public/assets/draco/`.

3. **2D Canvas Demos & Staggering Visualizer:**
   - Staggering grid canvas demo (`.staggering-canvas`).
   - Morphing & math coordinate canvases (`.heart-canvas`, `.dotted-grid-canvas`).
   - Easing curve line & dot interactive canvases (`.easings-lines-canvas`, `.easings-dots-canvas`).

4. **Live Interactive Demos Engine:**
   - Berkas engine demo lokal (`public/documentation-demos`, 2.2MB) berisi runner kode langsung untuk seluruh seksi dokumentasi.

5. **Dynamic Data & Sponsors:**
   - Kurva easing lokal (`public/assets/json/easings.json`).
   - Endpoint sponsor terlokalisasi (`public/sponsors/`) lengkap dengan avatar GitHub lokal di `public/media/avatars/`.

6. **Tipografi Resmi Terpasang Lokal:**
   - DINish (`DINish[slnt,wdth,wght].woff2`).
   - Berkeley Mono (`BerkeleyMono-Regular.woff2`, `BerkeleyMono-Italic.woff2`).
   - Digital-7 (`Digital-7MonoItalic.woff2`).

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
animejs-clone/
├── index.html                   # HTML entry point terlokalisasi
├── server.mjs                   # Server Node.js mandiri dengan GLB, WASM & Demo support
├── package.json                 # Manifest scripts: dev, start, check, build
├── README.md                    # Dokumentasi proyek
├── HANDOFF.md                   # Status checkpoint dan handoff
├── docs/
│   └── research/
│       ├── PAGE_TOPOLOGY.md     # Arsitektur seksi DOM & layers
│       ├── BEHAVIORS.md         # Spesifikasi motion, Three.js 3D & Canvas
│       ├── assets-inventory.json# Inventaris 120 aset lokal
│       └── url-to-local-map.json# Pemetaan URL remote ke lokal
├── scripts/
│   ├── verify.mjs               # Test runner integritas (57 checks - 100% PASS)
│   ├── recon-live.mjs           # Playwright live crawler & screenshot capture
│   ├── download-all.mjs         # Multi-threaded asset & GLB downloader
│   ├── build-localized-html.mjs # Builder index.html lokal
│   └── generate-inventory.mjs   # Pembuat inventaris aset
└── public/
    ├── assets/
    │   ├── css/                 # Stylesheet core & home
    │   ├── draco/               # Draco WASM runtime & wrapper
    │   ├── fonts/               # BerkeleyMono, DINish, Digital-7
    │   ├── images/              # Logo SVG & icons
    │   ├── js/                  # home.js & modular chunks
    │   ├── json/                # easings.json
    │   └── models/              # 22 Model GLB 3D
    ├── documentation-demos      # Live interactive code demos (2.2MB)
    ├── media/
    │   └── avatars/             # Sponsor GitHub avatars lokal
    └── sponsors/                # Localized sponsor data feeds
```
