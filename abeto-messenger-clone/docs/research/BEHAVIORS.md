# Behaviors & Mechanics: Abeto Messenger

## 1. Interaction Model
- **Primary Input:** Click, drag, mouse wheel, keyboard navigation (WASD / Arrow keys), touch gestures on mobile.
- **Intro Transition:**
  1. The page loads with a spinning miniature planet in deep turquoise void.
  2. Clicking or pressing the 3D Start button triggers `intro/button-turn.ogg` and `intro/button-out.ogg`.
  3. The camera performs a smooth logarithmic zoom trajectory towards the planet surface (`camera/zoom-in-5.ogg`, `camera/whoosh2.ogg`).
  4. Atmospheric clouds clear and reveal the delivery messenger character in the main village square.
  5. The interactive HUD slides into position from the edges with spring dampening.

## 2. Spherical Character Physics & Controls
- **Planet Gravity:** Normal vectors are calculated radially outwards from the center `(0, 0, 0)`. The avatar's "up" vector aligns with the planet surface normal at the character's current position.
- **Collision Detection:** Offloaded to a dedicated Web Worker (`collisionworker-eT5h7hIA.js`) utilizing merged hitmeshes (`hitmesh_0.drc` to `hitmesh_4.drc`) to preserve solid ground and building boundaries without stalling the main render loop.
- **Locomotion States:**
  - `idle`: Natural breathing and observation loop.
  - `run`: Dynamic leg cycles with footstep sound triggers (`character/footsteps4.ogg`, `character/footsteps-water.ogg` when crossing streams).
  - `sprint`: Faster gait triggered during prolonged directional hold.
  - `jump`: Upward impulse against radial gravity, accompanied by `character/jump-start.ogg` and `character/jump-land.ogg` on surface contact.
  - `afk`: Automatic idle variations after prolonged user inactivity (`afk1`, `afk2`, `afk3`).

## 3. Web Worker Offloading Architecture
To guarantee a solid 60 FPS without micro-stutters:
- `dracoworker-9mmlh0V-.js`: Decompresses Draco geometry buffers (`.drc`) in parallel threads with `draco_decoder.wasm`.
- `bitmapworker-DtCLhbWB.js`: Decodes textures into ImageBitmaps asynchronously off the main thread.
- `geometryworker-WyEueJn9.js`: Pre-calculates vertex normals, tangent attributes, and instancing transformations.
- `collisionworker-eT5h7hIA.js`: Continuously evaluates character raycasts and collision hulls against the spherical terrain.
- `glyphworker-DoaYwstb.js`: Renders vector font glyph curves and bands into high-performance textures via `glyph.wasm`.
- `msdfworker-DGxypdow.js`: Generates multi-channel signed distance field textures for crisp UI typography at arbitrary scale.

## 4. Multi-Layered Soundscape & Audio Orchestration
The app features an interactive dynamic soundscape:
- **Spatial Ambiances:** Cross-fades dynamically based on the avatar's proximity to world regions:
  - Base village: `ambiances/base.ogg`
  - Industrial zone: `ambiances/factory.ogg`
  - Forest groves: `ambiances/forest.ogg`
  - Seaside coast: `ambiances/beach.ogg`
  - River / Cascades: `ambiances/waterfalls.ogg`
  - Sacred shrines: `ambiances/temple.ogg`
- **Dynamic Background Music:** High-fidelity polyphonic soundtrack (`music/bgmusic-highq.ogg` / `music/bgmusic-mobile.ogg`) with interactive instrumentation layers near the resident bard (`music/musician.ogg`).
- **Interactive UI Feedback:** Clicks, hovers, dialogue reveals, paper unraveling, and quest completion chimes (`ui/click2.ogg`, `ui/hover2.ogg`, `ui/paper1.ogg`, `ui/quest-complete.ogg`).

## 5. NPC Dialogue & Delivery Quests
- Approaching any NPC triggers an attention icon and interactive speech bubble (`ui/npc-icons/active.icon`).
- Voice lines with character-specific audio snippets (`dialogues/male1.ogg`, `dialogues/female2.ogg`, `dialogues/wtf.ogg`).
- Quest items are stored in the delivery pouch and delivered to target characters across the miniature world.
