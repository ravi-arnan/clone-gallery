# clone-gallery

Galeri clone situs untuk studi frontend (animasi, scrollytelling, WebGL). Satu repo monorepo, tiap folder satu clone.

## Isi

- abeto-messenger-clone
- alche-clone
- animejs-clone
- atlasmotion-clone
- blueyard-clone
- bruno-simon-clone
- cornrevolution-clone
- era-residence-clone
- floema-clone
- igloo-clone
- kprverse-clone
- landonorris-clone
- lusion-clone
- mana-clone
- oryzo-clone
- pear-clone
- sharplink-clone
- shopify-winter2026-clone
- string-tune-clone
- sui-clone
- terminal-industries-clone
- thewatch-clone

## Catatan

- `node_modules/`, `dist/`, `.next/`, `build/` tidak ikut repo (lihat `.gitignore`).
- 5 symlink ke `/mnt/external` (AtlasMotionClone, blueyard-cloner, bugatti-clone, stripe-clone, wazuh-dashboard-clone) sengaja di-exclude karena target tidak tersedia dan mengandung aset scraped privat.
- Tiap subfolder punya `README.md`, `server.mjs`, dan `docs/` sendiri. Jalankan per folder, bukan dari root.
