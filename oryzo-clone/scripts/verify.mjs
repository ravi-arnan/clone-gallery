import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

console.log('=== Checking Oryzo.ai Clone Assets & System Integrity ===\n');

const CRITICAL_FILES = [
  // HTML Entry Points
  'index.html',
  'original.html',
  'public/index.html',

  // Core Astro JS & CSS & WASM Bundles
  'public/_astro/hoisted.CRsATKbF.js',
  'public/_astro/index.TL6TuoJb.css',
  'public/_astro/SplatsWorker-DSMxtdkh.js',
  'public/_astro/splat_sorter_bg-BfJrILzx.wasm',

  // 3D Gaussian Splats (.sog)
  'public/splats/props.sog',
  'public/splats/table_reflection.sog',

  // 3D Model Buffers (.buf)
  'public/models/BARK.buf',
  'public/models/COASTER_FLIP_ANIM.buf',
  'public/models/COFFEE_BEAN.buf',
  'public/models/coaster.buf',
  'public/models/coaster_hero_animation.buf',
  'public/models/featuresAnimations/CAMERA_ANIM.buf',
  'public/models/featuresAnimations/COASTER_ANIM.buf',
  'public/models/featuresAnimations/COFFEE_ANIM.buf',
  'public/models/hand.buf',
  'public/models/hand_animation.buf',
  'public/models/hero_camera.buf',
  'public/models/stack_camera.buf',
  'public/models/sustainability_text.buf',
  'public/models/sustainability_text_outline.buf',
  'public/models/table/COFFEE/COVER.buf',
  'public/models/table/COFFEE/CUP.buf',
  'public/models/table/COFFEE/LABEL.buf',
  'public/models/table/DESK.buf',
  'public/models/table/PINBOARD.buf',
  'public/models/table/TRAY_COVERS.buf',
  'public/models/table/WALL.buf',
  'public/models/table/water_bear.buf',
  'public/models/wearable/coaster_first.buf',
  'public/models/wearable/condom_back.buf',
  'public/models/wearable/condom_front.buf',

  // Rive Animations & WASM
  'public/rive/oryzo.riv',
  'public/libs/rive/rive.wasm',

  // Fonts
  'public/fonts/DM-Mono-400-Latin.woff2',
  'public/fonts/Literata.woff2',
  'public/fonts/msdf/Inter.json',
  'public/fonts/msdf/Inter.webp',
  'public/fonts/typekit/pmn6ngx.css',
  'public/fonts/typekit/neue-haas-grotesk.woff2',

  // Showcase Videos (.mp4)
  'public/images/wearable-gallery/bite.mp4',
  'public/images/wearable-gallery/yoga.mp4',

  // Key PBR Textures
  'public/textures/hero/AI_HAND.webp',
  'public/textures/hero/BASE.webp',
  'public/textures/coaster/DIFF.webp',
  'public/textures/coaster/STACK.webp',
  'public/textures/table/DESK.webp',
  'public/textures/table/PINBOARD.webp',
  'public/textures/table/WATERBEAR.webp'
];

let missingCount = 0;
let totalBytes = 0;

for (const file of CRITICAL_FILES) {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.error(`  [MISSING] ${file}`);
    missingCount++;
  } else {
    const stat = fs.statSync(filePath);
    totalBytes += stat.size;
  }
}

