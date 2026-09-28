#!/usr/bin/env python3
import os
import sys
import json
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

# Load discovered assets
with open("docs/research/all_discovered_assets.json", "r") as f:
    data = json.load(f)

# Priority asset categories: 3d, rive, font, css, theatre json
theatre_jsons = [
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/HeroScene.theatre-project-state_15.json?v=1787919811",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/AgenticScene.theatre-project-state.json?v=1787920786",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/SidekickScene.theatre-project-state_14_910d17ff-f5fb-4da0-920e-1b66f8d229b3.json?v=1787919817",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/ShopAppScene.theatre-project-state_8.json?v=1787919812",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/OnlineScene.theatre-project-state_1_5a646934-a79e-49ac-80a9-825d8a3fb221.json?v=1787919820",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/RetailScene.theatre-project-state-cs-251209v2_b28f3c6c-7ab6-4036-9ac4-9f48df3024f0.json?v=1787919819",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/B2BScene.theatre-project-state_4.json?v=1787919812",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/FinanceScene.theatre-project-state_7.json?v=1787919808",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/MarketingScene.theatre-project-state_12.json?v=1787919811",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/DeveloperScene.theatre-project-state_5.json?v=1787919812",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/OperationsScene.theatre-project-state_8.json?v=1787919818",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/ShippingScene.theatre-project-state_12.json?v=1787919820",
    "https://cdn.shopify.com/s/files/1/0951/3130/4218/files/CheckoutScene.theatre-project-state_13.json?v=1787919821"
]

all_urls = []
# 1. Theatre state JSONs
all_urls.extend(theatre_jsons)

# 2. 3D models (GLB models priority)
all_urls.extend(data['assets'].get('3d', []))

# 3. Rive animations
all_urls.extend(data['assets'].get('rive', []))

# 4. Fonts
all_urls.extend(data['assets'].get('font', []))

# 5. CSS
all_urls.extend(data['assets'].get('css', []))

# 6. Top videos & showcase videos
all_urls.extend(data['assets'].get('video', []))

# 7. Images (up to all detected images)
all_urls.extend(data['assets'].get('image', []))

# Deduplicate
all_urls = list(dict.fromkeys(all_urls))

print(f"Total unique target assets to download: {len(all_urls)}")

PUBLIC_DIR = os.path.abspath("public")

def url_to_local_path(url):
    parsed = urllib.parse.urlparse(url)
    domain = parsed.netloc
    # Strip leading slash
    path = parsed.path.lstrip('/')
    # If path is empty, use domain name
    if not path:
        path = "index.html"
    return os.path.join(PUBLIC_DIR, domain, path)

def download_one(url):
    local_path = url_to_local_path(url)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return (url, True, "already exists", os.path.getsize(local_path))
    
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    temp_path = local_path + ".tmp"
    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
        "Referer": "https://www.shopify.com/"
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read()
            with open(temp_path, "wb") as f:
                f.write(content)
            os.replace(temp_path, local_path)
            return (url, True, "downloaded", len(content))
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return (url, False, str(e), 0)

max_workers = 8
success_count = 0
fail_count = 0
total_bytes = 0

print(f"Starting multi-threaded download with {max_workers} workers...")
with ThreadPoolExecutor(max_workers=max_workers) as executor:
    futures = {executor.submit(download_one, u): u for u in all_urls}
    for i, future in enumerate(as_completed(futures)):
        url, success, msg, size = future.result()
        if success:
            success_count += 1
            total_bytes += size
            if i % 25 == 0 or size > 500000:
                print(f"[{i+1}/{len(all_urls)}] OK ({size:,} B) - {os.path.basename(urllib.parse.urlparse(url).path)}")
        else:
            fail_count += 1
            # print only non-404 or critical fails
            if "404" not in msg:
                print(f"[{i+1}/{len(all_urls)}] FAIL - {url} : {msg}")

print(f"\nDownload completed: {success_count} succeeded, {fail_count} failed.")
print(f"Total downloaded size: {total_bytes / (1024*1024):.2f} MB")
