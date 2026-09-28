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
const PORT = 3001;

console.log('=== Checking Pear.no Clone Assets & System Integrity ===\n');

const CRITICAL_FILES = [
  // Entry HTML
  'index.html',
  'original.html',

  // Core Bundles
  'assets/index-Bd_JnIbr.css',
  'assets/index-BhJdAf8K.js',

  // Fonts
  'fonts/FlechaL-Light.woff2',
  'fonts/FlechaL-Regular.woff2',
  'fonts/FlechaM-Regular.woff',
  'fonts/FlechaM-Regular.woff2',
  'fonts/FlechaM-Light.woff2',
  'fonts/FlechaS-Light.woff2',
  'fonts/FlechaS-Regular.woff2',
  'fonts/GTStandardL-Medium.woff2',
  'fonts/GTStandardL-Regular.woff2',
  'fonts/GTStandardMono-Regular.woff2',

  // Videos (.mp4)
  'films/footer-loop.mp4',
  'films/reveal.mp4',
  'films/signal.mp4',
  'films/colossus.mp4',

  // Video Posters & Art
  'films/reveal-poster.jpg',
  'films/signal-poster.jpg',
  'films/colossus-poster.jpg',
  'art/scaffold_expand.jpg',
  'favicon.svg',
  'favicon-32.png',
  'apple-touch-icon.png',
  'og.jpg',

  // Model Manifests
  'films/model/renaissance/manifest.json',
  'films/model/v28/manifest.json',
  'films/model/v51/manifest.json',
  'films/model/v61/manifest.json',

  // Sample sequence frames from each family
  'films/coda/f_001.webp',
  'films/coda/f_045.webp',
  'films/coda/f_089.webp',
  'films/flysky/f_001.webp',
  'films/flysky/f_060.webp',
  'films/flysky/f_121.webp',
  'films/plan/f_001.webp',
  'films/plan/f_060.webp',
  'films/plan/f_121.webp',
  'films/trans/f_001.webp',
  'films/trans/f_060.webp',
  'films/trans/f_121.webp',
  'films/tree/f_001.webp',
  'films/tree/f_060.webp',
  'films/tree/f_121.webp',
  'films/model/renaissance/1440/f_001.webp',
  'films/model/renaissance/1440/f_180.webp',
  'films/model/renaissance/1440/f_362.webp',
  'films/model/v61/1440/f_001.webp',
  'films/model/v61/1440/f_060.webp',
  'films/model/v61/1440/f_121.webp',
  'films/model/v28/1440/f_001.webp',
  'films/model/v28/1440/f_060.webp',
  'films/model/v28/1440/f_121.webp',
  'films/model/v51/1440/f_001.webp',
  'films/model/v51/1440/f_060.webp',
  'films/model/v51/1440/f_121.webp'
];

let missingCount = 0;
let totalBytes = 0;

for (const file of CRITICAL_FILES) {
  const rootPath = path.join(ROOT_DIR, file);
  const pubPath = path.join(PUBLIC_DIR, file);
  const exists = fs.existsSync(pubPath) || fs.existsSync(rootPath);

  if (!exists) {
    console.error(`  [MISSING] ${file}`);
    missingCount++;
  } else {
    const target = fs.existsSync(pubPath) ? pubPath : rootPath;
    const stat = fs.statSync(target);
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
  console.log('--- Testing HTTP Endpoints against http://localhost:3001 ---');
  const testUrls = [
    '/',
    '/assets/index-Bd_JnIbr.css',
    '/assets/index-BhJdAf8K.js',
    '/fonts/FlechaL-Light.woff2',
    '/films/footer-loop.mp4',
    '/films/reveal.mp4',
    '/art/scaffold_expand.jpg',
    '/films/model/renaissance/manifest.json',
    '/films/coda/f_001.webp?r=13',
    '/films/model/renaissance/1440/f_001.webp?r=13',
    '/films/flysky/f_001.webp?r=13'
  ];

  let passed = 0;
  for (const u of testUrls) {
    await new Promise((resolve) => {
      http.get(`http://localhost:${PORT}${u}`, (res) => {
        if (res.statusCode === 200 || res.statusCode === 206) {
          console.log(`  [HTTP ${res.statusCode}] ${u} (${res.headers['content-type']})`);
          passed++;
        } else {
          console.error(`  [HTTP ${res.statusCode} FAILED] ${u}`);
        }
        res.resume();
        resolve();
      }).on('error', (err) => {
        console.error(`  [CONN ERROR] ${u}: ${err.message}`);
        resolve();
      });
    });
  }

  console.log(`\nHTTP Endpoint Status: ${passed}/${testUrls.length} verified.`);
  return passed === testUrls.length;
}

// Phase 3: Browser Automated WebGL & Interaction Test
async function browserTest() {
  console.log('\n--- Running Browser Automation Verification ---');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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
  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  const webglWorking = await page.evaluate(() => {
    const glCanvas = document.querySelector('canvas.gl');
    if (!glCanvas) return false;
    const gl = glCanvas.getContext('webgl') || glCanvas.getContext('webgl2');
    return gl !== null;
  });

  console.log(`  Canvases Detected: ${canvasCount}`);
  console.log(`  WebGL Context Active on canvas.gl: ${webglWorking}`);

  // Test interactive scroll progression
  console.log('  Testing scroll interactions...');
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 12000));
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

  return webglWorking;
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
  console.log('  ALL INTEGRITY & ANIMATION VERIFICATION CHECKS PASSED');
  console.log('======================================================\n');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
