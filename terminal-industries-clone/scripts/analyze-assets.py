import re
import json

with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

# Find all URLs and paths
all_assets = set()

# URLs
for m in re.findall(r'https?://[^\s"\'()<>\\]+', text):
    all_assets.add(m.split('?')[0])

# Relative paths
for m in re.findall(r'/(?:static|images|videos|assets|frames|gltf|models)/[^\s"\'()<>\\]+', text):
    all_assets.add(m.split('?')[0])

print(f"Total matched assets: {len(all_assets)}")

categories = {
    "videos": [],
    "images": [],
    "fonts": [],
    "frames": [],
    "storyblok": [],
    "other": []
}

for a in sorted(all_assets):
    lower = a.lower()
    if any(lower.endswith(ext) for ext in [".mp4", ".webm", ".mov"]):
        categories["videos"].append(a)
    elif any(lower.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".ico"]):
        categories["images"].append(a)
    elif any(lower.endswith(ext) for ext in [".woff", ".woff2", ".ttf"]):
        categories["fonts"].append(a)
    elif "frame" in lower or "sequence" in lower:
        categories["frames"].append(a)
    elif "storyblok" in lower:
        categories["storyblok"].append(a)
    else:
        categories["other"].append(a)

for k, v in categories.items():
    print(f"\nCategory {k}: {len(v)} items")
    for item in v[:10]:
        print(f"  {item}")

with open("scripts/extracted-assets.json", "w") as f:
    json.dump(categories, f, indent=2)
