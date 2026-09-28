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
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.buf': 'application/octet-stream',
  '.exr': 'image/x-exr',
  '.hdr': 'image/vnd.radiance',
  '.wasm': 'application/wasm',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

function resolveLocalPath(reqUrl) {
  // 1. Handle Vercel Image Optimization endpoint (/_vercel/image?url=...&w=...&q=...)
  if (reqUrl.startsWith('/_vercel/image')) {
    try {
      const parsedUrl = new URL(reqUrl, 'http://localhost:3000');
      let rawTarget = parsedUrl.searchParams.get('url');
      if (rawTarget) {
        let cleanTarget = decodeURIComponent(rawTarget).split('?')[0];
        let filePath = null;

        if (cleanTarget.includes('cdn.sanity.io/')) {
          const rel = cleanTarget
            .replace(/^https?:\/\/cdn\.sanity\.io\//, '')
            .replace(/^\/cdn\.sanity\.io\//, '');
          filePath = path.join(PUBLIC_DIR, 'cdn.sanity.io', rel);
        } else if (cleanTarget.startsWith('/')) {
          filePath = path.join(PUBLIC_DIR, cleanTarget.slice(1));
        } else {
          filePath = path.join(PUBLIC_DIR, cleanTarget);
        }

        if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          return filePath;
        }
      }
    } catch (err) {
      console.error('[Error resolving /_vercel/image]', err.message);
    }
  }

  let cleanUrl = reqUrl.split('?')[0].split('#')[0];

  // Root or /en or /en/ -> index.html
  if (cleanUrl === '/' || cleanUrl === '' || cleanUrl === '/en' || cleanUrl === '/en/') {
    return path.join(__dirname, 'index.html');
  }

  // Handle /cdn.sanity.io/...
  if (cleanUrl.startsWith('/cdn.sanity.io/')) {
    const sanityPath = path.join(PUBLIC_DIR, cleanUrl.slice(1));
    if (fs.existsSync(sanityPath) && fs.statSync(sanityPath).isFile()) {
      return sanityPath;
    }
  }

  // Handle /audio/...
  if (cleanUrl.startsWith('/audio/')) {
    const audioPath = path.join(PUBLIC_DIR, cleanUrl.slice(1));
    if (fs.existsSync(audioPath) && fs.statSync(audioPath).isFile()) {
      return audioPath;
    }
  }

  // Handle /imgs/...
  if (cleanUrl.startsWith('/imgs/')) {
    const imgPath = path.join(PUBLIC_DIR, cleanUrl.slice(1));
    if (fs.existsSync(imgPath) && fs.statSync(imgPath).isFile()) {
      return imgPath;
    }
  }

  // Check public directory
  const relPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
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
    let remoteUrl;
    if (reqUrl.startsWith('/_vercel/image')) {
      try {
        const parsedUrl = new URL(reqUrl, 'http://localhost:3000');
        const rawTarget = parsedUrl.searchParams.get('url');
        if (rawTarget) {
          const cleanTarget = decodeURIComponent(rawTarget).split('?')[0];
          if (cleanTarget.startsWith('http')) {
            remoteUrl = cleanTarget;
          } else {
            remoteUrl = 'https://floema.com' + (cleanTarget.startsWith('/') ? cleanTarget : '/' + cleanTarget);
          }
        }
      } catch {
        resolve(false);
        return;
      }
    } else {
      let cleanUrl = reqUrl.split('?')[0].split('#')[0];
      if (cleanUrl.startsWith('/cdn.sanity.io/')) {
        remoteUrl = 'https://cdn.sanity.io/' + cleanUrl.replace(/^\/cdn\.sanity\.io\//, '');
      } else {
        remoteUrl = 'https://floema.com' + (cleanUrl.startsWith('/') ? cleanUrl : '/' + cleanUrl);
      }
    }

    if (!remoteUrl) {
      resolve(false);
      return;
    }

    try {
      https.get(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Referer': 'https://floema.com/en'
        }
      }, (res) => {
        const ct = res.headers['content-type'] || '';
        if (res.statusCode === 200 && !ct.includes('text/html')) {
          fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
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

  // Dummy analytics endpoint handlers
  const cleanUrl = req.url.split('?')[0].split('#')[0];
  if (cleanUrl.includes('plausible') || cleanUrl.includes('umami') || cleanUrl.includes('gtm.js') || cleanUrl.includes('analytics')) {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end('/* analytics disabled in offline clone */');
    return;
  }

  let localPath = resolveLocalPath(req.url);

  // If missing and looks like an asset, try fetching on demand
  if (!localPath) {
    const ext = path.extname(cleanUrl).toLowerCase();
    if (ext && ext !== '.html') {
      const targetPath = path.join(PUBLIC_DIR, cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
      const fetched = await fetchRemoteAsset(req.url, targetPath);
      if (fetched) {
        localPath = targetPath;
      }
    }
  }

  // SPA fallback for page navigation
  if (!localPath) {
    localPath = path.join(__dirname, 'index.html');
  }

  try {
    const stat = fs.statSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // HTTP Range streaming for large files / audio / models / textures
    const range = req.headers.range;
    if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/') || contentType.startsWith('model/') || contentType.startsWith('image/x-exr'))) {
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
  console.log(`[Floema Clone] Server running at http://localhost:${PORT}`);
  console.log(`Serving root: ${__dirname}`);
  console.log(`Serving public: ${PUBLIC_DIR}`);
});
