# KPRVerse Behaviors & Technical Specification

## 1. WebGL 3D Simulation & Shaders
- **Engine:** Three.js (custom compiled bundle: `three.module.c9112413.js`).
- **Binary Model Ingestion:**
  - GLTF 2.0 Binary buffers (`.glb`) loaded via `THREE.GLTFLoader`.
  - Compressed meshes decoded via Google Draco WebAssembly (`draco_decoder.wasm`).
  - Basis Universal / KTX2 texture transcoder (`basis_transcoder.wasm`) unpacking GPU ETC1S/UASTC textures directly into VRAM.
- **Scene Switching & Camera Transitions:**
  - Dynamic interpolation between camera keyframes mapped to scroll progress.
  - Multi-scene composition: Keep, Factions, Universe, Project, and Collection.
  - Linear interpolation (`lerp`) and cubic easing smoothing camera movement and orientation.
- **Custom Shaders & Materials:**
  - ACESFilmic tone mapping with sRGB color space output.
  - Procedural noise displacement and screen-space scanline / flicker effects.
  - Specular highlights, alpha-blended sprite sequences, and additive glow blend modes.

---

## 2. Sprite Sheet & 2D FX Animation System
- **Sprite Orchestration:**
  - Frame-accurate spritesheet playback synchronized with RAF.
  - JSON coordinate definition parsing texture atlas frames (`images/sheets/*.json`, `images/tableau/*/*.json`).
  - Interactive multi-layer animations:
    - Character light aura (`character-light-0/1/2`)
    - Beam ship propulsion (`beam-ship-0/1/2`)
    - Kai avatar sequences (`kai-0/1/2/3`)
    - Energy hand charges (`energy-left-0/1`, `energy-right-0/1`)
    - Quantum particle beams (`beam-0/1/2/3/4`)
    - Magic pulse (`magic-0`)
    - Dynamic hair & cloth simulations (`male-hair`, `female-hair`, `female-cloth`)

---

## 3. GSAP & Scroll Orchestration
- **Timeline Control:**
  - GSAP 3 timeline scrubbers bound to scroll progress (`useScrollTrigger`).
  - Header audio visualizer reactive scale tweens (`gsap.to(line, { scaleY: ..., repeat: -1 })`).
  - Staggered curtain reveals for navigational items and modal sheets.
  - Hacky text / decrypter effect on labels during hover and section transitions.

---

## 4. Audio Engine & Sound FX
- **Audio Bus Architecture:**
  - Sound FX pool mapped to UI interaction hooks (`hover-sfx.90813991.js`, `btn-audio.19359f99.js`).
  - Sound library:
    - `UI_menu_OPEN.mp3` & `UI_menu_CLOSE.mp3`
    - `UI_menu_rollover.mp3` & `UI_menu_text_rollover.mp3`
    - `FX_character_carousel_1/2/3.mp3`
    - `FX_ALT_intro_animation.mp3` & `FX_logo_intro_animation.mp3`
    - `FX_press_sheen.mp3`
    - `FX_flow_transition_RELEASE.mp3`
    - `FX_text_animation_loop.mp3`
- **Audio Mute/Unmute State:**
  - Global audio state persisted across sections.
  - Dynamic SVG equalizer bars animate in response to sound playback.
