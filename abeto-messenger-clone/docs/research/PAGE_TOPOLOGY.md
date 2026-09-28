# Page Topology: Abeto Messenger (https://messenger.abeto.co/)

## Overview
- **Origin URL:** `https://messenger.abeto.co/`
- **Application Type:** Interactive 3D WebGL Spherical Open-World Game & Experience
- **Framework & Engine:** Svelte 5 / Three.js / WebGL / Draco Compression / Basis KTX2 / Web Workers

---

## Visual Hierarchy & Z-Index Layering

1. **Background & Canvas Layer (z-index: 0)**
   - WebGL Canvas (`#app canvas`): Full-viewport WebGL rendering context.
   - Sky / Atmosphere shader background (cyan/turquoise gradient `#64cfbf` to `#7ce3d5`).
   - Instanced galaxy and star particles (`galaxies.drc`, `galaxy.ktx2`, `particle_sprites.ktx2`).

2. **3D Interactive World Layer (Scene Graph)**
   - **Planet Core & Terrains:**
     - Chunked terrain geometries (`full_0.drc` to `full_9.drc`) with 4-level LOD system (`full-lod-1`, `full-lod-2`, `full-lod-3`).
     - Hitmeshes for spherical character collision detection (`hitmesh_0.drc` to `hitmesh_4.drc`).
     - Animated water surfaces (`water.drc`, `water-noises-highq.ktx2`) with reflection/refraction and beach foam VFX (`beachfoam_vfx.drc`).
     - Waterfall simulations (`waterfall_vfx.drc`, `waterfallsplash_vfx.drc`, `waterfall_inlet_vfx.drc`).
   - **Flora & Environment:**
     - Instanced tree foliage (`tree-leaves_0.drc` to `tree-leaves_4.drc`, `tree-leaves.ktx2`).
     - Animated wind-driven grass blades (`grass.drc`, `grass-blades-highq.ktx2`).
     - Floating clouds (`clouds.drc`, `clouds_noise_64.ktx2`, `clouds_noise_512.ktx2`).
     - Flying butterflies on parametric curves (`butterflies.drc`, `butterfly-highq.ktx2`).
     - Overhead birds looping along spline trajectories (`birds/1.drc`, `birds/2.drc`, `curve-1.drc`, `curve-2.drc`).
     - Telecommunication / electrical cables strung between buildings (`cables-1.drc`, `cables-2.drc`).
   - **Playable Character (Delivery Messenger):**
     - Skinned mesh with bone hierarchy (`avatar-bones.drc`).
     - Customizable modular accessories (hair, top, bottom, shoes, base skin).
     - State-driven animation clips (idle, walk, run, sprint, jump-start, in-air, jump-land, AFK 1-3).
   - **Interactive NPCs & Quests:**
     - 17 unique NPC models across the planet (alien, boss, caveman, chef, diver, factory workers, scientists, musician, office worker, old woman, owl, scout, young lady).
     - Individual speech bubble triggers and audio voice lines (`dialogues/*.ogg`).
     - Delivery items (`clothes.drc`, `letterwet.drc`, `note.drc`, `offering.drc`, `postcard.drc`, `samplebox.drc`).
   - **3D Floating Emojis:**
     - 10 draggable/selectable 3D emoji meshes (`emojis/1.drc` to `emojis/10.drc`).

3. **DOM & HUD Layer (z-index: 10 - 100)**
   - **Intro Screen Overlay:**
     - Stylized vertical title (`title_vertical.drc`).
     - Start delivery interactive CTA button (`button.drc`, `intro/button-turn.ogg`, `intro/button-out.ogg`).
   - **In-Game HUD & Controls:**
     - Sound toggle button (Muted / Active).
     - Delivery quest checklist / log dialog (`ui/sidebuttons/list.icon`, `ui/openbox-checklist.ogg`).
     - Character customization wardrobe (`ui/sidebuttons/t-shirt.icon`, `ui/customize.ogg`).
     - Emoji reaction drawer.
     - Dialogue modal box with dynamic glyph font rendering (`heading.font`, `UglyDave-Alternates-optimized.font`).
     - Directional navigation arrows (`ui/arrow.icon`).
