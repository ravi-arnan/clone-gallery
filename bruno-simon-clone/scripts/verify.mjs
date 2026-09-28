import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);
const STATIC_DIR = path.join(ROOT_DIR, 'static');
const SOURCES_DIR = path.join(ROOT_DIR, 'sources');

console.log('=== Checking Bruno Simon Portfolio Clone Assets & Integrity ===');

const CRITICAL_STATIC_FILES = [
  // Core Textures & Preloads
  'palette.ktx',
  'palette.png',
  'intro/sound.ktx',
  'behindTheScene/stars.ktx',
  
  // 3D Models & Geometries
  'respawns/respawnsReferences-compressed.glb',
  'vehicle/default-compressed.glb',
  'vehicle/oldSchool-compressed.glb',
  'playground/playgroundVisual-compressed.glb',
  'playground/playgroundPhysical-compressed.glb',
  'terrain/terrain-compressed.glb',
  'foliage/foliageSDF.ktx',
  'bushes/bushesReferences-compressed.glb',
  'flowers/flowersReferences-compressed.glb',
  'bricks/bricks-compressed.glb',
  'explosiveCrates/explosiveCrates-compressed.glb',
  'lanterns/lanterns-compressed.glb',
  'benches/benches-compressed.glb',
  'tornado/tornadoPathReferences-compressed.glb',
  'jukebox/jukeboxMusicNotes.ktx',

  // Audio Engine Stems & Soundtracks
  'sounds/musics/Baguira.mp3',
  'sounds/musics/Boy.mp3',
  'sounds/musics/Sudo.mp3',
  'sounds/vehicle/energy/Energy_-_force_field_8_loop.mp3',
  'sounds/vehicle/floor/wheels-on-pebbles-road.mp3',
  'sounds/wind/13582-wind-in-forest-loop.mp3',
  'sounds/rain/soundjay_rain-on-leaves_main-01.mp3',
  
  // UI & Map Layers
  'ui/map/map-day.webp',
  'ui/map/map-night.webp',
  'ui/map.svg',
  'ui/gear.svg',
  'ui/medal.svg',

  // WASM & Decoders
  'basis/basis_transcoder.wasm',
  'draco/draco_decoder.wasm',
];

const CRITICAL_SOURCE_FILES = [
  'index.html',
  'index.js',
  'threejs-override.js',
  'Game/Game.js',
  'Game/Rendering.js',
  'Game/World/World.js',
];

let missing = 0;
let totalBytes = 0;

for (const rel of CRITICAL_STATIC_FILES) {
  const full = path.join(STATIC_DIR, rel);
  if (!fs.existsSync(full)) {
    console.error(`[FAIL] Missing static file: ${rel}`);
    missing++;
  } else {
    const size = fs.statSync(full).size;
    if (size === 0) {
      console.error(`[FAIL] Empty file: ${rel}`);
      missing++;
    } else {
      totalBytes += size;
    }
  }
}

for (const rel of CRITICAL_SOURCE_FILES) {
  const full = path.join(SOURCES_DIR, rel);
  if (!fs.existsSync(full)) {
    console.error(`[FAIL] Missing source file: ${rel}`);
    missing++;
  } else {
    const size = fs.statSync(full).size;
    if (size === 0) {
      console.error(`[FAIL] Empty source file: ${rel}`);
      missing++;
    } else {
      totalBytes += size;
    }
  }
}

function walkDir(dir) {
  let count = 0;
  let bytes = 0;
  if (!fs.existsSync(dir)) return [0, 0];
  for (const item of fs.readdirSync(dir)) {
    const p = path.join(dir, item);
    const s = fs.statSync(p);
    if (s.isDirectory()) {
      const [c, b] = walkDir(p);
      count += c;
      bytes += b;
    } else {
      count++;
      bytes += s.size;
    }
  }
  return [count, bytes];
}

const [totalCount, totalAllBytes] = walkDir(STATIC_DIR);

console.log(`Verified ${CRITICAL_STATIC_FILES.length} critical static assets and ${CRITICAL_SOURCE_FILES.length} critical source files.`);
console.log(`Total static assets in repository: ${totalCount} files (${(totalAllBytes / 1024 / 1024).toFixed(2)} MB).`);

if (missing === 0) {
  console.log('[SUCCESS] All critical 3D models, textures, audio stems, and sources verified!');
  process.exit(0);
} else {
  console.error(`[ERROR] ${missing} files failed check.`);
  process.exit(1);
}
