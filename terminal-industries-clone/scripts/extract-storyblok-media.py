import json
import re

with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    html = f.read()

# Find all storyblok assets (images, videos, etc.)
raw_matches = re.findall(r'https://a\.storyblok\.com/[^\s"\'()<>\\]+', html)
storyblok_assets = set()
for url in raw_matches:
    u = url.replace(r"\u002F", "/").replace("\\", "").rstrip('"\'')
    storyblok_assets.add(u)

print("Total Storyblok assets found:", len(storyblok_assets))
for a in sorted(storyblok_assets):
    print(" ", a)

with open("scripts/storyblok-assets.json", "w") as f:
    json.dump(sorted(list(storyblok_assets)), f, indent=2)
