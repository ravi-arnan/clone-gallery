import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const BASE_DIR = '/home/ravi/Projects/sharplink-clone';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    
    // Check if already exists and size > 0
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      resolve({ status: 'cached', path: dest });
      return;
    }

    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const origin = new URL(url).origin;
          redirectUrl = origin + redirectUrl;
        }
        return downloadFile(redirectUrl, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(dest);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve({ status: 'downloaded', path: dest });
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function run() {
  const reqs = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'docs/research/network-requests.json'), 'utf8'));
  const html = fs.readFileSync(path.join(BASE_DIR, 'original.html'), 'utf8');

  const assetList = new Set();

  // 1. From network requests
  reqs.forEach(r => {
    const u = r.url;
    if (u.includes('storyblok.com') || u.includes('/_fonts/') || u.includes('/_vercel/image') || u.includes('/webgl/')) {
      assetList.add(u);
    }
  });

  // 2. WebGL packed texture
  assetList.add('https://www.sharplink.com/webgl/packed_texture.png');

  // 3. Nuxt builds
  assetList.add('https://www.sharplink.com/_nuxt/builds/latest.json');
  assetList.add('https://www.sharplink.com/_nuxt/builds/meta/d417db0b-43fd-482a-b547-395c20b81a01.json');

  // 4. Lottie JSON
  assetList.add('https://a.storyblok.com/f/290008427472090/x/c203c1fda0/shrp_stack.json');

  // 5. From HTML parsing
  const matches = [...html.matchAll(/https:\/\/(a\.storyblok\.com|www\.sharplink\.com)[^\"'\s\)\>]+/g)].map(m => m[0]);
  matches.forEach(m => {
    if (m.match(/\.(png|jpg|jpeg|webp|avif|svg|gif|webm|mp4|woff|woff2|ttf|json|ico)/i)) {
      assetList.add(m);
    }
  });

  console.log(`Discovered ${assetList.size} assets to process.`);

  // Map each URL to a local destination
  const tasks = [];
  for (const url of assetList) {
    try {
      const parsed = new URL(url);
      let localPath = '';
      if (parsed.pathname.startsWith('/_fonts/')) {
        localPath = path.join(BASE_DIR, 'public', parsed.pathname);
      } else if (parsed.pathname.startsWith('/_nuxt/')) {
        localPath = path.join(BASE_DIR, 'public', parsed.pathname);
      } else if (parsed.pathname.startsWith('/webgl/')) {
        localPath = path.join(BASE_DIR, 'public', parsed.pathname);
      } else if (url.includes('/_vercel/image')) {
        // extract the encoded storyblok url
        const match = url.match(/url=([^&]+)/);
        if (match) {
          const decoded = decodeURIComponent(match[1]);
          const subPath = new URL(decoded).pathname;
          localPath = path.join(BASE_DIR, 'public/storyblok', subPath);
        } else {
          localPath = path.join(BASE_DIR, 'public/images', path.basename(parsed.pathname));
        }
      } else if (parsed.hostname === 'a.storyblok.com') {
        localPath = path.join(BASE_DIR, 'public/storyblok', parsed.pathname);
      } else {
        localPath = path.join(BASE_DIR, 'public', parsed.pathname);
      }

      tasks.push({ url, dest: localPath });
    } catch (e) {
      console.warn('Skipping invalid url:', url);
    }
  }

  // Batch download (concurrency 4 to protect network & CPU)
  const CONCURRENCY = 4;
  let success = 0;
  let failed = 0;
  let cached = 0;

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async (task) => {
      try {
        const res = await downloadFile(task.url, task.dest);
        if (res.status === 'cached') cached++;
        else {
          success++;
          console.log(`[OK] ${path.basename(task.dest)} (${task.url.slice(0, 60)}...)`);
        }
      } catch (err) {
        failed++;
        console.error(`[ERR] ${task.url}: ${err.message}`);
      }
    }));
  }

  console.log(`\nDownload summary: ${success} downloaded, ${cached} cached, ${failed} failed.`);
}

run().catch(console.error);
