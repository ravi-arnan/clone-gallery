import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('=== Checking Igloo Clone Assets & Integrity ===');

const CRITICAL_FILES = [
  'index.html',
  'assets/index-2eb69c09.js',
  'assets/App3D-f554a111.js',
  'assets/audioworker-036a09db.js',
  'assets/bitmapworker-046527f8.js',
  'assets/exrworker-41cbee65.js',
  'assets/msdfworker-ac346fa7.js',
  'assets/libs/draco/draco_decoder.wasm',
  'assets/libs/basis/basis_transcoder.wasm',
  'assets/fonts/IBMPlexMono-Medium.json',
  'assets/fonts/IBMPlexMono-Medium-datatexture.ktx2',
  
  // Core Scene Geometries
  'assets/geometries/igloo.drc',
  'assets/geometries/igloo/igloo_cage.drc',
  'assets/geometries/igloo/igloo_outline.drc',
  'assets/geometries/mountain.drc',
  'assets/geometries/ground.drc',
  'assets/geometries/floor.drc',

  // Portal Rings & Geometries
  'assets/geometries/shattered_ring.drc',
  'assets/geometries/shattered_ring2.drc',
  'assets/geometries/shattered_ring_smoke.drc',
  'assets/images/shattered_ring_color.ktx2',
  'assets/images/shattered_ring_ao.ktx2',
  'assets/images/shattered_ring2_color.ktx2',
  'assets/images/shattered_ring2_ao.ktx2',

  // Portfolio 3D Objects & Cubes
  'assets/geometries/cubes/cube1.drc',
  'assets/geometries/cubes/cube2.drc',
  'assets/geometries/cubes/cube3.drc',
  'assets/geometries/pudgy.drc',
  'assets/geometries/overpass_logo.drc',
  'assets/geometries/abstractlogo.drc',
  'assets/images/cubes/pudgy_color.ktx2',
  'assets/images/cubes/overpass_logo_color.ktx2',
  'assets/images/cubes/abstractlogo_color.ktx2',
  'assets/images/pudgy_dark_color.ktx2',
  'assets/images/overpass_logo_dark_color.ktx2',
  'assets/images/abstractlogo_dark_color.ktx2',
  'assets/images/cubes/cube1_normal.ktx2',
  'assets/images/cubes/cube2_normal.ktx2',
  'assets/images/cubes/cube3_normal.ktx2',

  // Social Media 3D Volumetric Assets
  'assets/images/volumes/peachesbody_64.ktx2',
  'assets/images/volumes/x_64.ktx2',
  'assets/images/volumes/medium_32.ktx2',
  'assets/volumes/peachesbody_64.ktx2',
  'assets/volumes/x_64.ktx2',
  'assets/volumes/medium_32.ktx2',

  // Audio & Core Textures
  'assets/audio/wind.ogg',
  'assets/audio/igloo.ogg',
  'assets/audio/music-highq.ogg',
  'assets/audio/manifesto.ogg',
  'assets/images/igloo/igloo_scene.ktx2',
  'assets/images/igloo/igloo_color.ktx2',
  'assets/images/igloo/igloo_exploded_color.ktx2',
  'assets/images/cubes_env.exr',
  'assets/images/scroll-datatexture.ktx2',
];

let missing = 0;
let totalBytes = 0;

for (const rel of CRITICAL_FILES) {
  const full = path.join(PUBLIC_DIR, rel);
  if (!fs.existsSync(full)) {
    console.error(`[FAIL] Missing critical file: ${rel}`);
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

function walkDir(dir) {
  let count = 0;
  let bytes = 0;
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

const [totalCount, totalAllBytes] = walkDir(PUBLIC_DIR);

console.log(`Verified ${CRITICAL_FILES.length} critical assets.`);
console.log(`Total public assets: ${totalCount} files (${(totalAllBytes / 1024 / 1024).toFixed(2)} MB).`);

if (missing === 0) {
  console.log('[SUCCESS] All portal, social media 3D assets, and critical files present and verified!');
  process.exit(0);
} else {
  console.error(`[ERROR] ${missing} files failed check.`);
  process.exit(1);
}
