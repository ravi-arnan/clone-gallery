import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-inspect-detail-' + Date.now();

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

    const info = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const s = window.store.state;
          return {
            sectionPositions: s.sectionPositions,
            sectionHeights: s.sectionHeights,
            pageHeight: s.pageHeight,
            currentSection: s.currentSection,
            currentSubSection: s.currentSubSection,
            menuStates: s.menuStates
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Section Info:', JSON.stringify(info.result?.value, null, 2));

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    fs.rmSync(TMP_PROFILE, { recursive: true, force: true });
  }
}

main().catch(console.error);
