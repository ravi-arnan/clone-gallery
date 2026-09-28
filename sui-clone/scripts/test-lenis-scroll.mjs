import { chromium } from '/home/ravi/Projects/job/node_modules/playwright/index.mjs';

async function testLenisScroll() {
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome-stable',
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--disable-web-security', '--no-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    console.log('Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    
    console.log('Waiting 4.5s for intro animation to complete ...');
    await page.waitForTimeout(4500);

    // Scroll using Lenis to Timeline section
    console.log('Scrolling to Timeline (y = 3600) ...');
    await page.evaluate(() => {
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(3600, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 3600);
      }
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/ravi/Projects/sui-clone/docs/research/debug-timeline-scrolled.png' });
    console.log('Saved debug-timeline-scrolled.png');

    // Scroll to Industry section
    console.log('Scrolling to Industry (y = 6500) ...');
    await page.evaluate(() => {
      if (window.lenis && typeof window.lenis.scrollTo === 'function') {
        window.lenis.scrollTo(6500, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 6500);
      }
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/home/ravi/Projects/sui-clone/docs/research/debug-industry-scrolled.png' });
    console.log('Saved debug-industry-scrolled.png');

  } catch (err) {
    console.error('Error in testLenisScroll:', err);
  } finally {
    await browser.close();
  }
}

testLenisScroll();
