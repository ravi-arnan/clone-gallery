import http from 'node:http';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const BRAVE_PATH = '/nix/store/g5k9h4l84s1rnvzk7hwj27sy9cqn6kv1-brave-origin-1.93.138/opt/brave.com/brave-origin/brave';
const TMP_PROFILE = '/tmp/brave-stalk-test-' + Date.now();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPages() {
  for (let i = 0; i < 25; i++) {
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
  throw new Error('Failed to connect to Brave DevTools port 9222');
}

async function main() {
  const brave = spawn(BRAVE_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${TMP_PROFILE}`,
    '--window-size=1920,1080',
    'http://localhost:3000'
  ], { stdio: 'ignore' });

  try {
    await sleep(3000);
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
        console.log(`[Brave Console ${msg.params.type}]`, args);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const desc = msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text;
        console.error('[Brave Exception]', desc);
      } else if (msg.id && callbacks.has(msg.id)) {
        const { resolve } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        resolve(msg.result);
      }
    };

    await new Promise(resolve => ws.onopen = resolve);
    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Waiting 7s for app init in Brave...');
    await sleep(7000);

    // Check WebGL context and format detection in Brave
    const webglInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const canvas = document.createElement('canvas');
          const gl = canvas.getContext('webgl');
          return {
            astc: !!gl.getExtension('WEBGL_compressed_texture_astc'),
            s3tc: !!gl.getExtension('WEBGL_compressed_texture_s3tc'),
            pvrtc: !!gl.getExtension('WEBGL_compressed_texture_pvrtc'),
            etc1: !!gl.getExtension('WEBGL_compressed_texture_etc1'),
            renderer: gl.getParameter(gl.RENDERER),
            vendor: gl.getParameter(gl.VENDOR),
            hasController: !!window.__scrollController
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Brave WebGL Info:', JSON.stringify(webglInfo.result?.value, null, 2));

    // Scroll to stalk a
    const stalkPos = await send('Runtime.evaluate', {
      expression: `window.__getSnapPosition('stalk', 'a')`,
      returnByValue: true
    });
    console.log('Stalk A pos:', stalkPos.result?.value);
    if (stalkPos.result?.value) {
      await send('Runtime.evaluate', {
        expression: `window.__scrollController.scrollTo(${stalkPos.result.value}, { direct: true });`
      });
      await sleep(3000);
      let shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('/home/ravi/Projects/cornrevolution-clone/screenshot-brave-stalk-a.png', Buffer.from(shot.data, 'base64'));
      console.log('Saved screenshot-brave-stalk-a.png');
    }

    // Inspect textures loaded in Brave
    const texInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const sv = window.view?.sections[2]?.sceneView;
          const fgTex = sv?.foregroundPlantTexture;
          const fgMat = sv?.foregroundPlantMaterial;
          return {
            fgTex: {
              isCompressed: !!fgTex?.isCompressedTexture,
              format: fgTex?.format,
              image: fgTex?.image ? (Array.isArray(fgTex.image) ? fgTex.image.length + ' mips' : (fgTex.image.width + 'x' + fgTex.image.height)) : null,
              version: fgTex?.version
            },
            fgMatUniforms: fgMat?.uniforms ? {
              foregroundTexture: fgMat.uniforms.foregroundTexture?.value?.format,
              foregroundShadowTexture: fgMat.uniforms.foregroundShadowTexture?.value?.format,
              foregroundScreenTexture: fgMat.uniforms.foregroundScreenTexture?.value?.format,
              energyMask: fgMat.uniforms.energyMask?.value?.format
            } : null
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Brave Stalk Texture Info:', JSON.stringify(texInfo.result?.value, null, 2));

    ws.close();
  } finally {
    brave.kill('SIGKILL');
    try { fs.rmSync(TMP_PROFILE, { recursive: true, force: true }); } catch(e) {}
  }
}

main().catch(console.error);
