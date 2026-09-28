import os
import re

BASE_DIR = '/home/ravi/Projects/sharplink-clone'
SSR_CLEAN_HTML = os.path.join(BASE_DIR, 'ssr_clean.html')
INDEX_HTML = os.path.join(BASE_DIR, 'index.html')

with open(SSR_CLEAN_HTML, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Normalize all remote sharplink.com asset URLs
html = html.replace('https://www.sharplink.com/_nuxt/', '/_nuxt/')
html = html.replace('https://www.sharplink.com/_fonts/', '/_fonts/')
html = html.replace('https://www.sharplink.com/webgl/', '/webgl/')
html = html.replace('https://www.sharplink.com/images/', '/images/')
html = html.replace('https://www.sharplink.com/api/', '/api/')
html = html.replace('https://www.sharplink.com/favicon.ico', '/favicon.ico')

# 2. Localize Storyblok assets
html = html.replace('https://a.storyblok.com/', '/storyblok/')
# In JSON / URL-encoded contexts:
html = html.replace('https:\\/\\/a.storyblok.com\\/', '\\/storyblok\\/')
html = html.replace('https%3A%2F%2Fa.storyblok.com%2F', '%2Fstoryblok%2F')
html = html.replace('https:%2F%2Fa.storyblok.com%2F', '%2Fstoryblok%2F')

# 3. Clean integrity and remote crossorigin attributes
html = re.sub(r'\sintegrity=[\'"][^\'"]*[\'"]', '', html)

# 4. Neutralize Marker.io snippet
html = re.sub(r'window\.markerConfig\s*=\s*\{[\s\S]*?\};', '/* markerConfig disabled */', html)
html = html.replace('https://edge.marker.io/latest/shim.js', '')

# 5. Guarantee video playback attributes
def fix_video_tag(match):
    tag = match.group(0)
    for attr in ['autoplay', 'loop', 'muted', 'playsinline']:
        if attr not in tag:
            tag = tag.replace('<video', f'<video {attr}')
    return tag

html = re.sub(r'<video[^>]*>', fix_video_tag, html)

# 6. Ensure all page component stylesheets are loaded in <head> for zero layout-shift
all_stylesheets = [
  '/_nuxt/entry.D7b4BisY.css',
  '/_nuxt/Content.haKaEqxz.css',
  '/_nuxt/colors._5rLuzGg.css',
  '/_nuxt/Wrapper.CBBHtnSw.css',
  '/_nuxt/Video.6CgUOyHF.css',
  '/_nuxt/TextReveal.CGR_q-cq.css',
  '/_nuxt/LatestArticles.DVpluiXD.css',
  '/_nuxt/DateBadge.CsfzVgh1.css',
  '/_nuxt/index.BYwz9TUN.css',
  '/_nuxt/default.BRin2g7f.css',
  '/_nuxt/HeroProductivityWrapper.CuvFFQ9r.css',
  '/_nuxt/index.DrU-Kxyg.css',
  '/_nuxt/Banner.Cdt8eNr1.css',
  '/_nuxt/index.9FetlLk4.css',
  '/_nuxt/News.Bqx_65q6.css',
  '/_nuxt/index.CgJ6ZlZG.css',
  '/_nuxt/about.BMcN-Udb.css',
  '/_nuxt/investors.BQ_RqbLz.css',
  '/_nuxt/index.zHGMSAB1.css',
  '/_nuxt/dashboard.nt9r6bK2.css',
  '/_nuxt/Header.CYo6hBTq.css',
  '/_nuxt/privacy-policy.CL2xqWHZ.css',
  '/_nuxt/EmailAlertWidget.BgT4Pmat.css',
  '/_nuxt/_slug_.SGf2b7ES.css',
  '/_nuxt/contact.kvkipIjd.css',
  '/_nuxt/terms-of-use.CNQlwydS.css'
]

# Check which are already in head
existing_links = re.findall(r'href=[\'"]([^\'"]+\.css)[\'"]', html)
new_links = []
for css in all_stylesheets:
    if css not in existing_links and os.path.basename(css) not in str(existing_links):
        new_links.append(f'<link rel="stylesheet" href="{css}">')

css_inject = '\n  ' + '\n  '.join(new_links)

# 7. Preload WebGL texture and Lottie JSON in <head>
preload_inject = """
  <!-- Local Offline Assets Preload -->
  <link rel="preload" href="/webgl/packed_texture.png" as="image">
  <link rel="preload" href="/storyblok/f/290008427472090/x/c203c1fda0/shrp_stack.json" as="fetch" crossorigin="anonymous">
"""

html = html.replace('</head>', f"{css_inject}\n{preload_inject}\n</head>")

with open(INDEX_HTML, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Generated clean SSR index.html successfully! Size: {os.path.getsize(INDEX_HTML)} bytes")
