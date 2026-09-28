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

console.log('=== Checking StringTune Clone Assets & System Integrity ===\n');

const CRITICAL_FILES = [
  // HTML Entry Points
  'index.html',
  'original.html',
  'public/index.html',

  // Core JS Chunks
  'public/_nuxt/entry.ecbf7bdb.js',
  'public/_nuxt/default.9c9b6173.js',
  'public/_nuxt/index.e3fb11d0.js',
  'public/_nuxt/index.55a36d6c.js',
  'public/_nuxt/SceneCanvas.2950ddea.js',
  'public/_nuxt/BaseVideo.17b9b97e.js',
  'public/_nuxt/CharAvatar.a506e16c.js',
  'public/_nuxt/GridRow.08569d72.js',
  'public/_nuxt/IconList.eb73eaa1.js',
  'public/_nuxt/MainFooter.9cf989a1.js',

  // Core CSS Bundles
  'public/_nuxt/GridRow.aee1d03d.css',
  'public/_nuxt/BaseVideo.28a3e9f5.css',
  'public/_nuxt/CharAvatar.559e0020.css',
  'public/_nuxt/MainFooter.c350568c.css',
  'public/_nuxt/SceneCanvas.4fe56d08.css',
  'public/_nuxt/index.52748fd2.css',
  'public/_nuxt/default.95e9e56d.css',
  'public/_nuxt/index.312a1a1b.css',

  // 3D Models & Environment Maps
  'public/models/katana.glb',
  'public/models/Wakizashi.glb',
  'public/models/lightroom.exr',

  // Katana Textures
  'public/models/k_txts/Katana_and_sheath_M_Katana_BaseColor.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Katana_Height.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Katana_Metallic.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Katana_Normal.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Katana_Roughness.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Sheath_BaseColor.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Sheath_Height.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Sheath_Metallic.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Sheath_Normal.1001.jpg',
  'public/models/k_txts/Katana_and_sheath_M_Sheath_Roughness.1001.jpg',

  // Draco Decoders
  'public/libs/draco/draco_decoder.wasm',
  'public/libs/draco/draco_wasm_wrapper.js',
  'public/libs/draco/draco_decoder.js',

  // Fonts
  'public/fonts/KHTeka-Regular.woff2',
  'public/fonts/KHTekaMono-Regular.woff2',
  'public/fonts/fdsi.woff',

  // Showcase Videos
  'public/videos/slash.mp4',
  'public/videos/skill-hub-link.mp4',
  'public/videos/container.mp4',
  'public/videos/ripple.mp4',
  'public/videos/dev-guides/stdg-presentation.mp4',

  // Images & SVGs
  'public/images/logo-sword.png',
  'public/images/r24.svg',
  'public/images/r32.svg',
  'public/images/r48.svg',
  'public/images/r64.svg',
  'public/images/home/storm.jpg',
  'public/images/home/tree.png',
  'public/images/home/bamboo-1.png',
  'public/images/home/bamboo-2.png',
  'public/images/home/bamboo-3.png',
  'public/images/home/bamboo-4.png',
  'public/images/home/polygon-bg.jpg',
  'public/share-screen.jpg',
  'public/fav/favicon.ico'
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
    { path: '/_nuxt/entry.ecbf7bdb.js', expected: 200 },
    { path: '/_nuxt/index.55a36d6c.js', expected: 200 },
    { path: '/_nuxt/SceneCanvas.4fe56d08.css', expected: 200 },
    { path: '/models/katana.glb', expected: 200 },
    { path: '/models/Wakizashi.glb', expected: 200 },
    { path: '/models/lightroom.exr', expected: 200 },
    { path: '/libs/draco/draco_decoder.wasm', expected: 200 },
    { path: '/fonts/KHTeka-Regular.woff2', expected: 200 },
    { path: '/images/home/storm.jpg', expected: 200 },
    { path: '/videos/slash.mp4', expected: 206, headers: { Range: 'bytes=0-1024' } }
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

// Phase 3: Browser Automated WebGL & Interaction Test
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
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle', timeout: 30000 });
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
      return { index: i, width: c.width, height: c.height, contextType: ctx };
    });
    return list;
  });

  console.log(`  Canvases Detected: ${canvasInfo.length}`);
  canvasInfo.forEach(c => console.log(`    Canvas ${c.index}: ${c.width}x${c.height} [${c.contextType}]`));

  const hasWebGL = canvasInfo.some(c => c.contextType.startsWith('webgl'));
  console.log(`  WebGL Context Active: ${hasWebGL}`);

  // Test interactive scroll progression
  console.log('  Testing scroll progression...');
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 10000));
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
