# Lando Norris Website Clone (100% Offline & Fully Animated)

Replika offline mandiri dengan fidelitas visual dan interaktif 1:1 dari [landonorris.com](https://landonorris.com/). Proyek ini mereplikasi seluruh pipeline animasi WebGL 3D (Three.js r174), orkestrasi timeline GSAP + ScrollTrigger, smooth scrolling Lenis, serta interaksi mikro berbasis Rive Vector Run-time.

---

## 1. Highlight Teknis & Fitur

- **Three.js WebGL2 Engine (`canvas.gl`)**:
  - Model 3D GLB yang didekompresi menggunakan Draco WASM (`helmet-21.glb`, `disco-02.glb`, `sotd.glb`, `tracks/tracks-06-test.glb`).
  - Studio HDRI environment lighting (`studio_small_08_1k--light.hdr`, `--faded.hdr`, `--dark.hdr`).
  - PBR textures (metallic, roughness, normal, gold, disco matcaps).
  - Tipografi dinamis MSDF (Multi-channel Signed Distance Field) dengan font `Brier-Bold-02` dan `MonaSans-Bold-02`.
- **Rive Vector Animation Instances (20 Canvases)**:
  - Didukung oleh WebAssembly engine lokal (`/libs/rive/rive.wasm`).
  - Memuat 8 state-machine vector: `page-transition.riv`, `phrases.riv`, `signature.riv`, `ln4.riv`, `circuits.riv`, `reef.riv`, `btn-ui.riv`, dan `mob-landscape.riv`.
- **Motion & Scroll Architecture**:
  - Sinkronisasi rotasi kamera 3D dan transisi helm berdasarkan scroll position dengan GSAP ScrollTrigger dan Lenis.
  - Dynamic theme coloring (`data-gl-change-track`) terhubung ke background shader Three.js.
- **100% Self-Contained & Offline**:
  - Semua aset disimpan di direktori `public/` (268 aset, total ~15 MB).
  - Kode eksternal dan telemetry (Google Tag Manager, Klaviyo, Iubenda) telah dihilangkan tanpa mengganggu event lifecycle situs.

---

## 2. Struktur Direktori

```
landonorris-clone/
├── index.html                    # Entry point HTML yang telah dilokalisasi
├── original.html                 # Snapshot mentah dari live site
├── package.json                  # Metadata proyek
├── server.mjs                    # Local static server dengan HTTP range support (206)
├── public/                       # Root aset publik (268 file)
│   ├── cdn-website-files/        # CSS, JavaScript Webflow, fonts, kartu helm
│   ├── dev-js/                   # Core orchestrator script (lando-by-OFF+BRAND.05.js)
│   ├── gl/                       # Aset 3D Three.js
│   │   ├── draco/                # Draco WASM decoders
│   │   ├── fonts/                # MSDF fonts & JSON glyphs
│   │   ├── hdri/                 # Radiance HDR studio environments
│   │   ├── models/               # Model GLB (helm, sirkuit, trofi)
│   │   └── textures/             # PBR textures (gold, disco, glass, head, noise)
│   ├── libs/rive/                # Rive WebAssembly runtime (rive.wasm)
│   └── rive/                     # Vector animation state machine (.riv)
├── scripts/
│   ├── inspect-site.mjs          # Skrip inspeksi headless Playwright
│   ├── download-all-assets.py    # Downloader aset multi-kategori
│   ├── build-localized-html.py   # Skrip stripping telemetry & path re-routing
│   └── verify.mjs                # Skrip verifikasi headless & assertion test
└── docs/
    ├── design-references/        # Screenshot hero, scroll stops, dan mobile view
    └── research/                 # Spesifikasi topologi dan perilaku interaktif
```

---

## 3. Cara Menjalankan Secara Lokal

Pastikan Node.js (v18+) telah terpasang di sistem.

1. **Jalankan Development Server**:
   ```bash
   node server.mjs
   ```
   Server akan berjalan di `http://localhost:3001` secara default. Port dapat diubah menggunakan environment variable `PORT` (misal: `PORT=3000 node server.mjs`).

2. **Buka di Browser**:
   Buka `http://localhost:3001` di Google Chrome atau browser modern lainnya dengan akselerasi hardware aktif.

3. **Jalankan Verifikasi Otomatis**:
   ```bash
   node scripts/verify.mjs
   ```
   Skrip ini memverifikasi integritas filesystem, respons HTTP 200 seluruh endpoint utama, inisialisasi context WebGL2 pada `canvas.gl`, dan memastikan tidak ada error konsol maupun jaringan.
