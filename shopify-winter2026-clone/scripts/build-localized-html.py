#!/usr/bin/env python3
import os
import re

with open("docs/research/raw_page.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# 1. Stylesheets & module preloads
html = re.sub(r'href="https://cdn\.shopify\.com/oxygen-v2/47215/49013/102837/4351350/assets/', 'href="/oxygen-assets/', html)

# 2. Font preloads
html = re.sub(r'href="https://cdn\.shopify\.com/b/shopify-brochure2-assets/', 'href="/cdn.shopify.com/b/shopify-brochure2-assets/', html)

# 3. Favicons
html = re.sub(r'href="https://cdn\.shopify\.com/s/files/', 'href="/cdn.shopify.com/s/files/', html)

# 4. Canonical link & metadata
html = html.replace('href="https://www.shopify.com/editions/winter2026"', 'href="/"')

# 5. Bootstrap script module
old_module_script_pattern = r'<script nonce="[^"]+" type="module" async="">import "https://cdn\.shopify\.com/oxygen-v2/47215/49013/102837/4351350/assets/manifest-40e0f26c\.js";import \* as route0 from "https://cdn\.shopify\.com/oxygen-v2/47215/49013/102837/4351350/assets/root-CklYXyH2\.js";import \* as route1 from "https://cdn\.shopify\.com/oxygen-v2/47215/49013/102837/4351350/assets/\(_locale\)\.editions\.winter2026-DbqN2bd0\.js";window\.__remixRouteModules = \{"root":route0,"routes/\(\$locale\)\.editions\.winter2026":route1\};import\("https://cdn\.shopify\.com/oxygen-v2/47215/49013/102837/4351350/assets/entry\.client-CXIPWjPz\.js"\);</script>'

new_module_script = '''<script type="module" async="">
import "/oxygen-assets/manifest-40e0f26c.js";
import * as route0 from "/oxygen-assets/root-CklYXyH2.js";
import * as route1 from "/oxygen-assets/(_locale).editions.winter2026-DbqN2bd0.js";
window.__remixRouteModules = {"root":route0,"routes/($locale).editions.winter2026":route1};
import("/oxygen-assets/entry.client-CXIPWjPz.js");
</script>'''

if re.search(old_module_script_pattern, html):
    html = re.sub(old_module_script_pattern, new_module_script, html)
    print("Replaced bootstrap module script via regex")
else:
    # Fallback direct string replacement
    target = 'import "https://cdn.shopify.com/oxygen-v2/47215/49013/102837/4351350/assets/manifest-40e0f26c.js";'
    if target in html:
        html = html.replace('https://cdn.shopify.com/oxygen-v2/47215/49013/102837/4351350/assets/', '/oxygen-assets/')
        print("Replaced oxygen-assets in bootstrap module script directly")

# 6. Global CDN rewrites in HTML attributes and content
html = html.replace('https://cdn.shopify.com/', '/cdn.shopify.com/')
html = html.replace('https://editions-winter-2026.myshopify.com/', '/editions-winter-2026.myshopify.com/')

# 7. Escaped variants inside JSON / stream strings
html = html.replace('https:\\/\\/cdn.shopify.com\\/', '\\/cdn.shopify.com\\/')
html = html.replace('https:\\/\\/editions-winter-2026.myshopify.com\\/', '\\/editions-winter-2026.myshopify.com\\/')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print(f"Localized index.html written successfully ({len(html):,} bytes)")
