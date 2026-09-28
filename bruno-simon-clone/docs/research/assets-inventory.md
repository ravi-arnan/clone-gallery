# Bruno Simon Portfolio — Assets Inventory

## 1. Summary
- **Total Local Assets**: 958 files
- **Total Assets Size**: 193.25 MB
- **Location**: `static/` (served seamlessly by Vite dev & standalone Node.js server)

---

## 2. Asset Type Breakdown

| Extension | Count | Category / Purpose |
|---|---|---|
| `.png` | 376 | Texture atlases, normal maps, noise masks, UI fallbacks |
| `.webp` | 283 | Optimized UI previews, map layers, flag icons, rewards |
| `.ktx` | 88 | GPU-compressed KTX2/Basis textures for Three.js shaders |
| `.mp3` | 88 | Complete spatial SFX, vehicle audio, ambient loops, music |
| `.glb` | 64 | Compressed 3D GLTF models (playground, terrain, cars, trees, props) |
| `.svg` | 25 | Vector UI icons, controls, crosshairs, modal buttons |
| `.woff2` / `.woff` | 8 | Web fonts (Nunito, Amatic SC, Pally) |
| `.ttf` / `.eot` | 8 | Legacy typography fallbacks |
| `.wasm` | 3 | Rapier 3D WebAssembly physics engine & Basis decoders |
| `.wav` | 3 | High-fidelity impact audio clips |
| `.webmanifest` / `.ico` | 2 | PWA manifest & favicon icons |
| `.js` / `.md` | 10 | Draco loaders, worker scripts, and documentation |

---

## 3. Key 3D Models (`.glb`)
- `respawns/respawnsReferences-compressed.glb`
- `playground/playgroundVisual-compressed.glb`
- `playground/playgroundPhysical-compressed.glb`
- `vehicle/default-compressed.glb` & `vehicle/oldSchool-compressed.glb`
- `terrain/terrain-compressed.glb`
- `birchTrees/birchTreesVisual-compressed.glb` & `cherryTrees/cherryTreesVisual-compressed.glb`
- `bushes/bushesReferences-compressed.glb`
- `benches/benches-compressed.glb`
- `bricks/bricks-compressed.glb`
- `explosiveCrates/explosiveCrates-compressed.glb`
- `lanterns/lanterns-compressed.glb`
- `tornado/tornado-compressed.glb`
- `jukebox/jukebox-compressed.glb`

---

## 4. Audio Stems (`static/sounds/`)
- **Vehicular**: Engine force field, suspension squeaks, pebble rolling, tire friction
- **Environment**: Rain on leaves, howling wolves, forest winds, crickets, thunder strikes, lake waves
- **Interactables**: Mechanical clicks, slides, assembling parts, domino bricks, crate explosions
- **Original Soundtracks**: `Baguira.mp3`, `Boy.mp3`, `Sudo.mp3` by Kounine
