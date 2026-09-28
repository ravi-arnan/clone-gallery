import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = path.join(__dirname, 'public');

// Fallback 1x1 transparent placeholders used by KPRVerse sprite engine
const TRANSPARENT_WEBP = Buffer.from(
  'UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAAFZQOCAYAAAAMAEAnQEqAQABAALATCWkAANwAP74H4AA',
  'base64'
);
const TRANSPARENT_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAQSURBVHgBAQUA+v8AAAAAAAAFAAFkeJU4AAAAAElFTkSuQmCC',
  'base64'
);
const TRANSPARENT_KTX2 = Buffer.from(
  'q0tUWCAyMLsNChoKAAAAAAEAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAEAAAABAAAAaAAAADwAAACkAAAAiAAAADABAAAAAAAAgAAAAAAAAACwAQAAAAAAAAIAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAIAOACjAQEAAwMAAAAAAAAAAAAAAAA/AAAAAAAAAAAA/////0AAPw8AAAAAAAAAAP////8RAAAAS1RYb3JpZW50YXRpb24AcgAAAAAzAAAAS1RYd3JpdGVyAHRva3R4IHY0LjEuMC1yYzN+NCAvIGxpYmt0eCB2NC4xLjAtcmMzfjIAADEAAABLVFh3cml0ZXJTY1BhcmFtcwAtLWJjbXAgLS1xbGV2ZWwgMjU1IC0tY2xldmVsIDEAAAAAAAAAAAEAAQAoAAAABQAAACsAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAEAAAABwAQAAAAAAAAiApgIAAAAAABAFgQAEwAAAAAAAIgAYAIAAAAAAAARBAAAAAAAwUQAAAAAAADyXy0AmAAAAAAAAEAIABMAAgAAAACIAcAEAAAAAAAAAggAAAA=',
  'base64'
);

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
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary',
  '.bin': 'application/octet-stream',
  '.hdr': 'application/octet-stream',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.wasm': 'application/wasm',
  '.ktx': 'image/ktx',
  '.ktx2': 'image/ktx2',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip'
};

function resolveLocalPath(reqUrl) {
  let cleanUrl = reqUrl.split('?')[0].split('#')[0];

  // Storyblok rewrite
  if (cleanUrl.startsWith('//a.storyblok.com/')) {
    cleanUrl = cleanUrl.replace('//a.storyblok.com/', '/storyblok/');
  } else if (cleanUrl.startsWith('/f/165555/')) {
    cleanUrl = '/storyblok' + cleanUrl;
  }

  // Root path
  if (cleanUrl === '/' || cleanUrl === '') {
    return path.join(__dirname, 'index.html');
  }

  // Public directory lookup
  let filePath = path.join(PUBLIC_DIR, cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
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

  // Check root
  let rootFile = path.join(__dirname, cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
  if (fs.existsSync(rootFile) && fs.statSync(rootFile).isFile()) {
    return rootFile;
  }

  return null;
}

// Fetch missing assets on demand and persist to disk
async function fetchAndCache(reqUrl) {
  let cleanUrl = reqUrl.split('?')[0].split('#')[0];
  let remoteUrl;
  let savePath;

  if (cleanUrl.startsWith('/storyblok/')) {
    remoteUrl = 'https://a.storyblok.com/' + cleanUrl.replace(/^\/storyblok\//, '');
    savePath = path.join(PUBLIC_DIR, cleanUrl.slice(1));
  } else if (cleanUrl.startsWith('/f/165555/')) {
    remoteUrl = 'https://a.storyblok.com' + cleanUrl;
    savePath = path.join(PUBLIC_DIR, 'storyblok', cleanUrl.slice(1));
  } else {
    remoteUrl = 'https://kprverse.com' + cleanUrl;
    savePath = path.join(PUBLIC_DIR, cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl);
  }

  return new Promise((resolve) => {
    https.get(remoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 8000
    }, (res) => {
      if (res.statusCode === 200) {
        const chunks = [];
        res.on('data', chunk => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          try {
            fs.mkdirSync(path.dirname(savePath), { recursive: true });
            fs.writeFileSync(savePath, buffer);
            console.log(`[CACHED ON-DEMAND] ${cleanUrl} (${buffer.length} bytes)`);
          } catch (e) {
            console.error(`Failed to cache ${savePath}:`, e.message);
          }
          resolve({ buffer, savePath });
        });
      } else {
        res.resume();
        resolve(null);
      }
    }).on('error', () => {
      resolve(null);
    });
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

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  let filePath = resolveLocalPath(req.url);

  // If file doesn't exist locally, attempt on-demand fetch and cache
  if (!filePath) {
    const cleanUrl = req.url.split('?')[0].split('#')[0];
    const ext = path.extname(cleanUrl).toLowerCase();

    // API fallbacks
    if (cleanUrl.includes('/api/')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', data: [] }));
      return;
    }

    // Try on-demand download if it has a static asset extension
    if (ext && MIME_TYPES[ext]) {
      const fetched = await fetchAndCache(cleanUrl);
      if (fetched) {
        filePath = fetched.savePath;
      }
    }

    // Still missing after fetch? Check transparent fallback for 3D tableau layers
    if (!filePath) {
      if (cleanUrl.includes('second-layer') || cleanUrl.includes('tableau')) {
        if (ext === '.webp') {
          res.writeHead(200, {
            'Content-Type': 'image/webp',
            'Content-Length': TRANSPARENT_WEBP.length,
            'Cache-Control': 'public, max-age=86400'
          });
          res.end(TRANSPARENT_WEBP);
          return;
        }
        if (ext === '.png') {
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': TRANSPARENT_PNG.length,
            'Cache-Control': 'public, max-age=86400'
          });
          res.end(TRANSPARENT_PNG);
          return;
        }
        if (ext === '.ktx2') {
          res.writeHead(200, {
            'Content-Type': 'image/ktx2',
            'Content-Length': TRANSPARENT_KTX2.length,
            'Cache-Control': 'public, max-age=86400'
          });
          res.end(TRANSPARENT_KTX2);
          return;
        }
      }

      // Default 404
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${req.url}`);
      return;
    }
  }

  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Handle HTTP Range Requests (essential for GLB, video, audio, wasm)
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

      if (start >= stat.size || end >= stat.size) {
        res.writeHead(416, {
          'Content-Range': `bytes */${stat.size}`,
          'Content-Type': contentType
        });
        res.end();
        return;
      }

      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType
      });
      if (req.method === 'HEAD') {
        res.end();
      } else {
        file.pipe(res);
      }
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=3600'
    });

    if (req.method === 'HEAD') {
      res.end();
    } else {
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`KPRVerse local server running at: http://localhost:${PORT}`);
});
