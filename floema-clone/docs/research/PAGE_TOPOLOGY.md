# Floema® Page Topology & Architecture

Target: [https://floema.com/en](https://floema.com/en)

## Overview

Floema is an award-winning digital experience crafted with Nuxt 3, Vue 3, Three.js (WebGPU/Node & WebGL rendering pipelines), GSAP ScrollTrigger timeline choreography, Pizzicato Web Audio soundscapes, and Sanity headless CMS.

## Page Component Hierarchy

```
App Root (Nuxt Layout)
├── Header & Global Navigation
│   ├── Floema Monogram & Brand Wordmark
│   ├── Navigation Menu (Products, Sustainability, About, Journal, Contacts)
│   ├── Language Switcher (EN, PT, ES, FR, DE)
│   └── Sound Controller (Mute / Unmute, Spatial Audio Trigger)
├── Homepage View (`data-component="homepage"`)
│   ├── Hero Section (`data-component="hero"`)
│   │   ├── Fluid Typography Title ("Spaces for people, made for life")
│   │   ├── Brand Narrative Parallax Grid
│   │   └── Interactive Mouse Indicator
│   ├── Collections Overview (`data-component="collections-overview"`)
│   │   ├── Ambient Shadow Container (`.shadows`)
│   │   ├── Urban Collection Card
│   │   ├── Golf Collection Card
│   │   ├── Nature Collection Card
│   │   └── Replastic Collection Card
│   ├── Sustainability Statement & Interactive Parallax Showcase
│   ├── Featured Products Showcase
│   │   ├── Palmer Tee Sign (Golf)
│   │   └── Byside Bench Plaza (Urban)
│   ├── Interactive 3D Model Viewer (`ModelView` & Web Worker)
│   │   ├── OrbitControls (Pointer Capture, Damping, Pitch/Yaw clamping)
│   │   ├── High-Dynamic-Range EXR Studio Lighting
│   │   ├── Draco Decompression Pipeline (WASM)
│   │   └── Zoom In / Zoom Out Controls
│   └── Bottom Group & Ambient Particles (`.bottomGroupCanvasContainer`)
│       └── Three.js WebGL Particle & Shadow Simulation (`ShadowsPortal`)
└── Footer
    ├── Newsletter Subscription
    ├── Certifications & Social Links
    └── Legal Disclaimers & Copyright Notice
```

## Layering & Z-Index Structure

- `z-index: 100`: Navigation bar & sound controls (fixed overlay).
- `z-index: 50`: Interactive modals, product 3D viewports.
- `z-index: 10`: Flow content & interactive sections.
- `z-index: 1`: Ambient WebGL particle canvas & shadow layers.
- `z-index: 0`: Background styling & gradients.
