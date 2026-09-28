# Alche Studio Clone: Behaviors & Animation Orchestration

Target Site: [https://alche.studio/](https://alche.studio/)

---

## 1. 3D WebGL2 Engine & Three.js

- **Rendering Engine:** WebGL2 context initialized on the root background canvas.
- **3D Binary Geometry:** `common/scene.glb` (685 KB). Contains 18 meshes and 19 nodes:
  - `CrackedLogo`: Shattered / fragmented geometry segments that assemble and separate based on scroll progression.
  - `Infinite`: Mobius-strip style 3D procedural loop.
  - `Alche_A`: Stylized monogram letter mark with physical specular reflections.
  - `Alche_Outline`: Wireframe edge highlight pass.
  - `Alche_SideScreen`: Textured auxiliary side surface.
  - `ThumbnailScreen`: Dynamic projection surface showcasing portfolio thumbnails in 3D perspective.
  - `Curve.001`, `Curve.003`, `Curve.004`: Vector bezier ribbons winding through 3D space.
- **Environment Lighting & Reflection:**
  - 6-face CubeTexture loaded from `envmap/px.png`, `nx.png`, `py.png`, `ny.png`, `pz.png`, `nz.png`.
  - Realistic metalness, roughness, and HDR environment reflection mapping across all mesh surfaces.
- **Outro Canvas Engine:**
  - `TopPageOutro__canvas` (`#outro-canvas`) positioned at the bottom of the page (~20,980px) executing dedicated final WebGL2 vertex particle effects.

---

## 2. GSAP & ScrollTrigger Timeline

- **Scroll Interpolation:** Lenis smooth scrolling (`html.lenis`) synchronizes wheel events with sub-pixel interpolation.
- **Timeline Binding:** GSAP `ScrollTrigger` ties camera rotation, position, FOV, and mesh deformation directly to page scroll offset over 22,780 px.
- **Interactive Tweakpane Hooks:** Built-in development controls for material properties, rotation speeds, and screen mapping (`tweakpane-mainlogo-material`, `tweakpane-mainlogo-quaternion`, `tweakpane-mainlogo-screen`).
- **Dynamic Text Scramble:** `[data-scramble]` elements animate letters upon hover and scroll revelation across headers, buttons, and navigation menus.

---

## 3. Audio & Sound FX (Howler.js)

- **Sound Engine:** Howler.js initialized with mute state persistence in `localStorage("sound-muted")`.
- **Soundtracks & Triggers:**
  - `/sounds/bgm.mp3`: Ambient looping background soundtrack.
  - `/sounds/mission_in.mp3`: Triggered when the mission statement enters viewport.
  - `/sounds/typing.mp3`: Typewriter effect triggered during interactive text reveals.
  - `/sounds/works_in.mp3`: Cinematic audio cue triggered when entering the Works showcase.

---

## 4. Rich Media & Interactive Videos

- **HTML5 Video Elements:**
  - `/top/service/stellla.mp4` (5.06 MB)
  - `/top/service/ue.mp4` (4.03 MB)
  - `/top/service/uefn.mp4` (3.53 MB)
  - `/stellla/kv.mp4` (12.16 MB)
- **Streaming Protocol:** Served via HTTP Range (`bytes start-end/total`) with `HTTP 206 Partial Content` support in `server.mjs`.

---

## 5. Lottie Vector Animations

- `/common/loading/bg/data.json` & `/common/loading/logo/data.json`: Smooth vector loading screen animations.
- `/top/outro/data.json`: Complex outro animation marking page completion.
