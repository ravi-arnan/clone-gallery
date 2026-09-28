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
  '/assets/style-BgpnrCnL.css',
  '/assets/webgl-CS4l6lxD.js',
  '/assets/App3D-DwM1eiaC.js',

  // Workers
  '/assets/glyphworker-DoaYwstb.js',
  '/assets/dracoworker-9mmlh0V-.js',
  '/assets/geometryworker-WyEueJn9.js',
  '/assets/msdfworker-DGxypdow.js',
  '/assets/bitmapworker-DtCLhbWB.js',
  '/assets/exrworker-Dm3Bkfzh.js',
  '/assets/collisionworker-eT5h7hIA.js',
  '/assets/charactergeoworker-D8pdYVWP.js',

  // Libs / WASM
  '/assets/libs/draco/draco_wasm_wrapper.js',
  '/assets/libs/draco/draco_decoder.wasm',
  '/assets/libs/basis/basis_transcoder.js',
  '/assets/libs/basis/basis_transcoder.wasm',
  '/assets/libs/glyph/glyph.js',
  '/assets/libs/glyph/glyph.wasm',

  // Fonts
  '/assets/fonts/heading.font',
  '/assets/fonts/planet.font',
  '/assets/fonts/UglyDave-Alternates-optimized.font',

  // Textures
  '/assets/images/atlas.png',
  '/assets/images/lut.ktx2',
  '/assets/images/clouds_noise_64.ktx2',
  '/assets/images/clouds_noise_512.ktx2',
  '/assets/images/particle_sprites.ktx2',
  '/assets/images/noise-simplex-layered-pixellated-highq.ktx2',
  '/assets/images/water-noises-highq.ktx2',
  '/assets/images/galaxy.ktx2',
  '/assets/images/noises-terrain.ktx2',
  '/assets/images/grass-blades-highq.ktx2',
  '/assets/images/tree-leaves.ktx2',
  '/assets/images/tree-leaves-detail.ktx2',
  '/assets/images/butterfly-highq.ktx2',
  '/assets/images/butterfly-front-highq.ktx2',
  '/assets/images/controls/circles.avif',

  // Icons
  '/assets/images/ui/sidebuttons/list.icon',
  '/assets/images/ui/sidebuttons/sound.icon',
  '/assets/images/ui/sidebuttons/sound-muted.icon',
  '/assets/images/ui/sidebuttons/t-shirt.icon',
  '/assets/images/ui/sidebuttons/poo.icon',
  '/assets/images/ui/arrow.icon',
  '/assets/images/ui/cross.icon',
  '/assets/images/ui/emojis/0.icon',
  '/assets/images/ui/quests/complete.icon',
  '/assets/images/ui/quests/house.icon',

  // Audio
  '/assets/audio/music/bgmusic-highq.ogg',
  '/assets/audio/ambiances/factory.ogg',
  '/assets/audio/ambiances/forest.ogg',
  '/assets/audio/ambiances/city.ogg',
  '/assets/audio/character/footsteps4.ogg',
  '/assets/audio/dialogues/quest.ogg',
  '/assets/audio/ui/click2.ogg',

  // 3D Models (.drc)
  '/assets/geometries/planets/intro/points.drc',
  '/assets/geometries/planets/present/intro/planet.drc',
  '/assets/geometries/planets/present/intro/water.drc',
  '/assets/geometries/planets/present/intro/trees.drc',
  '/assets/geometries/planets/present/intro/clouds.drc',
  '/assets/geometries/planets/present/intro/title_vertical.drc',
  '/assets/geometries/planets/present/intro/galaxies.drc',
  '/assets/geometries/planets/present/intro/button.drc',
  '/assets/geometries/planets/present/cables-1.drc',
  '/assets/geometries/planets/present/waterfall_vfx.drc',
  '/assets/geometries/planets/present/waterfallsplash_vfx.drc',
  '/assets/geometries/planets/present/beachfoam_vfx.drc',
  '/assets/geometries/planets/present/water.drc',
  '/assets/geometries/planets/present/grass.drc',
  '/assets/geometries/planets/present/butterflies.drc',
  '/assets/geometries/planets/present/full_0.drc',
  '/assets/geometries/planets/present/full_9.drc',
  '/assets/geometries/planets/present/hitmesh_0.drc',
  '/assets/geometries/planets/present/tree-leaves_0.drc',

  // Characters & NPCs
  '/assets/geometries/avatar/avatar-bones.drc',
  '/assets/geometries/avatar/avatar-idle.drc',
  '/assets/geometries/avatar/avatar-run.drc',
  '/assets/geometries/avatar/accessories/base.drc',
  '/assets/geometries/avatar/accessories/hair1.drc',
  '/assets/geometries/avatar/accessories/top1.drc',
  '/assets/geometries/avatar/accessories/bottom1.drc',
  '/assets/geometries/avatar/accessories/shoes1.drc',
  '/assets/geometries/npcs/present/alien/alien.drc',
  '/assets/geometries/npcs/present/boss/boss.drc',
  '/assets/geometries/npcs/present/caveman/caveman.drc',
  '/assets/geometries/npcs/present/chef/chef.drc',
  '/assets/geometries/npcs/present/musician/musician.drc',
  '/assets/geometries/npcs/present/young-lady/young-lady.drc',
  '/assets/geometries/birds/1.drc',
  '/assets/geometries/emojis/1.drc',
  '/assets/geometries/deliveries/clothes.drc'
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
        ok: res.statusCode === 200 || res.statusCode === 206
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
  console.log('='.repeat(65));
  console.log('🌐 ABETO MESSENGER CLONE - ASSET & RUNTIME INTEGRITY VERIFICATION');
  console.log('='.repeat(65));

  // 1. Filesystem check
  console.log('\n[1/2] Checking on-disk files in public/ and root...');
  let missingFiles = 0;
  for (const rel of CRITICAL_PATHS) {
    if (rel === '/') continue;
    const p1 = path.join(ROOT, 'public', rel.startsWith('/') ? rel.slice(1) : rel);
    const p2 = path.join(ROOT, rel.startsWith('/') ? rel.slice(1) : rel);
    const exists = (fs.existsSync(p1) && fs.statSync(p1).isFile()) || (fs.existsSync(p2) && fs.statSync(p2).isFile());
    if (!exists) {
      console.log(`  ❌ Missing on disk: ${rel}`);
      missingFiles++;
    }
  }

  if (missingFiles === 0) {
    console.log(`  ✅ All ${CRITICAL_PATHS.length - 1} critical test files present on disk!`);
  } else {
    console.log(`  ⚠️  Found ${missingFiles} missing files on disk.`);
  }

  // 2. HTTP Server Check
  console.log(`\n[2/2] Testing live endpoints on http://127.0.0.1:${PORT}...`);
  let passed = 0;
  let failed = 0;

  for (const p of CRITICAL_PATHS) {
    const res = await checkUrl(p);
    if (res.ok) {
      passed++;
      const sizeStr = res.size ? `(${Number(res.size).toLocaleString()} bytes)` : '';
      console.log(`  ✅ HTTP ${res.status} [${res.type}] ${p} ${sizeStr}`);
    } else {
      failed++;
      console.log(`  ❌ HTTP ${res.status} FAILED: ${p} (error: ${res.error || 'bad status'})`);
    }
  }

  console.log('\n' + '='.repeat(65));
  console.log(`VERIFICATION RESULT:`);
  console.log(`  Total Endpoints Checked: ${CRITICAL_PATHS.length}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log('='.repeat(65));

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL ENDPOINTS VERIFIED 100% OPERATIONAL!');
    process.exit(0);
  }
}

run();
