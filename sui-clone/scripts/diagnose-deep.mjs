import { chromium } from '/home/ravi/Projects/job/node_modules/playwright/index.mjs';

async function diagnoseDeep() {
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome-stable',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Scroll to canvasPin / Timeline section
    console.log('Scrolling to Timeline / Canvas sequence section ...');
    await page.evaluate(() => {
      const pin = document.getElementById('canvasPin');
      if (pin) pin.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo(0, 3200);
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/home/ravi/Projects/sui-clone/docs/research/debug-timeline.png', fullPage: false });
    console.log('Saved timeline screenshot to docs/research/debug-timeline.png');

    // Scroll to Industry section
    console.log('Scrolling to Industry section ...');
    await page.evaluate(() => {
      const ind = document.querySelector('.home-industry');
      if (ind) ind.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo(0, 6500);
    });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/home/ravi/Projects/sui-clone/docs/research/debug-industry.png', fullPage: false });
    console.log('Saved industry screenshot to docs/research/debug-industry.png');

  } catch (err) {
    console.error('Deep diagnostic error:', err);
  } finally {
    await browser.close();
  }
}

diagnoseDeep();
