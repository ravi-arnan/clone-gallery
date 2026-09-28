import os
import sys
import json
import urllib.parse
import urllib.request
import concurrent.futures

BASE_DIR = '/home/ravi/Projects/sui-clone'
INVENTORY_PATH = os.path.join(BASE_DIR, 'docs/research/assets-inventory.json')
MAP_PATH = os.path.join(BASE_DIR, 'docs/research/url-to-local-map.json')

PUBLIC_DIR = os.path.join(BASE_DIR, 'public')

# Create necessary folders
subdirs = {
    'video': 'videos',
    'font': 'fonts',
    'rive': 'rive',
    'lottie': 'lottie',
    'image': 'images',
    'svg': 'svg',
    'js': 'js',
    'css': 'css',
    'other': 'other'
}

for d in subdirs.values():
    os.makedirs(os.path.join(PUBLIC_DIR, d), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, 'sequences/homepage-scroll'), exist_ok=True)

with open(INVENTORY_PATH, 'r') as f:
    inventory = json.load(f)

url_to_local = {}

def get_filename_from_url(url, category):
    parsed = urllib.parse.urlparse(url)
    unquoted_path = urllib.parse.unquote(parsed.path)
    base = os.path.basename(unquoted_path)
    
    # Specific case for Cloudinary sequence frames
    if 'sequences/homepage-scroll' in url:
        return 'sequences/homepage-scroll/' + base

    if not base or '.' not in base:
        base = f"asset_{abs(hash(url))}"

    # clean safe filename
    safe_base = re_clean(base)
    folder = subdirs.get(category, 'other')
    return f"{folder}/{safe_base}"

def re_clean(name):
    # keep only reasonable chars, but keep extension
    return "".join(c if c.isalnum() or c in '._-' else '_' for c in name)

tasks = []

# Prepare all download tasks
for cat, urls in inventory.items():
    for u in urls:
        # Ignore external analytics / trackers
        if any(ign in u for ign in ['googletagmanager.com', 'google-analytics.com', 'hs-analytics.net', 'hsforms.com', 'hubspot.com', 'slater.app/slater/17378.js', 'slater.app/slater/50689.js', 'slater.app/slater/50007.js']):
            continue

        rel_path = get_filename_from_url(u, cat)
        local_path = os.path.join(PUBLIC_DIR, rel_path)
        url_to_local[u] = '/' + rel_path
        tasks.append((u, local_path))

print(f"Total assets to download: {len(tasks)}")

def download_one(task):
    url, dest = task
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        return (url, True, "cached")
    
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            with open(dest, 'wb') as f:
                f.write(content)
        return (url, True, len(content))
    except Exception as e:
        return (url, False, str(e))

# Run with thread pool
success_count = 0
fail_count = 0

with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(download_one, t): t for t in tasks}
    for i, fut in enumerate(concurrent.futures.as_completed(futures)):
        url, success, info = fut.result()
        if success:
            success_count += 1
            if i % 20 == 0 or i == len(tasks) - 1:
                print(f"[{i+1}/{len(tasks)}] Downloaded: {os.path.basename(futures[fut][1])} ({info})")
        else:
            fail_count += 1
            print(f"FAILED {url}: {info}")

print(f"\nDone! Success: {success_count}, Failed: {fail_count}")

with open(MAP_PATH, 'w') as f:
    json.dump(url_to_local, f, indent=2)

print(f"Saved URL mapping to {MAP_PATH}")
