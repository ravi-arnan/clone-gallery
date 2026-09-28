# Checkpoint & Handoff: oryzo-clone

- **Tanggal:** 2026-09-26 20:45:00 +08:00
- **Target Asal:** https://oryzo.ai/
- **Lokasi Proyek:** `/home/ravi/Projects/clone-gallery/oryzo-clone`

---

## Status Terakhir
- **Penyelesaian Kloning Penuh (100% Fully Animated & 3D WebGL2 / Gaussian Splatting):**
  - **Arsitektur Multi-Kanvas 3D WebGL2:** 6 kanvas aktif beroperasi secara harmonis merender 3D Gaussian Splats (`props.sog`, `table_reflection.sog`), WebAssembly radix sort worker (`splat_sorter_bg-BfJrILzx.wasm`), kurva vektor 2D, dan runtime Rive vector animation.
  - **Model 3D Biner & Trajektori Kamera:** 26 file model buffer biner (`.buf`) berisi geometri coaster, tangan AI, meja kerja, cangkir kopi, dan tardigrada mikroskopik tersimpan dan terhubung secara lokal tanpa ketergantungan CDN luar.
  - **Rive Vector Animation Engine:** Model animasi vektor Rive (`oryzo.riv`) dan runtime WebAssembly (`/libs/rive/rive.wasm`) beroperasi 100% secara offline.
  - **PBR Texturing & Efek Optik:** Lebih dari 40 tekstur beresolusi tinggi (BaseColor, Metallic, Roughness, Gobo light projections, SMAA antialiasing) tersimpan mandiri di `public/textures/`.
  - **Video Showcase Streaming:** Video showcase (`bite.mp4`, `yoga.mp4`) didukung penuh dengan streaming HTTP Range 206 dan mock lokal untuk Vimeo oEmbed.
  - **Tipografi & Desain:** Font DM Mono, Literata, MSDF Inter bitmap, dan Neue Haas Grotesk termuat dari penyimpanan lokal.
- **Hasil Verifikasi:**
  - `node scripts/verify.mjs`: **ALL INTEGRITY, WEBGL & ANIMATION CHECKS PASSED (100% Success)**.
  - Total aset tersimpan: 147 berkas (23.77 MB di `public/`).
  - Status endpoint: 12/12 rute lolos uji `HTTP 200 OK` / `HTTP 206 Partial Content`.
  - Status server: Server dev lokal dihentikan (port 3001 bebas). Jalankan `npm run dev` untuk menyalakannya kembali.

---

## Daftar Berkas Baru / Diubah
- `index.html`, `original.html`
- `package.json`, `server.mjs`, `.gitignore`, `README.md`, `HANDOFF.md`
- `public/` (berisi `_astro/`, `splats/`, `models/`, `rive/`, `libs/`, `fonts/`, `images/`, `textures/`, `meta/`)
- `scripts/inspect-site.mjs`, `scripts/download-all-assets.py`, `scripts/build-localized-html.py`, `scripts/verify.mjs`
- `docs/research/PAGE_TOPOLOGY.md`, `docs/research/BEHAVIORS.md`, `docs/research/inspection.json`, `docs/research/network-requests.json`
- `docs/design-references/` (screenshot hero, mobile hero, stop per scroll stop, dan verification clone)

---

## Next Action
Jalankan `npm run dev` di folder `oryzo-clone/`, lalu buka `http://localhost:3001` untuk verifikasi visual dan lakukan git commit bila sudah sesuai.
