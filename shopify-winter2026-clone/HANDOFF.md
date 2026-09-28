# Checkpoint & Handoff

- **Tanggal:** 2026-09-20
- **Target Asal:** https://www.shopify.com/editions/winter2026
- **Lokasi Proyek:** `/home/ravi/Projects/shopify-winter2026-clone`

---

## Ringkasan Progres & Status

1. **Aset 3D, Animasi, & Engine:**
   - 56 Model 3D (`.glb` dan `.usdz`) tersimpan lokal di `public/editions-winter-2026.myshopify.com/` dan `public/cdn.shopify.com/`.
   - 13 File state timeline Theatre.js JSON terintegrasi utuh untuk scroll camera motion di `public/cdn.shopify.com/s/files/`.
   - 27 File animasi vektor interaktif Rive (`.riv`) tersimpan lengkap di `public/cdn.shopify.com/s/files/`.
   - Google Draco WASM decoder v1.5.6, PMREM KTX2 lighting, dan custom Sobel filter terpasang lokal di `public/www.gstatic.com/` dan `public/cdn.shopify.com/`.
   - Font editorial (Neue Montreal, HW Cigars, Imperial Script) dalam format WOFF2 dan TTF terpasang lokal di `public/cdn.shopify.com/b/shopify-brochure2-assets/`.
   - 64 Module Oxygen client JS dan CSS Tailwind tersimpan di `public/oxygen-assets/`.
   - Total ukuran aset lokal saat ini mencapai ~438 MB (825 berkas lokal).

2. **Investigasi & Resolusi Error Runtime:**
   - **Root Cause 1 (Remix Route Mismatch):** Remix App Router mengikat rute `:locale?/editions/winter2026`. Akses ke root `/` menyebabkan hydration mismatch (#418/#423). Diatasi dengan menambahkan auto-redirect 302 dari `/` ke `/editions/winter2026`.
   - **Root Cause 2 (Relative URL Constructor):** Pemanggilan `new URL('/path')` pada Three.js engine dan link helper melempar error `TypeError: Failed to construct 'URL': Invalid URL`. Diatasi dengan URL constructor polyfill di `<head>` untuk menangani relative root paths secara aman.
   - **Root Cause 3 (Draco Decoder 404):** Engine Three.js memanggil decoder di `/draco/versioned/decoders/1.5.6/draco_decoder.wasm`. Berkas decoder Draco WASM v1.5.6 telah dipetakan langsung di `public/draco/`.
   - **Root Cause 4 (GTM & Third-Party Analytics):** Skrip analitik eksternal (GTM, DoubleClick) dinetralisir agar tidak menyuntikkan tag asing yang merusak hydration DOM dan mencegah net::ERR_ABORTED.

3. **Verifikasi:**
   - Script verifikasi [`scripts/verify.mjs`](file:///home/ravi/Projects/shopify-winter2026-clone/scripts/verify.mjs) mengonfirmasi **57/57 checks PASS (100% Success)**.
   - Diagnostik browser via Playwright mengonfirmasi 2 canvas WebGL aktif ter-render, judul halaman muncul, dan screenshot hasil render terverifikasi utuh (~1.3 MB).

---

## Daftar File Baru / Diubah
- `index.html` (Localized entry point dengan runtime client dan asset mapping lokal)
- `server.mjs` (High-performance HTTP server mandiri dengan HTTP 206 dan proxy cache fallback)
- `package.json` (NPM scripts: dev, start, check, download:assets)
- `.gitignore` (Ignore node_modules, temp, dan log files)
- `README.md` (Dokumentasi arsitektur dan panduan cepat)
- `docs/research/PAGE_TOPOLOGY.md` (Spesifikasi hierarki 14 seksi dan matrix scene 3D)
- `docs/research/BEHAVIORS.md` (Dokumentasi spesifikasi motion Theatre.js, WebGL shader, dan Rive)
- `docs/research/assets-manifest.json` (Daftar inventaris 380+ aset lokal)
- `scripts/verify.mjs` (Test runner otomatis 56 checks)
- `scripts/download-all-assets.py` (Script sinkronisasi multi-threaded aset)
- `scripts/build-localized-html.py` (Script re-build index.html)
- `scripts/generate-manifest.py` (Script audit aset)

---

## Next Action
Jalankan `npm run dev` di direktori `shopify-winter2026-clone` jika ingin menjalankan kembali server lokal di kemudian hari. Server saat ini dalam keadaan nonaktif (port 3000 bebas).
