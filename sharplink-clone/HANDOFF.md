# Checkpoint & Handoff

- **Tanggal:** 2026-09-23 00:48:00 +08:00
- **Target Asal:** https://www.sharplink.com/
- **Lokasi Proyek:** `/home/ravi/Projects/sharplink-clone`

---

## Investigasi & Resolusi Visual Placement Error

1. **Root Cause Masalah Placement Visual:**
   - **Analisis Slice Diff:** Perbandingan visual per slice 1000px (`docs/design-references/diff/`) mengungkap bahwa pada seksi Propositions (`clone_2000.png`), kolom ilustrasi arsitektur mesin (`shrp_machine_1` s/d `5.avif` dan DotLottie canvas) menciut dari 560x765px menjadi 90x168px dan tergeser menimpa judul "The Stack for Stacking Ethereum" di sebelah kiri atas.
   - **Penyebab Utama:** Berkas `original.html` sebelumnya ditangkap setelah browser melakukan scrolling interaktif. Akibatnya, elemen `.pin-spacer` dan inline style GSAP ScrollTrigger (`translate: none`, `inset: 0px 0px 773.938px`, `position: absolute`) telah tertanam statis ke dalam markup. Saat Nuxt melakukan hidrasi, ScrollTrigger membaca DOM yang sudah termutasi sehingga kalkulasi pin dan koordinat layout rusak.

2. **Resolusi yang Diterapkan:**
   - Menarik markup SSR murni yang belum termutasi dari server (`ssr_clean.html`).
   - Memperbarui `scripts/build-localized-html.py` untuk menyuntikkan seluruh 26 stylesheet komponen langsung ke `<head>` sebelum inisialisasi script untuk mencegah Cumulative Layout Shift (CLS).
   - Memastikan `heroOverlay_homepage.avif` dirender sempurna sebagai layer grid schematics di atas video hero.

3. **Verifikasi Visual Pasca-Perbaikan:**
   - **Hero Section (`clone_0.png`):** Layer grid skematik kawat (`heroOverlay_homepage.avif`) kini tampil penuh dan presisi di atas video hero.
   - **Propositions Section (`clone_2000.png`):** Kolom arsitektur mesin dan DotLottie canvas kini berada tepat di sebelah kanan dengan dimensi penuh (560x765px), dan judul teks di sebelah kiri terbebas dari overlap (identik 100% dengan situs asli).
   - **Footer 3D WebGL Logo (`clone_8000.png`):** Wordmark 3D Three.js aktif merender vertex titik koordinat dan shading WebGL2.

---

## Status Pengujian

- `npm run check`: **ALL VERIFICATION CHECKS PASSED (100% Success)**.
- Dimensi Canvas 1 (DotLottie): **560x765px** (sebelumnya rusak di 90x168px).
- Uncaught Page Errors: **0**.
- Failed HTTP 404 Requests: **0**.
- Server lokal telah dimatikan dan port 3000 kembali bebas.

---

## Next Action
Jalankan `npm start` atau `node server.mjs` di [`/home/ravi/Projects/sharplink-clone`](file:///home/ravi/Projects/sharplink-clone) kapan pun ingin menjalankan kembali server lokal.
