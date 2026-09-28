import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.resolve(__dirname, '..');

async function run() {
  console.log('Launching browser for deep investigation...');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  const logs = [];
  const errors = [];
  const requests = [];
  const failedRequests = [];

  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    logs.push({ type, text });
    if (type === 'error') {
      errors.push(text);
      console.log('  [CONSOLE ERROR]', text);
    }
  });

  page.on('pageerror', (err) => {
    errors.push(`PageError: ${err.message}\n${err.stack}`);
    console.log('  [UNCAUGHT PAGE ERROR]', err.message);
  });

  page.on('requestfailed', (req) => {
    const failInfo = `${req.method()} ${req.url()} - ${req.failure()?.errorText}`;
    failedRequests.push(failInfo);
    console.log('  [REQUEST FAILED]', failInfo);
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      console.log(`  [HTTP ${res.status()}] ${res.url()}`);
      requests.push({ status: res.status(), url: res.url() });
    }
  });

  console.log('Navigating to http://localhost:3001...');
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Check state of Three.js and Canvas
  const inspectState = await page.evaluate(() => {
    const gl = window.landoGL;
    const canvases = Array.from(document.querySelectorAll('canvas')).map((c, i) => ({
      index: i,
      className: c.className,
      w: c.width,
      h: c.height,
      rect: c.getBoundingClientRect(),
      style: c.getAttribute('style'),
      visible: window.getComputedStyle(c).display !== 'none' && window.getComputedStyle(c).visibility !== 'hidden'
    }));

    return {
      hasLandoGL: !!gl,
      glKeys: gl ? Object.keys(gl) : [],
      glParams: gl && gl.params ? Object.keys(gl.params) : [],
      canvases,
      bodyClasses: document.body.className,
      title: document.title,
    };
  });

  console.log('DOM & Window Inspection:', JSON.stringify(inspectState, null, 2));

  // Test scrolling down and checking state
  console.log('Testing scroll to 2500px...');
  await page.evaluate(() => window.scrollTo(0, 2500));
  await page.waitForTimeout(2000);

  console.log('Testing scroll to 5000px...');
  await page.evaluate(() => window.scrollTo(0, 5000));
  await page.waitForTimeout(2000);

  console.log('Testing scroll to 10000px...');
  await page.evaluate(() => window.scrollTo(0, 10000));
  await page.waitForTimeout(2000);

  // Take screenshot of current position
  await page.screenshot({ path: path.join(PROJECT_DIR, 'docs/design-references/deep-investigation-10000px.png') });

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(PROJECT_DIR, 'docs/design-references/deep-investigation-top.png') });

  // Check mobile viewport (e.g. 375x812) to see if mobile has issues
  console.log('Testing mobile viewport 375x812...');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(PROJECT_DIR, 'docs/design-references/deep-investigation-mobile.png') });

  await browser.close();

  console.log('\n--- Summary ---');
  console.log('Errors count:', errors.length);
  console.log('Failed requests count:', failedRequests.length);
  console.log('HTTP 4xx/5xx count:', requests.length);
  console.log('Logs count:', logs.length);
}

run().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
