# Page Topology & Canvas Architecture: Lando Norris Clone

## 1. Executive Summary
Situs `https://landonorris.com/` adalah interactive WebGL & vector-motion showcase untuk pembalap Formula 1 Lando Norris. Situs ini menggabungkan struktur DOM Webflow responsif, Three.js (r174) untuk visualisasi 3D real-time (helm, sirkuit, dan material PBR), serta Rive Vector Runtimes untuk interaksi mikro dan tipografi kinetik.

---

## 2. Canvas & Rendering Pipeline

Situs ini mengorkestrasi total **21 Canvas elements**:

```
+--------------------------------------------------------------------------+
| Browser Viewport                                                         |
|                                                                          |
|  [Canvas 20: Three.js WebGL2 Engine (class="gl")]                        |
|  - Fullscreen fixed background/foreground layer                          |
|  - Renders 3D Helmet (helmet-21.glb, disco-02.glb)                       |
|  - Renders Track layouts (tracks-06-test.glb)                            |
|  - Custom WebGL Shaders, MSDF Text rendering & PBR Lighting (HDR)        |
|                                                                          |
|  [DOM Overlay (Webflow Layout)]                                           |
|  +--------------------------------------------------------------------+  |
|  | Header / Navigation (LN4 logo, navigation triggers)                |  |
|  +--------------------------------------------------------------------+  |
|  | Hero Section (Interactive 3D viewport, intro typography)           |  |
|  +--------------------------------------------------------------------+  |
|  | Canvases 0-19: Rive Vector Animation Instances                     |  |
|  |  - page-transition.riv (Transitions & curtain reveal)              |  |
|  |  - phrases.riv (Dynamic typography and text reveal)               |  |
|  |  - signature.riv (Lando's dynamic hand-drawn signature)            |  |
|  |  - ln4.riv (LN4 dynamic emblem morph)                              |  |
|  |  - circuits.riv (Interactive track circuit maps)                   |  |
|  |  - reef.riv & btn-ui.riv (Interactive UI button feedback)          |  |
|  |  - mob-landscape.riv (Mobile orientation graphics)                 |  |
|  +--------------------------------------------------------------------+  |
|  | Content Sections: Bio, Career Stats, Helmet Vault, Partners, Merch|  |
|  +--------------------------------------------------------------------+  |
+--------------------------------------------------------------------------+
```

### Detailed Canvas Breakdown:
1. **Three.js WebGL2 Canvas (`canvas.gl`)**:
   - Selector: `canvas.gl` (terletak di index 20 dalam urutan DOM canvas).
   - Dimensi: Dynamic full viewport (misal 1440x900 atau 1920x1080).
   - Render Loop: RequestAnimationFrame terhubung ke Lenis Smooth Scroll dan GSAP ScrollTrigger.
   - PBR Materials: Metallic/Roughness maps, Gold foil texture, Disco ball matcaps, dan normal maps.
2. **Rive Animation Canvases (Canvases 0 s/d 19)**:
   - Didukung oleh `@rive-app/canvas-lite` WebAssembly engine (`/libs/rive/rive.wasm`).
   - Masing-masing diikat ke komponen UI spesifik (tombol nav, signature Lando, track overview, icon LN4).

---

## 3. DOM & Section Hierarchy

Dokumen HTML memiliki tinggi total scrollable ~13,577 px (desktop) yang dibagi ke dalam segmen-segmen utama:

1. **Preloader & Page Curtain**:
   - Menggunakan `page-transition.riv` dan background scene WebGL untuk transisi halus saat halaman dibuka.
2. **Hero Viewport (`.section-hero`)**:
   - Tampilan utama helm 3D Lando Norris yang dapat dirotasi dan merespons pergerakan kursor mouse.
   - Tipografi dinamis MSDF dan Webflow font stack (Mona Sans).
3. **Bio & Quote Showcase**:
   - `phrases.riv` dan tipografi kinetik yang merespons scroll progress.
4. **Helmet Archive / 3D Customizer**:
   - Model helm berganti varian material secara dinamis (Gold edition, Disco edition, Standard livery) menggunakan texture maps lokal (`Norris_Helmet_mat_BaseColor.webp`).
5. **Race Calendar & Circuits (`tracks-06-test.glb`)**:
   - Visualisasi sirkuit F1 dalam bentuk 3D spline/mesh dengan camera dolly antar sirkuit.
6. **Partners & Brand Vault**:
   - McLaren, Quadrant, Pure Electric, Tumi, Bell Helmets, dll.
7. **Merchandise & Shop Teaser**:
   - Grid kartu interaktif dengan hover animation.
8. **Footer & Signature**:
   - `signature.riv` yang menggambar tanda tangan resmi Lando Norris saat viewport masuk.

---

## 4. Asset Routing Topology

Semua aset eksternal telah dilokalisasi sepenuhnya ke direktori `public/`:
- **3D Assets & Shaders**: `/gl/` (Models: `/gl/models/`, HDRI: `/gl/hdri/`, Draco: `/gl/draco/`, Fonts: `/gl/fonts/`, Textures: `/gl/textures/`).
- **Rive Vector Files**: `/rive/` (`*.riv`).
- **WebAssembly Runtimes**: `/libs/rive/rive.wasm` dan `/gl/draco/draco_decoder.wasm`.
- **Core Scripts**: `/dev-js/lando-by-OFF+BRAND.05.js` dan Webflow bundles di `cdn-website-files/`.
