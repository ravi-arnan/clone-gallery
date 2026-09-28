#!/usr/bin/env python3
import os
import urllib.request

special_urls = [
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/studio_small_09_1k.pmrem.ktx2?v=1765211412",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/hat-sobel.webp?v=1764710703",
    "https://cdn.shopify.com/3d/models/362039553a5d18aa/coin-reduced.glb",
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.wasm",
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_wasm_wrapper.js",
    "https://www.gstatic.com/draco/versioned/decoders/1.5.6/draco_decoder.js"
]

import urllib.parse
PUBLIC_DIR = os.path.abspath("public")

for u in special_urls:
    parsed = urllib.parse.urlparse(u)
    domain = parsed.netloc
    path = parsed.path.lstrip('/')
    dest = os.path.join(PUBLIC_DIR, domain, path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        print(f"Already exists: {path}")
        continue
    try:
        req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(dest, "wb") as f:
                f.write(content)
        print(f"Downloaded {path} ({len(content):,} bytes)")
    except Exception as e:
        print(f"Failed {u}: {e}")
