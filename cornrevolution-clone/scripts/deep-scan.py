#!/usr/bin/env python3
import os
import re
import urllib.request

CDN_BASE = "https://d1hl9u9k5hiqxp.cloudfront.net"
BUNDLE_FILES = [
    "loader.76ceb4644b28bd9c30b5.js",
    "main.76ceb4644b28bd9c30b5.js",
    "vendors~main.76ceb4644b28bd9c30b5.js"
]

ROOT_DIR = "/home/ravi/Projects/cornrevolution-clone"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

# 1. Download bundle JS files first
for b in BUNDLE_FILES:
    out_path = os.path.join(PUBLIC_DIR, b)
    if not os.path.exists(out_path):
        print(f"Downloading bundle: {b} ...")
        url = f"{CDN_BASE}/{b}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as res, open(out_path, "wb") as f:
            f.write(res.read())
        print(f"Saved {b} ({os.path.getsize(out_path)} bytes)")

# 2. Scan bundles for all potential asset strings
assets = set()
pattern = re.compile(r'["\'`]([a-zA-Z0-9_\-\.\/]+\.(?:glb|gltf|bin|wasm|hdr|exr|webp|png|jpg|jpeg|svg|mp3|wav|ogg|mp4|webm|woff|woff2|ttf|otf|json|fnt|cur|ico))["\'`]', re.IGNORECASE)
url_pattern = re.compile(r'url\([\'"]?([a-zA-Z0-9_\-\.\/]+\.(?:woff|woff2|ttf|otf|png|jpg|webp|svg|cur))[\'"]?\)', re.IGNORECASE)

for b in BUNDLE_FILES:
    p = os.path.join(PUBLIC_DIR, b)
    with open(p, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
        for m in pattern.findall(content):
            assets.add(m)
        for m in url_pattern.findall(content):
            assets.add(m)

print(f"\nTotal potential asset matches: {len(assets)}")
filtered = sorted([a for a in assets if not a.endswith((".js", ".mjs"))])
for a in filtered:
    print(f"  {a}")

# Save found list to scan_results.txt
with open(os.path.join(ROOT_DIR, "scripts/scan_results.txt"), "w") as f:
    for a in filtered:
        f.write(a + "\n")
