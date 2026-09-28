import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

async function getPages() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  const pages = await getPages();
  const page = pages.find(p => p.type === 'page');
  if (!page) {
    console.error('Target page not found in Chrome. Available:', pages);
    process.exit(1);
  }

  console.log(`Connecting to page: ${page.id} (${page.url})`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const errors = [];
  const warnings = [];
  const networkErrors = [];
  const logs = [];

  ws.onopen = async () => {
    console.log('Connected to Chrome DevTools Protocol via WebSocket');

    await send('Console.enable');
    await send('Log.enable');
    await send('Runtime.enable');
    await send('Network.enable');
    await send('Page.enable');

    console.log('Navigating to http://localhost:3000 ...');
    await send('Page.navigate', { url: 'http://localhost:3000' });

    // Wait 5 seconds for page load, animations, and scripts execution
    await new Promise(r => setTimeout(r, 5000));

    // Evaluate DOM state and check preloader
    const evalRes = await send('Runtime.evaluate', {
      expression: `(${() => {
        const preloader = document.querySelector('[data-master-preloader]') || document.querySelector('.preloader') || document.querySelector('[data-preloader]');
        const videos = [...document.querySelectorAll('video')].map(v => ({
          src: v.currentSrc || v.src,
          paused: v.paused,
          readyState: v.readyState
        }));
        const title = document.title;
        const bodyClass = document.body.className;
        const flowers = document.querySelectorAll('.flower').length;
        const lenisExists = typeof window.lenis !== 'undefined' || typeof window.Lenis !== 'undefined';
        const gsapExists = typeof window.gsap !== 'undefined';
        return {
          title,
          bodyClass,
          preloaderVisible: preloader ? getComputedStyle(preloader).display !== 'none' && getComputedStyle(preloader).opacity !== '0' : false,
          videosCount: videos.length,
          flowerElements: flowers,
          lenisAvailable: lenisExists,
          gsapAvailable: gsapExists,
          videoDetails: videos.slice(0, 5)
        };
      }})()`,
      returnByValue: true
    });

    console.log('\n--- DOM & RUNTIME STATE ---');
    console.log(JSON.stringify(evalRes.result?.value, null, 2));

    // Capture screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot.result?.data) {
      const shotPath = path.resolve('docs/debug-screenshot.png');
      fs.writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
      console.log(`Saved screenshot to ${shotPath}`);
    }

    console.log('\n=================== CDP DIAGNOSTIC REPORT ===================');
    console.log(`Total Network Errors (4xx/5xx): ${networkErrors.length}`);
    for (const ne of networkErrors) {
      console.log(`  - [HTTP ${ne.status}] ${ne.url}`);
    }

    console.log(`Total Console / Runtime Errors: ${errors.length}`);
    for (const err of errors) {
      console.log(`  - [ERROR] ${err}`);
    }

    console.log(`Total Warnings: ${warnings.length}`);
    for (const w of warnings) {
      console.log(`  - [WARN] ${w}`);
    }
    console.log('=============================================================\n');

    ws.close();
    process.exit(0);
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const resolve = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        resolve(msg);
        return;
      }

      if (msg.method === 'Console.messageAdded') {
        const { level, text, url, line } = msg.params.message;
        if (level === 'error') errors.push(`${text} (${url || 'unknown'}:${line || 0})`);
        else if (level === 'warning') warnings.push(text);
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const { type, args } = msg.params;
        const text = args.map(a => a.value !== undefined ? a.value : JSON.stringify(a)).join(' ');
        if (type === 'error') errors.push(text);
        else if (type === 'warning') warnings.push(text);
        else logs.push(text);
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const { text, exception } = msg.params.exceptionDetails;
        const desc = exception?.description || text;
        errors.push(desc);
      } else if (msg.method === 'Network.responseReceived') {
        const { response } = msg.params;
        if (response.status >= 400) {
          networkErrors.push({ status: response.status, url: response.url });
        }
      }
    } catch (e) {
      console.error('CDP parse error:', e);
    }
  };

  ws.onerror = (err) => {
    console.error('WebSocket connection error:', err);
  };
}

main().catch(console.error);
