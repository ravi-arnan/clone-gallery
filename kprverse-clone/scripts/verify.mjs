import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.dirname(__dirname);

const CRITICAL_FILES = [
  'index.html',
  'server.mjs',
  'package.json',
  'public/favicon.svg',
  'public/_nuxt/entry.6ad9710f.css',
  'public/_nuxt/entry.9cfb39b7.js',
  'public/_nuxt/Home.17c0ce45.js',
  'public/_nuxt/three.module.c9112413.js',
  'public/_nuxt/ABCWhytePlusVariable.703e8fca.woff2',
  'public/_nuxt/ABCWhyteInktrapVariable.7999c8d9.woff2',
  'public/_nuxt/IBMPlexMono-Regular.0b129200.ttf',
  'public/_nuxt/HexaframeCF-Bold.6373d9c0.otf',
  'public/gltf/compressed/etc1s/tableaux-keep/tableaux-keep-2048.glb',
  'public/gltf/compressed/etc1s/tableaux-factions/tableaux-factions-2048.glb',
  'public/gltf/compressed/etc1s/tableaux-universe/tableaux-universe-2048.glb',
  'public/gltf/compressed/etc1s/project/project-2048.glb',
  'public/gltf/compressed/etc1s/collection/collection-2048.glb',
  'public/draco/draco_decoder.wasm',
  'public/draco/draco_wasm_wrapper.js',
  'public/basis/basis_transcoder.wasm',
  'public/images/compressed/ktx/tableau/extras/pnoise0.ktx2',
  'public/images/compressed/webp/tableau/extras/noise.webp',
  'public/images/compressed/webp/tableau/extras/flick.webp',
  'public/images/sheets/header-sprite.json',
  'public/images/sheets/header-sprite.png',
  'public/images/tableau/keep/beam-ship/beam-ship-0.json',
  'public/images/tableau/keep/beam-ship/beam-ship-0.png',
  'public/images/tableau/keep/kai/kai-0.json',
  'public/images/tableau/keep/kai/kai-0.png',
  'public/images/project-story/female-cloth/female-cloth-0.json',
  'public/images/project-story/female-cloth/female-cloth-0.png',
  'public/audio/UI_menu_OPEN.mp3',
  'public/audio/UI_menu_CLOSE.mp3',
  'public/audio/FX_ALT_intro_animation.mp3',
  'public/audio/FX_logo_intro_animation.mp3',
  'public/videos/trailer/keepers-teaser-1080.mp4'
];

async function checkFiles() {
  console.log(`\n--- 1. Verifying ${CRITICAL_FILES.length} Critical Files ---`);
  let missing = 0;
  for (const rel of CRITICAL_FILES) {
    const full = path.join(ROOT_DIR, rel);
    if (fs.existsSync(full)) {
      const size = fs.statSync(full).size;
      console.log(`  [EXISTS] (${size.toLocaleString()} B) ${rel}`);
    } else {
      console.error(`  [MISSING] ${rel}`);
      missing++;
    }
  }
  return missing;
}

function fetchEndpoint(url, headers = {}) {
  return new Promise((resolve) => {
    const req = http.get(url, { headers }, (res) => {
      let size = 0;
      res.on('data', (c) => (size += c.length));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, size });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ error: 'timeout' });
    });
  });
}

async function checkEndpoints(port = 3000) {
  console.log(`\n--- 2. Verifying HTTP Endpoints on port ${port} ---`);
  const endpoints = [
    '/',
    '/_nuxt/entry.9cfb39b7.js',
    '/_nuxt/Home.17c0ce45.js',
    '/_nuxt/three.module.c9112413.js',
    '/gltf/compressed/etc1s/tableaux-keep/tableaux-keep-2048.glb',
    '/draco/draco_decoder.wasm',
    '/images/compressed/ktx/tableau/extras/pnoise0.ktx2',
    '/audio/UI_menu_OPEN.mp3',
    '/videos/trailer/keepers-teaser-1080.mp4',
    '/favicon.svg'
  ];

  let failed = 0;
  for (const ep of endpoints) {
    const res = await fetchEndpoint(`http://localhost:${port}${ep}`);
    if (res.error) {
      console.error(`  [FAIL] ${ep}: ${res.error}`);
      failed++;
    } else if (res.status === 200 || res.status === 206) {
      console.log(`  [HTTP ${res.status}] ${ep} (${res.size.toLocaleString()} B, type: ${res.headers['content-type']})`);
    } else {
      console.error(`  [HTTP ${res.status}] ${ep}`);
      failed++;
    }
  }
  return failed;
}

async function main() {
  const missingFiles = await checkFiles();
  const port = parseInt(process.env.PORT || '3000', 10);
  const failedEndpoints = await checkEndpoints(port);

  console.log('\n================ Verification Summary ================');
  console.log(`Missing Files: ${missingFiles}`);
  console.log(`Failed HTTP Endpoints: ${failedEndpoints}`);

  if (missingFiles > 0 || failedEndpoints > 0) {
    console.error('VERIFICATION FAILED');
    process.exit(1);
  } else {
    console.log('ALL CHECKS PASSED (100% OK)');
  }
}

main().catch(console.error);
