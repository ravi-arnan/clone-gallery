import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

console.log('=== FLOEMA CLONE COMPREHENSIVE INTEGRITY VERIFICATION ===\n');

let errors = 0;
let passes = 0;

function checkFile(relPath, minBytes = 1) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`  [FAIL] Missing: ${relPath}`);
    errors++;
    return false;
  }
  const stat = fs.statSync(fullPath);
  if (stat.size < minBytes) {
    console.error(`  [FAIL] File too small (${stat.size} bytes): ${relPath}`);
    errors++;
    return false;
  }
  console.log(`  [PASS] ${relPath} (${stat.size.toLocaleString()} bytes)`);
  passes++;
  return true;
}

console.log('1. Core Application Files:');
checkFile('index.html', 1000);
checkFile('server.mjs', 500);
checkFile('package.json', 100);

console.log('\n2. Favicon & Icons:');
checkFile('public/favicon.ico', 100);
checkFile('public/favicon.svg', 100);
checkFile('public/favicon-64x64.png', 500);
checkFile('public/apple-touch-icon.png', 1000);

console.log('\n3. Wireframe SVGs & UI Visuals:');
checkFile('public/imgs/wireframes/bike-station.svg', 1000);
checkFile('public/imgs/wireframes/chair.svg', 1000);
checkFile('public/imgs/wireframes/table.svg', 1000);
checkFile('public/imgs/wireframes/waterfountain.svg', 1000);
checkFile('public/imgs/temp/product-cropped.png', 500000);

console.log('\n4. Primary Nuxt Bundles & CSS:');
checkFile('public/_nuxt/DOn5zXw2.js', 10000);
checkFile('public/_nuxt/entry.D9Lu-YTe.css', 10000);
checkFile('public/_nuxt/groq.CepGutwA.css', 500);
checkFile('public/_nuxt/ModelView.CI1QsZ_0.css', 100);
checkFile('public/_nuxt/ShadowsPortal.CgH3YUsE.css', 100);

console.log('\n5. Web Workers for 3D & Shadows:');
checkFile('public/_nuxt/Images.worker-DJGdEiMP.js', 500000);
checkFile('public/_nuxt/Shadows.worker-C5dCWLRm.js', 500000);
checkFile('public/_nuxt/ModelView.worker-ChHUB9To.js', 500000);

console.log('\n6. 3D WebGL Assets & Envmaps:');
checkFile('public/3d/shadows/packed_texture_3.png', 100000);
checkFile('public/3d/shadows/noiseTexture.png', 10000);
checkFile('public/3d/envmaps/HDR_Light_Studio_Free_HDRI_Design_13.exr', 500000);
checkFile('public/draco/draco_decoder.wasm', 100000);
checkFile('public/draco/draco_wasm_wrapper.js', 10000);
checkFile('public/draco/draco_decoder.js', 100000);

console.log('\n7. Decoded 3D Models:');
checkFile('public/models/palmer-tee-sign.glb', 10000);
checkFile('public/models/byside-bench-plaza.glb', 2000);

console.log('\n8. Variable Typography:');
checkFile('public/_nuxt/Zimula-Variable.Cb2n2uX-.ttf', 100000);

console.log('\n9. Ambient Audio Soundscapes:');
const audios = [
  'about-foreground.mp3',
  'kingfisher-assustou-se.mp3',
  'olw-leaving.mp3',
  'sustainability-bike.mp3',
  'sustainability-foreground-0.mp3',
  'sustainability-foreground-1.mp3',
  'sustainability-foreground-synth.mp3'
];
for (const a of audios) {
  checkFile(path.join('public/audio', a), 10000);
}

console.log('\n10. Sanity Images & Files Cache:');
const sanityImgDir = path.join(PUBLIC, 'cdn.sanity.io/images/535lnz3g/production');
const sanityFileDir = path.join(PUBLIC, 'cdn.sanity.io/files/535lnz3g/production');

let imgCount = 0;
if (fs.existsSync(sanityImgDir)) {
  imgCount = fs.readdirSync(sanityImgDir).length;
  console.log(`  [PASS] Cached ${imgCount} Sanity images locally`);
  passes++;
} else {
  console.error('  [FAIL] Missing Sanity image cache');
  errors++;
}

let fileCount = 0;
if (fs.existsSync(sanityFileDir)) {
  fileCount = fs.readdirSync(sanityFileDir).length;
  console.log(`  [PASS] Cached ${fileCount} Sanity files locally`);
  passes++;
} else {
  console.error('  [FAIL] Missing Sanity files cache');
  errors++;
}

console.log(`\nVerification Summary: ${passes} passed, ${errors} failed. (Total Sanity assets: ${imgCount + fileCount})`);
if (errors > 0) {
  process.exit(1);
} else {
  console.log('All integrity checks passed successfully!');
}
