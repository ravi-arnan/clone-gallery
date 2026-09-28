# Behaviors & Animation Pipeline: Terminal Industries

## 1. Frame-Accurate Canvas Sequence Engine
- **Web Worker Architecture (`video-sequence.worker-B5BJOqje.js`):**
  - Worker asynchronously streams batches of 8 WebP frames (`Arr.spliceNth(l, 8)` with 50ms interval) to prevent UI thread stutter.
  - Converts network streams into `Blob` and transfers them to the main thread as Object URLs.
  - Main thread sorts and draws frames to HTML5 `<canvas>` via 2D context using `fitAndPosition(contain/cover)`.
- **High-DPI Retina Scaling:**
  - Dynamic DPR scaling: `canvas.width = offsetWidth * window.devicePixelRatio`, with CSS pixel dimension matching.
  - Context scaled by DPR to prevent blurriness on Retina displays.

## 2. GSAP & ScrollTrigger Choreography
- **Hero Scrub:**
  - Timeline bound to scroll progress `t => { s.value = t.progress }`.
  - Content headlines fade in/out with `pow2.out` and `pow2.in` character opacities and `--c-lime` accent highlights.
- **Floating Cursor Follower:**
  - `mouseDamp` linear interpolation on `gsap.ticker`.
  - Pulsing text animation loops smoothly until scroll engagement.
- **Text Reveal & Splitting:**
  - SplitText splits headings and text blocks into lines and chars.
  - Masked line animation: `yPercent: 100 -> 0`, ease `expo.out`, duration `1.2s`, stagger `0.04s`.

## 3. Smooth Scrolling
- **Lenis:**
  - Virtual scroll normalized across trackpad and mousewheel.
  - Synchronized with GSAP `ScrollTrigger.update()` on every frame.
