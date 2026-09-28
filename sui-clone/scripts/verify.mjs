import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(BASE_DIR, 'public');

let totalChecks = 0;
let passedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

console.log('=== VERIFYING SUI.IO CLONE INTEGRITY ===\n');

// 1. Check index.html
const indexPath = path.join(BASE_DIR, 'index.html');
assert(fs.existsSync(indexPath) && fs.statSync(indexPath).size > 100000, 'index.html exists and is non-trivial (>100KB)');

const indexContent = fs.readFileSync(indexPath, 'utf8');
assert(indexContent.includes('Where AI transacts'), 'index.html contains Hero heading "Where AI transacts"');
assert(indexContent.includes('The stack autonomous systems run on'), 'index.html contains Timeline section');
assert(indexContent.includes('canvas_sequence'), 'index.html contains Canvas Sequence element');
assert(indexContent.includes('sui-v2.shared'), 'index.html includes localized sui-v2 stylesheet');
assert(indexContent.includes('slater-17378.js'), 'index.html includes localized Slater animation loader');

// 2. Vendor scripts
const vendorFiles = [
  'gsap.min.js', 'ScrollTrigger.min.js', 'SplitText.min.js',
  'CustomEase.min.js', 'InertiaPlugin.min.js', 'Observer.min.js',
  'Draggable.min.js', 'DrawSVGPlugin.min.js', 'ScrambleTextPlugin.min.js',
  'MorphSVGPlugin.min.js', 'Flip.min.js', 'lenis.min.js',
  'jquery-3.5.1.min.js', 'rive.min.js', 'lottie.min.js'
];
for (const f of vendorFiles) {
  const p = path.join(PUBLIC_DIR, 'vendor', f);
  assert(fs.existsSync(p) && fs.statSync(p).size > 100, `Vendor library exists: ${f}`);
}

// 3. Webflow JS chunks
const webflowChunks = [
  'sui-v2.schunk.8110c5140c42692b.js',
  'sui-v2.schunk.288df1f54663a3bc.js',
  'sui-v2.schunk.305741e705aa0ac6.js',
  'sui-v2.schunk.d64be42593ba95e6.js',
  'sui-v2.schunk.9dfb96661114d3db.js',
  'sui-v2.6382a8df.0d93f870390191b1.js'
];
for (const f of webflowChunks) {
  const p = path.join(PUBLIC_DIR, 'js', f);
  assert(fs.existsSync(p) && fs.statSync(p).size > 1000, `Webflow chunk exists: ${f}`);
}

// 4. Slater scripts
const slaterFiles = ['slater-17378.js', 'slater-50007.js', 'slater-50689.js'];
for (const f of slaterFiles) {
  const p = path.join(PUBLIC_DIR, 'js', f);
  assert(fs.existsSync(p) && fs.statSync(p).size > 1000, `Slater animation script exists: ${f}`);
}

// 5. Canvas sequence frames (76 frames)
let framesCount = 0;
for (let i = 0; i <= 75; i++) {
  const frameName = `frame_${i.toString().padStart(4, '0')}.webp`;
  const p = path.join(PUBLIC_DIR, 'sequences/homepage-scroll', frameName);
  if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
    framesCount++;
  }
}
assert(framesCount === 76, `3D Canvas Sequence frames complete: ${framesCount}/76`);

// 6. Rive models
const riveDir = path.join(PUBLIC_DIR, 'rive');
const riveFiles = fs.readdirSync(riveDir).filter(f => f.endsWith('.riv'));
assert(riveFiles.length >= 6, `Rive models installed: ${riveFiles.length} files`);
for (const rf of riveFiles) {
  assert(fs.statSync(path.join(riveDir, rf)).size > 5000, `Rive model valid: ${rf}`);
}

// 7. Lottie JSON animations
const lottieDir = path.join(PUBLIC_DIR, 'lottie');
const lottieFiles = fs.readdirSync(lottieDir).filter(f => f.endsWith('.json'));
assert(lottieFiles.length >= 13, `Lottie animations installed: ${lottieFiles.length} files`);
let validLottie = 0;
for (const lf of lottieFiles) {
  try {
    JSON.parse(fs.readFileSync(path.join(lottieDir, lf), 'utf8'));
    validLottie++;
  } catch (e) {}
}
assert(validLottie === lottieFiles.length, `All ${validLottie} Lottie JSON files parse cleanly`);

// 8. Videos
const videoDir = path.join(PUBLIC_DIR, 'videos');
const videoFiles = fs.readdirSync(videoDir).filter(f => f.endsWith('.mp4') || f.endsWith('.webm'));
assert(videoFiles.length >= 4, `Hero and ecosystem videos present: ${videoFiles.length} files`);

// 9. Fonts
const fontDir = path.join(PUBLIC_DIR, 'fonts');
const fontFiles = fs.readdirSync(fontDir);
assert(fontFiles.length >= 15, `TWK Everett typography fonts installed: ${fontFiles.length} files`);

// 10. Test server response
console.log('\n--- TESTING LOCAL SERVER RUNTIME ---');

const testReq = (urlPath) => {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, length: Buffer.byteLength(data) });
      });
    }).on('error', (err) => resolve({ status: 500, error: err.message }));
  });
};

Promise.all([
  testReq('/'),
  testReq('/css/sui-v2.shared.230f7fdb5.min.css'),
  testReq('/vendor/gsap.min.js'),
  testReq('/vendor/lenis.min.js'),
  testReq('/vendor/rive.min.js'),
  testReq('/js/slater-50689.js'),
  testReq('/sequences/homepage-scroll/frame_0000.webp'),
  testReq('/rive/692481ba00e8cc9cc42d9a75_Data_Storage.riv'),
  testReq('/lottie/692ea9c07a4530e0a1c8fde2_05_-_AI.json')
]).then(results => {
  assert(results[0].status === 200 && results[0].headers['content-type'].includes('text/html'), 'GET / returns 200 HTML');
  assert(results[1].status === 200 && results[1].headers['content-type'].includes('text/css'), 'GET /css/... returns 200 CSS');
  assert(results[2].status === 200 && results[2].headers['content-type'].includes('javascript'), 'GET /vendor/gsap.min.js returns 200 JS');
  assert(results[3].status === 200 && results[3].headers['content-type'].includes('javascript'), 'GET /vendor/lenis.min.js returns 200 JS');
  assert(results[4].status === 200 && results[4].headers['content-type'].includes('javascript'), 'GET /vendor/rive.min.js returns 200 JS');
  assert(results[5].status === 200 && results[5].headers['content-type'].includes('javascript'), 'GET /js/slater-50689.js returns 200 JS');
  assert(results[6].status === 200 && results[6].headers['content-type'].includes('image/webp'), 'GET /sequences/.../frame_0000.webp returns 200 WebP');
  assert(results[7].status === 200 && results[7].headers['content-type'].includes('application/octet-stream'), 'GET /rive/... returns 200 octet-stream');
  assert(results[8].status === 200 && results[8].headers['content-type'].includes('application/json'), 'GET /lottie/... returns 200 JSON');

  console.log(`\n========================================`);
  console.log(`VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} PASS`);
  console.log(`========================================\n`);

  process.exit(passedChecks === totalChecks ? 0 : 1);
});
