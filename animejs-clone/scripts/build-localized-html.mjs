import fs from 'node:fs';

const BASE = '/home/ravi/Projects/animejs-clone';
let html = fs.readFileSync(`${BASE}/original.html`, 'utf-8');

console.log('Transforming original.html into localized index.html ...');

// 1. Remove Google Tag Manager script tag
html = html.replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-16LTPBS8QC"><\/script>/g, '');

// 2. Localize window.paths & stub analytics
const oldPathsScript = `<script>
  window.paths = {
    demos: 'https://animejs.com/documentation-demos',
    'easings': 'https://animejs.com/assets/json/easings.json',
    'github-sponsors': 'https://animejs.com/sponsors/github-sponsors',
    'platinum-sponsors': 'https://animejs.com/sponsors/platinum-sponsors',
    'gold-sponsors': 'https://animejs.com/sponsors/gold-sponsors',
    'silver-sponsors': 'https://animejs.com/sponsors/silver-sponsors',
  };
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-16LTPBS8QC');
</script>`;

const newPathsScript = `<script>
  window.paths = {
    demos: '/documentation-demos',
    'easings': '/assets/json/easings.json',
    'github-sponsors': '/sponsors/github-sponsors',
    'platinum-sponsors': '/sponsors/platinum-sponsors',
    'gold-sponsors': '/sponsors/gold-sponsors',
    'silver-sponsors': '/sponsors/silver-sponsors',
  };
  window.dataLayer = [];
  function gtag(){};
</script>`;

html = html.replace(oldPathsScript, newPathsScript);

// 3. Remove Carbon Ads script
html = html.replace(/<script async type="text\/javascript" src="\/\/cdn\.carbonads\.com\/carbon\.js\?serve=CWBITK77&amp;placement=animejscom&amp;format=responsive" id="_carbonads_js"><\/script>/g, '<!-- Carbon Ads disabled in local clone -->');
html = html.replace(/<script async type="text\/javascript" src="\/\/cdn\.carbonads\.com\/carbon\.js\?serve=CWBITK77&placement=animejscom&format=responsive" id="_carbonads_js"><\/script>/g, '<!-- Carbon Ads disabled in local clone -->');

// 4. Localize stylesheets and icon
html = html.replace(/href="https:\/\/animejs\.com\/assets\/css\/core\.css(?:\?v=\d+)?"/g, 'href="/assets/css/core.css"');
html = html.replace(/href="https:\/\/animejs\.com\/assets\/css\/home\.css(?:\?v=\d+)?"/g, 'href="/assets/css/home.css"');
html = html.replace(/href="https:\/\/animejs\.com\/assets\/images\/favicon\.png"/g, 'href="/assets/images/favicon.png"');

// 5. Localize images & logo
html = html.replace(/src="https:\/\/animejs\.com\/assets\/images\/anime-js-logo-v4\.svg"/g, 'src="/assets/images/anime-js-logo-v4.svg"');
html = html.replace(/src="https:\/\/animejs\.com\/media\/pages\/sponsors\/platinum-sponsors\/ef1c9c6c85-1787698629\/sponsor-placeholder\.svg"/g, 'src="/media/pages/sponsors/platinum-sponsors/ef1c9c6c85-1787698629/sponsor-placeholder.svg"');
html = html.replace(/content="https:\/\/animejs\.com\/media\/pages\/home\/066c76f87b-1787698629\/generated-og-image\.en\.png"/g, 'content="/media/pages/home/066c76f87b-1787698629/generated-og-image.en.png"');

// 6. Localize main module script
html = html.replace(/src="https:\/\/animejs\.com\/assets\/js\/home\.js(?:\?v=\d+)?"/g, 'src="/assets/js/home.js"');

// 7. Localize root home link
html = html.replace(/href="https:\/\/animejs\.com"/g, 'href="/"');

// 8. Prevent form redirect on email submit
html = html.replace(/<form>/g, '<form onsubmit="event.preventDefault(); document.getElementById(\'form-fields\').classList.remove(\'is-active\'); document.getElementById(\'success-message\').classList.add(\'is-active\'); return false;">');

// Write localized index.html
fs.writeFileSync(`${BASE}/index.html`, html);
console.log(`[OK] Successfully wrote localized ${BASE}/index.html (${html.length} bytes)`);
