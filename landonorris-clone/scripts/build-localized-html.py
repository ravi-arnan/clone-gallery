#!/usr/bin/env python3
"""
Build localized, clean HTML and JS files for Lando Norris clone.
Localizes asset paths, patches 3D WebGL and Rive paths to local endpoints,
neutralizes telemetry and third-party trackers, and writes index.html.
"""

import os
import re

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

def clean_html(content):
    # Remove tracking scripts
    content = re.sub(r'<script[^>]*google_tags_first_party.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*gtag\(.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*klaviyo.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*iubenda.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*avljl2rk9q5p.*?</script>', '', content, flags=re.DOTALL)

    # Localize core script tags
    content = content.replace(
        'https://lando.itsoffbrand.io/dev-js/lando-by-OFF+BRAND.05.js',
        '/dev-js/lando-by-OFF+BRAND.05.js'
    )
    content = content.replace(
        'https://assets.itsoffbrand.io/lando/dev-js/transitions-rive-isolate.js',
        '/dev-js/transitions-rive-isolate.js'
    )
    content = content.replace(
        'https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=67b5a02dc5d338960b17a7e9',
        '/js/jquery-3.5.1.min.js'
    )

    # Localize Webflow CDN paths
    content = content.replace(
        'https://cdn.prod.website-files.com/',
        '/cdn-website-files/'
    )

    # Localize origin domain
    content = content.replace('https://landonorris.com/', '/')
    content = content.replace('https://landonorris.com', '/')

    return content

def patch_js_bundle():
    js_path = os.path.join(PUBLIC_DIR, "dev-js/lando-by-OFF+BRAND.05.js")
    if not os.path.exists(js_path):
        print(f"{js_path} not found!")
        return

    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()

    # 1. Patch 3D WebGL asset root
    vQ_target = 'var vQ="https://lando.itsoffbrand.io/gl"'
    vQ_replacement = 'var vQ="/gl"'
    if vQ_target in js:
        js = js.replace(vQ_target, vQ_replacement)
        print("Successfully patched vQ to /gl in lando-by-OFF+BRAND.05.js")

    # 2. Patch Rive asset root
    mj_target = 'mj="https://lando.itsoffbrand.io/rive/"'
    mj_replacement = 'mj="/rive/"'
    if mj_target in js:
        js = js.replace(mj_target, mj_replacement)
        print("Successfully patched mj to /rive/ in lando-by-OFF+BRAND.05.js")

    # 3. Patch Rive wasm loader
    wasm_target = 'f.wasmURL="https://unpkg.com/".concat(C.name,"@").concat(C.version,"/rive.wasm")'
    wasm_replacement = 'f.wasmURL="/libs/rive/rive.wasm"'
    if wasm_target in js:
        js = js.replace(wasm_target, wasm_replacement)
        print("Successfully patched Rive wasmURL in lando-by-OFF+BRAND.05.js")

    # 4. Patch Webflow schunk and JS script references inside JS if any
    js = js.replace('https://cdn.prod.website-files.com/', '/cdn-website-files/')

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)

def main():
    print("=== Localizing HTML and JS for Lando Norris Clone ===")
    src_file = os.path.join(PROJECT_DIR, "original.html")
    if not os.path.exists(src_file):
        print("original.html not found!")
        return

    with open(src_file, "r", encoding="utf-8") as f:
        content = f.read()

    cleaned = clean_html(content)

    # Write index.html at root
    out_root = os.path.join(PROJECT_DIR, "index.html")
    with open(out_root, "w", encoding="utf-8") as f:
        f.write(cleaned)

    # Write index.html in public/
    out_pub = os.path.join(PUBLIC_DIR, "index.html")
    with open(out_pub, "w", encoding="utf-8") as f:
        f.write(cleaned)

    # Patch JS bundle for offline 3D WebGL and Rive assets
    patch_js_bundle()

    # Clean up temp file if present
    temp_file = os.path.join(PUBLIC_DIR, "lando_offbrand_temp.js")
    if os.path.exists(temp_file):
        os.remove(temp_file)

    print("Successfully built index.html and public/index.html!")

if __name__ == "__main__":
    main()
