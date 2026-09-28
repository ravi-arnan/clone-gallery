#!/usr/bin/env python3
import os
import re

scan_dir = "/home/ravi/Projects/thewatch-clone/public/assets"
all_assets = set()
pattern = re.compile(r'["\'`]([a-zA-Z0-9_\-\.\/]+\.(?:glb|gltf|bin|wasm|hdr|exr|webp|png|jpg|jpeg|svg|mp3|wav|ogg|mp4|webm|woff|woff2|ttf|otf|json))["\'`]', re.IGNORECASE)
url_pattern = re.compile(r'url\([\'"]?([a-zA-Z0-9_\-\.\/]+\.(?:woff|woff2|ttf|otf|png|jpg|webp|svg))[\'"]?\)', re.IGNORECASE)

for fname in os.listdir(scan_dir):
    fpath = os.path.join(scan_dir, fname)
    if os.path.isfile(fpath):
        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            for m in pattern.findall(content):
                all_assets.add(m)
            for m in url_pattern.findall(content):
                all_assets.add(m)

print(f"Total matches found: {len(all_assets)}")
for a in sorted(all_assets):
    print(a)
