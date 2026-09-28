# Behaviors & Motion Specification: Anime.js v4

Dokumentasi perilaku dinamis, motion engine, Three.js 3D rendering, dan interaktivitas pada Anime.js v4.

## 1. Engine 3D Three.js & Draco WASM

1. **Inisialisasi WebGL:**
   - Diinisialisasi di `#engine` melalui class `Ft` dalam `home.js`.
   - Menggunakan Three.js `WebGLRenderer` dengan resolusi retina (`devicePixelRatio` adaptif), `powerPreference: "high-performance"`.
   - Background scene: `#FFFFFF` (putih bersih) dengan lighting terarah dan material PBR / Matcap.

2. **22 Model GLB Modular & Draco Compression:**
   - Model 3D dikompresi menggunakan Google Draco format `.drc` dalam container `.glb`.
   - Engine menginisialisasi `DRACOLoader` via `./assets/draco/` (`draco_decoder.wasm` dan `draco_wasm_wrapper.js`).
   - Seluruh 22 modul dimuat secara asinkron:
     `module-animate-01.glb`, `module-draggable-01.glb`, `module-draggable-02.glb`, `module-easing-01.glb`, `module-engine-01.glb`, `module-renderer-01.glb`, `module-scope-01.glb`, `module-scroll-01.glb`, `module-shield-01.glb`, `module-shield-02.glb`, `module-spring-01.glb`, `module-stagger-01.glb`, `module-stagger-02.glb`, `module-svg-01.glb`, `module-timeline-01.glb`, `module-timeline-02.glb`, `module-timer-01.glb`, `module-timer-02.glb`, `module-timer-03.glb`, `module-timer-04.glb`, `module-timer-05.glb`, `module-waapi-01.glb`.

3. **Motion & Posisi 3D:**
   - Model melayang (floating) dengan rotasi halus di idle state.
   - Posisi kamera dan posisi mesh terikat dengan scroll window (`onScroll` observer). Saat pengunjung menggulir halaman, model bergerak dinamis dan menyusun diri sesuai konteks seksi yang sedang aktif.
   - Garis konektor SVG (`polyline#path-animation`) menghubungkan modul-modul 3D secara dinamis di koordinat layar.

## 2. Canvas 2D & Interactive Code Demos

1. **Grid Staggering (`.staggering-canvas`):**
   - Canvas 2D (800x800) merender matriks titik/grid yang merespons pointer pengguna dan timeline gelombang stagger.
2. **Heart & Shapes Demos (`.heart-canvas`, `.dotted-grid-canvas`):**
   - Menggambarkan kalkulasi koordinat matematika dan path morphing.
3. **Easings Lines & Dots (`.easings-lines-canvas`, `.easings-dots-canvas`):**
   - Memvisualisasikan kurva easing (Spring, CubicBezier, Steps) yang diambil dari `assets/json/easings.json`.
4. **Interactive Demos Engine (`documentation-demos`):**
   - Berkas 2.2MB yang memuat runner live-code demo untuk setiap seksi modul (Timeline, Timer, Animatable, Draggable, Scope, onScroll, SVG, Utilities, Easings, WAAPI).

## 3. Tipografi & Gaya Desain

- **Font Utama:** DINish (`DINish[slnt,wdth,wght].woff2`) untuk body text dan heading.
- **Font Kode / Teknis:** Berkeley Mono (`BerkeleyMono-Regular.woff2`, `BerkeleyMono-Italic.woff2`) untuk blok sintaks dan label UI.
- **Font Display:** Digital-7 (`Digital-7MonoItalic.woff2`) untuk elemen indikator digital.
- **Warna Identitas:** Monokromatik kontras tinggi dengan aksen warna cerah pada badge fitur dan grafik easing.
