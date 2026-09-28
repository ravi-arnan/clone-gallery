import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-s3tc-test-' + Date.now();

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
    'about:blank'
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

    // Force ASTC to null so app uses S3TC
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        const origGetExt = WebGLRenderingContext.prototype.getExtension;
        WebGLRenderingContext.prototype.getExtension = function(name) {
          if (name === 'WEBGL_compressed_texture_astc') {
            console.log('[Mock] Disabled WEBGL_compressed_texture_astc to test S3TC');
            return null;
          }
          return origGetExt.apply(this, arguments);
        };
      `
    });

    await send('Page.navigate', { url: 'http://localhost:3000' });
    console.log('Navigating to http://localhost:3000 with ASTC disabled (forcing S3TC)...');
    await sleep(7000);

    const loadedFormat = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sample = window.view?.sections[1]?.pot?.object?.children?.[1]?.material?.map;
          return {
            hasController: !!window.__scrollController,
            format: sample?.format,
            isCompressed: sample?.isCompressedTexture
          };
        })()
      `,
      returnByValue: true
    });
    console.log('S3TC loaded format:', loadedFormat.result?.value);

    // Scroll to pot p9
    const potPos = await send('Runtime.evaluate', {
      expression: `window.__getSnapPosition('science', 9)`,
      returnByValue: true
    });
    if (potPos.result?.value) {
      await send('Runtime.evaluate', {
        expression: `window.__scrollController.scrollTo(${potPos.result.value}, { direct: true });`
      });
      await sleep(3000);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-pot-s3tc.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot-pot-s3tc.png');
    }

    // Scroll to stalk a
    const stalkPos = await send('Runtime.evaluate', {
      expression: `window.__getSnapPosition('stalk', 'a')`,
      returnByValue: true
    });
    if (stalkPos.result?.value) {
      await send('Runtime.evaluate', {
        expression: `window.__scrollController.scrollTo(${stalkPos.result.value}, { direct: true });`
      });
      await sleep(3000);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-stalk-s3tc.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot-stalk-s3tc.png');
    }

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    try { fs.rmSync(TMP_PROFILE, { recursive: true, force: true }); } catch(e) {}
  }
}

main().catch(console.error);
