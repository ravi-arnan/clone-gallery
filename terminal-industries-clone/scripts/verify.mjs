import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('=== Terminal Industries Asset Integrity Verification ===\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function checkFile(relPath, minBytes = 1) {
  totalChecks++;
  const fullPath = path.join(PUBLIC_DIR, relPath);
  if (fs.existsSync(fullPath)) {
    const size = fs.statSync(fullPath).size;
    if (size >= minBytes) {
      passedChecks++;
      return true;
    } else {
      console.error(`[EMPTY] ${relPath} (size: ${size} bytes)`);
      failedChecks++;
      return false;
    }
  } else {
    console.error(`[MISSING] ${relPath}`);
    failedChecks++;
    return false;
  }
}

function checkBatch(title, generatePaths) {
  let count = 0;
  let missing = 0;
  const paths = generatePaths();
  for (const p of paths) {
    totalChecks++;
    const fullPath = path.join(PUBLIC_DIR, p);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 0) {
      count++;
      passedChecks++;
    } else {
      missing++;
      failedChecks++;
    }
  }
  console.log(`${title}: ${count}/${paths.length} verified (${missing} missing)`);
}

// 1. Check Hero Desktop Frames (410)
checkBatch('Hero Desktop Frames', () => {
  const list = [];
  for (let i = 0; i < 410; i++) {
    list.push(`static/frames/home/desktop/webp/hero_anim_desktop_60_${i}.webp`);
  }
  return list;
});

// 2. Check Hero Mobile Frames (409)
checkBatch('Hero Mobile Frames', () => {
  const list = [];
  for (let i = 0; i < 409; i++) {
    list.push(`static/frames/home/mobile/webp/hero_anim_mobile_60_${i}.webp`);
  }
  return list;
});

// 3. Check Solutions Frames (272)
checkBatch('Solutions Features Frames', () => {
  const list = [];
  for (let i = 0; i < 272; i++) {
    list.push(`static/frames/solutions/webp/${i}.webp`);
  }
  return list;
});

// 4. Check Web Fonts
console.log('\nChecking Typography:');
const fonts = [
  'static/fonts/SuisseIntl-Regular.woff2',
  'static/fonts/SuisseIntl-Medium.woff2',
  'static/fonts/SuisseIntl-Semibold.woff2',
  'static/fonts/SuisseIntl-Book.woff2',
  'static/fonts/GeistMono-Regular.woff2',
  'static/fonts/GeistMono-SemiBold.woff2',
  'static/fonts/GeistMono-Bold.woff2'
];
for (const f of fonts) {
  if (checkFile(f, 1000)) {
    console.log(`  [OK] ${path.basename(f)}`);
  }
}

// 5. Check Web Worker
console.log('\nChecking Web Workers:');
if (checkFile('_nuxt/video-sequence.worker-B5BJOqje.js', 100)) {
  console.log('  [OK] video-sequence.worker-B5BJOqje.js');
}

// 6. Check Core Videos
console.log('\nChecking Storyblok MP4 Videos:');
const videos = [
  'storyblok/f/337048/x/f0f51ea10f/vid_3-1_prerender_1.mp4',
  'storyblok/f/337048/x/5d1992bef6/vid_3-2_prerender_1.mp4',
  'storyblok/f/337048/x/5c039660e1/vid_3-3_prerender_1.mp4',
  'storyblok/f/337048/x/daeedd63c8/vid_3-5_prerender_1.mp4',
  'storyblok/f/337048/x/41cc2fcad6/dummy-01.mp4',
  'storyblok/f/337048/x/a652cecb9b/dummy-02.mp4'
];
for (const v of videos) {
  if (checkFile(v, 100000)) {
    console.log(`  [OK] ${path.basename(v)}`);
  }
}

console.log(`\nVerification Summary: ${passedChecks}/${totalChecks} passed. ${failedChecks} failed.`);
if (failedChecks === 0) {
  console.log('All required offline assets verified successfully!');
  process.exit(0);
} else {
  console.log(`Notice: ${failedChecks} assets still downloading or pending.`);
  process.exit(1);
}
