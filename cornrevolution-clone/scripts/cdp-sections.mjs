import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-cdp-sections-' + Date.now();

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
    await sleep(2000);
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
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        console.log(`[Browser Console ${msg.params.type}]`, args);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
        console.error('[Browser Exception]', desc);
      } else if (msg.id && callbacks.has(msg.id)) {
        const { resolve } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        resolve(msg.result);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Waiting 5s for app initialization...');
    await sleep(5000);

    // Inspect store state & snap positions
    const state = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const s = window.store.state;
          return {
            currentSection: s.currentSection,
            pageHeight: s.pageHeight,
            sections: Object.keys(s)
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Initial Store state:', state.result?.value);

    // Press Down arrow multiple times to advance to section 2 (science / pot)
    console.log('Navigating to section 2 (science)...');
    for (let k = 0; k < 20; k++) {
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 40 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 40 });
      await sleep(100);
    }
    await sleep(3000);

    let secState = await send('Runtime.evaluate', {
      expression: `window.store.state.currentSection`,
      returnByValue: true
    });
    console.log('Current section after scroll 1:', secState.result?.value);

    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-science.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot-science.png');

    // Press Down arrow more to advance to section 3 (stalk / corn plant)
    console.log('Navigating to section 3 (stalk)...');
    for (let k = 0; k < 30; k++) {
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', windowsVirtualKeyCode: 40 });
      await send('Input.dispatchKeyEvent', { type: 'keyUp', windowsVirtualKeyCode: 40 });
      await sleep(100);
    }
    await sleep(3000);

    secState = await send('Runtime.evaluate', {
      expression: `window.store.state.currentSection`,
      returnByValue: true
    });
    console.log('Current section after scroll 2:', secState.result?.value);

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-stalk.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot-stalk.png');

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    fs.rmSync(TMP_PROFILE, { recursive: true, force: true });
  }
}

main().catch(console.error);
