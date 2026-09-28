# Sharplink Clone

Clone pixel-perfect dan fully animated dari [https://www.sharplink.com/](https://www.sharplink.com/) lengkap dengan seluruh animasi GSAP, 3D WebGL WebGPU Three.js Canvas, DotLottie, Chart.js, video looping streaming, dan mock API data dashboard.

---

## Fitur Utama

1. **Three.js WebGL2/WebGPU 3D Interactive Logo Canvas:**
   - Terletak di pre-footer dengan engine Three.js r179.
   - Menggunakan texture atlas lokal `/webgl/packed_texture.png`.
   - Reaktif terhadap pergerakan kursor mouse dengan kalkulasi displacement lerp dan koordinat vertex 3D live (`vertex-label`).

2. **Full GSAP & ScrollTrigger Animations:**
   - Animasi text reveal, staggered heading transitions, dan section pinning.
   - Slider dan card transition pada seksi propositions architecture.

3. **DotLottie Canvas Player:**
   - Memuat data animasi vektor `/storyblok/f/290008427472090/x/c203c1fda0/shrp_stack.json`.
   - Merender animasi pada elemen `<canvas>` secara lokal tanpa ketergantungan CDN eksternal.

4. **Background Video Streaming (HTTP 206 Partial Content):**
   - Hero video: `shrp_homepagehero_30fps.webm`.
   - Opportunity video: `shrp_homeopportunity_chrome.webm` / `safari.mp4`.
   - Mendukung streaming range request untuk pemutaran instan, looping mulus, dan hemat memori.

5. **ETH Productivity Chart & Dashboard API Mocks:**
   - Canvas Chart.js interaktif untuk visualisasi treasury yield Ethereum.
   - Endpoint mock lokal lengkap (`/api/dashboard/impact3-data`, `/api/dashboard/eth-coingecko`, `/api/dashboard/polygon`, dll.).

6. **100% Offline Asset Localization:**
   - 74 JS chunks, 26 stylesheet CSS, 28 file webfont woff/woff2, 17 icon SVG, dan seluruh gambar Storyblok/Nasdaq tersimpan lokal di folder `public/`.

---

## Cara Menjalankan

### 1. Menjalankan Server Lokal
```bash
npm start
# atau
node server.mjs
```
Akses di browser: [http://localhost:3000](http://localhost:3000).

### 2. Menjalankan Uji Verifikasi Otomatis
```bash
npm run check
# atau
node scripts/verify.mjs
```

### 3. Rebuild HTML Terlokalisasi (Opsional)
```bash
npm run build
```

---

## Hasil Pengujian & Verifikasi

- **Static & API Endpoints:** 11/11 PASS (200 OK)
- **Canvases Rendering:** 3/3 Aktif (Chart.js 2D, DotLottie 2D, Three.js 3D WebGL2)
- **Videos Playing:** 3/3 Autoplay mulus (readyState 4)
- **Uncaught Page Errors:** 0
- **Failed HTTP 404 Requests:** 0
