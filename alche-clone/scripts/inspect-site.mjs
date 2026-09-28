import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const SCREENSHOT_DIR = path.join(PROJECT_DIR, 'docs/design-references');
const RESEARCH_DIR = path.join(PROJECT_DIR, 'docs/research');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(RESEARCH_DIR, { recursive: true });

async function inspect() {
  console.log('Launching browser with hardware acceleration / SwiftShader...');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu-rasterization'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();

  const networkRequests = [];
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const status = response.status();
      const headers = response.headers();
      const contentType = headers['content-type'] || '';
      const contentLength = headers['content-length'] || 0;

      networkRequests.push({
        url,
        status,
        contentType,
        contentLength
      });
    } catch (e) {
      // ignore
    }
  });

  console.log('Navigating to https://alche.studio/ ...');
  await page.goto('https://alche.studio/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);

  // Take hero screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-hero.png'), fullPage: false });
  console.log('Captured desktop-hero.png');

  // Fast scroll stops (scroll stops prevent canvas freeze)
  const stops = [1500, 4000, 8000, 14000, 20000];
  for (let i = 0; i < stops.length; i++) {
    const y = stops[i];
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `scroll-stop-${i + 1}-${y}px.png`), fullPage: false });
    console.log(`Captured scroll-stop-${i + 1}-${y}px.png`);
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Extract page metadata, scripts, canvases, libraries
  const pageInspection = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src,
      id: s.id,
      type: s.type,
      inlineSnippet: s.src ? null : s.innerText.slice(0, 300)
    }));

    const links = Array.from(document.querySelectorAll('link')).map(l => ({
      rel: l.rel,
      href: l.href,
      as: l.as,
      type: l.type
    }));

    const canvases = Array.from(document.querySelectorAll('canvas')).map((c, i) => {
      const rect = c.getBoundingClientRect();
      let contextType = 'unknown';
      try {
        if (c.getContext('webgl2')) contextType = 'webgl2';
        else if (c.getContext('webgl')) contextType = 'webgl';
        else if (c.getContext('2d')) contextType = '2d';
      } catch (e) {}
      return {
        index: i,
        className: c.className,
        id: c.id,
        width: c.width,
        height: c.height,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        contextType
      };
    });

    const videos = Array.from(document.querySelectorAll('video')).map(v => ({
      src: v.src || v.querySelector('source')?.src,
      currentSrc: v.currentSrc,
      poster: v.poster,
      autoplay: v.autoplay,
      loop: v.loop,
      muted: v.muted
    }));

    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      currentSrc: img.currentSrc,
      alt: img.alt,
      width: img.naturalWidth,
      height: img.naturalHeight,
      className: img.className
    }));

    const globals = {
      hasGSAP: typeof window.gsap !== 'undefined',
      hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
      hasThree: typeof window.THREE !== 'undefined',
      hasLenis: typeof window.lenis !== 'undefined' || typeof window.Lenis !== 'undefined',
      hasTweakpane: typeof window.Tweakpane !== 'undefined',
      hasLottie: typeof window.lottie !== 'undefined' || typeof window.bodymovin !== 'undefined'
    };

    return {
      title: document.title,
      meta: Array.from(document.querySelectorAll('meta')).map(m => ({
        name: m.getAttribute('name'),
        property: m.getAttribute('property'),
        content: m.getAttribute('content')
      })),
      globals,
      scripts,
      links,
      canvases,
      videos,
      images,
      bodyClasses: document.body.className,
      htmlClasses: document.documentElement.className
    };
  });

  // Mobile screenshot
  console.log('Capturing mobile view...');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto('https://alche.studio/', { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-hero.png'), fullPage: false });
  await mobilePage.close();

  // Save inspection files
  fs.writeFileSync(path.join(RESEARCH_DIR, 'inspection.json'), JSON.stringify(pageInspection, null, 2));
  fs.writeFileSync(path.join(RESEARCH_DIR, 'network-requests.json'), JSON.stringify(networkRequests, null, 2));

  console.log(`Inspection complete! Found ${pageInspection.canvases.length} canvases, ${pageInspection.scripts.length} scripts, ${networkRequests.length} network requests.`);

  await browser.close();
}

inspect().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
