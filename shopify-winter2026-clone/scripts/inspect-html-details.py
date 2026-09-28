#!/usr/bin/env python3
import re
import json

with open("docs/research/raw_page.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Find all script contents or src
scripts = re.findall(r'<script([^>]*)>(.*?)</script>', content, re.DOTALL)
print(f"Total <script> tags: {len(scripts)}")
for idx, (attrs, body) in enumerate(scripts):
    src_match = re.search(r'src=["\']([^"\']+)["\']', attrs)
    if src_match:
        print(f"Script {idx} (src): {src_match.group(1)}")
    else:
        print(f"Script {idx} (inline, len={len(body)}): {body[:120]}...")

# Find all link tags (stylesheets, preloads, fonts)
links = re.findall(r'<link([^>]+)>', content)
print(f"\nTotal <link> tags: {len(links)}")
for l in links:
    if 'stylesheet' in l or 'preload' in l or 'font' in l or 'icon' in l:
        print(f"Link: {l}")

# Check 3D models detected
with open("docs/research/deep_scan_summary.json", "r") as f:
    data = json.load(f)

print("\n--- Detected 3D models ---")
for m in data['direct_3d'][:20]:
    print(m)

print("\n--- Sample Asset URLs (first 25) ---")
for a in data['all_detected_assets'][:25]:
    print(a)
