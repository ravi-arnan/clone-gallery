import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-cdp-profile-' + Date.now();

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
  console.log('Starting headless Chrome with remote debugging...');
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
    console.log('Connected to target page:', page.url);

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

    const consoleLogs = [];
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const args = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        consoleLogs.push(`[${msg.params.type}] ${args}`);
        console.log(`[Browser Console ${msg.params.type}]`, args);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
        consoleLogs.push(`[EXCEPTION] ${desc}`);
        console.error('[Browser Exception]', desc);
      } else if (msg.id && callbacks.has(msg.id)) {
        const { resolve } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        resolve(msg.result);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);
    console.log('WebSocket connection opened.');

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Network.enable');

    // Wait 5 seconds for preloader & WebGL initialization
    console.log('Waiting for initial WebGL render (5s)...');
    await sleep(5000);

    // Capture screenshot 1 (Landing)
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-landing.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot-landing.png');

    // Scroll down to Stalk / Science section
    console.log('Simulating scroll down...');
    await send('Runtime.evaluate', {
      expression: `
        window.scrollTo(0, 1500);
        document.dispatchEvent(new WheelEvent('wheel', { deltaY: 2000 }));
      `
    });
    await sleep(3000);

    // Capture screenshot 2 (After scroll)
    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-section2.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot-section2.png');

    // Check WebGL state via evaluate
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvases = Array.from(document.querySelectorAll('canvas'));
          return {
            canvasCount: canvases.length,
            canvasSizes: canvases.map(c => ({ w: c.width, h: c.height })),
            store: window.store ? Object.keys(window.store) : null,
            env: window.env ? Object.keys(window.env) : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Page WebGL State:', evalRes.result?.value);

    // Save logs to file
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/browser-console.log', consoleLogs.join('\n'));
    console.log(`Saved ${consoleLogs.length} console logs to browser-console.log`);

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    fs.rmSync(TMP_PROFILE, { recursive: true, force: true });
    console.log('Chrome process closed.');
  }
}

main().catch(console.error);
