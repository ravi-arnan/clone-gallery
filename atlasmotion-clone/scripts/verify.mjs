import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('=== Checking Atlas Motion Clone Assets & System Integrity ===\n');

const CRITICAL_FILES = [
  // HTML Routes
  'index.html',
  '404.html',
  'thesis/index.html',
  'writing/index.html',
  'writing/atlas-testing/index.html',
  'contact/index.html',
  'order/index.html',
  'terms-and-conditions/index.html',
  'privacy-policy/index.html',

  // Core Bundles
  '_astro/atlas-testing.BbucaGFz.css',
  '_astro/hoisted.CysLIoj6.js',
  '_astro/index.Dtw1uRVs.js',
  '_astro/orderStorefront.BpL46G_d.js',
  '_astro/staticInteractions.wQ4pCrWG.js',

  // 3D Buffer Models (.buf)
  'models/CAMERA.buf',
  'models/DRONE_BASE.buf',
  'models/DRONE_BLADE.buf',
  'models/ENGINE_ANIMATION.buf',
  'models/MOUNTAIN_FG.buf',
  'models/JDM_part_01.buf',
  'models/JDM_part_02.buf',
  'models/JDM_part_03.buf',
  'models/JDM_part_05.buf',
  'models/JDM_part_06_a.buf',
  'models/JDM_part_06_b.buf',
  'models/JDM_part_07.buf',
  'models/JDM_part_08.buf',
  'models/JDM_part_09.buf',
  'models/JDM_part_10.buf',
  'models/JDM_part_11.buf',

  // Textures
  'textures/hero/CLOUD_A.webp',
  'textures/hero/CLOUD_B.webp',
  'textures/hero/CLOUD_C.webp',
  'textures/hero/CLOUD_ALPHAS.webp',
  'textures/hero/BASE.webp',
  'textures/hero/TERRAIN_BG.webp',
  'textures/hero/TERRAIN_FG.webp',
  'textures/hero/TERRAIN_FG_ALPHA.webp',
  'textures/hero/brush.png',
  'textures/gallery/1.webp',
  'textures/gallery/2.webp',
  'textures/gallery/3.webp',
  'textures/gallery/4.webp',
  'textures/gallery/5.webp',
  'textures/gallery/6.webp',
  'textures/ROBOT/ROBOT.webp',
  'textures/ROBOT/ROBOT_2.png',
  'textures/TERRAIN/HEIGHT.webp',
  'textures/smaa-search.png',
  'textures/smaa-area.png',
  'textures/diffuse.png',
  'textures/specular.png',
  'textures/brdf.png',
  'textures/LDR_RGB1_0.png',

  // Fonts
  'fonts/SuisseIntl-Book.woff',
  'fonts/SuisseIntl-Medium.woff',
  'fonts/SuisseIntl.woff',

  // Videos
  'videos/video.mp4',
  'videos/video_MOBILE.mp4',

  // Images
  'images/home-video-poster.jpg',
  'images/home-drone-fallback.jpg',
  'images/home-motor-fallback.jpg',
  'images/home-thesis.webp',
  'images/home-thesis_MOBILE.webp',
  'images/gallery-thumbnails/1_THUMBNAIL.webp',
  'images/gallery-thumbnails/2_THUMBNAIL.webp',
  'images/gallery-thumbnails/3_THUMBNAIL.webp',
  'images/gallery-thumbnails/4_THUMBNAIL.webp',
  'images/gallery-thumbnails/5_THUMBNAIL.webp',
  'images/gallery-thumbnails/6_THUMBNAIL.webp',
  'images/home-build-to-spec__bgimage.webp',
  'images/home-build-to-spec__bgimage_MOBILE.webp',
  'images/blog/tested-beyond-the-limit/hero.png',
  'images/blog/tested-beyond-the-limit/propulsion-system.svg',
  'images/blog/tested-beyond-the-limit/thrust-over-time.svg',
  'images/thesis/hero.webp',
  'images/thesis/hero_MOBILE.webp',
  'images/order/2207-primary-v2.webp',
  'images/order/3115-primary-v8.webp',
  'images/order/4112-primary-v4.webp',

  // Meta
  'meta/apple-touch-icon.png',
  'meta/favicon-16x16.png',
  'meta/favicon-32x32.png',
  'meta/og_image.jpg',
  'meta/site.webmanifest',
];

let missing = 0;
let checked = 0;

for (const relPath of CRITICAL_FILES) {
  const fullPath = path.join(PUBLIC_DIR, relPath);
  checked++;
  if (!fs.existsSync(fullPath)) {
    console.error(`[MISSING] ${relPath}`);
    missing++;
  } else {
    const size = fs.statSync(fullPath).size;
    if (size === 0) {
      console.error(`[EMPTY] ${relPath}`);
      missing++;
    }
  }
}

// Count all files in public
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const full = path.join(dirPath, file);
    if (fs.statSync(full).isDirectory()) {
      arrayOfFiles = getAllFiles(full, arrayOfFiles);
    } else {
      arrayOfFiles.push(full);
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(PUBLIC_DIR);
let totalBytes = 0;
for (const f of allFiles) {
  totalBytes += fs.statSync(f).size;
}

console.log(`Checked ${checked} critical paths.`);
if (missing === 0) {
  console.log(`All critical assets present and non-empty!`);
} else {
  console.error(`Found ${missing} missing or empty assets!`);
  process.exit(1);
}

console.log('\n--- Repository Asset Stats ---');
console.log(`Total public assets: ${allFiles.length} files`);
console.log(`Total storage size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

// Detailed stats by asset type
const counts = {
  models_buf: allFiles.filter(f => f.endsWith('.buf')).length,
  textures_webp: allFiles.filter(f => f.includes('/textures/') && f.endsWith('.webp')).length,
  textures_png_jpg: allFiles.filter(f => f.includes('/textures/') && (f.endsWith('.png') || f.endsWith('.jpg'))).length,
  images: allFiles.filter(f => f.includes('/images/')).length,
  videos_mp4: allFiles.filter(f => f.endsWith('.mp4')).length,
  fonts: allFiles.filter(f => f.endsWith('.woff') || f.endsWith('.woff2')).length,
  html_pages: allFiles.filter(f => f.endsWith('.html')).length,
  js_css: allFiles.filter(f => f.endsWith('.js') || f.endsWith('.css')).length,
};

console.log('\nAsset Breakdown:');
console.log(`- 3D Buffer Models (.buf): ${counts.models_buf}`);
console.log(`- 3D Textures (WebP): ${counts.textures_webp}`);
console.log(`- 3D Textures (PNG/JPG): ${counts.textures_png_jpg}`);
console.log(`- UI Images & SVGs: ${counts.images}`);
console.log(`- Video Showcase (.mp4): ${counts.videos_mp4}`);
console.log(`- Web Fonts (.woff): ${counts.fonts}`);
console.log(`- HTML Pages & Routes: ${counts.html_pages}`);
console.log(`- Core JS & CSS Bundles: ${counts.js_css}`);
console.log('\nVerification PASSED 100%!');
