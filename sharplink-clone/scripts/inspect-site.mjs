import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;
import fs from 'node:fs';
import path from 'node:path';

const PROJECT_DIR = '/home/ravi/Projects/sharplink-clone';
const SCREENSHOT_DIR = path.join(PROJECT_DIR, 'docs/design-references');
const RESEARCH_DIR = path.join(PROJECT_DIR, 'docs/research');

async function inspect() {
  console.log('Launching browser...');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
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
      networkRequests.push({
        url,
        status,
        contentType,
        contentLength: headers['content-length'] || 0
      });
    } catch (e) {
      // ignore
    }
  });

  console.log('Navigating to https://www.sharplink.com/ ...');
  await page.goto('https://www.sharplink.com/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(5000);

  // Take initial viewport screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-hero.png'), fullPage: false });
  console.log('Captured desktop-hero.png');

  // Slow scroll to trigger all scroll-driven animations & lazy-loads
  console.log('Scrolling page to trigger GSAP and lazy assets...');
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Total document height: ${totalHeight}px`);

  for (let y = 0; y < totalHeight; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);

  // Full page screenshot
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-full.png'), fullPage: true });
  console.log('Captured desktop-full.png');

  // Extract page metadata, scripts, canvases, libraries
  const pageInspection = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src,
      id: s.id,
      type: s.type,
      inlineSnippet: s.src ? null : s.innerText.slice(0, 200)
    }));

    const links = Array.from(document.querySelectorAll('link')).map(l => ({
      rel: l.rel,
      href: l.href,
      as: l.as
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

    // Check globals
    const globals = {
      hasGSAP: typeof window.gsap !== 'undefined',
      hasScrollTrigger: typeof window.ScrollTrigger !== 'undefined',
      hasThree: typeof window.THREE !== 'undefined',
      hasLenis: typeof window.lenis !== 'undefined' || typeof window.Lenis !== 'undefined',
      hasNuxt: typeof window.__NUXT__ !== 'undefined',
      nuxtData: typeof window.__NUXT__ !== 'undefined' ? Object.keys(window.__NUXT__) : null
    };

    // Page title and meta
    const title = document.title;
    const meta = Array.from(document.querySelectorAll('meta')).map(m => ({
      name: m.getAttribute('name'),
      property: m.getAttribute('property'),
      content: m.getAttribute('content')
    }));

    return {
      title,
      meta,
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

  // Get raw rendered HTML
  const rawHtml = await page.content();
  fs.writeFileSync(path.join(PROJECT_DIR, 'original.html'), rawHtml, 'utf-8');
  console.log('Saved original.html');

  // Also test mobile viewport
  console.log('Capturing mobile view (390x844)...');
  const mobilePage = await context.newPage();
  await mobilePage.setViewportSize({ width: 390, height: 844 });
  await mobilePage.goto('https://www.sharplink.com/', { waitUntil: 'networkidle', timeout: 30000 });
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-full.png'), fullPage: true });
  console.log('Captured mobile-full.png');
  await mobilePage.close();

  // Save network requests & inspection
  fs.writeFileSync(path.join(RESEARCH_DIR, 'network-requests.json'), JSON.stringify(networkRequests, null, 2), 'utf-8');
  fs.writeFileSync(path.join(RESEARCH_DIR, 'page-inspection.json'), JSON.stringify(pageInspection, null, 2), 'utf-8');

  console.log('Inspection complete!');
  await browser.close();
}

inspect().catch(err => {
  console.error('Inspection failed:', err);
  process.exit(1);
});
