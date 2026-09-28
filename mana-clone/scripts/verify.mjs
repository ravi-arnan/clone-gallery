import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.dirname(__dirname);
const PORT = parseInt(process.env.PORT || '3001', 10);

const CRITICAL_PATHS = [
  '/',
  '/assets/app.css',
  '/assets/global.js',
  '/assets/MANA_canettes__v5_WEBGL.gltf',
  '/assets/MANA_canettes__v5_WEBGL.bin',
  '/assets/MANA_hdr.hdr',
  '/assets/MANA_canette_top_normal copy_exr.png',
  '/assets/MANA_canette_top_normal%20copy_exr.png',
  '/assets/MANA_canette_pamp_color_for_mat_v2.png',
  '/assets/MANA_canette_pamp_roughness__metal_maps.png',
  '/assets/MANA_canette_hibiscus_color_for_mat.png',
  '/assets/MANA_canette_tropical_color_for_mat.png',
  '/assets/MANA_canette_melon_mint_mat.png',
  '/assets/NeueMontreal-Medium.woff2',
  '/assets/NeueMontreal2020-Book.woff2',
  '/assets/NeueMontreal2020-Regular.woff2',
  '/assets/lottie_pamp_1.json',
  '/assets/lottie_pamp_2.json',
  '/assets/lottie_pamp_4.json',
  '/assets/lottie_hibi_1.json',
  '/assets/lottie_hibi_2.json',
  '/assets/lottie_hibi_3.json',
  '/assets/lottie_trop_1.json',
  '/assets/lottie_trop_2.json',
  '/assets/lottie_trop_4.json',
  '/assets/lottie_melo_1.json',
  '/assets/lottie_melo_2.json',
  '/assets/lottie_melo_3.json',
  '/assets/carte_crash.json',
  '/assets/carte_caf.json',
  '/assets/carte_antiox.json',
  '/assets/carte_vege.json',
  '/assets/jeu_happy.json',
  '/assets/jeu_sad.json',
  '/assets/jeu_walk.json',
  '/assets/jeu_jump.json',
  '/assets/jeu_paysage.json',
  '/assets/bubbles.json',
  '/assets/transition-faster.json',
  '/cdn/shop/files/favicon-32x32.png',
  '/cdn/shop/files/1-1eie_827x980.jpg',
  '/cdn/shop/files/2-1eie_827x980.jpg',
  '/cdn/shop/files/boite_827x980.jpg',
  '/cdn/shop/files/MANA_2024_3d_visuel_2_1920x1080_-_150dpi.jpg',
  '/cdn/shop/files/Mana5969_250x250_crop_center.jpg',
  '/cdn/shop/files/mures-01_1f205ae0-9697-4285-bb1b-88a2d02ce70d_827x980.jpg',
  '/cdn/shop/files/pamplemousse-01_827x980.jpg',
  '/cdn/shop/files/tropical-01_827x980.jpg'
];

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const encoded = encodeURI(decodeURI(urlPath));
    const req = http.request({
      hostname: '127.0.0.1',
      port: PORT,
      path: encoded,
      method: 'HEAD',
      timeout: 3000
    }, (res) => {
      resolve({
        path: urlPath,
        status: res.statusCode,
        size: res.headers['content-length'],
        type: res.headers['content-type'],
        ok: res.statusCode === 200
      });
    });

    req.on('error', (err) => {
      resolve({ path: urlPath, status: 0, error: err.message, ok: false });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ path: urlPath, status: 408, error: 'Timeout', ok: false });
    });

    req.end();
  });
}

async function run() {
  console.log('='.repeat(60));
  console.log('MANA YERBA MATE - ASSET & RUNTIME INTEGRITY VERIFICATION');
  console.log('='.repeat(60));

  // 1. Filesystem check
  console.log('\n[1/2] Checking on-disk files...');
  let diskErrors = 0;
  for (const item of CRITICAL_PATHS) {
    if (item === '/') {
      const p = path.join(ROOT, 'index.html');
      if (!fs.existsSync(p)) {
        console.error(`  [FAIL] Missing index.html`);
        diskErrors++;
      }
      continue;
    }

    const clean = decodeURI(item.split('?')[0]);
    let localFile;
    if (clean.startsWith('/assets/')) {
      localFile = path.join(ROOT, 'public', 'assets', clean.slice('/assets/'.length));
    } else {
      localFile = path.join(ROOT, 'public', clean.slice(1));
    }

    if (!fs.existsSync(localFile)) {
      console.error(`  [FAIL] Missing disk file: ${item} -> ${localFile}`);
      diskErrors++;
    }
  }

  if (diskErrors === 0) {
    console.log(`  [PASS] All ${CRITICAL_PATHS.length} critical assets verified on disk.`);
  } else {
    console.error(`  [FAIL] ${diskErrors} asset(s) missing on disk.`);
  }

  // 2. HTTP Server check
  console.log(`\n[2/2] Checking HTTP endpoints on port ${PORT}...`);
  const results = await Promise.all(CRITICAL_PATHS.map(checkUrl));
  let httpErrors = 0;

  for (const r of results) {
    if (!r.ok) {
      console.error(`  [FAIL] ${r.status} ${r.path} (${r.error || 'bad status'})`);
      httpErrors++;
    }
  }

  if (httpErrors === 0) {
    console.log(`  [PASS] All ${CRITICAL_PATHS.length} HTTP endpoints returned 200 OK.`);
  } else {
    console.error(`  [FAIL] ${httpErrors} HTTP endpoints failed.`);
  }

  console.log('\n' + '='.repeat(60));
  if (diskErrors === 0 && httpErrors === 0) {
    console.log('VERIFICATION COMPLETE: 100% HEALTHY - ALL CRITICAL PATHS OK');
    console.log('='.repeat(60));
    process.exit(0);
  } else {
    console.error(`VERIFICATION FAILED: ${diskErrors} disk errors, ${httpErrors} HTTP errors`);
    console.log('='.repeat(60));
    process.exit(1);
  }
}

run();
