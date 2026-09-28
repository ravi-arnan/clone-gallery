import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const BASE = '/home/ravi/Projects/animejs-clone';

async function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function downloadFile(url, destPath) {
  const dir = path.dirname(destPath);
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
    console.log(`[SKIP] Already exists: ${destPath}`);
    return;
  }
  try {
    const buf = await fetchBuffer(url);
    fs.writeFileSync(destPath, buf);
    console.log(`[OK] Downloaded: ${url} -> ${destPath} (${buf.length} bytes)`);
  } catch (err) {
    console.error(`[ERR] Failed ${url}: ${err.message}`);
  }
}

async function main() {
  console.log('Starting full asset download ...');

  // 1. Copy home.js to public/assets/js/home.js
  if (fs.existsSync(`${BASE}/home.js`)) {
    fs.mkdirSync(`${BASE}/public/assets/js`, { recursive: true });
    fs.copyFileSync(`${BASE}/home.js`, `${BASE}/public/assets/js/home.js`);
    console.log('[OK] Copied home.js to public/assets/js/home.js');
  }

  // 2. Models
  const models = [
    'module-draggable-01.glb',
    'module-draggable-02.glb',
    'module-animate-01.glb',
    'module-easing-01.glb',
    'module-scope-01.glb',
    'module-scroll-01.glb',
    'module-timer-01.glb',
    'module-timer-02.glb',
    'module-timer-03.glb',
    'module-timer-04.glb',
    'module-timer-05.glb',
    'module-engine-01.glb',
    'module-stagger-01.glb',
    'module-stagger-02.glb',
    'module-spring-01.glb',
    'module-svg-01.glb',
    'module-shield-01.glb',
    'module-shield-02.glb',
    'module-timeline-01.glb',
    'module-timeline-02.glb',
    'module-renderer-01.glb',
    'module-waapi-01.glb'
  ];
  for (const m of models) {
    await downloadFile(`https://animejs.com/assets/models/${m}`, `${BASE}/public/assets/models/${m}`);
  }

  // 3. Draco
  const dracoFiles = [
    'draco_decoder.wasm',
    'draco_wasm_wrapper.js',
    'draco_decoder.js',
    'draco_encoder.js'
  ];
  for (const d of dracoFiles) {
    await downloadFile(`https://animejs.com/assets/draco/${d}`, `${BASE}/public/assets/draco/${d}`);
  }

  // 4. JS Chunks
  const chunks = [
    'chunk-WQVFBASJ.js',
    'chunk-DCANE7XH.js',
    'chunk-FX45FQRC.js',
    'chunk-N6I4AEHZ.js',
    'chunk-WXAKRBIO.js',
    'chunk-CPVC3KGU.js',
    'debug-CBQ742GO.js'
  ];
  for (const c of chunks) {
    await downloadFile(`https://animejs.com/assets/js/chunks/${c}`, `${BASE}/public/assets/js/chunks/${c}`);
  }

  // 5. Fonts
  const fonts = [
    'BerkeleyMono-Regular.woff2',
    'BerkeleyMono-Italic.woff2',
    'DINish[slnt,wdth,wght].woff2',
    'Digital-7MonoItalic.woff2'
  ];
  for (const f of fonts) {
    await downloadFile(`https://animejs.com/assets/fonts/${f}`, `${BASE}/public/assets/fonts/${f}`);
  }

  // 6. Stylesheets
  await downloadFile('https://animejs.com/assets/css/core.css?v=1787698626', `${BASE}/public/assets/css/core.css`);
  await downloadFile('https://animejs.com/assets/css/home.css?v=1787698626', `${BASE}/public/assets/css/home.css`);

  // 7. JSON & Images
  await downloadFile('https://animejs.com/assets/json/easings.json', `${BASE}/public/assets/json/easings.json`);
  await downloadFile('https://animejs.com/assets/images/anime-js-logo-v4.svg', `${BASE}/public/assets/images/anime-js-logo-v4.svg`);
  await downloadFile('https://animejs.com/assets/images/favicon.png', `${BASE}/public/assets/images/favicon.png`);
  await downloadFile('https://animejs.com/assets/images/icons/drop-down.svg', `${BASE}/public/assets/images/icons/drop-down.svg`);
  await downloadFile('https://animejs.com/media/pages/sponsors/platinum-sponsors/ef1c9c6c85-1787698629/sponsor-placeholder.svg', `${BASE}/public/media/pages/sponsors/platinum-sponsors/ef1c9c6c85-1787698629/sponsor-placeholder.svg`);
  await downloadFile('https://animejs.com/media/pages/sponsors/silver-sponsors/49214d1e15-1787698629/testmu-ai-logomark.svg', `${BASE}/public/media/pages/sponsors/silver-sponsors/49214d1e15-1787698629/testmu-ai-logomark.svg`);
  await downloadFile('https://animejs.com/media/pages/home/066c76f87b-1787698629/generated-og-image.en.png', `${BASE}/public/media/pages/home/066c76f87b-1787698629/generated-og-image.en.png`);

  // 8. Sponsor endpoints
  const sponsorEndpoints = [
    'github-sponsors',
    'platinum-sponsors',
    'gold-sponsors',
    'silver-sponsors'
  ];
  for (const ep of sponsorEndpoints) {
    await downloadFile(`https://animejs.com/sponsors/${ep}`, `${BASE}/public/sponsors/${ep}`);
  }

  // 9. Download GitHub avatars from github-sponsors
  const githubSponsorsPath = `${BASE}/public/sponsors/github-sponsors`;
  if (fs.existsSync(githubSponsorsPath)) {
    const content = fs.readFileSync(githubSponsorsPath, 'utf-8');
    const avatarUrls = [...content.matchAll(/https:\/\/avatars\.githubusercontent\.com\/u\/[^\s"'>]+/g)].map(m => m[0]);
    console.log(`Found ${avatarUrls.length} avatars in github-sponsors`);

    let localizedSponsors = content;
    for (let i = 0; i < avatarUrls.length; i++) {
      const u = avatarUrls[i];
      const match = u.match(/\/u\/(\d+)/);
      const id = match ? match[1] : `avatar_${i}`;
      const localRel = `/media/avatars/${id}.jpg`;
      const localFile = `${BASE}/public${localRel}`;
      await downloadFile(u, localFile);
      localizedSponsors = localizedSponsors.replaceAll(u, localRel);
    }
    fs.writeFileSync(githubSponsorsPath, localizedSponsors);
    console.log('[OK] Localized avatar URLs in github-sponsors');
  }

  console.log('\n--- All Assets Downloaded Successfully! ---');
}

main().catch(err => {
  console.error('Fatal download error:', err);
  process.exit(1);
});
