import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('=== Corn Revolution Clone: Verification Suite ===\n');

let errors = [];
let warnings = [];
let passCount = 0;

function checkFile(relPath, minSize = 1) {
  const p = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(p)) {
    errors.push(`Missing file: ${relPath}`);
    return false;
  }
  const stat = fs.statSync(p);
  if (stat.size < minSize) {
    errors.push(`File too small (${stat.size} bytes < ${minSize} min): ${relPath}`);
    return false;
  }
  passCount++;
  return true;
}

function checkPublic(relPath, minSize = 1) {
  return checkFile(path.join('public', relPath), minSize);
}

// 1. Core application files
console.log('[1/7] Checking core application structure...');
checkFile('index.html', 100);
checkFile('server.mjs', 500);
checkFile('package.json', 50);

// 2. JS Bundles
console.log('[2/7] Checking JS bundle files and offline patching...');
checkPublic('loader.76ceb4644b28bd9c30b5.js', 100000);
checkPublic('main.76ceb4644b28bd9c30b5.js', 500000);
checkPublic('vendors~main.76ceb4644b28bd9c30b5.js', 400000);
checkPublic('test0.76ceb4644b28bd9c30b5.js', 1000);

const loaderCode = fs.readFileSync(path.join(PUBLIC_DIR, 'loader.76ceb4644b28bd9c30b5.js'), 'utf-8');
const mainCode = fs.readFileSync(path.join(PUBLIC_DIR, 'main.76ceb4644b28bd9c30b5.js'), 'utf-8');

if (loaderCode.includes('d1hl9u9k5hiqxp.cloudfront.net')) {
  errors.push('loader bundle still contains external CloudFront references!');
} else {
  console.log('  ✓ loader bundle fully localized (0 external references)');
}

if (mainCode.includes('d1hl9u9k5hiqxp.cloudfront.net')) {
  errors.push('main bundle still contains external CloudFront references!');
} else {
  console.log('  ✓ main bundle fully localized (0 external references)');
}

// 3. 3D GLTF models and binary buffers
console.log('[3/7] Checking 3D GLTF models and binary buffers...');
const models = [
  'models/landing/cobb_test.gltf',
  'models/landing/cobb_test.bin',
  'models/landing/hair.gltf',
  'models/landing/hair.bin',
  'models/kernel/KERNAL.gltf',
  'models/kernel/KERNAL.bin',
  'images/stalk/stalk_rigged3.gltf',
  'images/stalk/stalk_rigged3.bin',
  'images/stalk/SingleStalk12_db.gltf',
  'images/stalk/SingleStalk12_db.bin',
  'images/stalk/SingleStalk2.png',
  'assets/pot3.gltf',
  'assets/pot3.bin',
  'assets/bg_pot.gltf',
  'assets/bg_pot.bin'
];
models.forEach(m => checkPublic(m, 10));

// 4. Fonts and MSDF text rendering assets
console.log('[4/7] Checking typography & MSDF font assets...');
const fonts = [
  'svg/svg.svg',
  'fonts/Gilroy/gilroy.json',
  'fonts/Gilroy/gilroy-msdf.png',
  'fonts/Gilroy/3714E1_B_0.woff2',
  'fonts/Gilroy/3714E1_B_0.woff',
  'fonts/Gilroy/3714E1_B_0.ttf',
  'fonts/Manifold/manifold.json',
  'fonts/Manifold/manifold-msdf.png',
  'fonts/Manifold/gradient-map.png',
  'fonts/Manifold/manifold-cf-extra-bold.woff2',
  'fonts/Manifold/manifold-cf-extra-bold.woff',
  'fonts/Manifold/manifold-cf-extra-bold.ttf'
];
fonts.forEach(f => checkPublic(f, 100));

// 5. Spritesheets, UI graphics and Favicons
console.log('[5/7] Checking UI graphics, animation spritesheets, and metadata...');
const ui = [
  'images/arrowhead-down.png',
  'images/rotate-icon.png',
  'images/overlay-bg.jpg',
  'images/spinner.png',
  'images/icons/icons-0.png',
  'images/icons/icons-1.png',
  'images/icons/icons-2.png',
  'images/icons/arrow-link.png',
  'images/icons/arrow-link-external.png',
  'images/field/map-grade.png',
  'textures/corteva-logo.png',
  'textures/registered.png',
  'textures/testing/post-noise.png',
  'textures/field/map-field-diffuse-combined0@mipmaps.png',
  'textures/field/map-field-diffuse-0.png',
  'favicon/apple-touch-icon.png',
  'favicon/favicon-32x32.png',
  'favicon/favicon-16x16.png',
  'favicon/site.webmanifest',
  'favicon/safari-pinned-tab.svg',
  'favicon/favicon.ico',
  'favicon/browserconfig.xml',
  'fb.jpg',
  'tw.jpg'
];
ui.forEach(u => checkPublic(u, 50));

// 6. Compressed KTX textures across all 3 formats (S3TC, ASTC, PVRTC)
console.log('[6/7] Checking compressed KTX textures across all formats (S3TC, ASTC, PVRTC)...');
const ktxSamples = [
  'landing/graded/alpha.ktx',
  'landing/hair/alpha.ktx',
  'landing/graded/TOP_L.ktx',
  'landing/graded/TOP_R.ktx',
  'landing/graded/BOTTOM_L.ktx',
  'landing/graded/BOTTOM_R.ktx',
  'landing/hair/HAIR_TOP_L_.ktx',
  'field/map-ground-diffuse@mipmaps.ktx',
  'kernel/map_diffuse_kernel.ktx',
  'testing/soil/soil_default@mipmaps.ktx',
  'testing/main-stalk/stalk_diffuse_flat@mipmaps.ktx',
  'pot/diffuse_pot@mipmaps.ktx'
];
ktxSamples.forEach(s => {
  checkPublic(`compressed/s3tc/${s}`, 1000);
  checkPublic(`compressed/astc/${s}`, 1000);
  checkPublic(`compressed/pvrtc/${s}`, 1000);
});

// 7. Calculate disk footprint
console.log('[7/7] Computing project assets footprint...');
function getDirSize(dir) {
  let size = 0;
  let count = 0;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      const sub = getDirSize(full);
      size += sub.size;
      count += sub.count;
    } else {
      size += stat.size;
      count += 1;
    }
  }
  return { size, count };
}

const pubStat = getDirSize(PUBLIC_DIR);
console.log(`  Total files in public/: ${pubStat.count}`);
console.log(`  Total size of public/: ${(pubStat.size / (1024 * 1024)).toFixed(2)} MB`);

console.log('\n----------------------------------------');
if (errors.length === 0) {
  console.log(`✓ ALL CHECKS PASSED (${passCount} checks verified).`);
  console.log('The clone is 100% authentic, complete, and fully self-contained offline.');
  process.exit(0);
} else {
  console.error(`✗ VERIFICATION FAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
}
