#!/usr/bin/env python3
"""
Comprehensive Asset Downloader for Pear Clone (https://pear.no/)
Downloads 100% of HTML, CSS, JS, Fonts, Showcase Videos (.mp4), Manifests, Posters,
and all interactive WebGL sequence frames (.webp) for 100% offline, fully-animated replica.
"""

import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://pear.no"
PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

# 1. Base Static Assets
BASE_ASSETS = [
    # Core Bundles
    "/assets/index-Bd_JnIbr.css",
    "/assets/index-BhJdAf8K.js",

    # Fonts
    "/fonts/FlechaL-Light.woff2",
    "/fonts/FlechaL-Regular.woff2",
    "/fonts/FlechaM-Regular.woff",
    "/fonts/FlechaM-Regular.woff2",
    "/fonts/FlechaM-Light.woff",
    "/fonts/FlechaM-Light.woff2",
    "/fonts/FlechaS-Light.woff2",
    "/fonts/FlechaS-Regular.woff2",
    "/fonts/GTStandardL-Medium.woff2",
    "/fonts/GTStandardL-Regular.woff2",
    "/fonts/GTStandardMono-Regular.woff2",

    # Videos (.mp4)
    "/films/footer-loop.mp4",
    "/films/reveal.mp4",
    "/films/signal.mp4",
    "/films/colossus.mp4",

    # Video Posters & Art
    "/films/footer-loop-poster.jpg",
    "/films/reveal-poster.jpg",
    "/films/signal-poster.jpg",
    "/films/colossus-poster.jpg",
    "/art/scaffold_expand.jpg",
    "/favicon.svg",
    "/favicon-32.png",
    "/apple-touch-icon.png",
    "/og.jpg",

    # Model Manifests
    "/films/model/renaissance/manifest.json",
    "/films/model/v28/manifest.json",
    "/films/model/v51/manifest.json",
    "/films/model/v61/manifest.json"
]

# 2. Generate all frame sequences
SEQUENCE_SPECS = [
    # (prefix, count)
    ("/films/coda", 89),
    ("/films/flysky", 121),
    ("/films/plan", 121),
    ("/films/trans", 121),
    ("/films/tree", 121),
    ("/films/model/renaissance/1440", 362),
    ("/films/model/v61/1440", 121),
    ("/films/model/v28/1440", 121),
    ("/films/model/v51/1440", 121),
    # Mobile tier primary
    ("/films/coda/768", 89),
    ("/films/flysky/768", 121),
    ("/films/plan/768", 121),
    ("/films/trans/768", 121),
    ("/films/tree/768", 121),
    ("/films/model/renaissance/768", 362),
    ("/films/model/v61/768", 121),
]

def build_manifest():
    manifest = list(BASE_ASSETS)
    for prefix, count in SEQUENCE_SPECS:
        for i in range(1, count + 1):
            fname = f"f_{str(i).zfill(3)}.webp"
            manifest.append(f"{prefix}/{fname}")
    return manifest

def download_file(rel_path, target_root=PUBLIC_DIR, prefix=BASE_URL):
    url = f"{prefix}{rel_path}"
    clean_path = rel_path.lstrip("/")
    local_file = os.path.join(target_root, clean_path)
    os.makedirs(os.path.dirname(local_file), exist_ok=True)

    if os.path.exists(local_file) and os.path.getsize(local_file) > 0:
        return (rel_path, True, os.path.getsize(local_file), "cached")

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Referer": "https://pear.no/"
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            with open(local_file, "wb") as f:
                f.write(content)
            return (rel_path, True, len(content), "downloaded")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return (rel_path, False, 0, f"404 Not Found")
        return (rel_path, False, 0, f"HTTP {e.code}")
    except Exception as e:
        return (rel_path, False, 0, str(e))

def download_html():
    url = f"{BASE_URL}/"
    local_file = os.path.join(PROJECT_DIR, "original.html")
    headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode("utf-8")
            with open(local_file, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"[OK] Downloaded original.html ({len(content):,} chars)")
    except Exception as e:
        print(f"[ERR] Failed to download original.html: {e}")

def main():
    print("=== Starting Pear.no Asset Downloader ===")
    download_html()

    all_assets = build_manifest()
    print(f"Total Assets to Process: {len(all_assets)}")

    start_time = time.time()
    total_bytes = 0
    success_count = 0
    fail_count = 0
    missing_assets = []

    with ThreadPoolExecutor(max_workers=16) as executor:
        futures = {executor.submit(download_file, asset): asset for asset in all_assets}
        for future in as_completed(futures):
            asset_path = futures[future]
            try:
                path, ok, size, status = future.result()
                if ok:
                    success_count += 1
                    total_bytes += size
                    if success_count % 100 == 0:
                        print(f"  Progress: {success_count}/{len(all_assets)} downloaded ({(total_bytes / (1024*1024)):.2f} MB)...")
                else:
                    fail_count += 1
                    missing_assets.append((path, status))
            except Exception as e:
                fail_count += 1
                missing_assets.append((asset_path, str(e)))

    elapsed = time.time() - start_time
    print(f"\n==========================================")
    print(f"Download Summary:")
    print(f"  Successful: {success_count} / {len(all_assets)}")
    print(f"  Failed: {fail_count}")
    print(f"  Total Data Size: {total_bytes / (1024*1024):.2f} MB")
    print(f"  Elapsed Time: {elapsed:.2f}s")
    print(f"==========================================")

    if missing_assets:
        print("\nMissing / Failed Assets:")
        for path, reason in missing_assets[:20]:
            print(f"  - {path}: {reason}")
        if len(missing_assets) > 20:
            print(f"  ... and {len(missing_assets) - 20} more")

if __name__ == "__main__":
    main()
