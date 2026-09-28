#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('==============================================');
console.log(' ERA RESIDENCE CLONE — INTEGRITY VERIFICATION');
console.log('==============================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(label, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${label}`);
  } else {
    failedChecks++;
    console.error(`[FAIL] ${label} - ${details}`);
  }
}

// 1. Check Routes
console.log('--- 1. Route HTML Integrity ---');
const routes = [
  'index.html',
  'apartments/index.html',
  'contact/index.html',
  'coming-soon/index.html',
  'apartments/011/index.html',
  'apartments/031/index.html',
  'apartments/111/index.html',
  'apartments/224/index.html'
];

for (const r of routes) {
  const p = path.join(ROOT_DIR, r);
  const exists = fs.existsSync(p) && fs.statSync(p).size > 1000;
  const size = exists ? fs.statSync(p).size : 0;
  check(`Route: /${r}`, exists, `Size: ${size} bytes`);
}

// 2. Check 3D Bougainvillea Flower Videos
console.log('\n--- 2. 3D Bougainvillea Flower Simulations (WebM & MOV) ---');
for (let i = 1; i <= 7; i++) {
  const num = String(i).padStart(2, '0');
  const webmName = `public/assets.era-residence.com/flowers/bougainvillea-flowers_${num}.webm`;
  const movName = `public/assets.era-residence.com/flowers/bougainvillea-flowers_${num}.mov`;
  
  const webmPath = path.join(ROOT_DIR, webmName);
  const movPath = path.join(ROOT_DIR, movName);

  const webmExists = fs.existsSync(webmPath) && fs.statSync(webmPath).size > 10000;
  const movExists = fs.existsSync(movPath) && fs.statSync(movPath).size > 10000;

  const webmSize = webmExists ? (fs.statSync(webmPath).size / 1024 / 1024).toFixed(2) : 0;
  const movSize = movExists ? (fs.statSync(movPath).size / 1024 / 1024).toFixed(2) : 0;

  check(`Flower 3D Simulation #${num} (WebM)`, webmExists, `${webmSize} MB`);
  check(`Flower 3D Simulation #${num} (MOV)`, movExists, `${movSize} MB`);
}

// 3. Check Animation Engine & Vendor JS
console.log('\n--- 3. Animation Libraries & GSAP Bundles ---');
const scripts = [
  'public/cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js',
  'public/cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js',
  'public/cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js',
  'public/cdn.jsdelivr.net/npm/gsap@3.15/dist/CustomEase.min.js',
  'public/unpkg.com/lenis@1.3.21/dist/lenis.min.js',
  'public/cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js',
  'public/unpkg.com/@barba/core',
  'public/assets.slater.app/slater/20164.js',
  'public/assets.slater.app/slater/20164/60900.js'
];

for (const s of scripts) {
  const p = path.join(ROOT_DIR, s);
  const minSize = s.endsWith('20164.js') ? 20 : 500;
  const exists = fs.existsSync(p) && fs.statSync(p).size > minSize;
  const size = exists ? (fs.statSync(p).size / 1024).toFixed(1) : 0;
  check(`Script: ${path.basename(s)}`, exists, `${size} KB`);
}

// 4. Check Lottie Brand Asset
console.log('\n--- 4. Lottie Brand Assets ---');
const lottiePath = path.join(ROOT_DIR, 'public/pub-157506367d4c4fa1825d7a6d26b687a2.r2.dev/tftl-logo_white.json');
let lottieValid = false;
try {
  if (fs.existsSync(lottiePath)) {
    const raw = fs.readFileSync(lottiePath, 'utf8');
    const parsed = JSON.parse(raw);
    lottieValid = parsed && (parsed.v || parsed.layers);
  }
} catch {
  lottieValid = false;
}
check('Lottie TFTL Logo (tftl-logo_white.json)', lottieValid, `${(fs.statSync(lottiePath).size / 1024).toFixed(1)} KB`);

// 5. Check Typography
console.log('\n--- 5. Editorial Typography & Font Files ---');
const fonts = [
  'public/use.typekit.net/af/02a0c4/0000000000000000773598f9/31/l', // ambroise woff2
  'public/use.typekit.net/af/ceca40/00000000000000007758dac7/31/l', // sloop woff2
  'public/cdn.prod.website-files.com/6a068da7ad91b057365bf967/6a06a699270853940fed199c_MaisonNeueExt-Book.woff2',
  'public/cdn.prod.website-files.com/6a068da7ad91b057365bf967/6a06a6b22391d5d6ce159452_MaisonNeueExt-Bold.woff2',
  'public/css/fonts.css'
];

for (const f of fonts) {
  const p = path.join(ROOT_DIR, f);
  const exists = fs.existsSync(p) && fs.statSync(p).size > 100;
  check(`Font/CSS: ${path.basename(f)}`, exists, `${fs.existsSync(p) ? fs.statSync(p).size : 0} bytes`);
}

// 6. Check Total Assets in Public
console.log('\n--- 6. Public Directory Asset Count ---');
let totalFiles = 0;
let totalBytes = 0;
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile()) {
      totalFiles++;
      totalBytes += fs.statSync(full).size;
    }
  }
}
walk(PUBLIC_DIR);
check('Public static assets count >= 350', totalFiles >= 350, `Found: ${totalFiles} files`);
check('Public static storage size >= 140 MB', totalBytes >= 140 * 1024 * 1024, `Size: ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);

// Summary
console.log('\n==============================================');
console.log(`VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} PASSED (${failedChecks} FAILED)`);
console.log('==============================================\n');

if (failedChecks > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
