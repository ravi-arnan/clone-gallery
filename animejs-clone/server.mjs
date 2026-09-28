import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let PORT = parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
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
  '.otf': 'font/otf'
};

function resolvePath(reqUrl) {
  let clean = decodeURIComponent(reqUrl.split('?')[0].split('#')[0]);
  if (clean === '/' || clean === '') {
    return path.join(__dirname, 'index.html');
  }

  // Handle /cdn-cgi, analytics or external tracker stubs
  if (clean.startsWith('/cdn-cgi/') || clean.includes('google-analytics') || clean.includes('gtag')) {
    return 'DUMMY_204';
  }

  const rel = clean.startsWith('/') ? clean.slice(1) : clean;

  // Direct check in public folder
  const inPublic = path.join(PUBLIC_DIR, rel);
  if (fs.existsSync(inPublic) && fs.statSync(inPublic).isFile()) {
    return inPublic;
  }

  // Check in root folder
  const inRoot = path.join(__dirname, rel);
  if (fs.existsSync(inRoot) && fs.statSync(inRoot).isFile()) {
    return inRoot;
  }

  // Route specific checks
  if (rel === 'documentation-demos') {
    const demosPath = path.join(PUBLIC_DIR, 'documentation-demos');
    if (fs.existsSync(demosPath)) return demosPath;
  }

  if (rel.startsWith('sponsors/')) {
    const spPath = path.join(PUBLIC_DIR, rel);
    if (fs.existsSync(spPath)) return spPath;
  }

  // Fallback search in public subdirectories by basename
  const base = path.basename(rel);
  for (const sub of ['assets/models', 'assets/draco', 'assets/js', 'assets/js/chunks', 'assets/fonts', 'assets/css', 'assets/images', 'assets/json', 'sponsors', 'media/avatars']) {
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
    console.warn(`[404 Not Found]: ${req.url}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Special content-type mappings
  let mime = MIME_TYPES[ext];
  if (!mime) {
    if (filePath.endsWith('documentation-demos') || filePath.includes('/sponsors/')) {
      mime = 'text/html; charset=utf-8';
    } else {
      mime = 'application/octet-stream';
    }
  }

  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=3600'
  });

  fs.createReadStream(filePath).pipe(res);
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`Anime.js clone server running at http://localhost:${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
