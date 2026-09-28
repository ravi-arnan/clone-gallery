import http from 'node:http';
import fs from 'node:fs';

async function getPages() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  const pages = await getPages();
  const page = pages.find(p => p.type === 'page' && p.url.includes('localhost:3000'));
  if (!page) {
    console.error('Target page not found');
    process.exit(1);
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  function send(method, params = {}) {
    const msgId = id++;
    ws.send(JSON.stringify({ id: msgId, method, params }));
    return msgId;
  }

  ws.onopen = () => {
    // Set 1920x1080 viewport
    send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    // Wait 3 seconds for resize and WebGL layout to adjust
    setTimeout(() => {
      send('Page.captureScreenshot', { format: 'png' });
    }, 3000);
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.result && msg.result.data) {
      const buffer = Buffer.from(msg.result.data, 'base64');
      fs.writeFileSync('/home/ravi/Projects/kprverse-clone/preview.png', buffer);
      console.log(`Saved 1920x1080 screenshot to preview.png (${buffer.length} bytes)`);
      ws.close();
      process.exit(0);
    }
  };
}

main().catch(console.error);
