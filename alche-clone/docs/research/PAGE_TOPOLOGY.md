# Alche Studio Clone: Page Topology

Target Site: [https://alche.studio/](https://alche.studio/)  
Clone Location: `/home/ravi/Projects/clone-gallery/alche-clone` (symlinked at `/home/ravi/Projects/alche-clone`)

---

## 1. Viewport & Canvas Layout

The page utilizes a multi-layer stacking architecture designed around a fullscreen 3D WebGL2 canvas that sits behind and alongside DOM text elements:

```
[Viewport 1440x900]
  ├── [Z-Index 0] WebGL2 Background & 3D Interactive Canvas
  │     ├── Scene: scene.glb (CrackedLogo, Infinite, Alche_A, Alche_Outline, Alche_SideScreen, ThumbnailScreen)
  │     ├── Environment Map: 6-face CubeTexture (px, nx, py, ny, pz, nz)
  │     └── Shaders: Specular reflectance, vertex morphing, and camera tracking
  ├── [Z-Index 10] Flow Content (Length: ~22,780 px)
  │     ├── TopHeader / Navigation (Top, News, Works, About, Stellla, Contact)
  │     ├── Hero Title & Mission Statement Section
  │     ├── Featured Works Section (run for money in Fortnite, RADWIMPS Role Playing Music, etc.)
  │     ├── Services Showcase (Stellla, Unreal Engine, UEFN Video Showcase)
  │     ├── Stellla Platform Feature Highlights & Specs
  │     └── Footer (Navigation columns, social links, recruit, privacy & copyright)
  ├── [Z-Index 20] TopPageOutro Section (at Y: ~20,980 px)
  │     ├── TopPageOutro__canvas (#outro-canvas WebGL2)
  │     ├── TopPageOutro__lottie (/top/outro/data.json)
  │     └── TopPageOutro__logo SVG
  └── [Z-Index 100] Loading Screen Overlay (#loading-overlay)
        ├── Lottie Background (/common/loading/bg/data.json)
        ├── Lottie Logo (/common/loading/logo/data.json)
        └── Loading Text & Transition
```

---

## 2. Route Hierarchy

The clone features full Single-Page Application (SPA) smooth transitions powered by Astro and Swup (`Swup.Cr7ogLqN.js`, `SwupPreloadPlugin.DQ2lZ6J5.js`, `SwupHeadPlugin.d6nb3Z__.js`):

- `/` (`index.html`) - Main Landing Page with interactive 3D WebGL2 scene
- `/about` (`about/index.html`) - Company Profile, Studio Philosophy, Collaboration Logos, Studio Team Photos
- `/news` (`news/index.html`) - Press Releases, Announcements, Article Updates
- `/works` (`works/index.html`) - Complete Portfolio Grid with Category Filtering (Fortnite, Metaverse, Mobile, Unreal Engine, VR)
- `/works/detail/*` (`works/detail/*/index.html`) - Deep Case Study Pages with Hi-Res CMS Artwork
- `/stellla` (`stellla/index.html`) - Metaverse Architecture & Platform Capabilities (with `stellla/kv.mp4`)
- `/contact` (`contact/index.html`) - Contact Portal & Inquiries
- `/privacypolicy` (`privacypolicy/index.html`) - Privacy Policy
- `/license` (`license/index.html`) - Software Licenses
