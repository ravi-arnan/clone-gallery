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
  '.wasm': 'application/wasm',
  '.ktx2': 'image/ktx2',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.usdz': 'model/vnd.usdz+zip',
  '.riv': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

function resolveLocalPath(reqUrl) {
  let cleanUrl = decodeURIComponent(reqUrl.split('?')[0].split('#')[0]);

  // Root path & editions entry
  if (cleanUrl === '/' || cleanUrl === '' || cleanUrl === '/editions/winter2026' || cleanUrl === '/en/editions/winter2026' || cleanUrl === '/en') {
    return path.join(__dirname, 'index.html');
  }

  // Remove leading slash
  const relPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;

  // 1. Oxygen assets aliases
  if (cleanUrl.startsWith('/oxygen-assets/')) {
    const filename = cleanUrl.replace('/oxygen-assets/', '');
    const p = path.join(PUBLIC_DIR, 'oxygen-assets', filename);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }
  if (cleanUrl.includes('/oxygen-v2/')) {
    const filename = path.basename(cleanUrl);
    const p = path.join(PUBLIC_DIR, 'oxygen-assets', filename);
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p;
  }

  // 2. Direct match in public/
  let candidate = path.join(PUBLIC_DIR, relPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // 3. Domain namespaces mapping
  // /cdn/shop/... -> public/editions-winter-2026.myshopify.com/cdn/shop/...
  if (cleanUrl.startsWith('/cdn/shop/')) {
    candidate = path.join(PUBLIC_DIR, 'editions-winter-2026.myshopify.com', relPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }

  // /b/shopify-brochure2-assets/... -> public/cdn.shopify.com/b/shopify-brochure2-assets/...
  if (cleanUrl.startsWith('/b/shopify-brochure2-assets/')) {
    candidate = path.join(PUBLIC_DIR, 'cdn.shopify.com', relPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }

  // /s/files/... -> public/cdn.shopify.com/s/files/...
  if (cleanUrl.startsWith('/s/files/')) {
    candidate = path.join(PUBLIC_DIR, 'cdn.shopify.com', relPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }

  // /3d/models/...
  if (cleanUrl.startsWith('/3d/models/')) {
    candidate = path.join(PUBLIC_DIR, 'cdn.shopify.com', relPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
    candidate = path.join(PUBLIC_DIR, 'editions-winter-2026.myshopify.com', 'cdn', 'shop', relPath);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }

  // 4. Direct match in root
  candidate = path.join(__dirname, relPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  return null;
}

// Fallback proxy to fetch remote assets on demand if anything was missed
async function fetchRemoteAsset(reqUrl, targetFilePath) {
  return new Promise((resolve) => {
    let remoteUrl;
    if (reqUrl.startsWith('/cdn.shopify.com/')) {
      remoteUrl = 'https:/' + reqUrl;
    } else if (reqUrl.startsWith('/editions-winter-2026.myshopify.com/')) {
      remoteUrl = 'https:/' + reqUrl;
    } else if (reqUrl.startsWith('/www.gstatic.com/')) {
      remoteUrl = 'https:/' + reqUrl;
    } else if (reqUrl.startsWith('/oxygen-assets/')) {
      remoteUrl = 'https://cdn.shopify.com/oxygen-v2/47215/49013/102837/4351350/assets/' + reqUrl.replace('/oxygen-assets/', '');
    } else if (reqUrl.startsWith('/cdn/shop/')) {
      remoteUrl = 'https://editions-winter-2026.myshopify.com' + reqUrl;
    } else if (reqUrl.startsWith('/s/files/') || reqUrl.startsWith('/b/')) {
      remoteUrl = 'https://cdn.shopify.com' + reqUrl;
    } else {
      remoteUrl = 'https://www.shopify.com' + (reqUrl.startsWith('/') ? reqUrl : '/' + reqUrl);
    }

    try {
      https.get(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Referer': 'https://www.shopify.com/'
        }
      }, (res) => {
        const ct = res.headers['content-type'] || '';
        if ((res.statusCode === 200 || res.statusCode === 304) && !ct.includes('text/html')) {
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

  const rawPath = req.url.split('?')[0].split('#')[0];
  if (rawPath === '/' || rawPath === '') {
    res.writeHead(302, { 'Location': '/editions/winter2026' });
    res.end();
    return;
  }
  let filePath = resolveLocalPath(req.url);

  // If file not found locally, try on-demand fallback fetch
  if (!filePath) {
    const cleanUrl = req.url.split('?')[0].split('#')[0];
    const rel = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;
    const fallbackPath = path.join(PUBLIC_DIR, rel);
    const fetched = await fetchRemoteAsset(req.url, fallbackPath);
    if (fetched && fs.existsSync(fallbackPath)) {
      filePath = fallbackPath;
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    // If route request (SPA navigation)
    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(path.join(__dirname, 'index.html')).pipe(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // HTTP 206 Partial Content support for videos and large 3D models
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

      if (start >= stat.size || end >= stat.size) {
        res.writeHead(416, {
          'Content-Range': `bytes */${stat.size}`
        });
        res.end();
        return;
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      fileStream.pipe(res);
      return;
    }

    // Standard HTTP 200 response
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    });

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Internal Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Shopify Editions Winter 2026 Server running at http://localhost:${PORT}`);
  console.log(`Mode: 100% Local Self-Contained | 3D WebGL + Rive + Theatre.js Enabled`);
});
