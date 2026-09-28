#!/usr/bin/env python3
import re
import json
import os
from urllib.parse import urljoin, urlparse

raw_path = "docs/research/raw_page.html"
with open(raw_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

base_url = "https://www.shopify.com"

# 1. Scripts
scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', content)
print(f"Found {len(scripts)} script tags")

# 2. Stylesheets
styles = re.findall(r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']', content)
styles += re.findall(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']', content)
print(f"Found {len(styles)} stylesheet tags")

# 3. Images
imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', content)
imgs += re.findall(r'<img[^>]+srcset=["\']([^"\']+)["\']', content)
# unpack srcset
all_img_urls = set()
for img in imgs:
    parts = img.split(",")
    for p in parts:
        clean = p.strip().split(" ")[0]
        if clean:
            all_img_urls.add(clean)

# 4. Videos & Audio
videos = re.findall(r'<video[^>]+src=["\']([^"\']+)["\']', content)
videos += re.findall(r'<source[^>]+src=["\']([^"\']+)["\']', content)
print(f"Found {len(videos)} video sources")

# 5. Search for 3D models, shaders, canvas, gsap, etc. in content
models_3d = set(re.findall(r'https?://[^\s"\'<>]+\.(?:glb|gltf|bin|splinecode|spline|hdr|exr|usdz)', content, re.IGNORECASE))
models_3d_relative = set(re.findall(r'["\'](/[^"\'<>]+\.(?:glb|gltf|bin|splinecode|spline|hdr|exr|usdz))["\']', content, re.IGNORECASE))
print(f"Direct 3D model links in HTML: {len(models_3d) + len(models_3d_relative)}")

# Search for any references to three, gsap, lenis, spline, webgl
keywords = ['gsap', 'ScrollTrigger', 'three', 'webgl', 'spline', 'rive', 'draco', 'shader', 'canvas', 'remix', 'hydrogen']
found_kw = {}
for kw in keywords:
    matches = len(re.findall(re.escape(kw), content, re.IGNORECASE))
    found_kw[kw] = matches
print("Keyword counts in HTML:", found_kw)

# Search for CDN URLs or assets in JSON blocks (window.__remixContext or similar)
asset_extensions = r'\.(?:png|jpg|jpeg|webp|avif|svg|gif|mp4|webm|mov|mp3|ogg|wav|glb|gltf|bin|hdr|exr|woff2|woff|ttf)'
all_potential_assets = set(re.findall(r'https?://[^\s"\'<>\\]+?' + asset_extensions, content, re.IGNORECASE))
print(f"Found {len(all_potential_assets)} absolute asset URLs matching extensions")

# Save scan summary
summary = {
    "scripts": scripts,
    "stylesheets": list(set(styles)),
    "images_in_html": list(all_img_urls),
    "videos": list(set(videos)),
    "direct_3d": list(models_3d.union(models_3d_relative)),
    "keywords": found_kw,
    "all_detected_assets": list(all_potential_assets)
}

with open("docs/research/deep_scan_summary.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print("Scan complete. Summary written to docs/research/deep_scan_summary.json")
