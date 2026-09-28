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

  const errors = [];
  const notFounds = [];

  ws.onopen = () => {
    send('Console.enable');
    send('Runtime.enable');
    send('Network.enable');

    send('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false
    });

    console.log('Beginning simulated scroll sequence...');
    let step = 0;
    const interval = setInterval(() => {
      step++;
      send('Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 960,
        y: 540,
        deltaX: 0,
        deltaY: 400
      });

      if (step >= 10) {
        clearInterval(interval);
        console.log('Finished scroll sequence, capturing tableau screenshot...');
        setTimeout(() => {
          send('Page.captureScreenshot', { format: 'png' });
        }, 2000);
      }
    }, 400);
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.exceptionThrown') {
      const { text, exception } = msg.params.exceptionDetails;
      errors.push(exception ? exception.description : text);
      console.error(`[EXCEPTION] ${text}`);
    } else if (msg.method === 'Network.responseReceived') {
      if (msg.params.response.status >= 400) {
        notFounds.push(`${msg.params.response.status} ${msg.params.response.url}`);
        console.error(`[NETWORK ${msg.params.response.status}] ${msg.params.response.url}`);
      }
    } else if (msg.result && msg.result.data) {
      const buffer = Buffer.from(msg.result.data, 'base64');
      fs.writeFileSync('/home/ravi/Projects/kprverse-clone/preview-scrolled.png', buffer);
      console.log(`Saved scrolled screenshot (${buffer.length} bytes)`);
      console.log(`Scroll Test Results: Exceptions: ${errors.length}, 404s: ${notFounds.length}`);
      ws.close();
      process.exit(0);
    }
  };
}

main().catch(console.error);
