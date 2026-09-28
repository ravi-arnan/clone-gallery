#!/usr/bin/env python3
import os
import re
import json
import urllib.parse

assets = set()
visited_scripts = set()
to_scan_scripts = []

# Base URL for relative oxygen-v2 scripts
OXYGEN_BASE = "https://cdn.shopify.com/oxygen-v2/47215/49013/102837/4351350/assets/"

# 1. Scan raw_page.html
with open("docs/research/raw_page.html", "r", errors="ignore") as f:
    html = f.read()

# Collect URLs from html
urls = re.findall(r'https?://[^\s"\'<>\\]+', html)
for u in urls:
    # clean trailing punctuation or quotes
    u = u.rstrip('",\';\\')
    assets.add(u)

# Collect all oxygen assets mentioned
oxygen_files = re.findall(r'[a-zA-Z0-9_\-\(\)\.]+\.(?:js|css|map)', html)
for of in oxygen_files:
    if not of.startswith("http"):
        to_scan_scripts.append(OXYGEN_BASE + of)

# Also check manifest.js
if os.path.exists("docs/research/manifest.js"):
    with open("docs/research/manifest.js", "r", errors="ignore") as f:
        m_text = f.read()
    for u in re.findall(r'https?://[^\s"\'<>\\]+', m_text):
        assets.add(u.rstrip('",\';\\'))

# Also check Background.js
if os.path.exists("docs/research/Background.js"):
    with open("docs/research/Background.js", "r", errors="ignore") as f:
        bg_text = f.read()
    # Find relative imports like ./HeroScene-BSrKcflv.js
    for sc in re.findall(r'[\'"](\./[^\'"]+\.js)[\'"]', bg_text):
        sc_name = sc.replace("./", "")
        to_scan_scripts.append(OXYGEN_BASE + sc_name)

# Also check editions-winter2026-core.js
if os.path.exists("docs/research/editions-winter2026-core.js"):
    with open("docs/research/editions-winter2026-core.js", "r", errors="ignore") as f:
        core_text = f.read()
    for sc in re.findall(r'[\'"](\./[^\'"]+\.js)[\'"]', core_text):
        sc_name = sc.replace("./", "")
        to_scan_scripts.append(OXYGEN_BASE + sc_name)

print(f"Discovered initial {len(assets)} URLs, {len(to_scan_scripts)} scripts to scan.")

# Categorize assets by extension
EXTENSIONS = {
    '3d': ('.glb', '.gltf', '.bin', '.usdz', '.hdr', '.exr'),
    'rive': ('.riv',),
    'video': ('.mp4', '.webm', '.mov', '.ogg', '.m4v'),
    'audio': ('.mp3', '.wav', '.aac'),
    'font': ('.woff2', '.woff', '.ttf', '.otf', '.eot'),
    'css': ('.css',),
    'js': ('.js', '.mjs'),
    'image': ('.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg', '.ico')
}

categorized = {k: set() for k in EXTENSIONS}
categorized['other'] = set()

for u in assets:
    parsed = urllib.parse.urlparse(u)
    path = parsed.path.lower()
    matched = False
    for cat, exts in EXTENSIONS.items():
        if any(path.endswith(ext) for ext in exts):
            categorized[cat].add(u)
            matched = True
            break
    if not matched and ('/files/' in u or '/3d/' in u or '/videos/' in u or 'cdn.shopify.com' in u):
        categorized['other'].add(u)

summary = {
    'total_urls': len(assets),
    'scripts_to_fetch': list(set(to_scan_scripts)),
    'counts': {k: len(v) for k, v in categorized.items()},
    'assets': {k: sorted(list(v)) for k, v in categorized.items()}
}

with open("docs/research/all_discovered_assets.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print("\nAsset discovery breakdown:")
for cat, count in summary['counts'].items():
    print(f"  {cat}: {count}")
