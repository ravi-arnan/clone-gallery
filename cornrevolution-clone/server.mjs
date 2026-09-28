import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.ktx': 'image/ktx',
  '.exr': 'image/x-exr',
  '.hdr': 'image/vnd.radiance',
  '.wasm': 'application/wasm',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml'
};

function resolveLocalPath(reqUrl) {
  let cleanUrl = reqUrl.split('?')[0].split('#')[0];

  // Root path -> index.html
  if (cleanUrl === '/' || cleanUrl === '') {
    return path.join(__dirname, 'index.html');
  }

  const relPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;

  // Check public directory
  let filePath = path.join(PUBLIC_DIR, relPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  // Check root directory
  let rootPath = path.join(__dirname, relPath);
  if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
    return rootPath;
  }

  // Check with .html
  if (fs.existsSync(filePath + '.html')) {
    return filePath + '.html';
  }

  return null;
}

// Proxy and cache on demand if any rare asset was missed
async function fetchRemoteAsset(reqUrl, targetFilePath) {
  return new Promise((resolve) => {
    const remoteUrl = 'https://d1hl9u9k5hiqxp.cloudfront.net' + (reqUrl.startsWith('/') ? reqUrl : '/' + reqUrl);
    try {
      https.get(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Referer': 'https://cornrevolution.resn.global/'
        }
      }, (res) => {
        const ct = res.headers['content-type'] || '';
        // If remote sends HTML fallback, it's not a real asset
        if (res.statusCode === 200 && !ct.includes('text/html')) {
          fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
          const fileStream = fs.createWriteStream(targetFilePath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            console.log(`[Proxy Cache] Successfully cached remote asset ${reqUrl} -> ${targetFilePath}`);
            resolve(true);
          });
          fileStream.on('error', () => resolve(false));
        } else {
          resolve(false);
        }
      }).on('error', () => resolve(false));
    } catch {
      resolve(false);
    }
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  let localPath = resolveLocalPath(req.url);

  // If missing and looks like an asset, try fetching on demand
  if (!localPath) {
    const cleanUrl = req.url.split('?')[0].split('#')[0];
    const ext = path.extname(cleanUrl).toLowerCase();
    if (ext && ext !== '.html') {
      const targetPath = path.join(PUBLIC_DIR, cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
      const fetched = await fetchRemoteAsset(cleanUrl, targetPath);
      if (fetched) {
        localPath = targetPath;
      }
    }
  }

  // SPA fallback for non-file navigation requests
  const isSpaFallback = !localPath;
  if (!localPath) {
    localPath = path.join(__dirname, 'index.html');
  }

  try {
    const stat = fs.statSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // HTTP Range streaming for large files / models / audio / video
    const range = req.headers.range;
    if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/') || contentType.startsWith('model/') || ext === '.bin' || ext === '.ktx')) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(localPath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      console.log(`[206 Range] ${req.method} ${req.url} (${chunkSize} bytes)`);
      fileStream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    if (isSpaFallback && req.url !== '/' && !req.url.endsWith('.html')) {
      console.log(`[200 SPA] ${req.method} ${req.url} -> index.html`);
    } else {
      console.log(`[200 OK] ${req.method} ${req.url} (${contentType})`);
    }

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(localPath).pipe(res);
  } catch (err) {
    console.error(`[500 ERROR] ${req.method} ${req.url}: ${err.message}`);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Corn Revolution Clone] Server running at http://localhost:${PORT}`);
  console.log(`Serving root: ${__dirname}`);
  console.log(`Serving public: ${PUBLIC_DIR}`);
});
