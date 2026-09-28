import os
import re
import json
import urllib.parse

BASE_DIR = '/home/ravi/Projects/sui-clone'
ORIGINAL_HTML = os.path.join(BASE_DIR, 'original.html')
INDEX_HTML = os.path.join(BASE_DIR, 'index.html')
MAP_PATH = os.path.join(BASE_DIR, 'docs/research/url-to-local-map.json')

with open(MAP_PATH, 'r') as f:
    url_map = json.load(f)

with open(ORIGINAL_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace all known mapped URLs
sorted_urls = sorted(url_map.keys(), key=lambda x: len(x), reverse=True)
replace_count = 0
for u in sorted_urls:
    local = url_map[u]
    if u in html:
        html = html.replace(u, local)
        replace_count += 1
    # also check url-encoded or unencoded variations
    unquoted = urllib.parse.unquote(u)
    if unquoted in html and unquoted != u:
        html = html.replace(unquoted, local)
        replace_count += 1

print(f"Direct URL replacements made: {replace_count}")

# 2. Map Core Vendor Scripts in HTML
vendor_map = {
    'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js': '/vendor/webfont.js',
    'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=68e8e0120513ba12c5cd12e0': '/vendor/jquery-3.5.1.min.js',
    'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/css/sui-v2.shared.230f7fdb5.min.css': '/css/sui-v2.shared.230f7fdb5.min.css',
    'https://cdn.prod.website-files.com/gsap/3.15.0/gsap.min.js': '/vendor/gsap.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/ScrollTrigger.min.js': '/vendor/ScrollTrigger.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/SplitText.min.js': '/vendor/SplitText.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/CustomEase.min.js': '/vendor/CustomEase.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/InertiaPlugin.min.js': '/vendor/InertiaPlugin.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/Observer.min.js': '/vendor/Observer.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/Draggable.min.js': '/vendor/Draggable.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/DrawSVGPlugin.min.js': '/vendor/DrawSVGPlugin.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/ScrambleTextPlugin.min.js': '/vendor/ScrambleTextPlugin.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/MorphSVGPlugin.min.js': '/vendor/MorphSVGPlugin.min.js',
    'https://cdn.prod.website-files.com/gsap/3.15.0/Flip.min.js': '/vendor/Flip.min.js',
    'https://unpkg.com/lenis@1.3.23/dist/lenis.min.js': '/vendor/lenis.min.js',
    'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.8110c5140c42692b.js': '/js/sui-v2.schunk.8110c5140c42692b.js',
    'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.288df1f54663a3bc.js': '/js/sui-v2.schunk.288df1f54663a3bc.js',
    'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.305741e705aa0ac6.js': '/js/sui-v2.schunk.305741e705aa0ac6.js',
    'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.d64be42593ba95e6.js': '/js/sui-v2.schunk.d64be42593ba95e6.js',
    'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.schunk.9dfb96661114d3db.js': '/js/sui-v2.schunk.9dfb96661114d3db.js',
    'https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/js/sui-v2.6382a8df.0d93f870390191b1.js': '/js/sui-v2.6382a8df.0d93f870390191b1.js'
}

for k, v in vendor_map.items():
    html = html.replace(k, v)

# 3. Add global Rive & Lottie preload in <head>
head_inject = """
    <!-- Preload Global Rive & Lottie Runtimes -->
    <script src="/vendor/rive.min.js"></script>
    <script src="/vendor/lottie.min.js"></script>
"""
html = html.replace('</head>', f"{head_inject}\n</head>")

# 4. Fix Slater loader at bottom: load /js/slater-17378.js directly
slater_pattern = re.compile(r'\(function\(\)\s*\{\s*var src = window\.location\.host\.includes\("webflow\.io"\)[\s\S]*?\}\)\(\);')
html = slater_pattern.sub("""(function() {
    var s = document.createElement('script');
    s.src = '/js/slater-17378.js';
    s.type = 'module';
    s.defer = true;
    document.head.appendChild(s);
  })();""", html)

# 5. Neutralize GTM, HubSpot, and doubleclick
html = re.sub(r'\(function\(w,d,s,l,i\)\{w\[l\]=w\[l\]\|\|\[\];w\[l\]\.push\(\{\'gtm\.start\'[\s\S]*?\}\)\(window,document,\'script\',\'dataLayer\',\'GTM-[^\']+\'\);', '/* GTM neutralized */', html)
html = html.replace('https://hubspotonwebflow.com/assets/js/form-124.js', '')

# 6. Neutralize Weglot CDN network call
html = re.sub(r's\.src = \'https:\/\/cdn\.weglot\.com\/weglot\.min\.js\';', 'window.__weglotReady = true; window.dispatchEvent(new CustomEvent("weglotReady")); return;', html)

with open(INDEX_HTML, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Localized index.html created successfully! Size: {os.path.getsize(INDEX_HTML)} bytes")
