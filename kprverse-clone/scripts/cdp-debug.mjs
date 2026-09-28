import http from 'node:http';

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
  const page = pages.find(p => p.type === 'page' && p.url.includes('localhost:3000'));
  if (!page) {
    console.error('Target page not found in Chrome. Pages:', pages);
    process.exit(1);
  }

  console.log(`Connecting to: ${page.title} (${page.url})`);
  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let msgId = 1;
  function send(method, params = {}) {
    const id = msgId++;
    ws.send(JSON.stringify({ id, method, params }));
    return id;
  }

  const errors = [];
  const warnings = [];
  const notFounds = [];

  ws.onopen = () => {
    console.log('Connected to Chrome DevTools Protocol!');
    send('Console.enable');
    send('Log.enable');
    send('Runtime.enable');
    send('Network.enable');
    send('Page.enable');

    console.log('Navigating cleanly to http://localhost:3000 ...');
    send('Page.navigate', { url: 'http://localhost:3000' });

    // Wait 12 seconds for all 3D assets, textures, sounds, and shaders to load
    setTimeout(() => {
      console.log('\n=================== CDP VERIFICATION REPORT ===================');
      console.log(`Total 404 Not Found: ${notFounds.length}`);
      if (notFounds.length > 0) {
        notFounds.forEach(u => console.log(`  - 404: ${u}`));
      }

      console.log(`Total Exceptions: ${errors.length}`);
      if (errors.length > 0) {
        errors.forEach(e => console.log(`  - Exception: ${e}`));
      }

      console.log(`Total Warnings: ${warnings.length}`);
      console.log('===============================================================\n');

      ws.close();
      process.exit(0);
    }, 12000);
  };

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Console.messageAdded') {
        const { level, text, url, line } = msg.params.message;
        if (level === 'error') {
          errors.push(`${text} (${url || ''}:${line || ''})`);
          console.error(`[CONSOLE ERROR] ${text}`);
        }
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        const { type, args } = msg.params;
        const text = args.map(a => a.value !== undefined ? a.value : JSON.stringify(a)).join(' ');
        if (type === 'error') {
          errors.push(text);
          console.error(`[API ERROR] ${text}`);
        }
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const { text, exception } = msg.params.exceptionDetails;
        const desc = exception ? exception.description : text;
        errors.push(desc);
        console.error(`[EXCEPTION] ${desc}`);
      } else if (msg.method === 'Network.responseReceived') {
        const { response } = msg.params;
        if (response.status >= 400) {
          notFounds.push(`${response.status} ${response.url}`);
          console.error(`[NETWORK ${response.status}] ${response.url}`);
        }
      }
    } catch (e) {
      console.error('CDP parse error:', e);
    }
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
}

main().catch(console.error);
