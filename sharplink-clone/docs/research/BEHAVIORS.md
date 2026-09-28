# Interactive Behaviors & Animation Models

Target: https://www.sharplink.com/

---

## 1. 3D WebGL Logo Canvas (Three.js r179 WebGPU)
- **Selector:** `canvas.logo-canvas` inside `.webgl-wrapper`
- **Engine:** Three.js r179 WebGPU with WebGL2 fallback
- **Texture:** `/webgl/packed_texture.png`
- **Interaction Model:** Continuous time tick + cursor mouse move lerp
- **Behavior:**
  - Mouse coordinates trigger normalized position shifts (`u.value.lerp(_, dt * 7)`).
  - Vertices `[T, R, w]` calculate sine-based wave displacements.
  - Floating vertex labels (`.vertex-label`) update live with computed pixel coordinates `translate(Xpx, Ypx)` and opacity falloff.
  - Custom color node shader blends texture alpha and color gradients.

## 2. Scroll-Linked DotLottie Canvas
- **Selector:** `.dotlottie.lottie-player canvas`
- **Source Data:** `/storyblok/f/290008427472090/x/c203c1fda0/shrp_stack.json`
- **Interaction Model:** Scroll-driven / viewport intersection
- **Behavior:** Renders high-fidelity vector animation on HTML5 2D canvas in synchronization with propositions stack.

## 3. Video Background Streaming
- **Hero Video:** `shrp_homepagehero_30fps.webm` (Autoplay, Loop, Muted, Playsinline).
- **Opportunity Video:** `shrp_homeopportunity_chrome.webm` / `safari.mp4` (Autoplay, Loop, Muted, Playsinline).
- **Behavior:** Streamed via HTTP 206 Partial Content for instant start and seamless loop.

## 4. ETH Productivity Chart.js Canvas
- **Selector:** `.productivity-chart.chart canvas`
- **Interaction Model:** Data-driven animation
- **Behavior:** Fetches `/api/dashboard/impact3-data` and renders animated area chart displaying Ethereum treasury yields.

## 5. GSAP ScrollTrigger & Text Reveal
- **Selector:** `.split-line`, `.char-reveal`
- **Plugins:** GSAP Core + ScrollTrigger + CustomEase + SplitText
- **Behavior:**
  - Headers reveal lines with clip-path and translateY staggered animations.
  - Sections fade-in and pin during card transitions.
