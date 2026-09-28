# Page Topology: Anime.js v4 (https://animejs.com/)

Analisis arsitektur DOM, kontainer layout, dan hierarki seksi pada website Anime.js v4.

## 1. Lapisan Utama (Layer Architecture)

Website dibangun dengan arsitektur multi-layer:
1. **Background 3D Engine (`#engine`):**
   - Canvas WebGL (`canvas#renderer`) beresolusi tinggi (2880x1800 retina).
   - Three.js r172 WebGLRenderer + Draco WASM Mesh Loader.
   - 22 Floating Modular 3D Meshes (`.glb` files) mewakili arsitektur modular Anime.js v4.
   - CSS3D / Labels Renderer (`#css-renderer`, `#labels-renderer`) untuk teks 3D dan konektor kawat SVG interaktif.
2. **Foreground Content (`.page`):**
   - Header statis/overlay (`header#site-header.ui-overlay`).
   - Kontainer utama (`main#site-content`).
   - Sticky sidebar navigation (`#site-menu` dan chapter indicators).
   - Footer komprehensif (`footer#site-footer`).

## 2. Struktur Seksi (Sections & Chapters)

Setiap seksi terikat dengan atribut `data-chapter` dan `data-label`:

| Seksi ID | data-chapter | Judul / Fungsi Utama | Interaktivitas & Demo |
| :--- | :--- | :--- | :--- |
| `#intro` | `intro` | Hero: "All-in-one animation engine" | 3D visual engine hero scene, heading sponsors |
| `#toolbox` | `toolbox` | "The complete animator's toolbox" | Grid modul & fitur Anime.js |
| `#features-gallery` | - | Gallery showcase | Carousel & preview kartu fitur |
| `#intuitive` | `intuitive` | "Intuitive API" | Interactive code editor demo (`#intuitive-demo`) |
| `#composition` | `composition` | "Enhanced transforms" | Multi-target transform demo (`#composition-demo`) |
| `#scroll` | `scroll` | "Scroll Observer" | Viewport synchronization & scroll scrubbing |
| `#staggering` | `staggering` | "Advanced staggering" | 2D Canvas grid wave demo (`.staggering-canvas`) |
| `#svgUtils` | `svgUtils` | "SVG toolset" | Morph, drawable SVG path & motion paths |
| `#draggable` | `draggable` | "Springs and draggable" | Interactive draggable canvas & spring physics |
| `#clockwork` | `clockwork` | "Runs like clockwork" | Engine loop, tick callbacks, precision timer |
| `#responsive` | `responsive` | "Responsive animations" | Scope & media queries |
| `#modules` | `modules` | "A lightweight and modular API" | 3D modular node tree visualization |
| `#sponsors` | `sponsors` | "Our sponsors" | Dynamic funding bar (`<funding-level>`) & sponsor grids |
| `#get-started` | `get-started` | "Start animating" | NPM installation, copy button, bundle size metrics |
| `#site-footer` | - | Footer | Version switcher, documentation links, social, newsletter |

## 3. Komponen Kustom (Web Components)

- `<funding-level>`: Mengambil data persentase dan daftar sponsor GitHub secara dinamis.
- `<sponsors-list>`: Merender logo sponsor (Platinum & Silver) dengan layout grid responsif.
- `<email-signup>`: Form pendaftaran newsletter terisolasi dengan state handling lokal.
