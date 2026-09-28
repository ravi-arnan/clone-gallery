import { chromium } from '/home/ravi/Projects/job/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

async function recon() {
  console.log('Starting live reconnaissance of https://animejs.com/ ...');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome-stable',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const requests = new Map();
  const responses = [];
  const consoleLogs = [];
  const pageErrors = [];

  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', err => {
    pageErrors.push(err.message || String(err));
  });

  page.on('request', req => {
    requests.set(req.url(), {
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      headers: req.headers()
    });
  });

  page.on('response', resp => {
    responses.push({
      url: resp.url(),
      status: resp.status(),
      contentType: resp.headers()['content-type'] || '',
      contentLength: resp.headers()['content-length'] || ''
    });
  });

  console.log('Navigating to https://animejs.com/ ...');
  await page.goto('https://animejs.com/', { waitUntil: 'networkidle', timeout: 45000 });
  console.log('Initial page load done. Waiting 5 seconds for 3D engine and animations to initialize...');
  await page.waitForTimeout(5000);

  // Take hero screenshot
  await page.screenshot({ path: '/home/ravi/Projects/animejs-clone/docs/research/live-hero-1440.png' });
  console.log('Captured live-hero-1440.png');

  // Scroll through the page slowly to trigger scroll animations and load all lazy/3D modules
  const scrollHeights = [500, 1200, 2000, 3000, 4500, 6000, 7500, 9000, 11000];
  for (let i = 0; i < scrollHeights.length; i++) {
    const y = scrollHeights[i];
    await page.evaluate(targetY => window.scrollTo({ top: targetY, behavior: 'instant' }), y);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `/home/ravi/Projects/animejs-clone/docs/research/live-scroll-${y}.png` });
  }

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/home/ravi/Projects/animejs-clone/docs/research/live-footer.png' });

  // Inspect page details
  const pageDetails = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => ({
      src: s.src,
      type: s.type,
      inline: !s.src ? s.innerText.slice(0, 200) : null
    }));

    const links = Array.from(document.querySelectorAll('link')).map(l => ({
      rel: l.rel,
      href: l.href,
      as: l.as
    }));

    const canvases = Array.from(document.querySelectorAll('canvas')).map(c => ({
      id: c.id,
      className: c.className,
      width: c.width,
      height: c.height,
      parent: c.parentElement ? `${c.parentElement.tagName}#${c.parentElement.id}.${c.parentElement.className}` : null
    }));

    const sections = Array.from(document.querySelectorAll('section, header, footer, main, [id], [class*="section"]')).map(el => ({
      tagName: el.tagName,
      id: el.id,
      className: el.className,
      rect: el.getBoundingClientRect()
    }));

    return {
      title: document.title,
      paths: window.paths,
      scripts,
      links,
      canvases,
      sectionsCount: sections.length,
      engineEl: document.getElementById('engine')?.innerHTML.slice(0, 500)
    };
  });

  console.log('Page details extracted.');

  // Save network requests and page details
  fs.writeFileSync(
    '/home/ravi/Projects/animejs-clone/docs/research/live-network-requests.json',
    JSON.stringify(Array.from(requests.values()), null, 2)
  );

  fs.writeFileSync(
    '/home/ravi/Projects/animejs-clone/docs/research/live-responses.json',
    JSON.stringify(responses, null, 2)
  );

  fs.writeFileSync(
    '/home/ravi/Projects/animejs-clone/docs/research/live-page-details.json',
    JSON.stringify(pageDetails, null, 2)
  );

  fs.writeFileSync(
    '/home/ravi/Projects/animejs-clone/docs/research/live-console.json',
    JSON.stringify({ consoleLogs, pageErrors }, null, 2)
  );

  await browser.close();
  console.log('Reconnaissance complete!');
}

recon().catch(err => {
  console.error('Reconnaissance failed:', err);
  process.exit(1);
});
