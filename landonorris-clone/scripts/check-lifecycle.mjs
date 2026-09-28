import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;

async function check() {
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'],
  });
  const page = await browser.newPage();
  
  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('http://localhost:3001');
  await page.waitForTimeout(4000);

  const res = await page.evaluate(() => {
    return {
      loadingComplete: window.loadingComplete,
      riveLoadingStarted: window.riveLoadingStarted,
      loadedRiveKeys: Object.keys(window.loadedRiveFiles || {}),
      hasLandoGL: !!window.landoGL,
      reveal: window.landoGL?.reveal,
      hasWorld: !!window.landoGL?.world,
      bounds: window.landoGL?.bounds,
      allRiveLoadedFired: window.riveAllLoadedFired,
      dataPage: document.querySelector('[data-page]')?.dataset?.page,
    };
  });

  console.log('Result:', JSON.stringify(res, null, 2));
  console.log('Console Logs:');
  consoleLogs.forEach(l => console.log('  [' + l.type + '] ' + l.text));

  await browser.close();
}

check().catch(console.error);
