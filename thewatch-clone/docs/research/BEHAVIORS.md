# Behaviors & Technical Specification - The Watch (FS 60P)

## 1. 3D WebGL Pipeline (Three.js)

- **Main Model:** `/assets/watch-DXFPNOEl.glb` (~9.0 MB)
  - Extensions: `KHR_materials_transmission`, `KHR_materials_ior`, `KHR_texture_transform`, `EXT_texture_webp`.
  - Self-contained textures (Draco/WASM decoder not required).
- **Secondary Model:** `/assets/model-BhXOvGiC.glb` (~209 KB)
- **HDR Environment Maps:**
  - `/assets/envmap-kW4EmG7W.exr` (1.43 MB) - primary lighting environment
  - `/assets/metal-B47qzO42.exr` (396 KB) - specular metal reflection map
  - `/assets/sunrise-B8ECBLua.exr` (1.45 MB) - warm ambient environment
- **Material System:**
  - Defined in `/assets/default-Bo472-CV.json`.
  - Features PBR metals (`metal-glossy`, `metal-brushed`, `metal-semiGlossy`), dial numbers, glass transmission, ruby pivot jewels, and anisotropic brushed finish normal maps.

---

## 2. GSAP & Timeline Choreography

- **Library:** GSAP 3.15.0 with ScrollTrigger & custom timeline orchestration.
- **Scroll Interpolation:** Camera position `(x, y, z)` and target lookAt vectors interpolated synchronously as user scrolls through sections.
- **Disassembly Timeline:**
  - Parts expand along local transformation axes with custom cubic easing (`power3.inOut`).
  - Interactive 3D pins update screen space coordinates dynamically on render loop.
- **Color Transition Timeline:**
  - Dynamic material swapping between `first` (Silver), `second` (Black), `third` (Gold), and `fourth` (Rose Gold).
  - Gallery images updated in sync via `assets/the-watch/img/images-section/${config}_${index}.webp`.

---

## 3. Typography & Design Tokens

- **Headings & Accents:** `Nekst` (Black, Bold, SemiBold, Medium, Regular, Light, Thin).
- **Body & Specs:** `Inter` (Black, Bold, ExtraBold, SemiBold, Medium, Regular, Light, ExtraLight, Thin).
- **Format:** Fully localized `.woff2`, `.woff`, and `.ttf` formats.

---

## 4. Zero-Dependency Local Runtime

- **Server:** Node.js native `http` module (`server.mjs`).
- **Features:**
  - HTTP Range streaming (HTTP 206 Partial Content).
  - Proper MIME types for WebGL binary GLB, EXR textures, and modern font formats.
  - SPA fallback routing for client-side navigation.
  - On-demand asset proxy cache fallback.
