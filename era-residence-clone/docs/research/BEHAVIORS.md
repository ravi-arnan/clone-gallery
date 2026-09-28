# ERA Residence — Animation & Behavioral Specification

## Overview
All motion choreography in ERA Residence is orchestrated via **GSAP 3.15** with custom cubic-bezier curves, Lenis virtual smooth scrolling, and scroll-linked timeline scrubbing.

---

## 1. Custom Easing Functions (CustomEase)

The site registers 7 custom cubic bezier easings:

| Name | Bezier String | Usage Context |
| :--- | :--- | :--- |
| `InOut` | `0.75, 0, 0.25, 1` | Primary symmetric transitions, modal reveals, scale transforms |
| `Out` | `0.25, 1, 0.5, 1` | Entry animations, element clip-path reveals, slide-ins |
| `In` | `0.5, 0, 0.75, 0` | Exit animations, scale-up fadeouts |
| `Ease` | `0.25, 0.1, 0.25, 1` | Subtle image parallax and background drifts |
| `Write` | `0.333, 0, 0.667, 1` | Editorial typography char/word letter reveals |
| `diveIn` | `0.6, 0, 0, 1` | Deep perspective zoom entries |
| `horScroll` | `0.25, 0, 0.75, 1` | Horizontal pinned track translation acceleration curve |

---

## 2. Master Scroll Choreography (`initTranistionFlow`)

### A. Hero Section Scrub
- **Trigger:** `.hero-scroll-area`, `start: "top top"`, `end: "bottom bottom"`, `scrub: true`.
- **Target 1:** `.hero-s` moves `y: -(1.25 * height - window.innerHeight)` with ease `"Ease"`.
- **Target 2:** `.hero-w_bg` moves `y: -(height - window.innerHeight)` with ease `"Ease"`.
- **Target 3:** Background `.hero-w_bg` scales from `1` to `2` with `translateZ(10)` and `transformOrigin: "50% 75%"`.

### B. Circular Typography Expansion
- **Trigger:** `.benefits-intro-w`, `start: "top bottom"`, `end: "bottom top"`, `scrub: true`.
- **Target:** `[data-circle-text]` animates `wordSpacing` from `0rem` to `10rem` linearly (`ease: "none"`).

### C. Horizontal Location Track
- **Breakpoint:** Desktop (`min-width: 992px`).
- **Mechanism:** Pinned virtual track where vertical page scroll is translated to horizontal X position:
  - Height of container `.loc-scroll-area` dynamically set to `track.scrollWidth`.
  - GSAP tween: `x: -(track.scrollWidth - offsetWidth)` with ease `"horScroll"`, `scrub: 0.25`.
- **Layered Elements:**
  - Track titles (`.loc-intro-s_title_line`) shift opposite directions (`xPercent: [-5, 25, -15]` to `[5, -25, 25]`).
  - 3D flower asset (`.flower.loc-intro`) moves `xPercent: 0` to `-25`.
  - 3D flower asset (`.flower.loc-path`) moves `yPercent: 0` to `25`.
  - Path image reveals via `clipPath: inset(0% 100% 0% 0%)` -> `inset(0% 0% 0% 0%)`.

### D. Architecture Polygon Clip-Path Morph
- **Trigger:** `.arch-scroll-area`, `start: "top bottom"`, `end: "200% top"`, `scrub: true`.
- **Dual Polygonal Masks:**
  - Left mask (`.arch-intro-s_bg_l`): Morphs complex 10-point polygon coordinates.
  - Right mask (`.arch-intro-s_bg_r`): Morphs symmetrical 10-point polygon coordinates.
- **3D Flower Scale & Spread:**
  - Left flower (`.flower.arch-intro-l`): `scale: 1.84`, `xPercent: -50`.
  - Right flower (`.flower.arch-intro-r`): `scale: 1.84`, `xPercent: 50`.
- **Wrapper Zoom:** `.arch-w` transforms from `scale: 0.75` to `scale: 1`.

### E. Footer Inset Morphing
- **Trigger:** `.footer-w`, `start: "top 30%"`, `end: "bottom bottom"`, `scrub: 0.5`.
- **Mask:** `[data-footer-clip]` morphs from `inset(0% 0% 0% 0%)` to `inset(8% 22% 8% 22%)` on desktop, or `inset(4% 32% 4% 32%)` on mobile.
- **Content:** Inner content `.footer-s` fades and scales from `opacity: 0, scale: 0.75` to `opacity: 1, scale: 1`.

---

## 3. Typography Motion (`SplitText`)

- **Headings (`animateTextH`):** Split into lines and words. Masked within overflow hidden wrappers, rising from `yPercent: 100` to `yPercent: 0` with staggered delays (`0.08s`).
- **Body Text (`animateTextP`):** Split into lines, fading in and sliding up gently (`y: 20px -> 0`, `opacity: 0 -> 1`).
- **Call-to-Action Counters (`animateCtn`):** Interactive digit counters counting upwards when triggered by viewport entry.

---

## 4. Virtual Smooth Scrolling (Lenis)

- Initialized on window: `new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })`.
- Connected to GSAP ticker:
  ```javascript
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  ```
- Supports local scroll containers (`initLocalLenis`) for modal drawers and detailed apartment floor plans.
