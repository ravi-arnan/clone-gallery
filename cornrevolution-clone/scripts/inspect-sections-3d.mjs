import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const CHROME_PATH = '/etc/profiles/per-user/ravi/bin/google-chrome';
const TMP_PROFILE = '/tmp/chrome-inspect-sec-' + Date.now();

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

    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const secScience = window.view.sections[1];
          const secStalk = window.view.sections[2];
          
          function inspectMeshAndMaterial(root, maxDepth = 4) {
            const list = [];
            function traverse(node, depth) {
              if (!node || depth > maxDepth) return;
              if (node.isMesh || node.isSkinnedMesh || node.isPoints) {
                const item = {
                  name: node.name,
                  type: node.type,
                  visible: node.visible,
                  parentName: node.parent?.name
                };
                const m = node.material;
                if (m) {
                  const mats = Array.isArray(m) ? m : [m];
                  item.materials = mats.map(mat => ({
                    name: mat.name,
                    type: mat.type,
                    color: mat.color ? mat.color.getHexString() : null,
                    map: mat.map ? {
                      name: mat.map.name,
                      isCompressed: !!mat.map.isCompressedTexture,
                      format: mat.map.format,
                      hasImage: !!mat.map.image,
                      needsUpdate: mat.map.needsUpdate
                    } : null,
                    uniforms: mat.uniforms ? Object.keys(mat.uniforms).filter(k => k.toLowerCase().includes('tex') || k.toLowerCase().includes('map') || k.toLowerCase().includes('color')) : null
                  }));
                }
                list.push(item);
              }
              if (node.children) {
                for (const c of node.children) traverse(c, depth + 1);
              }
            }
            traverse(root, 0);
            return list;
          }

          // Inspect pot
          const potObject = secScience.pot?.object || secScience.pot?.scene || secScience.pot;
          const potMeshes = inspectMeshAndMaterial(potObject);

          // Inspect stalk
          const stalkObject = secStalk.sceneView?.object || secStalk.sceneView?.scene || secStalk.sceneView;
          const stalkMeshes = inspectMeshAndMaterial(stalkObject);

          // Inspect textures in window.assets.textures
          const texturesSummary = {};
          if (window.assets && window.assets.textures) {
            const texMap = window.assets.textures;
            const entries = texMap instanceof Map ? Array.from(texMap.entries()) : Object.entries(texMap);
            for (const [k, v] of entries) {
              if (k.includes('pot') || k.includes('stalk') || k.includes('soil')) {
                texturesSummary[k] = {
                  isTexture: !!v?.isTexture,
                  isCompressed: !!v?.isCompressedTexture,
                  format: v?.format,
                  hasImage: !!v?.image,
                  imageDetails: v?.image ? (Array.isArray(v.image) ? v.image.length + ' mipmaps' : (v.image.width + 'x' + v.image.height)) : null,
                  needsUpdate: v?.needsUpdate
                };
              }
            }
          }

          return {
            potKeys: Object.keys(secScience.pot || {}),
            stalkKeys: Object.keys(secStalk.sceneView || {}),
            potMeshes: potMeshes.slice(0, 15),
            stalkMeshes: stalkMeshes.slice(0, 15),
            texturesSummary
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Detailed 3D inspection:', JSON.stringify(res.result?.value, null, 2));

    ws.close();
  } finally {
    chrome.kill('SIGKILL');
    fs.rmSync(TMP_PROFILE, { recursive: true, force: true });
  }
}

main().catch(console.error);
