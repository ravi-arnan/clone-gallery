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
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.wasm': 'application/wasm',
  '.webmanifest': 'application/manifest+json'
};

function resolveLocalPath(reqUrl) {
  let cleanUrl = reqUrl.split('?')[0].split('#')[0];

  // Storyblok rewrite
  if (cleanUrl.startsWith('/storyblok/')) {
    const sbRel = cleanUrl.replace(/^\/storyblok\//, '');
    let sbPath = path.join(PUBLIC_DIR, 'storyblok', sbRel);
    if (fs.existsSync(sbPath) && fs.statSync(sbPath).isFile()) {
      return sbPath;
    }
    // If request includes thumbnail /m/ filter, fallback to the base image
    const baseSbRel = sbRel.replace(/\/m\/.*$/, '');
    const baseSbPath = path.join(PUBLIC_DIR, 'storyblok', baseSbRel);
    if (fs.existsSync(baseSbPath) && fs.statSync(baseSbPath).isFile()) {
      return baseSbPath;
    }
  }

  // Root path -> index.html
  if (cleanUrl === '/' || cleanUrl === '') {
    return path.join(__dirname, 'index.html');
  }

  // Public directory lookup
  const relPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
  let filePath = path.join(PUBLIC_DIR, relPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return filePath;
  }

  // Check with .html
  if (fs.existsSync(filePath + '.html')) {
    return filePath + '.html';
  }

  // Check directory index.html
  if (fs.existsSync(path.join(filePath, 'index.html'))) {
    return path.join(filePath, 'index.html');
  }

  // Check root dir
  let rootFile = path.join(__dirname, relPath);
  if (fs.existsSync(rootFile) && fs.statSync(rootFile).isFile()) {
    return rootFile;
  }

  return null;
}

// Proxy and cache fallback for missing assets
async function fetchRemoteAsset(reqUrl, targetFilePath) {
  return new Promise((resolve) => {
    let remoteUrl;
    if (reqUrl.startsWith('/storyblok/')) {
      remoteUrl = 'https://a.storyblok.com/' + reqUrl.replace(/^\/storyblok\//, '');
    } else {
      remoteUrl = 'https://terminal-industries.com' + reqUrl;
    }

    try {
      const client = remoteUrl.startsWith('https') ? https : http;
      client.get(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Referer': 'https://terminal-industries.com/'
        }
      }, (res) => {
        if (res.statusCode === 200) {
          os_ensure_dir(path.dirname(targetFilePath));
          const fileStream = fs.createWriteStream(targetFilePath);
          res.pipe(fileStream);
          fileStream.on('finish', () => resolve(true));
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

function os_ensure_dir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

const server = http.createServer(async (req, res) => {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle mock API endpoints so Nuxt forms/subscribes don't break
  if (req.url.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Simulated API response' }));
    return;
  }

  let localPath = resolveLocalPath(req.url);

  // If missing and it looks like a static asset, try fetching on demand
  if (!localPath) {
    const cleanUrl = req.url.split('?')[0].split('#')[0];
    const ext = path.extname(cleanUrl).toLowerCase();
    if (ext && ext !== '.html') {
      let targetPath;
      if (cleanUrl.startsWith('/storyblok/')) {
        targetPath = path.join(PUBLIC_DIR, 'storyblok', cleanUrl.replace(/^\/storyblok\//, ''));
      } else {
        targetPath = path.join(PUBLIC_DIR, cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
      }
      const fetched = await fetchRemoteAsset(cleanUrl, targetPath);
      if (fetched) {
        localPath = targetPath;
      }
    }
  }

  // If still not found, fallback to index.html for client-side routing
  if (!localPath) {
    localPath = path.join(__dirname, 'index.html');
  }

  try {
    const stat = fs.statSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // HTTP Range streaming for videos
    const range = req.headers.range;
    if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(localPath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });
      fileStream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    fs.createReadStream(localPath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Terminal Industries Clone] Server listening on http://localhost:${PORT}`);
  console.log(`Serving root: ${__dirname}`);
  console.log(`Serving public: ${PUBLIC_DIR}`);
});
