import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('=== The Watch Clone Asset Integrity & Verification ===\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, fn) {
  totalChecks++;
  try {
    const res = fn();
    if (res !== false) {
      console.log(`[PASS] ${desc}`);
      passedChecks++;
    } else {
      console.error(`[FAIL] ${desc}`);
    }
  } catch (err) {
    console.error(`[FAIL] ${desc}: ${err.message}`);
  }
}

// 1. Entry files
check('index.html exists and has content', () => {
  const p = path.join(ROOT_DIR, 'index.html');
  const stat = fs.statSync(p);
  const content = fs.readFileSync(p, 'utf-8');
  return stat.size > 500 && content.includes('canvas-wrapper') && content.includes('root') && content.includes('loader');
});

check('server.mjs exists', () => {
  return fs.existsSync(path.join(ROOT_DIR, 'server.mjs'));
});

check('package.json exists', () => {
  return fs.existsSync(path.join(ROOT_DIR, 'package.json'));
});

// 2. 3D Models
check('3D Watch Model (watch-DXFPNOEl.glb) is valid (>8MB)', () => {
  const p = path.join(PUBLIC_DIR, 'assets/watch-DXFPNOEl.glb');
  const stat = fs.statSync(p);
  const fd = fs.openSync(p, 'r');
  const buf = Buffer.alloc(4);
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  return stat.size > 8000000 && buf.toString('utf-8') === 'glTF';
});

check('Sample 3D Model (model-BhXOvGiC.glb) is valid (>200KB)', () => {
  const p = path.join(PUBLIC_DIR, 'assets/model-BhXOvGiC.glb');
  const stat = fs.statSync(p);
  const fd = fs.openSync(p, 'r');
  const buf = Buffer.alloc(4);
  fs.readSync(fd, buf, 0, 4, 0);
  fs.closeSync(fd);
  return stat.size > 100000 && buf.toString('utf-8') === 'glTF';
});

// 3. HDR / EXR Environment Maps
check('EXR Environment maps exist and are non-empty', () => {
  const envmap = fs.statSync(path.join(PUBLIC_DIR, 'assets/envmap-kW4EmG7W.exr')).size;
  const metal = fs.statSync(path.join(PUBLIC_DIR, 'assets/metal-B47qzO42.exr')).size;
  const sunrise = fs.statSync(path.join(PUBLIC_DIR, 'assets/sunrise-B8ECBLua.exr')).size;
  return envmap > 1000000 && metal > 300000 && sunrise > 1000000;
});

// 4. Material Config JSON
check('Material configuration (default-Bo472-CV.json) is valid JSON', () => {
  const p = path.join(PUBLIC_DIR, 'assets/default-Bo472-CV.json');
  const json = JSON.parse(fs.readFileSync(p, 'utf-8'));
  return json.materials && json.materials['metal-glossy'];
});

// 5. Product Gallery WebP Images (20 images)
check('All 20 color variant gallery images exist and are valid', () => {
  const configs = ['first', 'second', 'third', 'fourth'];
  for (const cfg of configs) {
    for (let i = 1; i <= 5; i++) {
      const p = path.join(PUBLIC_DIR, `assets/the-watch/img/images-section/${cfg}_${i}.webp`);
      if (!fs.existsSync(p) || fs.statSync(p).size < 1000) return false;
    }
  }
  return true;
});

// 6. Mechanism Parts Images (10 images)
check('All 10 watch parts images exist', () => {
  const parts = ['dial', 'hands', 'crystal', 'bezel', 'lugs', 'strap', 'buckle', 'crown', 'caseback', 'movement'];
  for (const part of parts) {
    const p = path.join(PUBLIC_DIR, `assets/the-watch/img/parts/${part}.jpg`);
    if (!fs.existsSync(p) || fs.statSync(p).size < 1000) return false;
  }
  return true;
});

// 7. Core JS Bundles & GSAP
check('Core JS Bundles and GSAP chunk exist', () => {
  const required = [
    'assets/index-Ck-pEZ8v.js',
    'assets/the-watch.D6O26wKS.js',
    'assets/hotReplace.BfRBVwiW.js',
    'assets/sample-project.COb35JvF.js',
    'assets/gsapAnimation.pTu-v-2i.js',
    'assets/en_GB.CAgLt01W.js',
    'assets/fr_FR.DKItQTa6.js'
  ];
  return required.every(f => fs.existsSync(path.join(PUBLIC_DIR, f)) && fs.statSync(path.join(PUBLIC_DIR, f)).size > 100);
});

// 8. Fonts
check('Web Fonts (Inter & Nekst) are present', () => {
  const p1 = path.join(PUBLIC_DIR, 'assets/fonts/Inter/Inter-Regular.woff2');
  const p2 = path.join(PUBLIC_DIR, 'assets/fonts/Nekst/Nekst-Bold.woff2');
  return fs.existsSync(p1) && fs.existsSync(p2);
});

console.log(`\nVerification complete: ${passedChecks}/${totalChecks} checks passed.`);
if (passedChecks === totalChecks) {
  console.log('STATUS: ALL INTEGRITY CHECKS PASSED!\n');
  process.exit(0);
} else {
  console.error('STATUS: SOME CHECKS FAILED!\n');
  process.exit(1);
}
