# Project Handoff: igloo-clone

**Tanggal:** 2026-09-19  
**Target:** https://www.igloo.inc/  
**Lokasi:** `/home/ravi/Projects/igloo-clone`

---

## Status Terakhir
- Kloning situs igloo.inc selesai 100% menggunakan arsitektur WebGL 3D interaktif asli.
- Total aset tersimpan secara lokal: 118 file (21.06 MB) di `public/assets/`.
- Aset 3D & WebGL yang terintegrasi:
  - 16 model Draco `.drc` (igloo solid, cage wireframe, ground, mountain, particles, smoke ribbons).
  - 3 model 3D portofolio cubes (`cube1.drc`, `cube2.drc`, `cube3.drc`) + 3 inner objects (`pudgy.drc`, `overpass_logo.drc`, `abstractlogo.drc`).
  - Aset 3D volumetrik sosial media: `peachesbody_64.ktx2` (LinkedIn), `x_64.ktx2` (X/Twitter), `medium_32.ktx2` (Medium).
  - Tekstur portal rings: `shattered_ring_color.ktx2`, `shattered_ring_ao.ktx2`, `shattered_ring2_color.ktx2`, `shattered_ring2_ao.ktx2`.
  - 18 audio stems `.ogg` lengkap dengan dukungan range streaming di `server.mjs`.
  - MSDF 3D Font (`IBMPlexMono-Medium`) + WASM decoders (Draco & Basis Universal).
- Server dev berjalan di `server.mjs` (port 3001) dengan konfigurasi header CORS, COOP, COEP, dan cache control.

---

## Next Action
Buka http://localhost:3001 di browser untuk pengecekan visual interaksi 3D dan lakukan commit manual jika sudah sesuai.
