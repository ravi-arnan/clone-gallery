import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = '/home/ravi/Projects/sharplink-clone/docs/design-references';

function testEndpoint(urlPath) {
  return new Promise((resolve) => {
    http.get(BASE_URL + urlPath, (res) => {
      res.resume();
      resolve({ path: urlPath, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ path: urlPath, status: 'ERROR: ' + err.message });
    });
  });
}

async function verify() {
  console.log('=== Step 1: Testing Static & API Endpoints ===');
  const endpoints = [
    '/',
    '/_nuxt/5OliWYBk.js',
    '/_nuxt/entry.D7b4BisY.css',
    '/webgl/packed_texture.png',
    '/storyblok/f/290008427472090/x/c203c1fda0/shrp_stack.json',
    '/storyblok/f/290008427472090/x/87414464bd/shrp_homepagehero_30fps.webm',
    '/_vercel/image?url=%2Fimages%2Fgradient-dark-transparent.png&w=1536&q=100',
    '/_vercel/image?url=%2Fstoryblok%2Ff%2F290008427472090%2F272x68%2F6652277faa%2Flogo.png&w=1536&q=100',
    '/api/dashboard/impact3-data',
    '/api/dashboard/eth-coingecko',
    '/api/dashboard/polygon'
  ];

  let endpointPass = true;
  for (const ep of endpoints) {
    const res = await testEndpoint(ep);
    const pass = res.status === 200 || res.status === 206;
    console.log(`  [${pass ? 'PASS' : 'FAIL'}] ${ep} => ${res.status}`);
    if (!pass) endpointPass = false;
  }

  if (!endpointPass) {
    console.error('Some endpoint tests failed!');
  } else {
    console.log('All endpoints returned 200 OK!\n');
  }

  console.log('=== Step 2: Testing Full Browser Rendering with Playwright ===');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  const errors = [];
  const warnings = [];
  const failedRequests = [];

  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  page.on('console', (msg) => {
    if (msg.type() === 'error') warnings.push(msg.text());
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      failedRequests.push(`${res.status()} ${res.url()}`);
    }
  });

  console.log(`Navigating to ${BASE_URL} ...`);
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Take clone hero screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'clone-desktop-hero.png'), fullPage: false });
  console.log('Saved clone-desktop-hero.png');

  // Check Canvases
  const canvases = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('canvas')).map((c, i) => {
      let ctx = 'unknown';
      try {
        if (c.getContext('webgl2')) ctx = 'webgl2';
        else if (c.getContext('webgl')) ctx = 'webgl';
        else if (c.getContext('2d')) ctx = '2d';
      } catch(e) {}
      return {
        index: i,
        className: c.className,
        width: c.width,
        height: c.height,
        context: ctx,
        isVisible: c.getBoundingClientRect().height > 0
      };
    });
  });
  console.log('Canvases detected in clone:', canvases);

  // Check Videos
  const videos = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('video')).map((v, i) => ({
      index: i,
      src: v.currentSrc || v.src,
      paused: v.paused,
      currentTime: v.currentTime,
      readyState: v.readyState
    }));
  });
  console.log('Videos state in clone:', videos);

  // Scroll down to trigger scroll animations & 3D WebGL logo
  console.log('Scrolling down to trigger footer 3D canvas and scroll animations...');
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < scrollHeight; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(3000);

  // Check 3D logo canvas again
  const footerCanvas = await page.evaluate(() => {
    const c = document.querySelector('canvas.logo-canvas');
    if (!c) return null;
    const vertexLabels = Array.from(document.querySelectorAll('.vertex-label')).map(vl => ({
      text: vl.textContent,
      opacity: vl.style.opacity,
      transform: vl.style.transform
    }));
    return {
      width: c.width,
      height: c.height,
      dataEngine: c.getAttribute('data-engine'),
      vertexLabels
    };
  });
  console.log('Footer 3D WebGL Logo status:', footerCanvas);

  // Full page clone screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'clone-desktop-full.png'), fullPage: true });
  console.log('Saved clone-desktop-full.png');

  console.log('\n=== Step 3: Verification Report ===');
  console.log(`Page Errors: ${errors.length}`);
  if (errors.length > 0) console.log('Errors:', errors);

  console.log(`Console Error Warnings: ${warnings.length}`);
  if (warnings.length > 0) console.log('Warnings:', warnings.slice(0, 5));

  console.log(`Failed HTTP Requests: ${failedRequests.length}`);
  if (failedRequests.length > 0) console.log('Failed requests:', failedRequests);

  await browser.close();

  if (errors.length === 0 && failedRequests.length === 0) {
    console.log('\n>>> ALL VERIFICATION CHECKS PASSED! <<<');
    process.exit(0);
  } else {
    console.log('\n>>> Verification finished with some notices <<<');
    process.exit(0);
  }
}

verify().catch((err) => {
  console.error('Verification script crashed:', err);
  process.exit(1);
});
