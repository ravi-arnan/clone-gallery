import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const BASE_DIR = '/home/ravi/Projects/sui-clone';
const JS_DIR = path.join(BASE_DIR, 'public/js');
const CSS_DIR = path.join(BASE_DIR, 'public/css');
const VENDOR_DIR = path.join(BASE_DIR, 'public/vendor');

fs.mkdirSync(JS_DIR, { recursive: true });
fs.mkdirSync(CSS_DIR, { recursive: true });
fs.mkdirSync(VENDOR_DIR, { recursive: true });

const filesToDownload = [
  // CSS
  { url: 'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/css/sui-v2.shared.230f7fdb5.min.css', dest: path.join(CSS_DIR, 'sui-v2.shared.230f7fdb5.min.css') },
  // Webflow JS chunks
  { url: 'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=68e8e0120513ba12c5cd12e0', dest: path.join(VENDOR_DIR, 'jquery-3.5.1.min.js') },
  { url: 'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.8110c5140c42692b.js', dest: path.join(JS_DIR, 'sui-v2.schunk.8110c5140c42692b.js') },
  { url: 'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.288df1f54663a3bc.js', dest: path.join(JS_DIR, 'sui-v2.schunk.288df1f54663a3bc.js') },
  { url: 'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.305741e705aa0ac6.js', dest: path.join(JS_DIR, 'sui-v2.schunk.305741e705aa0ac6.js') },
  { url: 'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.d64be42593ba95e6.js', dest: path.join(JS_DIR, 'sui-v2.schunk.d64be42593ba95e6.js') },
  { url: 'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.9dfb96661114d3db.js', dest: path.join(JS_DIR, 'sui-v2.schunk.9dfb96661114d3db.js') },
  { url: 'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.6382a8df.0d93f870390191b1.js', dest: path.join(JS_DIR, 'sui-v2.6382a8df.0d93f870390191b1.js') },
  // GSAP & plugins
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js', dest: path.join(VENDOR_DIR, 'gsap.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js', dest: path.join(VENDOR_DIR, 'ScrollTrigger.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/SplitText.min.js', dest: path.join(VENDOR_DIR, 'SplitText.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/CustomEase.min.js', dest: path.join(VENDOR_DIR, 'CustomEase.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/InertiaPlugin.min.js', dest: path.join(VENDOR_DIR, 'InertiaPlugin.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/Observer.min.js', dest: path.join(VENDOR_DIR, 'Observer.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/Draggable.min.js', dest: path.join(VENDOR_DIR, 'Draggable.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/DrawSVGPlugin.min.js', dest: path.join(VENDOR_DIR, 'DrawSVGPlugin.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/ScrambleTextPlugin.min.js', dest: path.join(VENDOR_DIR, 'ScrambleTextPlugin.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/MorphSVGPlugin.min.js', dest: path.join(VENDOR_DIR, 'MorphSVGPlugin.min.js') },
  { url: 'https://cdn.prod.website-files.com/gsap/3.15.0/Flip.min.js', dest: path.join(VENDOR_DIR, 'Flip.min.js') },
  // Lenis
  { url: 'https://unpkg.com/lenis@1.3.23/dist/lenis.min.js', dest: path.join(VENDOR_DIR, 'lenis.min.js') },
  // WebFont
  { url: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js', dest: path.join(VENDOR_DIR, 'webfont.js') }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${path.basename(dest)}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const item of filesToDownload) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (err) {
      console.error(`Failed ${item.url}:`, err.message);
    }
  }
}

run();
