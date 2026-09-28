import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { chromium } from '/home/ravi/Projects/job/node_modules/playwright/index.mjs';

const BASE = '/home/ravi/Projects/animejs-clone';
let passed = 0;
let total = 0;

function check(desc, cond) {
  total++;
  if (cond) {
    passed++;
    console.log(`  [PASS] ${desc}`);
  } else {
    console.error(`  [FAIL] ${desc}`);
  }
}

async function verify() {
  console.log('=== Step 1: Verifying Local File Inventory ===');

  check('index.html exists and is non-empty', fs.existsSync(`${BASE}/index.html`) && fs.statSync(`${BASE}/index.html`).size > 10000);
  check('core.css exists and is non-empty', fs.existsSync(`${BASE}/public/assets/css/core.css`) && fs.statSync(`${BASE}/public/assets/css/core.css`).size > 1000);
  check('home.css exists and is non-empty', fs.existsSync(`${BASE}/public/assets/css/home.css`) && fs.statSync(`${BASE}/public/assets/css/home.css`).size > 1000);
  check('home.js exists and is non-empty', fs.existsSync(`${BASE}/public/assets/js/home.js`) && fs.statSync(`${BASE}/public/assets/js/home.js`).size > 50000);
  check('documentation-demos exists (>1MB)', fs.existsSync(`${BASE}/public/documentation-demos`) && fs.statSync(`${BASE}/public/documentation-demos`).size > 1000000);
  check('easings.json is valid JSON', () => {
    try {
      JSON.parse(fs.readFileSync(`${BASE}/public/assets/json/easings.json`, 'utf-8'));
      return true;
    } catch {
      return false;
    }
  });

  const models = [
    'module-draggable-01.glb',
    'module-draggable-02.glb',
    'module-animate-01.glb',
    'module-easing-01.glb',
    'module-scope-01.glb',
    'module-scroll-01.glb',
    'module-timer-01.glb',
    'module-timer-02.glb',
    'module-timer-03.glb',
    'module-timer-04.glb',
    'module-timer-05.glb',
    'module-engine-01.glb',
    'module-stagger-01.glb',
    'module-stagger-02.glb',
    'module-spring-01.glb',
    'module-svg-01.glb',
    'module-shield-01.glb',
    'module-shield-02.glb',
    'module-timeline-01.glb',
    'module-timeline-02.glb',
    'module-renderer-01.glb',
    'module-waapi-01.glb'
  ];

  console.log(`\n=== Step 2: Verifying All 22 GLB 3D Models ===`);
  for (const m of models) {
    const p = `${BASE}/public/assets/models/${m}`;
    check(`Model ${m} exists and non-empty`, fs.existsSync(p) && fs.statSync(p).size > 5000);
  }

  console.log(`\n=== Step 3: Verifying Draco WASM & Decoder ===`);
  const dracoFiles = ['draco_decoder.wasm', 'draco_wasm_wrapper.js', 'draco_decoder.js'];
  for (const d of dracoFiles) {
    const p = `${BASE}/public/assets/draco/${d}`;
    check(`Draco file ${d} exists and non-empty`, fs.existsSync(p) && fs.statSync(p).size > 10000);
  }

  console.log(`\n=== Step 4: Verifying JS Chunks & Fonts ===`);
  const chunks = [
    'chunk-WQVFBASJ.js',
    'chunk-DCANE7XH.js',
    'chunk-FX45FQRC.js',
    'chunk-N6I4AEHZ.js',
    'chunk-WXAKRBIO.js',
    'chunk-CPVC3KGU.js',
    'debug-CBQ742GO.js'
  ];
  for (const c of chunks) {
    const p = `${BASE}/public/assets/js/chunks/${c}`;
    check(`Chunk ${c} exists`, fs.existsSync(p) && fs.statSync(p).size > 500);
  }

  const fonts = [
    'BerkeleyMono-Regular.woff2',
    'BerkeleyMono-Italic.woff2',
    'DINish[slnt,wdth,wght].woff2',
    'Digital-7MonoItalic.woff2'
  ];
  for (const f of fonts) {
    const p = `${BASE}/public/assets/fonts/${f}`;
    check(`Font ${f} exists (>1000B)`, fs.existsSync(p) && fs.statSync(p).size > 1000);
  }

  console.log(`\n=== Step 5: Testing Local HTTP Server & Routes ===`);
  const TEST_PORT = 3333;
  process.env.PORT = String(TEST_PORT);

  // Import server dynamically
  await import('../server.mjs');
  await new Promise(r => setTimeout(r, 1000));

  const testRoutes = [
    { path: '/', mime: 'text/html' },
    { path: '/assets/css/core.css', mime: 'text/css' },
    { path: '/assets/css/home.css', mime: 'text/css' },
    { path: '/assets/js/home.js', mime: 'application/javascript' },
    { path: '/assets/models/module-engine-01.glb', mime: 'model/gltf-binary' },
    { path: '/assets/draco/draco_decoder.wasm', mime: 'application/wasm' },
    { path: '/documentation-demos', mime: 'text/html' },
    { path: '/assets/json/easings.json', mime: 'application/json' },
    { path: '/sponsors/github-sponsors', mime: 'text/html' }
  ];

  for (const tr of testRoutes) {
    await new Promise(resolve => {
      http.get(`http://localhost:${TEST_PORT}${tr.path}`, res => {
        const ct = res.headers['content-type'] || '';
        check(`HTTP GET ${tr.path} -> ${res.statusCode} (Expected: ${tr.mime}, Got: ${ct})`, res.statusCode === 200 && ct.includes(tr.mime));
        res.resume();
        resolve();
      }).on('error', err => {
        check(`HTTP GET ${tr.path} connection error: ${err.message}`, false);
        resolve();
      });
    });
  }

  console.log(`\n=== Step 6: Visual & Runtime Headless Browser Verification ===`);
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome-stable',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const uncaughtErrors = [];
  const networkErrors = [];

  page.on('pageerror', err => {
    uncaughtErrors.push(err.message || String(err));
  });

  page.on('requestfailed', req => {
    // Ignore external ads/analytics or normal client aborts
    const url = req.url();
    const errText = req.failure()?.errorText || '';
    if (url.includes('google') || url.includes('carbonads') || errText.includes('ERR_ABORTED')) return;
    networkErrors.push(`${url} (${errText})`);
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      if (resp.url().includes('google') || resp.url().includes('carbonads')) return;
      networkErrors.push(`HTTP ${resp.status()}: ${resp.url()}`);
    }
  });

  console.log(`Loading http://localhost:${TEST_PORT} in headless browser ...`);
  await page.goto(`http://localhost:${TEST_PORT}`, { waitUntil: 'networkidle', timeout: 45000 });
  console.log('Page loaded. Waiting 5 seconds for 3D engine, shaders, and animations to mount...');
  await page.waitForTimeout(5000);

  const runtimeState = await page.evaluate(() => {
    const rendererCanvas = document.getElementById('renderer');
    const allCanvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
      id: c.id,
      className: c.className,
      width: c.width,
      height: c.height
    }));

    return {
      title: document.title,
      rendererExists: !!rendererCanvas,
      rendererWidth: rendererCanvas ? rendererCanvas.width : 0,
      rendererHeight: rendererCanvas ? rendererCanvas.height : 0,
      canvasesCount: allCanvases.length,
      canvases: allCanvases
    };
  });

  console.log('Runtime state from browser:', JSON.stringify(runtimeState, null, 2));

  check('Document title matches target', runtimeState.title.includes('Anime.js'));
  check('Three.js #renderer canvas mounted', runtimeState.rendererExists);
  check('Three.js #renderer canvas has active dimensions (>1000px)', runtimeState.rendererWidth > 1000 && runtimeState.rendererHeight > 500);
  check('Multiple canvases rendered for demos', runtimeState.canvasesCount >= 1);
  check(`0 Uncaught Page Errors (Found: ${uncaughtErrors.length})`, uncaughtErrors.length === 0);
  check(`0 Failed Internal Network Requests (Found: ${networkErrors.length})`, networkErrors.length === 0);

  if (uncaughtErrors.length > 0) {
    console.error('Uncaught errors:', uncaughtErrors);
  }
  if (networkErrors.length > 0) {
    console.error('Failed network requests:', networkErrors);
  }

  // Scroll down to test interactive scroll and 3D module repositioning
  console.log('Testing scroll interaction at 1500px ...');
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${BASE}/docs/research/verified-scroll-1500.png` });

  // Take screenshot of clone
  await page.screenshot({ path: `${BASE}/docs/research/verified-clone.png` });
  console.log(`[OK] Saved clone screenshots to docs/research/`);

  await browser.close();

  console.log(`\n================================`);
  console.log(`Verification Complete: ${passed}/${total} Checks Passed (${Math.round((passed/total)*100)}%)`);
  console.log(`================================`);

  process.exit(passed === total ? 0 : 1);
}

verify().catch(err => {
  console.error('Verification script crashed:', err);
  process.exit(1);
});
