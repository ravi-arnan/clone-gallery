# KPRVerse Page Topology & Architecture

## Overview
- **Target URL:** `https://kprverse.com/`
- **Application Framework:** Nuxt 3 / Vue 3 SSR
- **3D / WebGL Stack:** Three.js, Draco Decompression (`draco_decoder.wasm`), KTX2 / Basis Universal Transcoding (`basis_transcoder.wasm`), Custom GLSL Shaders
- **Animation Stack:** GSAP 3 (GreenSock), ScrollTrigger, RAF loops, Custom virtual smooth scroll
- **Audio Engine:** HTML5 Audio / Web Audio with dynamic frequency visualizer and UI SFX trigger bus

---

## Component & Layer Hierarchy

```
Root Viewport (window)
│
├── WebGL Canvas Layer (Fixed fullscreen background z-index: 1)
│   ├── Three.js WebGLRenderer (ToneMapping, ACESFilmic, Antialias)
│   ├── Camera System (PerspectiveCamera, dynamic FOV, smooth lerp transition)
│   ├── Scene Manager (Scene Switching / Blending):
│   │   ├── Tableaux-Keep (GLB: tableaux-keep-2048.glb, character lights, beam ship, kai)
│   │   ├── Tableaux-Factions (GLB: tableaux-factions-2048.glb, energy left/right sprites)
│   │   ├── Tableaux-Universe (GLB: tableaux-universe-2048.glb, beam, magic, sky glow)
│   │   ├── Project Story (GLB: project-2048.glb, hair & cloth animated sprite overlays)
│   │   └── Collection Showcase (GLB: collection-2048.glb, 3D character podium)
│   └── Post-Processing / Shaders (Noise, flick, color grading, custom GLSL materials)
│
├── HUD & Frame Layer (Fixed overlay z-index: 50)
│   ├── the-frame.vue (Top/Bottom/Left/Right border frame, technical grid lines)
│   ├── the-frame-progress.vue (Scroll-scrubbed progress indicator with hex counters)
│   ├── the-frame-submenu.vue (Contextual breadcrumbs, section markers, citizen status)
│   └── corner-cut-svg.vue (Cyberpunk sci-fi chamfered corner decorations)
│
├── Navigation & Header Layer (Fixed top z-index: 100)
│   ├── logo-kpr.vue (Animated SVG / canvas logo)
│   ├── btn-burger.vue (Interactive menu toggle with sound trigger)
│   ├── btn-audio.vue (Equalizer bar visualizer driven by GSAP, mute/unmute control)
│   ├── btn-wallet-connect.vue (Web3 wallet modal trigger)
│   └── the-menu.vue (Fullscreen overlay navigation with staggered entry animations)
│       └── menu-nav-item.vue (Lime-green highlight hover state, audio rollover)
│
├── Content & Story Flow (Scrollable document body z-index: 20)
│   ├── Hero Section ("New Eden / Keeper Universe")
│   ├── Tableaux Section (Interactive 3D storytelling portals with camera zoom)
│   ├── Project Story (Lore, concept art, character models, design pillars)
│   ├── Collection Showcase (Interactive 3D carousel, character specs)
│   └── Footer Section (Achievements, downloads, social links, legal notices)
│
└── Modals & Interactive Overlays (Fixed top z-index: 200)
    ├── the-popup-gallery.vue (High-res artwork inspection gallery)
    ├── the-console.vue (Interactive retro sci-fi terminal with live command stream)
    ├── wallet-connect.vue (Metamask / WalletConnect connection dialog)
    └── widescreen-warning.vue / landscape-warning.vue (Device orientation guards)
```

---

## Section Details

### 1. WebGL Canvas Stage
- High-fidelity Three.js render loop running at 60 FPS.
- Pre-loaded compressed GLB models with Draco compression.
- 2048x2048 high-res PBR textures with WebP / KTX2 fallbacks.
- Multi-layer sprite sheet orchestrator for animated character light aura, energy pulses, and magic sparks.

### 2. HUD & Tech Frame
- Responsive SVG cutouts dynamically recalculating on window resize.
- IBM Plex Mono and ABC Whyte Plus typographic system.
- Live progress coordinates updating synchronously with scroll offset.

### 3. Audio & Soundscape
- Sound effects triggered on hover, click, menu toggle, carousel slide, and intro fanfare.
- Dynamic visualizer in header reacting to playback state.
