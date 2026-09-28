import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = __dirname;
const PUBLIC_DIR = path.join(__dirname, 'public');
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ico': 'image/x-icon',
  '.hdr': 'image/vnd.radiance',
  '.exr': 'image/x-exr',
  '.pdf': 'application/pdf',
};

function resolveFile(urlPath) {
  let safePath = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  const searchRoots = [PUBLIC_DIR, PROJECT_DIR];

  for (const root of searchRoots) {
    let filePath = path.join(root, safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      const idx = path.join(filePath, 'index.html');
      if (fs.existsSync(idx) && fs.statSync(idx).isFile()) {
        return idx;
      }
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }

    const withHtml = filePath + '.html';
    if (fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) {
      return withHtml;
    }
  }

  return null;
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Handle Vimeo oembed offline gracefully
  if (urlPath.startsWith('/api/oembed')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      type: 'video',
      version: '1.0',
      provider_name: 'Vimeo',
      provider_url: 'https://vimeo.com/',
      title: 'Oryzo',
      author_name: 'Lusion',
      author_url: 'https://vimeo.com/lusion',
      html: '<iframe src="/images/wearable-gallery/bite.mp4" width="100%" height="100%" frameborder="0"></iframe>',
      width: 1920,
      height: 1080,
      thumbnail_url: '/images/video_thumb.webp'
    }));
    return;
  }

  // Handle telemetry or CDN endpoints gracefully
  if (urlPath.startsWith('/cdn-cgi/') || urlPath.startsWith('/api/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  const filePath = resolveFile(urlPath);

  if (!filePath) {
    if (path.extname(urlPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`404 Not Found: ${urlPath}`);
      return;
    }
    const fallbackPath = path.join(PROJECT_DIR, 'index.html');
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(fallbackPath).pipe(res);
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`404 Not Found: ${urlPath}`);
    return;
  }

  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Video/Audio range streaming support (206 Partial Content)
    const range = req.headers.range;
    if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
      });
      fileStream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Server Error: ${err.message}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Oryzo Server running at http://localhost:${PORT}`);
});
