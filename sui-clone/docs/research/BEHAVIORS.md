# Animation & Behavior Specification: Sui.io

## 1. Engine Animasi & Dependensi

1. **GSAP 3.15 Suite (Core + Plugins):**
   - `gsap.min.js`: Core tween engine
   - `ScrollTrigger.min.js`: Scroll-driven pinning, scrub, dynamic triggers
   - `SplitText.min.js`: Tipografi kata/huruf stagger
   - `CustomEase.min.js`: Bézier timing kurva
   - `InertiaPlugin.min.js`: Momentum scrolling & drag physics
   - `Observer.min.js`: Viewport gestures & touch handling
   - `Draggable.min.js`: Interactive elements
   - `DrawSVGPlugin.min.js`: SVG path tracing & line animations
   - `ScrambleTextPlugin.min.js`: Cyberpunk / hacker text decode effect pada hover
   - `MorphSVGPlugin.min.js`: Transisi bentuk vektor
   - `Flip.min.js`: Smooth layout transitions

2. **Lenis Smooth Scroll v1.3.23:**
   - Smooth interpolation dengan parameter `lerp: 0.12, syncTouch: true`.
   - Terhubung dengan `gsap.ticker` untuk 60fps/120fps sync tanpa stutter.

3. **3D Image Sequence Player (`.canvas_sequence`):**
   - 76 WebP render sequence (frame_0000.webp s/d frame_0075.webp) di-render di atas Canvas 2D.
   - Pinned saat memasuki viewport (`[home-trigger]`), loop range [10..48], scrub ke full scroll timeline.
   - Menggambar frame dengan aspect ratio cover dan membersihkan canvas setiap frame.

4. **Rive Animation Runtime:**
   - Rive WebGL/Canvas WASM runtime memuat aset vektor interaktif:
     - `Data Storage.riv`
     - `Verifiable Off Chain.riv`
     - `Identity Management.riv`
     - `Asset and Service Coordination.riv`
     - `Data Security.riv`
     - `Liquidity Management.riv`
   - State machine: `State Machine 1`, Artboard: `Artboard`, autoplay: `true`.

5. **Lottie JSON Engine:**
   - 13 File JSON Lottie dimuat dinamis saat viewport intersection atau tab switch.
   - Aset: Intro to Sui Stack, Gaming, Institutions, DeFi, AI, World, Onchain Validation, Research, Security, Developer, Assets, Community.

6. **Procedural Grain Overlay (`.noise.absolutetop`):**
   - Canvas noise generator memberikan tekstur filmic grain di seluruh latar belakang hero.

7. **Text Scramble & Shuffle Hover:**
   - Atribut `[global="scrumble"]` memicu ScrambleTextPlugin saat mouse enter.
   - Atribut `[global="shuffleHover"]` memicu letter swapping animasi.