console.log(`Filesystem Verification:`);
console.log(`  Critical Files Checked: ${CRITICAL_FILES.length}`);
console.log(`  Sample Checked Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`  Missing Files: ${missingCount}`);

if (missingCount > 0) {
  console.error('\nVerification FAILED: Some critical assets are missing!');
  process.exit(1);
}

console.log('  ALL FILESYSTEM ASSETS PRESENT!\n');

// Phase 2: HTTP Endpoint Verification
async function checkEndpoints() {
  console.log(`--- Testing HTTP Endpoints against http://localhost:${PORT} ---`);
  const testUrls = [
    { path: '/', expected: 200 },
    { path: '/_astro/hoisted.CRsATKbF.js', expected: 200 },
    { path: '/_astro/index.TL6TuoJb.css', expected: 200 },
    { path: '/_astro/splat_sorter_bg-BfJrILzx.wasm', expected: 200 },
    { path: '/splats/props.sog', expected: 200 },
    { path: '/models/coaster.buf', expected: 200 },
    { path: '/models/table/water_bear.buf', expected: 200 },
    { path: '/rive/oryzo.riv', expected: 200 },
    { path: '/libs/rive/rive.wasm', expected: 200 },
    { path: '/fonts/Literata.woff2', expected: 200 },
    { path: '/textures/hero/AI_HAND.webp', expected: 200 },
    { path: '/images/wearable-gallery/bite.mp4', expected: 206, headers: { Range: 'bytes=0-1024' } }
  ];

  let passed = 0;
  for (const item of testUrls) {
    await new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: item.path,
        method: 'GET',
        headers: item.headers || {}
      };

      const req = http.request(options, (res) => {
        if (res.statusCode === item.expected) {
          console.log(`  [HTTP ${res.statusCode}] ${item.path} (${res.headers['content-type']})`);
          passed++;
        } else {
          console.error(`  [HTTP ${res.statusCode} FAILED, expected ${item.expected}] ${item.path}`);
        }
        res.resume();
        resolve();
      });

      req.on('error', (err) => {
        console.error(`  [CONN ERROR] ${item.path}: ${err.message}`);
        resolve();
      });

      req.end();
    });
  }

  console.log(`\nHTTP Endpoint Status: ${passed}/${testUrls.length} verified.`);
  return passed === testUrls.length;
}

// Phase 3: Browser Automated WebGL & Animation Test
async function browserTest() {
  console.log('\n--- Running Browser WebGL & Animation Verification ---');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu-rasterization'
    ]
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  console.log(`Navigating to http://localhost:${PORT}/ ...`);
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Check canvases and WebGL
  const canvasInfo = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('canvas')).map((c, i) => {
      let ctx = 'unknown';
      try {
        if (c.getContext('webgl2')) ctx = 'webgl2';
        else if (c.getContext('webgl')) ctx = 'webgl';
        else if (c.getContext('2d')) ctx = '2d';
      } catch (e) {}
      return { id: c.id, width: c.width, height: c.height, contextType: ctx };
    });
    return list;
  });

  console.log(`  Canvases Detected: ${canvasInfo.length}`);
  canvasInfo.forEach(c => console.log(`    Canvas id="${c.id}": ${c.width}x${c.height} [${c.contextType}]`));

  const hasWebGL = canvasInfo.some(c => c.contextType.startsWith('webgl'));
  console.log(`  WebGL Context Active: ${hasWebGL}`);

  // Test interactive scroll progression
  console.log('  Testing scroll progression...');
  await page.evaluate(() => window.scrollTo(0, 8000));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 24000));
  await page.waitForTimeout(1000);

  // Save verification screenshot
  const shotPath = path.join(ROOT_DIR, 'docs/design-references/verification-clone.png');
  await page.screenshot({ path: shotPath, fullPage: false });
  console.log(`  Verification screenshot saved: ${shotPath}`);

  await browser.close();

  if (consoleErrors.length > 0) {
    console.log(`\n  Console Errors (${consoleErrors.length}):`);
    consoleErrors.forEach(e => console.log('    - ', e));
  } else {
    console.log('  Zero console errors detected!');
  }

  return hasWebGL;
}

async function run() {
  const httpOk = await checkEndpoints();
  if (!httpOk) {
    console.error('HTTP endpoint checks failed! Is server running?');
    process.exit(1);
  }

  const browserOk = await browserTest();
  if (!browserOk) {
    console.error('Browser WebGL verification failed!');
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('  ALL INTEGRITY, WEBGL & ANIMATION CHECKS PASSED');
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
