import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_DIR, 'public');
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const BASE_URL = `http://localhost:${PORT}`;

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${urlPath}`;
    http.get(fullUrl, (res) => {
      let dataLen = 0;
      res.on('data', (chunk) => {
        dataLen += chunk.length;
      });
      res.on('end', () => {
        resolve({
          path: urlPath,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'] || '',
          contentLength: dataLen,
          ok: res.statusCode === 200,
        });
      });
    }).on('error', (err) => {
      resolve({
        path: urlPath,
        statusCode: 0,
        error: err.message,
        ok: false,
      });
    });
  });
}

async function verifyFilesystem() {
  console.log('\n--- 1. Filesystem Verification ---');
  const criticalFiles = [
    'index.html',
    'package.json',
    'server.mjs',
    'public/index.html',
    'public/dev-js/lando-by-OFF+BRAND.05.js',
    'public/gl/models/helmet-21.glb',
    'public/gl/models/disco-02.glb',
    'public/gl/models/sotd.glb',
    'public/gl/models/tracks/tracks-06-test.glb',
    'public/gl/hdri/studio_small_08_1k--light.hdr',
    'public/gl/hdri/studio_small_08_1k--faded.hdr',
    'public/gl/hdri/studio_small_08_1k--dark.hdr',
    'public/gl/draco/draco_decoder.wasm',
    'public/gl/draco/draco_wasm_wrapper.js',
    'public/gl/fonts/Brier-Bold-02.webp',
    'public/gl/fonts/Brier-Bold-msdf.json',
    'public/gl/textures/helmet/webp/gold/Norris_Helmet_mat_BaseColor.webp',
    'public/gl/textures/helmet/webp/disco/Norris_Helmet_mat_BaseColor.webp',
    'public/gl/textures/head/webp/diffuse.webp',
    'public/rive/page-transition.riv',
    'public/rive/reef.riv',
    'public/rive/phrases.riv',
    'public/rive/signature.riv',
    'public/rive/ln4.riv',
    'public/rive/circuits.riv',
    'public/rive/btn-ui.riv',
    'public/rive/mob-landscape.riv',
    'public/libs/rive/rive.wasm',
  ];

  let missing = 0;
  for (const relPath of criticalFiles) {
    const fullPath = path.join(PROJECT_DIR, relPath);
    if (fs.existsSync(fullPath)) {
      const stat = fs.statSync(fullPath);
      console.log(`  [OK] ${relPath} (${(stat.size / 1024).toFixed(1)} KB)`);
    } else {
      console.error(`  [MISSING] ${relPath}`);
      missing++;
    }
  }

  return missing === 0;
}

async function verifyHttpEndpoints() {
  console.log('\n--- 2. HTTP Endpoint Verification ---');
  const testEndpoints = [
    '/',
    '/index.html',
    '/dev-js/lando-by-OFF+BRAND.05.js',
    '/gl/models/helmet-21.glb',
    '/gl/models/tracks/tracks-06-test.glb',
    '/gl/hdri/studio_small_08_1k--light.hdr',
    '/gl/draco/draco_decoder.wasm',
    '/gl/textures/helmet/webp/gold/Norris_Helmet_mat_BaseColor.webp',
    '/gl/fonts/Brier-Bold-02.webp',
    '/rive/page-transition.riv',
    '/rive/reef.riv',
    '/rive/signature.riv',
    '/libs/rive/rive.wasm',
  ];

  let passed = 0;
  for (const endpoint of testEndpoints) {
    const res = await checkUrl(endpoint);
    if (res.ok) {
      console.log(`  [200 OK] ${res.path} -> ${res.contentType} (${res.contentLength} bytes)`);
      passed++;
    } else {
      console.error(`  [FAIL ${res.statusCode}] ${res.path} -> ${res.error || ''}`);
    }
  }

  return passed === testEndpoints.length;
}

async function verifyBrowser() {
  console.log('\n--- 3. Headless Browser & Animation Verification ---');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  const consoleErrors = [];
  const consoleWarnings = [];
  const networkErrors = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    // Ignore benign Webflow or non-critical 3rd party tracker log warnings
    if (type === 'error') {
      consoleErrors.push(text);
    } else if (type === 'warning') {
      consoleWarnings.push(text);
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(`Uncaught PageError: ${err.message}`);
  });

  page.on('requestfailed', (req) => {
    const url = req.url();
    // Ignore optional telemetry or external fonts if any
    if (!url.includes('google-analytics') && !url.includes('doubleclick') && !url.includes('klaviyo')) {
      networkErrors.push(`${req.method()} ${url} -> ${req.failure()?.errorText}`);
    }
  });

  console.log(`  Navigating to ${BASE_URL} ...`);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Give Three.js and Rive animations 4.5 seconds to bootstrap
  console.log('  Waiting 4500ms for WebGL & Rive initialization...');
  await page.waitForTimeout(4500);

  // Inspect DOM and Canvases
  const canvasStats = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    return canvases.map((c, idx) => {
      const rect = c.getBoundingClientRect();
      const isGL = c.classList.contains('gl');
      let webglContext = false;
      try {
        const gl = c.getContext('webgl2') || c.getContext('webgl');
        webglContext = !!gl;
      } catch (e) {
        webglContext = false;
      }
      return {
        index: idx,
        className: c.className,
        width: c.width,
        height: c.height,
        rectWidth: Math.round(rect.width),
        rectHeight: Math.round(rect.height),
        isGL,
        webglContext,
      };
    });
  });

  console.log(`  Total Canvases Found: ${canvasStats.length}`);
  const glCanvas = canvasStats.find((c) => c.isGL || c.className.includes('gl'));
  if (glCanvas) {
    console.log(`  [OK] Three.js WebGL Canvas (.gl) detected: index=${glCanvas.index}, dimensions=${glCanvas.width}x${glCanvas.height}`);
  } else {
    console.warn('  [WARN] Canvas with class="gl" not explicitly matched in class list. Checking all canvases:');
    canvasStats.forEach((c) => {
      console.log(`    Canvas #${c.index}: ${c.className || '(no class)'} ${c.width}x${c.height}`);
    });
  }

  // Scroll down to check Lenis / GSAP scroll triggers
  console.log('  Testing scroll progression...');
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 3500));
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Capture verification screenshot
  const screenshotDir = path.join(PROJECT_DIR, 'docs', 'design-references');
  fs.mkdirSync(screenshotDir, { recursive: true });
  const screenshotPath = path.join(screenshotDir, 'verification-clone.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`  Verification screenshot saved to ${screenshotPath}`);

  await browser.close();

  console.log('\n  Console Errors recorded: ' + consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.log('    [ERROR]', e));
  }
  console.log('  Network Errors recorded: ' + networkErrors.length);
  if (networkErrors.length > 0) {
    networkErrors.forEach((e) => console.log('    [NET-ERROR]', e));
  }

  return {
    canvasCount: canvasStats.length,
    hasGLCanvas: !!glCanvas,
    errorsCount: consoleErrors.length,
    networkErrorsCount: networkErrors.length,
  };
}

async function main() {
  const fsOk = await verifyFilesystem();
  const httpOk = await verifyHttpEndpoints();
  const browserResults = await verifyBrowser();

  console.log('\n=========================================');
  console.log('           VERIFICATION REPORT           ');
  console.log('=========================================');
  console.log(`Filesystem:    ${fsOk ? 'PASS' : 'FAIL'}`);
  console.log(`HTTP Endpoints: ${httpOk ? 'PASS' : 'FAIL'}`);
  console.log(`Canvases detected: ${browserResults.canvasCount}`);
  console.log(`Three.js WebGL:    ${browserResults.hasGLCanvas ? 'PASS' : 'NOT DETECTED'}`);
  console.log(`Console Errors:    ${browserResults.errorsCount}`);
  console.log(`Network Failures:  ${browserResults.networkErrorsCount}`);
  console.log('=========================================\n');

  if (!fsOk || !httpOk) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Verification failed with uncaught exception:', err);
  process.exit(1);
});
