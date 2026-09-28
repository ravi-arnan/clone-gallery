# Shopify Editions Winter 2026 Clone

Authentic, fully animated offline clone dari https://www.shopify.com/editions/winter2026.

Clone ini mempertahankan seluruh pengalaman interaktif: 3D WebGL background engine dengan Three.js dan Theatre.js timeline sequences, 56 aset model 3D (GLB dan USDZ), 27 animasi vektor interaktif Rive (.riv), custom post-processing Sobel edge detection, partikel dan simulasi kupu-kupu instanced mesh, video showcase, serta tipografi editorial (Neue Montreal, HW Cigars, Imperial Script), yang berjalan mandiri tanpa ketergantungan runtime eksternal.

---

## Technical Highlights

- **3D WebGL & Theatre.js Motion Engine:**
  - 14 Scene 3D mandiri (Hero, Agentic, Sidekick, Online, Retail/POS, B2B, Finance, Marketing, Developer, Operations, Shipping, Checkout, Shop App, Fallback).
  - 13 Sheet timeline Theatre.js JSON state files mengendalikan transformasi kamera virtual (FOV, spline position, rotation), intensitas pencahayaan, dan pergerakan model 3D saat user melakukan scroll.
  - Custom Sobel shader filter dengan falloff center untuk memberikan efek pencil-sketch render khas Shopify Editions yang bertransisi halus ke render 3D photorealistic.
  - Instanced mesh particle cloud dan animasi kepakan sayap kupu-kupu 3D berbasis vertex shader sine deformation (`Butterflies-DLjrCfBq.js`).
  - Google Draco WASM decoder v1.5.6 terintegrasi lokal untuk dekompresi mesh 3D secara instan.
  - Tekstur pencahayaan berbasis PMREM KTX2 (`studio_small_09_1k.pmrem.ktx2`).
- **Rive Vector Animation State Machines:**
  - 27 File animasi vektor interaktif Rive (`.riv`) untuk kartu fitur produk, flow automations, dashboard developer, visualisasi pulse, dan simulator AI agent.
  - Interaksi real-time terhadap kursor mouse, hover, dan click transitions.
- **Tipografi & Web Fonts:**
  - Neue Montreal (Bold 700)
  - HW Cigars (Regular 400)
  - Imperial Script (Regular 400)
  - Seluruh font WOFF2 dan TTF tersimpan dan di-serve lokal dari `public/cdn.shopify.com/b/shopify-brochure2-assets/`.
- **Media & Showcase:**
  - 99 Video interaktif (`.mp4`, `.webm`) untuk demo fitur dengan streaming HTTP 206 Partial Content.
  - Aset visual beresolusi tinggi (PNG, WebP, SVG).
- **High-Performance Zero-Dependency Server:**
  - Native Node.js HTTP server (`server.mjs`) dengan dukungan HTTP 206 byte-range streaming untuk video dan model 3D besar, MIME type lengkap, CORS, clean URL routing, dan on-demand asset proxy cache fallback.

---

## Quick Start

### 1. Menjalankan Server Lokal
```bash
npm run dev
# atau
node server.mjs
```
Buka http://localhost:3000 (atau port yang ditentukan via `PORT=3001 node server.mjs`) di browser.

### 2. Verifikasi Integritas Aset & Endpoint
```bash
npm run check
# atau
node scripts/verify.mjs
```

### 3. Sinkronisasi / Download Ulang Aset
```bash
npm run download:assets
# atau
nice -n 19 python3 scripts/download-all-assets.py
```

---

## Struktur Direktori

```
shopify-winter2026-clone/
├── index.html                 # Entry point HTML dengan runtime dan localized asset references
├── server.mjs                 # Zero-dependency Node.js HTTP server dengan HTTP 206 streaming dan CORS
├── package.json               # Manifest dan npm scripts
├── HANDOFF.md                 # Checkpoint status dan catatan handoff
├── README.md                  # Dokumentasi teknis lengkap
├── docs/research/
│   ├── PAGE_TOPOLOGY.md       # Spesifikasi hierarki seksi dan scene matrix 3D
│   ├── BEHAVIORS.md           # Spesifikasi interaksi, timeline Theatre.js, dan Rive
│   ├── assets-manifest.json   # Inventaris lengkap seluruh aset lokal
│   └── raw_page.html          # Scraped source HTML asli
├── public/                    # 100% file aset mandiri
│   ├── oxygen-assets/         # Oxygen client React runtime, Three.js engine, dan scene modules
│   ├── cdn.shopify.com/       # Theatre JSON, model 3D, font WOFF2/TTF, Rive animations, images
│   ├── editions-winter-2026.myshopify.com/ # Model 3D GLB dan video demo
│   └── www.gstatic.com/       # Google Draco WASM decoder dan wrapper
└── scripts/
    ├── deep-scan.py           # Analisis dependensi dan URL halaman
    ├── download-all-assets.py # Multi-threaded polite asset downloader
    ├── download-special-assets.py # Downloader Draco, PMREM KTX2, dan coin GLB
    ├── build-localized-html.py# Builder dan sanitizer index.html lokal
    ├── generate-manifest.py   # Auditor ukuran dan kategori aset
    └── verify.mjs             # Verifikasi kelayakan 56 titik kritis sistem
```

---

## Status Verifikasi

- **Total Checks:** 56/56 Passed (100% Success)
- **Total Aset Terverifikasi:** 825 berkas (~438 MB)
- **Status Endpoint:** Seluruh endpoint lokal (HTML, CSS Tailwind, client modules, Three.js engine, Theatre states, Draco WASM, model GLB, font WOFF2) merespons dengan HTTP 200 OK.
