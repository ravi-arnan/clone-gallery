import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-pot-stalk-' + Date.now();

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

    console.log('Waiting 6s for app init...');
    await sleep(6000);

    // Get snap positions
    const snapInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return {
            hasController: !!window.__scrollController,
            potPos: window.__getSnapPosition('science', 'pot'),
            stalkPos: window.__getSnapPosition('stalk', 'a'),
            stalkPosD: window.__getSnapPosition('stalk', 'd'),
            stalkPosF: window.__getSnapPosition('stalk', 'f')
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Snap positions:', snapInfo.result?.value);

    // 1. Scroll directly to POT
    console.log('Scrolling to POT...');
    await send('Runtime.evaluate', {
      expression: `
        window.__scrollController.scrollTo(window.__getSnapPosition('science', 'pot'), { direct: true });
      `
    });
    await sleep(3000);

    // Capture POT screenshot
    let shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-pot.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot-pot.png');

    // 2. Scroll directly to STALK A
    console.log('Scrolling to STALK A...');
    await send('Runtime.evaluate', {
      expression: `
        window.__scrollController.scrollTo(window.__getSnapPosition('stalk', 'a'), { direct: true });
      `
    });
    await sleep(3000);

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-stalk-a.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot-stalk-a.png');

    // 3. Scroll to STALK D
    console.log('Scrolling to STALK D...');
    await send('Runtime.evaluate', {
      expression: `
        window.__scrollController.scrollTo(window.__getSnapPosition('stalk', 'd'), { direct: true });
      `
    });
    await sleep(3000);

    shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-stalk-d.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved screenshot-stalk-d.png');

    // Check meshes visibility and status at Stalk D
    const stalkState = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const secStalk = window.view.sections[2];
          const sv = secStalk.sceneView;
          return {
            currentSection: window.store.state.currentSection,
            currentSubSection: window.store.state.currentSubSection,
            scrollPosition: window.store.state.scroll.position,
            sceneViewKeys: Object.keys(sv || {}),
            meshVisible: sv?.mesh?.visible,
            skinnedMeshVisible: sv?.skinnedMesh?.visible,
            skinnedMesh2Visible: sv?.skinnedMesh2?.visible,
            skinnedMeshMaterial: sv?.skinnedMesh?.material?.type,
            skinnedMeshColor: sv?.skinnedMesh?.material?.color?.getHexString(),
            skinnedMeshMap: !!sv?.skinnedMesh?.material?.map
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Stalk state at D:', JSON.stringify(stalkState.result?.value, null, 2));

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    fs.rmSync(TMP_PROFILE, { recursive: true, force: true });
  }
}

main().catch(console.error);
