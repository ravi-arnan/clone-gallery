#!/usr/bin/env python3
"""
Build localized, clean HTML and JS files for Oryzo clone.
Ensures local asset resolution, neutralizes telemetry, patches Rive WASM URL to local endpoint,
and writes index.html to project root and public/ for static serving.
"""

import os
import re

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

def clean_html(content):
    # Remove external beacon scripts
    content = re.sub(r'<script[^>]*cloudflareinsights\.com[^>]*>.*?</script>', '', content, flags=re.DOTALL)

    # Localize metadata URLs
    content = content.replace("https://oryzo.ai/meta/og_image.png", "/meta/og_image.png")
    content = content.replace("https://oryzo.ai/", "/")
    content = content.replace("https://oryzo.ai", "/")

    return content

def patch_js_bundle():
    js_path = os.path.join(PUBLIC_DIR, "_astro/hoisted.CRsATKbF.js")
    if not os.path.exists(js_path):
        print(f"{js_path} not found!")
        return

    with open(js_path, "r", encoding="utf-8") as f:
        js = f.read()

    # Point Rive wasm to local endpoint
    target_rive = 'p.wasmURL="https://unpkg.com/".concat(_.name,"@").concat(_.version,"/rive.wasm")'
    replacement_rive = 'p.wasmURL="/libs/rive/rive.wasm"'
    if target_rive in js:
        js = js.replace(target_rive, replacement_rive)
        print("Successfully patched Rive wasmURL in hoisted.CRsATKbF.js")

    # Point Vimeo oembed to local endpoint
    target_vimeo = 'let a=`https://${getOembedDomain(n)}/api/oembed.json?url='
    replacement_vimeo = 'let a=`/api/oembed.json?url='
    if target_vimeo in js:
        js = js.replace(target_vimeo, replacement_vimeo)
        print("Successfully patched Vimeo oembed url in hoisted.CRsATKbF.js")

    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js)

def main():
    print("=== Localizing HTML and JS for Oryzo Clone ===")
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

    # Patch JS bundle for offline Rive wasm and Vimeo oembed
    patch_js_bundle()

    print("Successfully built index.html and public/index.html!")

if __name__ == "__main__":
    main()
