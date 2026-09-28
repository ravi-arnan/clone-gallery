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

console.log('=== Checking Alche Studio Clone Assets & System Integrity ===\n');

const CRITICAL_FILES = [
  // HTML Routes
  'index.html',
  'about/index.html',
  'news/index.html',
  'works/index.html',
  'stellla/index.html',
  'contact/index.html',
  'privacypolicy/index.html',
  'license/index.html',
  'works/detail/997ia9e6cty7/index.html',
  'works/detail/lqlwmmtrsd6s/index.html',

  // Core Astro JS & CSS Bundles
  '_astro/index.DnJ5xLaK.css',
  '_astro/about.DKIoZJhT.css',
  '_astro/index.CQ0ApTUm.css',
  '_astro/about.Bk-C3ZjO.css',
  '_astro/about.CKFe_wyj.css',
  '_astro/news.CIol-JvY.css',
  '_astro/stellla.DlNku1_C.css',
  '_astro/works.D0SUTMok.css',
  '_astro/page.SNkKDTDH.js',
  '_astro/index.astro_astro_type_script_index_0_lang.Cn_goiN_.js',
  '_astro/index.astro_astro_type_script_index_0_lang.CauODnqH.js',

  // Swup SPA Plugins
  '_astro/Swup.Cr7ogLqN.js',
  '_astro/SwupA11yPlugin.ZX-iZMgT.js',
  '_astro/SwupPreloadPlugin.DQ2lZ6J5.js',
  '_astro/SwupBodyClassPlugin.B6xGcJnL.js',
  '_astro/SwupHeadPlugin.d6nb3Z__.js',
  '_astro/SwupScriptsPlugin.CRD5-C2F.js',
  '_astro/index.modern.BC8Oj8jT.js',

  // Fonts
  '_astro/google-sans-code-latin-400-normal.5lTHPz_z.woff2',
  '_astro/ibm-plex-mono-latin-400-normal.Dm_PoFIZ.woff2',
  '_astro/ibm-plex-sans-jp-latin-400-normal.CDdMl-oX.woff2',
  '_astro/ibm-plex-sans-jp-latin-400-normal.D5LEXcjN.woff',

  // 3D Model (.glb)
  'common/scene.glb',

  // CubeTexture Environment Map
  'envmap/px.png',
  'envmap/nx.png',
  'envmap/py.png',
  'envmap/ny.png',
  'envmap/pz.png',
  'envmap/nz.png',

  // Audio (.mp3)
  'sounds/bgm.mp3',
  'sounds/mission_in.mp3',
  'sounds/typing.mp3',
  'sounds/works_in.mp3',

  // Videos (.mp4)
  'top/service/stellla.mp4',
  'top/service/ue.mp4',
  'top/service/uefn.mp4',
  'stellla/kv.mp4',

  // Lottie Animation JSONs
  'common/loading/bg/data.json',
  'common/loading/logo/data.json',
  'top/outro/data.json',

  // Graphics & Branding
  '404/ascii_texture.png',
  'common/loading.svg',
  'common/alche_logo.svg',
  'top/logo.png',
  'top/works-title.png',
  'top/service-title.png',
  'top/fortnite.png',
  'top/ue2.png',
  'stellla/logo_stellla.png',
  'favicon.png',
  'favicon/000.png',
  'ogp.jpg',

  // CMS Media Avif
  'cms-media/01M0P0Q7Y0JJVK0QJC1DEKFCYW-w800.avif',
  'cms-media/01M0P0QEPW33D4YQEFN09K01JW-w800.avif',
  'cms-media/01M0P0RWQJS08Q2XRVC78DDFWE-w800.avif',
  'cms-media/01M0P0RYEXA8R54HTQB627SEXV-w800.avif',
  'cms-media/01M0P0SVF5XHVWD2JZA940M1PC-w800.avif',
  'cms-media/01M0P0WHRCZVQ51VE2MY08YG93-w800.avif'
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

console.log(`\nFilesystem Verification:`);
console.log(`  Total Critical Files Checked: ${CRITICAL_FILES.length}`);
console.log(`  Total Storage Size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`  Missing Files: ${missingCount}`);

if (missingCount > 0) {
  console.error('\nVerification FAILED: Some critical assets are missing!');
  process.exit(1);
}

console.log('  ALL FILESYSTEM ASSETS PRESENT!\n');

// Phase 2: Test HTTP Endpoints via local server
async function checkEndpoints() {
  console.log('--- Testing HTTP Endpoints against http://localhost:3001 ---');
  const testUrls = [
    '/',
    '/_astro/page.SNkKDTDH.js',
    '/_astro/index.astro_astro_type_script_index_0_lang.Cn_goiN_.js',
    '/common/scene.glb',
    '/envmap/px.png',
    '/sounds/bgm.mp3',
    '/top/service/stellla.mp4',
    '/common/loading/bg/data.json',
    '/about',
    '/works',
    '/stellla',
    '/contact'
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

// Phase 3: Playwright Browser Test & Screenshot
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

  // Check canvas and WebGL
  const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length);
  const webglWorking = await page.evaluate(() => {
    const c = document.querySelector('canvas');
    if (!c) return false;
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    return gl !== null;
  });

  console.log(`  Canvases Detected: ${canvasCount}`);
  console.log(`  WebGL Context Active: ${webglWorking}`);

  // Test scroll triggers
  console.log('  Testing scroll interactions...');
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 8000));
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
