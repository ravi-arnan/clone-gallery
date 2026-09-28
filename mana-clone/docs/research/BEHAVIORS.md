# Behaviors & Interactive Architecture: Mana Yerba Maté

## 1. WebGL 3D Can Rendering & Physics

- **Engine:** Three.js with `WebGLRenderer`, `PerspectiveCamera(40, 1, 1, 200)`, `AmbientLight(0xffffff, 0.45)`, `ACESFilmicToneMapping`, `sRGBEncoding`.
- **Environment Lighting:** `RGBELoader` loading `MANA_hdr.hdr` with `EquirectangularReflectionMapping` applied as environment map with `envMapIntensity = 2.02`.
- **Can Model:** `GLTFLoader` loading `MANA_canettes__v5_WEBGL.gltf` with companion binary buffer `MANA_canettes__v5_WEBGL.bin`.
- **PBR Textures:**
  - Normal map: `MANA_canette_top_normal copy_exr.png`
  - Roughness / metallic map: `MANA_canette_pamp_roughness__metal_maps.png`
  - Diffuse color maps dynamically swapped per flavor:
    - Pamplemousse: `MANA_canette_pamp_color_for_mat_v2.png`
    - Hibiscus: `MANA_canette_hibiscus_color_for_mat.png`
    - Tropical: `MANA_canette_tropical_color_for_mat.png`
    - Melon Mint: `MANA_canette_melon_mint_mat.png`
- **Scroll Sync:**
  - GSAP ScrollTrigger bound to `.c-HomeHero--part1` scrubbing rotation (`z: -PI, y: -PI, x: 1.12*PI`), position (`z: 20`), and canvas translateY.
  - Offscreen optimization: `ScrollTrigger` on `.offCanvas` removes the ticker when scrolled past hero, re-adds on scroll back.
- **Flavor Switching:**
  - Clicking `.heroNext` / `.heroPrev` triggers can rotation with elastic easing (`elastic.out(0.34, 0.26)`), updates body `data-boisson`, switches background color theme class (`jaune`, `violet`, `orange`, `vert`), and activates corresponding Lottie stickers.

## 2. Scroll-Pinned Benefits Dial (Part 2)

- **Interaction Model:** ScrollTrigger pin with scrub.
- **Trigger:** `.sectionCercle` pins to `top top` for `3 * window.innerWidth` distance.
- **Rotation:** `.innerCercleCartes` rotates smoothly to `-130deg`.
- **Lottie Cards:** 4 animated cards (`carte_crash.json`, `carte_caf.json`, `carte_antiox.json`, `carte_vege.json`) play on enter and pause on leave.

## 3. Review / Quote Carousel (Part 3)

- **Interaction Model:** Click-driven slider.
- **Controls:** `.quotePrev`, `.quoteNext`.
- **States:** Slides through 3 customer quotes with active `.current` classes and shadow button indicators.

## 4. Parallax & Elastic Typography

- **Image Parallax:** `.c-imagesDuo` elements translateY based on scroll progression.
- **Elastic Rainbow Letters:** `.c-wordParagraph` spans staggered with `elastic.out(2, 0.5)` on scroll entry.
- **Negative Header Mode:** `.negativ` sections trigger `.logoNeg` class on body, adapting navbar contrast.

## 5. Swiper Product Carousel

- **Engine:** Swiper.js configured for multi-column responsive layout (2 slides mobile, 3 slides desktop).
- **Hover Micro-interaction:** SVG circular mask clusters (`svgMaskThumb`) expand circles with GSAP stagger on thumbnail hover.

## 6. Playable Footer Runner Mini-Game

- **Engine:** Lottie SVG player + GSAP Timeline + Keyboard/Touch listener.
- **Character States:**
  - Running: `jeu_walk.json`
  - Jumping: `jeu_jump.json` (triggered by Spacebar, `.startGameMobile`, or tap)
  - Success catch: `jeu_happy.json` (triggered when jump catches `.denree` at progress 0.45 - 0.6)
  - Miss / Fall: `jeu_sad.json`
- **Scenery:** Continuously scrolling landscape (`jeu_paysage.json`) and looped cloud timelines (`.nuage1`, `.nuage2`).
- **Game Loop:** Clicking `.startGame` spawns `.denree` yerba can moving across screen; player must jump at the exact window to score.
