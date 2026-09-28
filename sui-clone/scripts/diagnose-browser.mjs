import { chromium } from '/home/ravi/Projects/job/node_modules/playwright/index.mjs';

async function diagnose() {
  console.log('Launching browser to diagnose http://localhost:3000 ...');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome-stable',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const consoleLogs = [];
  const errors = [];
  const networkErrors = [];

  page.on('console', msg => {
    const text = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleLogs.push(text);
    if (msg.type() === 'error') {
      console.error(text);
    } else {
      console.log(text);
    }
  });

  page.on('pageerror', err => {
    const text = `[UNCAUGHT EXCEPTION] ${err.stack || err.message}`;
    errors.push(text);
    console.error(text);
  });

  page.on('requestfailed', req => {
    const text = `[FAILED REQUEST] ${req.url()} (${req.failure()?.errorText})`;
    networkErrors.push(text);
    console.error(text);
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      const text = `[HTTP ${resp.status()}] ${resp.url()}`;
      networkErrors.push(text);
      console.error(text);
    }
  });

  try {
    console.log('Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    console.log('Page loaded. Waiting 3s for animations and canvas init...');
    await page.waitForTimeout(3000);

    const state = await page.evaluate(() => {
      return {
        title: document.title,
        canvasElements: Array.from(document.querySelectorAll('canvas')).map(c => ({
          className: c.className,
          width: c.width,
          height: c.height,
          style: c.getAttribute('style')
        })),
        videoElements: Array.from(document.querySelectorAll('video')).map(v => ({
          currentSrc: v.currentSrc,
          paused: v.paused,
          readyState: v.readyState
        })),
        gsapLoaded: typeof window.gsap !== 'undefined',
        scrollTriggerLoaded: typeof window.ScrollTrigger !== 'undefined',
        lenisLoaded: typeof window.Lenis !== 'undefined',
        riveLoaded: typeof window.rive !== 'undefined',
        lottieLoaded: typeof window.lottie !== 'undefined'
      };
    });

    console.log('\n--- Page State Inspection ---');
    console.log(JSON.stringify(state, null, 2));

    await page.screenshot({ path: '/home/ravi/Projects/sui-clone/docs/research/debug-render.png', fullPage: false });
    console.log('\nSaved screenshot to docs/research/debug-render.png');

    // Scroll down to test scroll animations
    console.log('Simulating scroll down ...');
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/ravi/Projects/sui-clone/docs/research/debug-scroll.png', fullPage: false });
    console.log('Saved screenshot after scroll to docs/research/debug-scroll.png');

  } catch (err) {
    console.error('Diagnostic run error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n--- Diagnostics Summary ---');
  console.log(`Total Console Messages: ${consoleLogs.length}`);
  console.log(`Console Errors: ${consoleLogs.filter(l => l.startsWith('[ERROR]')).length}`);
  console.log(`Uncaught Exceptions: ${errors.length}`);
  console.log(`Failed / 4xx / 5xx Network Requests: ${networkErrors.length}`);
}

diagnose();
