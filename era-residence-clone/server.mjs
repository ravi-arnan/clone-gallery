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

  // Root path -> index.html
  if (cleanUrl === '/' || cleanUrl === '') {
    return path.join(__dirname, 'index.html');
  }

  // Remove leading slash for path joining
  const relPath = cleanUrl.startsWith('/') ? cleanUrl.slice(1) : cleanUrl;

  // 1. Direct file in public/
  let candidate = path.join(PUBLIC_DIR, relPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // 2. Direct file in root/
  candidate = path.join(__dirname, relPath);
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // 3. Folder/index.html in root/
  candidate = path.join(__dirname, relPath, 'index.html');
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // 4. Folder/index.html in public/
  candidate = path.join(PUBLIC_DIR, relPath, 'index.html');
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // 5. File.html in root/
  candidate = path.join(__dirname, relPath + '.html');
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }

  // 6. Typekit extensionless font mapping (e.g., /use.typekit.net/af/.../31/l)
  if (cleanUrl.includes('use.typekit.net/af/')) {
    let fontPath = path.join(PUBLIC_DIR, relPath);
    if (fs.existsSync(fontPath) && fs.statSync(fontPath).isFile()) {
      return fontPath;
    }
  }

  return null;
}

// Fallback proxy to fetch remote assets on demand if anything was missed
async function fetchRemoteAsset(reqUrl, targetFilePath) {
  return new Promise((resolve) => {
    let remoteUrl;
    if (reqUrl.startsWith('/cdn.prod.website-files.com/')) {
      remoteUrl = 'https:/' + reqUrl;
    } else if (reqUrl.startsWith('/assets.era-residence.com/')) {
      remoteUrl = 'https:/' + reqUrl;
    } else if (reqUrl.startsWith('/use.typekit.net/')) {
      remoteUrl = 'https:/' + reqUrl;
    } else {
      remoteUrl = 'https://www.era-residence.com' + (reqUrl.startsWith('/') ? reqUrl : '/' + reqUrl);
    }

    try {
      https.get(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          'Referer': 'https://www.era-residence.com/'
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
    // Check SPA fallback for apartment detail routes
    if (req.url.startsWith('/apartments/')) {
      const aptIndex = path.join(__dirname, 'apartments', 'index.html');
      if (fs.existsSync(aptIndex)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(aptIndex).pipe(res);
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  try {
    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Typekit extensionless files
    if (!ext && filePath.includes('use.typekit.net/af/')) {
      if (filePath.endsWith('/l')) contentType = 'font/woff2';
      else if (filePath.endsWith('/d')) contentType = 'font/woff';
      else if (filePath.endsWith('/a')) contentType = 'font/otf';
    }

    // HTTP 206 Partial Content support for videos and large media
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
  console.log(`ERA Residence Clone Server running at http://localhost:${PORT}`);
  console.log(`Port: ${PORT} | Mode: Local Offline High-Performance`);
});
