import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-pot-sub-' + Date.now();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPages() {
  for (let i = 0; i < 20; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9222/json', (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
      });
      const page = data.find(p => p.type === 'page');
      if (page) return page;
    } catch {
      await sleep(500);
    }
  }
  throw new Error('Failed to connect to Chrome DevTools port 9222');
}

async function main() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${TMP_PROFILE}`,
    '--use-gl=angle',
    '--use-angle=gl',
    '--enable-webgl',
    '--window-size=1920,1080',
    'http://localhost:3000'
  ], { stdio: 'ignore' });

  try {
    await sleep(2500);
    const page = await getPages();
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let reqId = 1;
    const callbacks = new Map();

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = reqId++;
        callbacks.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        resolve(msg.result);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Waiting 6s for app init...');
    await sleep(6000);

    // Get positions of science division 8, 9, 10
    const pos = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            p8: window.__getSnapPosition('science', 8),
            p9: window.__getSnapPosition('science', 9),
            p10: window.__getSnapPosition('science', 10)
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Pot sub-positions:', pos.result?.value);

    const { p8, p9, p10 } = pos.result?.value || {};

    // Capture at p8
    if (p8) {
      await send('Runtime.evaluate', {
        expression: `window.__scrollController.scrollTo(${p8}, { direct: true });`
      });
      await sleep(3000);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-pot-p8.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot-pot-p8.png');
    }

    // Capture at p9
    if (p9) {
      await send('Runtime.evaluate', {
        expression: `window.__scrollController.scrollTo(${p9}, { direct: true });`
      });
      await sleep(3000);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-pot-p9.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot-pot-p9.png');
    }

    // Capture at p10
    if (p10) {
      await send('Runtime.evaluate', {
        expression: `window.__scrollController.scrollTo(${p10}, { direct: true });`
      });
      await sleep(3000);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-pot-p10.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot-pot-p10.png');
    }

    // Also check pot mesh status in Three.js
    const potState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const pot = window.view.sections[1].pot;
          const info = {
            potVisible: pot?.object?.visible,
            potChildren: pot?.object?.children?.map(c => ({ name: c.name, visible: c.visible, type: c.type })),
            position: pot?.object?.position,
            scale: pot?.object?.scale
          };
          return info;
        })()
      `,
      returnByValue: true
    });
    console.log('Pot state:', JSON.stringify(potState.result?.value, null, 2));

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    try { fs.rmSync(TMP_PROFILE, { recursive: true, force: true }); } catch(e) {}
  }
}

main().catch(console.error);
