#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
from urllib.parse import urlparse
from concurrent.futures import ThreadPoolExecutor, as_completed

MANIFEST_PATH = "/home/ravi/Projects/era-residence-clone/docs/research/assets-manifest.json"
PUBLIC_DIR = "/home/ravi/Projects/era-residence-clone/public"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Referer": "https://www.era-residence.com/"
}

def url_to_local_path(url):
    p = urlparse(url)
    rel_path = p.netloc + p.path
    # Strip trailing slash if any
    if rel_path.endswith("/"):
        rel_path = rel_path[:-1] + "/index.html"
    local_path = os.path.join(PUBLIC_DIR, rel_path)
    return local_path

def download_asset(url):
    local_path = url_to_local_path(url)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return (url, True, "Already exists", os.path.getsize(local_path))

    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = resp.read()
            with open(local_path, "wb") as f:
                f.write(data)
            return (url, True, "Downloaded", len(data))
    except Exception as e:
        return (url, False, str(e), 0)

def main():
    if not os.path.exists(MANIFEST_PATH):
        print(f"Manifest not found at {MANIFEST_PATH}")
        sys.exit(1)

    with open(MANIFEST_PATH) as f:
        assets = json.load(f)

    print(f"Starting download of {len(assets)} assets into {PUBLIC_DIR}...")
    
    success = 0
    failed = 0
    total_bytes = 0

    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_asset, url): url for url in assets}
        for i, future in enumerate(as_completed(futures)):
            url, ok, msg, size = future.result()
            if ok:
                success += 1
                total_bytes += size
                if i % 25 == 0 or i == len(assets) - 1:
                    print(f"[{i+1}/{len(assets)}] OK: {url.split('/')[-1][:40]} ({size} bytes)")
            else:
                failed += 1
                print(f"[{i+1}/{len(assets)}] FAIL: {url} -> {msg}")

    print("\nDownload Summary:")
    print(f"  Total Assets: {len(assets)}")
    print(f"  Successful: {success}")
    print(f"  Failed: {failed}")
    print(f"  Total Size: {total_bytes / (1024 * 1024):.2f} MB")

if __name__ == "__main__":
    main()
