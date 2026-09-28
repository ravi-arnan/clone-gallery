import fs from 'node:fs';
import path from 'node:path';

const BASE = '/home/ravi/Projects/animejs-clone';
const PUBLIC = `${BASE}/public`;

function scanDir(dir) {
  let results = [];
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(full));
    } else {
      results.push({
        relativePath: path.relative(PUBLIC, full),
        sizeBytes: stat.size,
        extension: path.extname(f).toLowerCase()
      });
    }
  }
  return results;
}

const inventory = scanDir(PUBLIC);
fs.writeFileSync(`${BASE}/docs/research/assets-inventory.json`, JSON.stringify(inventory, null, 2));

const urlMap = {
  "https://animejs.com/assets/css/core.css": "/assets/css/core.css",
  "https://animejs.com/assets/css/home.css": "/assets/css/home.css",
  "https://animejs.com/assets/js/home.js": "/assets/js/home.js",
  "https://animejs.com/documentation-demos": "/documentation-demos",
  "https://animejs.com/assets/json/easings.json": "/assets/json/easings.json",
  "https://animejs.com/sponsors/github-sponsors": "/sponsors/github-sponsors",
  "https://animejs.com/sponsors/platinum-sponsors": "/sponsors/platinum-sponsors",
  "https://animejs.com/sponsors/gold-sponsors": "/sponsors/gold-sponsors",
  "https://animejs.com/sponsors/silver-sponsors": "/sponsors/silver-sponsors",
  "https://animejs.com/assets/models/*": "/assets/models/*",
  "https://animejs.com/assets/draco/*": "/assets/draco/*",
  "https://animejs.com/assets/fonts/*": "/assets/fonts/*"
};
fs.writeFileSync(`${BASE}/docs/research/url-to-local-map.json`, JSON.stringify(urlMap, null, 2));

console.log(`Generated assets-inventory.json (${inventory.length} items) and url-to-local-map.json`);
