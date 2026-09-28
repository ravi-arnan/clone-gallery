import re
import os
import urllib.parse
import json

base_dir = '/home/ravi/Projects/sui-clone'

html_path = os.path.join(base_dir, 'original.html')
css_path = os.path.join(base_dir, 'public/css/sui-v2.shared.230f7fdb5.min.css')
js_paths = [
    os.path.join(base_dir, 'public/js/slater-17378.js'),
    os.path.join(base_dir, 'public/js/slater-50007.js'),
    os.path.join(base_dir, 'public/js/slater-50689.js'),
    os.path.join(base_dir, 'public/js/sui-v2.schunk.8110c5140c42692b.js'),
    os.path.join(base_dir, 'public/js/sui-v2.schunk.288df1f54663a3bc.js'),
    os.path.join(base_dir, 'public/js/sui-v2.schunk.305741e705aa0ac6.js'),
    os.path.join(base_dir, 'public/js/sui-v2.schunk.d64be42593ba95e6.js'),
    os.path.join(base_dir, 'public/js/sui-v2.schunk.9dfb96661114d3db.js'),
    os.path.join(base_dir, 'public/js/sui-v2.6382a8df.0d93f870390191b1.js'),
]

sources = [html_path, css_path] + js_paths

url_pattern = re.compile(r'https?://[a-zA-Z0-9_\-\.\:\/%]+')

# Extensions we care about
asset_extensions = (
    '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico',
    '.woff', '.woff2', '.ttf', '.otf', '.eot',
    '.mp4', '.webm', '.mov',
    '.riv', '.json',
    '.css', '.js'
)

found_urls = set()

for src in sources:
    if not os.path.exists(src):
        continue
    with open(src, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # 1. Direct URLs
    matches = url_pattern.findall(content)
    for u in matches:
        # Clean up any trailing quotes or syntax
        clean_u = u.rstrip('"\'),;}>\\')
        parsed = urllib.parse.urlparse(clean_u)
        path = parsed.path.lower()
        if any(path.endswith(ext) for ext in asset_extensions):
            found_urls.add(clean_u)

    # 2. Extract background-image:url(...) or src="..." from inline HTML or CSS
    bg_matches = re.findall(r'url\([\'"]?(https?://[^\'")]+)[\'"]?\)', content)
    for u in bg_matches:
        clean_u = u.rstrip('"\'),;}>\\')
        found_urls.add(clean_u)

# Add Cloudinary sequence frames (0 to 75)
for i in range(76):
    frame_url = f"https://res.cloudinary.com/dp6m7thfm/image/upload/sequences/homepage-scroll/frame_{i:04d}.webp"
    found_urls.add(frame_url)

categorized = {
    'video': [],
    'audio': [],
    'font': [],
    'image': [],
    'svg': [],
    'rive': [],
    'lottie': [],
    'css': [],
    'js': [],
    'other': []
}

for u in sorted(found_urls):
    lower = u.lower()
    if lower.endswith(('.mp4', '.webm', '.mov')):
        categorized['video'].append(u)
    elif lower.endswith(('.woff', '.woff2', '.ttf', '.otf', '.eot')):
        categorized['font'].append(u)
    elif lower.endswith('.riv'):
        categorized['rive'].append(u)
    elif lower.endswith('.json'):
        categorized['lottie'].append(u)
    elif lower.endswith('.svg'):
        categorized['svg'].append(u)
    elif lower.endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico')):
        categorized['image'].append(u)
    elif lower.endswith('.css'):
        categorized['css'].append(u)
    elif lower.endswith('.js'):
        categorized['js'].append(u)
    else:
        categorized['other'].append(u)

print("=== ASSET INVENTORY SUMMARY ===")
for cat, urls in categorized.items():
    print(f"{cat.upper()}: {len(urls)} items")

with open(os.path.join(base_dir, 'docs/research/assets-inventory.json'), 'w') as f:
    json.dump(categorized, f, indent=2)

print("\nSaved asset inventory to docs/research/assets-inventory.json")
