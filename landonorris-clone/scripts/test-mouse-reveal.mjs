import pkg from '/home/ravi/Projects/job/node_modules/playwright/index.js';
const { chromium } = pkg;
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.resolve(__dirname, '..');

async function testMouse() {
  console.log('Testing mouse hover on 3D hero viewport...');
  const browser = await chromium.launch({
    executablePath: '/etc/profiles/per-user/ravi/bin/google-chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader'],
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  await page.goto('http://localhost:3001');
  await page.waitForTimeout(4000);

  // Move mouse across center
  console.log('Moving mouse to center...');
  await page.mouse.move(720, 450);
  await page.waitForTimeout(500);
  await page.mouse.move(650, 400);
  await page.waitForTimeout(500);
  await page.mouse.move(750, 500);
  await page.waitForTimeout(1000);

  const shotPath = path.join(PROJECT_DIR, 'docs/design-references/mouse-reveal-test.png');
  await page.screenshot({ path: shotPath });
  console.log('Saved mouse reveal test to:', shotPath);

  await browser.close();
}

testMouse().catch(console.error);
