import { chromium } from '/home/ravi/Projects/job/node_modules/playwright/index.mjs';

async function testAllSections() {
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome-stable',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failedUrls = [];

  page.on('response', resp => {
    if (resp.status() >= 400) {
      failedUrls.push({ url: resp.url(), status: resp.status() });
      console.error(`[4xx/5xx] ${resp.status()}: ${resp.url()}`);
    }
  });

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.waitForTimeout(4000);

    const sections = [
      { name: 'benefits', selector: '.home-benefits' },
      { name: 'industry', selector: '.home-industry' },
      { name: 'video-loop', selector: '.home-loop' },
      { name: 'footer', selector: 'footer' }
    ];

    for (const sec of sections) {
      console.log(`Scrolling to ${sec.name} ...`);
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          el.scrollIntoView({ behavior: 'instant' });
        }
      }, sec.selector);
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `/home/ravi/Projects/sui-clone/docs/research/section-${sec.name}.png` });
      console.log(`Saved screenshot for ${sec.name}`);
    }

  } catch (err) {
    console.error('Error during section test:', err);
  } finally {
    await browser.close();
  }

  console.log('\n--- Failed URLs ---');
  console.log(JSON.stringify(failedUrls, null, 2));
}

testAllSections();
