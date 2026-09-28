# Page Topology & Architecture: Pioneer – Corn. Revolutionized.

**Target Site:** `https://cornrevolution.resn.global/`  
**Created By:** Resn for Pioneer / Corteva Agriscience  
**Clone Target Directory:** `/home/ravi/Projects/cornrevolution-clone`

---

## 1. DOM Hierarchy & Core Mount Points

```html
<body>
    <!-- 1. Scroll proxy for capturing user scroll inputs and scrub timing -->
    <div data-ui="scrollProxy"></div>

    <!-- 2. WebGL Canvas and HTML overlay container -->
    <div data-ui="root" class="root">
        <!-- Injected WebGL canvas (Three.js WebGLRenderer) -->
        <!-- Injected UI overlay (Nav, side progress, hotspot markers, modal copy) -->
    </div>

    <!-- 3. WebGL fallback for unsupported browsers/devices -->
    <div id="unsupported" class="unsupported" style="display: none">
        <div class="unsupported__bg"></div>
        <svg class="unsupported__logo">...</svg>
        <div class="unsupported__inner">
            <h2 class="unsupported__title title3">This experience does not work on this browser.</h2>
            <h2 class="body">Try it out using Chrome, Firefox, Safari or Edge.</h2>
        </div>
    </div>
</body>
```

---

## 2. Five Sequential Sections Breakdown

The experience is structured around 5 interactive 3D WebGL scenes connected via GSAP timeline transitions:

### Section 1: Landing (The Ear / Cob)
- **3D Assets:**
  - `models/landing/cobb_test.gltf` + `cobb_test.bin` (Corn cob geometry & armature bones)
  - `models/landing/hair.gltf` + `hair.bin` (Corn silk strands)
- **Textures:** Graded 4-quadrant textures (`TOP_L.ktx`, `TOP_R.ktx`, `BOTTOM_L.ktx`, `BOTTOM_R.ktx`, `alpha.ktx`)
- **Effects:** Post-processing noise (`post-noise.png`), 3D particle dust, intro title animation.

### Section 2: Science (DNA & Lab Seedling)
- **3D Assets:**
  - `assets/pot3.gltf` + `pot3.bin` (Growing seedling in pot)
  - `assets/bg_pot.gltf` + `bg_pot.bin` (Background ambient geometry)
- **Textures:** `pot/diffuse_pot@mipmaps.ktx`, `pot/bg_pot_diffuse.ktx`
- **Features:** DNA double-helix particle spline, infographic rings, interactive hotspot data callouts.

### Section 3: Stalk (The Corn Plant & Biology)
- **3D Assets:**
  - `images/stalk/stalk_rigged3.gltf` + `stalk_rigged3.bin` (Rigged stalk skeleton)
  - `images/stalk/SingleStalk12_db.gltf` + `SingleStalk12_db.bin` + `SingleStalk2.png` (Detail geometry)
- **Textures:** Soil layers (`soil_default`, `soil_nutrients_clay`, `soil_nutrients_loam`, `soil_nutrients_sand`), plant shadow, energy channel, rain texture, lens flare.
- **UI & Spritesheets:** 1200 frames across `images/icons/icons-{0,1,2}.png` (30 FPS 100x100px animation sequences).

### Section 4: Field (Precision Agriculture & Aerial Grid)
- **Instanced Mesh Pipeline:** Thousands of corn crop instances (`tile-instances-material.js`, `tile-instances-vs.glsl`).
- **Textures:** `textures/field/map-field-diffuse-combined0@mipmaps.png`, `map-ground-diffuse@mipmaps.ktx`, `map-cloud-noise@mipmaps.ktx`, `images/field/map-grade.png`.
- **Camera:** Orbit controls, cinematic sweep over crop field rows.

### Section 5: Result (Kernel Anatomy & Impact)
- **3D Assets:**
  - `models/kernel/KERNAL.gltf` + `KERNAL.bin` (Central high-res kernel model)
- **Textures:** `kernel/map_diffuse_kernel.ktx`, `map_bump_kernel.ktx`, `map_matcap_mult.ktx`, `map_matcap_screen.ktx`, `map_bg.ktx`.
- **Physics Simulation:** Traer spring-mass physics driving floating cluster particles around the kernel.
- **Hotspots:** Interactive clickable pins revealing product science details and Corteva Agriscience footer.

---

## 3. Typography & UI Assets

- **MSDF (Multi-channel Signed Distance Field) Text:**
  - `fonts/Gilroy/gilroy.json` & `fonts/Gilroy/gilroy-msdf.png`
  - `fonts/Manifold/manifold.json` & `fonts/Manifold/manifold-msdf.png` & `gradient-map.png`
- **Web Fonts:**
  - Gilroy (`3714E1_B_0.woff2`, `.woff`, `.ttf`)
  - Manifold CF Extra Bold (`manifold-cf-extra-bold.woff2`, `.woff`, `.ttf`)
- **Vector Icons:** `svg/svg.svg` containing all UI iconography symbols.
