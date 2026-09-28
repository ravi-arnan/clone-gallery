import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = [];

function check(desc, condition, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${desc}`);
  } else {
    failedChecks.push({ desc, detail });
    console.error(`[FAIL] ${desc} - ${detail}`);
  }
}

console.log('=== Verifying Shopify Editions Winter 2026 Clone ===\n');

// 1. Structure
check('index.html exists', fs.existsSync(path.join(ROOT_DIR, 'index.html')));
check('server.mjs exists', fs.existsSync(path.join(ROOT_DIR, 'server.mjs')));
check('package.json exists', fs.existsSync(path.join(ROOT_DIR, 'package.json')));
check('PAGE_TOPOLOGY.md exists', fs.existsSync(path.join(ROOT_DIR, 'docs/research/PAGE_TOPOLOGY.md')));
check('BEHAVIORS.md exists', fs.existsSync(path.join(ROOT_DIR, 'docs/research/BEHAVIORS.md')));

// 2. Critical Oxygen JS modules
const requiredOxygen = [
  'manifest-40e0f26c.js',
  'entry.client-CXIPWjPz.js',
  'components-BdJai906.js',
  'Background-CGKUhMwd.js',
  'Effects-WhEp4HUr.js',
  'Butterflies-DLjrCfBq.js',
  'CoinRain-HBhd1OxE.js',
  'rive-DN8nxF7J.js',
  'HeroScene-BSrKcflv.js',
  'AgenticScene-CjbqotvP.js',
  'SidekickScene-BjZodfEY.js',
  'OnlineScene-BMHIFUKS.js',
  'RetailScene-C_gTk6Ga.js',
  'B2BScene-DkNPida2.js',
  'FinanceScene-BDwc32O0.js',
  'MarketingScene-Dfjygwwd.js',
  'DeveloperScene-BjLCbQRY.js',
  'OperationsScene-DdGQqwgR.js',
  'ShippingScene-CzO3hhHj.js',
  'CheckoutScene-zmnsTHZx.js',
  'ShopAppScene-BGpEYXgJ.js',
  'tailwind-G-N6aznT.css',
  'fonts-latin-CzfLCQn_.css'
];

for (const ox of requiredOxygen) {
  const p = path.join(PUBLIC_DIR, 'oxygen-assets', ox);
  check(`Oxygen asset: ${ox}`, fs.existsSync(p) && fs.statSync(p).size > 0);
}

// 3. Theatre.js Project States
const requiredTheatre = [
  'HeroScene.theatre-project-state_15.json',
  'AgenticScene.theatre-project-state.json',
  'SidekickScene.theatre-project-state_14_910d17ff-f5fb-4da0-920e-1b66f8d229b3.json',
  'OnlineScene.theatre-project-state_1_5a646934-a79e-49ac-80a9-825d8a3fb221.json',
  'RetailScene.theatre-project-state-cs-251209v2_b28f3c6c-7ab6-4036-9ac4-9f48df3024f0.json',
  'B2BScene.theatre-project-state_4.json',
  'FinanceScene.theatre-project-state_7.json',
  'MarketingScene.theatre-project-state_12.json',
  'DeveloperScene.theatre-project-state_5.json',
  'OperationsScene.theatre-project-state_8.json',
  'ShippingScene.theatre-project-state_12.json',
  'CheckoutScene.theatre-project-state_13.json',
  'ShopAppScene.theatre-project-state_8.json'
];

for (const th of requiredTheatre) {
  const p = path.join(PUBLIC_DIR, 'cdn.shopify.com/s/files/1/0951/3130/4218/files', th);
  check(`Theatre state: ${th}`, fs.existsSync(p) && fs.statSync(p).size > 0);
}

// 4. Draco Decoders & PMREM
check('Draco WASM decoder', fs.existsSync(path.join(PUBLIC_DIR, 'www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm')));
check('Draco JS wrapper', fs.existsSync(path.join(PUBLIC_DIR, 'www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js')));
check('PMREM lighting KTX2', fs.existsSync(path.join(PUBLIC_DIR, 'cdn.shopify.com/s/files/1/0951/3130/4218/files/studio_small_09_1k.pmrem.ktx2')));
check('Hat Sobel texture', fs.existsSync(path.join(PUBLIC_DIR, 'cdn.shopify.com/s/files/1/0951/3130/4218/files/hat-sobel.webp')));

// 5. Fonts
check('NeueMontreal font', fs.existsSync(path.join(PUBLIC_DIR, 'cdn.shopify.com/b/shopify-brochure2-assets/3ee238256136fcfdfca35decbd44d0d4.woff2')));
check('HWCigars font', fs.existsSync(path.join(PUBLIC_DIR, 'cdn.shopify.com/b/shopify-brochure2-assets/49a57a6e59f6a50f0627418abeb58fec.woff2')));
check('ImperialScript font', fs.existsSync(path.join(PUBLIC_DIR, 'cdn.shopify.com/b/shopify-brochure2-assets/389d4f8566b3b9cbe083b682c7fabf06.woff2')));

// 6. Test HTTP server endpoints on port 3948
console.log('\n--- Testing Local HTTP Server Endpoints ---');
const TEST_PORT = 3948;
process.env.PORT = String(TEST_PORT);

const serverProcess = await import('../server.mjs');

function testUrl(testPath, expectedCode = 200) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${TEST_PORT}${testPath}`, (res) => {
      const ok = res.statusCode === expectedCode;
      check(`Endpoint ${testPath} -> HTTP ${res.statusCode}`, ok, `Expected ${expectedCode}, got ${res.statusCode}`);
      res.resume();
      resolve(ok);
    }).on('error', (e) => {
      check(`Endpoint ${testPath}`, false, e.message);
      resolve(false);
    });
  });
}

// Wait for server listening
await new Promise(r => setTimeout(r, 600));

await testUrl('/', 302);
await testUrl('/editions/winter2026', 200);
await testUrl('/oxygen-assets/tailwind-G-N6aznT.css');
await testUrl('/oxygen-assets/manifest-40e0f26c.js');
await testUrl('/oxygen-assets/Background-CGKUhMwd.js');
await testUrl('/cdn.shopify.com/s/files/1/0951/3130/4218/files/HeroScene.theatre-project-state_15.json');
await testUrl('/www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm');
await testUrl('/cdn.shopify.com/s/files/1/0951/3130/4218/files/studio_small_09_1k.pmrem.ktx2');
await testUrl('/cdn.shopify.com/b/shopify-brochure2-assets/3ee238256136fcfdfca35decbd44d0d4.woff2');

console.log(`\n========================================`);
console.log(`Verification Results: ${passedChecks}/${totalChecks} PASSED`);
if (failedChecks.length > 0) {
  console.log(`Failed checks:`, failedChecks);
  process.exit(1);
} else {
  console.log(`All systems nominal. Clone verification 100% SUCCESS!`);
  process.exit(0);
}
