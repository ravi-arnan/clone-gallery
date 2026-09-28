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
    await page.goto('http://localhost:3000/editions/winter2026', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log('DOM Content Loaded. Waiting 5s for hydration and WebGL init...');
    await page.waitForTimeout(5000);

    // Evaluate state
    const state = await page.evaluate(() => {
      return {
        title: document.title,
        hasRemixContext: typeof window.__remixContext !== 'undefined',
        hasRemixRouteModules: typeof window.__remixRouteModules !== 'undefined',
        hasRemixRouter: typeof window.__remixRouter !== 'undefined',
        canvasCount: document.querySelectorAll('canvas').length,
        bodyChildren: document.body.children.length,
        bodyHtmlSnippet: document.body.innerHTML.slice(0, 500)
      };
    });

    console.log('\n--- Page State Inspection ---');
    console.log(JSON.stringify(state, null, 2));

    await page.screenshot({ path: 'docs/design-references/debug-render.png', fullPage: false });
    console.log('\nSaved screenshot to docs/design-references/debug-render.png');
  } catch (err) {
    console.error('Diagnostic run error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n--- Summary ---');
  console.log(`Console Errors: ${consoleLogs.filter(l => l.startsWith('[ERROR]')).length}`);
  console.log(`Uncaught Exceptions: ${errors.length}`);
  console.log(`Failed / 4xx / 5xx Network Requests: ${networkErrors.length}`);
}

diagnose();
