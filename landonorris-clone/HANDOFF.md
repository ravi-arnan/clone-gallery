# Handoff: Lando Norris Website Clone

- **Tanggal**: 2026-09-26
- **Status Terakhir**: Investigasi menyeluruh dan perbaikan critical bug telah selesai. Masalah layar preloader lime "Load Norris" yang menggantung pada viewport tertentu dan ketergantungan tekstur KTX2 telah diselesaikan. Seluruh 268 aset lokal (Three.js 3D models GLB, Draco decoder WASM, HDRI lighting maps, PBR textures, MSDF fonts, Rive vector runtimes & state machines, Webflow bundles) tersaji offline. Server lokal aktif di port 3001 dengan HTTP Range 206 streaming dan fallback resolution. Hasil verifikasi automated Playwright mencatat 21/21 Canvas aktif termasuk Three.js WebGL2 pada `canvas.gl`, 0 console error, dan 0 network failure.

## Hasil Investigasi & Perbaikan Bug
1. **Viewport Texture Resolution Bug**: Script asli menggunakan logika `iQ = window.innerWidth > 991 ? "webp" : "ktx2"`. Pada viewport <= 991px (mobile, tablet, window resized, atau split screen), engine Three.js mencoba memuat tekstur `.ktx2` dan transcoder `/gl/basis/` yang tidak ada, sehingga `Promise.all` macet selamanya di preloader lime. Logika dipatch ke WebP universal (`iQ = "webp"`) dan loader diikat ke WebP di semua ukuran layar.
2. **Promise Hanging pada Loader Error**: Custom loaders di `class BZ` (`customTextureLoader`, `customModelLoader`, `customHdriLoader`, `customFontLoader`) tidak memanggil callback resolve `B()` saat terjadi onError, sehingga jika 1 aset bermasalah, aplikasi menggantung total. Telah dipatch dengan graceful error recovery `(E) => { console.error(E); B(); }`.
3. **Preloader Curtain Dismiss & Fallback**: Menambahkan handler event klik manual pada tombol "Load Norris" dan safety auto-dismiss fallback (3.5 detik) di [index.html](file:///home/ravi/Projects/clone-gallery/landonorris-clone/index.html) sehingga kurtain transisi tidak akan pernah mengunci viewport pengguna.
4. **Server Enhancements**: Menambahkan URL-decoding fallback dan route mapper `.ktx2 -> .webp` di [server.mjs](file:///home/ravi/Projects/clone-gallery/landonorris-clone/server.mjs).

## Daftar File
- [index.html](file:///home/ravi/Projects/clone-gallery/landonorris-clone/index.html): Entry point HTML lokal bebas tracker dengan safety transition dismiss.
- [original.html](file:///home/ravi/Projects/clone-gallery/landonorris-clone/original.html): Snapshot mentah live site.
- [server.mjs](file:///home/ravi/Projects/clone-gallery/landonorris-clone/server.mjs): Static server dengan dukungan HTTP 206 partial content streaming, URL decoding fallback, dan route mapper.
- [package.json](file:///home/ravi/Projects/clone-gallery/landonorris-clone/package.json): Project manifest.
- [.gitignore](file:///home/ravi/Projects/clone-gallery/landonorris-clone/.gitignore): Konfigurasi ignorasi git.
- [README.md](file:///home/ravi/Projects/clone-gallery/landonorris-clone/README.md): Dokumentasi proyek, struktur direktori, dan panduan menjalankan.
- [public/](file:///home/ravi/Projects/clone-gallery/landonorris-clone/public): Direktori penyimpanan 268 aset offline (3D GLB, HDR, Draco, PBR, Rive, JS, CSS, fonts).
- [scripts/inspect-site.mjs](file:///home/ravi/Projects/clone-gallery/landonorris-clone/scripts/inspect-site.mjs): Skrip inspeksi headless visual dan kanvas.
- [scripts/download-all-assets.py](file:///home/ravi/Projects/clone-gallery/landonorris-clone/scripts/download-all-assets.py): Downloader aset lokal.
- [scripts/build-localized-html.py](file:///home/ravi/Projects/clone-gallery/landonorris-clone/scripts/build-localized-html.py): Stripper telemetry dan patch routing aset JS/HTML.
- [scripts/verify.mjs](file:///home/ravi/Projects/clone-gallery/landonorris-clone/scripts/verify.mjs): Automated test suite untuk filesystem, HTTP endpoint, WebGL2 context, dan console logs.
- [scripts/deep-investigate.mjs](file:///home/ravi/Projects/clone-gallery/landonorris-clone/scripts/deep-investigate.mjs): Skrip investigasi multi-viewport dan scroll profiling.
- [docs/research/PAGE_TOPOLOGY.md](file:///home/ravi/Projects/clone-gallery/landonorris-clone/docs/research/PAGE_TOPOLOGY.md): Spesifikasi arsitektur 21 kanvas dan Webflow DOM layout.
- [docs/research/BEHAVIORS.md](file:///home/ravi/Projects/clone-gallery/landonorris-clone/docs/research/BEHAVIORS.md): Dokumentasi Three.js WebGL engine, GSAP ScrollTrigger, Lenis, dan Rive state machine.
- [docs/design-references/](file:///home/ravi/Projects/clone-gallery/landonorris-clone/docs/design-references): Visual reference screenshots (hero, scroll stops, mobile, verification snapshot, mouse reveal).

## Next Action
Buka `http://localhost:3001` pada browser Anda untuk memverifikasi interaksi mouse reveal fluid effect pada helm, pergerakan scroll GSAP, dan animasi Rive secara manual sebelum melakukan commit git.
