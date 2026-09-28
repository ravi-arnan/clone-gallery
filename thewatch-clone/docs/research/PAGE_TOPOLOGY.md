# Page Topology - The Watch (FS 60P by 60fps)

## Overview
Clone of [https://thewatch.60fps.fr/](https://thewatch.60fps.fr/).
The website is a high-end luxury watch showcase featuring interactive 3D WebGL rendering (Three.js), GSAP timeline animations, smooth scroll interactions, color material switches, and interactive part disassembly.

---

## DOM Hierarchy & Entry Points

```html
<div id="app">
  <!-- 1. Preloader Overlay -->
  <div id="loader">
    <svg viewBox="0 0 700 700">
      <path stroke="#DCDCDC" d="..." />
      <path class="progress-arc" stroke="#D3D3D3" d="..." />
    </svg>
    <div><span>Now</span> loading</div>
  </div>

  <!-- 2. WebGL 3D Canvas Container -->
  <div id="canvas-wrapper">
    <!-- Three.js Canvas injected dynamically -->
  </div>

  <!-- 3. Reactive UI / Svelte Components Layer -->
  <div id="root">
    <!-- Header / Nav -->
    <header class="header">...</header>

    <!-- Interactive Sections -->
    <main class="main-content">
      <section data-section="Hero">...</section>
      <section data-section="Timeless">...</section>
      <section data-section="Details">...</section>
      <section data-section="Curves">...</section>
      <section data-section="Disassembly">...</section>
      <section data-section="Mechanism">...</section>
      <section data-section="Parts">...</section>
      <section data-section="Images">...</section>
    </main>

    <!-- Fixed Overlays & HUD -->
    <div class="hud-controls">...</div>
    <div class="color-picker">...</div>
  </div>
</div>
```

---

## Interactive Sections

1. **Hero Section (`FS 60P`)**
   - 3D watch rendering centered on screen.
   - Interactive cursor guidance ("HOLD TO EXPLORE" / "SELECT MODEL" / "SWAP").

2. **Timeless & Chronograph**
   - Value proposition typography with dual-label layouts (`firstLabel`, `secondLabel`).
   - Camera orbits and shifts focus to watch bezel and crown.

3. **Case & Finishes / Dial & Complications**
   - Close-up camera angles highlighting polished and satin-brushed metal surfaces.

4. **Interactive Disassembly Mode**
   - Exploded view of the watch mechanism.
   - Clickable / draggable 3D pins identifying:
     - Tourbillon
     - Mainplate
     - Dial
     - Barrel
     - Backplate
     - Weight

5. **Mechanical Heart & Movement**
   - 60mm automatic movement close-up inspection.
   - Technical specifications and weight metrics.

6. **Parts Catalog & Color Customizer**
   - Dynamic 4-color palette selector:
     - Silver Steel (`first`)
     - Deep Black (`second`)
     - Pure Gold (`third`)
     - Rose Gold (`fourth`)
   - 10 Mechanical parts table with weight breakdowns (Dial, Hands, Crystal, Bezel, Lugs, Strap, Buckle, Crown, Caseback, Movement).

7. **Product Gallery Showcase**
   - 5 responsive photography frames dynamically switched per selected color variant (20 high-res WebP images total).
