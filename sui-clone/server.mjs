import http from 'node:http';
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
  '.mp4': 'video/mp4'
};

function resolvePath(reqUrl) {
  let clean = decodeURIComponent(reqUrl.split('?')[0].split('#')[0]);
  if (clean === '/' || clean === '') {
    return path.join(__dirname, 'index.html');
  }

  // Handle /cdn-cgi or analytics smoothly
  if (clean.startsWith('/cdn-cgi/')) {
    return 'DUMMY_204';
  }

  // Check public folder first
  const rel = clean.startsWith('/') ? clean.slice(1) : clean;
  const inPublic = path.join(PUBLIC_DIR, rel);
  if (fs.existsSync(inPublic) && fs.statSync(inPublic).isFile()) {
    return inPublic;
  }

  // Check root folder
  const inRoot = path.join(__dirname, rel);
  if (fs.existsSync(inRoot) && fs.statSync(inRoot).isFile()) {
    return inRoot;
  }

  // Fallback search inside public subdirectories by basename
  const base = path.basename(rel);
  for (const sub of ['images', 'svg', 'fonts', 'videos', 'rive', 'lottie', 'js', 'css', 'vendor', 'sequences/homepage-scroll']) {
    const candidate = path.join(PUBLIC_DIR, sub, base);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url);

  // Common CORS and security headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (filePath === 'DUMMY_204') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (!filePath) {
    // Return index.html for SPA routes, or 404 for asset routes
    const isAsset = /\.(png|jpg|jpeg|webp|avif|gif|svg|ico|woff|woff2|ttf|otf|mp4|webm|riv|wasm|js|css|json)$/i.test(req.url);
    if (!isAsset) {
      const indexPath = path.join(__dirname, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
        return;
      }
    }
    console.warn(`[404 Not Found]: ${req.url}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME_TYPES[ext] || 'application/octet-stream';

  // Support HTTP 206 Partial Content for video streaming
  const range = req.headers.range;
  if (range && (ext === '.mp4' || ext === '.webm')) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = (end - start) + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mime
    });

    const stream = fs.createReadStream(filePath, { start, end });
    stream.pipe(res);
    return;
  }

  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=3600'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Sui.io clone server running at http://localhost:${PORT}`);
});
