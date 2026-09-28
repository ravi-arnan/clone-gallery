import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-inspect-mat-' + Date.now();

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

    // Find 3D objects in Three.js scenes
    const sceneInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Find views and objects
          const result = {};
          
          // Traverse window to find Three.js scenes or instances
          function findThreeObjects() {
            const meshes = [];
            // Check globals or window properties
            for (const k of Object.keys(window)) {
              try {
                const val = window[k];
                if (val && typeof val === 'object') {
                  if (val.isScene || val.isMesh || val.isObject3D) {
                    meshes.push({ key: k, type: val.type, name: val.name });
                  }
                }
              } catch(e) {}
            }
            return meshes;
          }

          result.threeObjects = findThreeObjects();
          result.storeState = {
            currentSection: window.store.state.currentSection,
            currentSubSection: window.store.state.currentSubSection,
            scrollPosition: window.store.state.scroll.position,
            sectionPositions: window.store.state.sectionPositions,
            sectionHeights: window.store.state.sectionHeights
          };
          return result;
        })()
      `,
      returnByValue: true
    });
    console.log('Scene & Store info:', JSON.stringify(sceneInfo.result?.value, null, 2));

    // Let's find the views and scenes inside AppView or registered singletons
    const detailInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          // Inspect AppView or sections via DOM or event listeners
          // We can inspect __three__ or traverse all objects in memory
          // Let's find textures in THREE.TextureLoader / Cache
          const textures = [];
          // If THREE exists
          if (window.THREE && window.THREE.Cache) {
            textures.push(...Object.keys(window.THREE.Cache.files));
          }
          return {
            windowKeys: Object.keys(window).filter(k => !k.startsWith('webkit') && !k.startsWith('on')),
            cacheFiles: textures
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Detail info:', JSON.stringify(detailInfo.result?.value, null, 2));

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    fs.rmSync(TMP_PROFILE, { recursive: true, force: true });
  }
}

main().catch(console.error);
