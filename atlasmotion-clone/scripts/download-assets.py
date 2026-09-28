#!/usr/bin/env python3
"""
Atlas Motion Assets Downloader
Downloads all HTML pages, CSS, JS, 3D models (.buf), textures, fonts, videos, images, and meta assets
from https://atlasmotion.com/ to build a 100% self-contained, fully animated clone.
"""

import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://atlasmotion.com"
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))

# Target assets to download
ASSETS = [
    # Core Astro bundles
    "/_astro/atlas-testing.BbucaGFz.css",
    "/_astro/hoisted.CysLIoj6.js",
    "/_astro/index.Dtw1uRVs.js",
    "/_astro/orderStorefront.BpL46G_d.js",
    "/_astro/staticInteractions.wQ4pCrWG.js",

    # 3D Binary Models (.buf)
    "/models/CAMERA.buf",
    "/models/DRONE_BASE.buf",
    "/models/DRONE_BLADE.buf",
    "/models/ENGINE_ANIMATION.buf",
    "/models/MOUNTAIN_FG.buf",
    "/models/JDM_part_01.buf",
    "/models/JDM_part_02.buf",
    "/models/JDM_part_03.buf",
    "/models/JDM_part_05.buf",
    "/models/JDM_part_06_a.buf",
    "/models/JDM_part_06_b.buf",
    "/models/JDM_part_07.buf",
    "/models/JDM_part_08.buf",
    "/models/JDM_part_09.buf",
    "/models/JDM_part_10.buf",
    "/models/JDM_part_11.buf",

    # Textures (hero, gallery, robot, terrain, post-processing)
    "/textures/hero/CLOUD_A.webp",
    "/textures/hero/CLOUD_B.webp",
    "/textures/hero/CLOUD_C.webp",
    "/textures/hero/CLOUD_ALPHAS.webp",
    "/textures/hero/BASE.webp",
    "/textures/hero/TERRAIN_BG.webp",
    "/textures/hero/TERRAIN_FG.webp",
    "/textures/hero/TERRAIN_FG_ALPHA.webp",
    "/textures/hero/brush.png",
    "/textures/gallery/1.webp",
    "/textures/gallery/2.webp",
    "/textures/gallery/3.webp",
    "/textures/gallery/4.webp",
    "/textures/gallery/5.webp",
    "/textures/gallery/6.webp",
    "/textures/ROBOT/ROBOT.webp",
    "/textures/ROBOT/ROBOT_2.png",
    "/textures/TERRAIN/HEIGHT.webp",
    "/textures/smaa-search.png",
    "/textures/smaa-area.png",
    "/textures/diffuse.png",
    "/textures/specular.png",
    "/textures/brdf.png",
    "/textures/LDR_RGB1_0.png",

    # Fonts
    "/fonts/SuisseIntl-Book.woff",
    "/fonts/SuisseIntl-Medium.woff",
    "/fonts/SuisseIntl.woff",

    # Videos
    "/videos/video.mp4",
    "/videos/video_MOBILE.mp4",

    # Images
    "/images/home-video-poster.jpg",
    "/images/home-drone-fallback.jpg",
    "/images/home-motor-fallback.jpg",
    "/images/home-thesis.webp",
    "/images/home-thesis_MOBILE.webp",
    "/images/gallery-thumbnails/1_THUMBNAIL.webp",
    "/images/gallery-thumbnails/2_THUMBNAIL.webp",
    "/images/gallery-thumbnails/3_THUMBNAIL.webp",
    "/images/gallery-thumbnails/4_THUMBNAIL.webp",
    "/images/gallery-thumbnails/5_THUMBNAIL.webp",
    "/images/gallery-thumbnails/6_THUMBNAIL.webp",
    "/images/home-build-to-spec__bgimage.webp",
    "/images/home-build-to-spec__bgimage_MOBILE.webp",
    "/images/blog/tested-beyond-the-limit/hero.png",
    "/images/blog/tested-beyond-the-limit/propulsion-system.svg",
    "/images/blog/tested-beyond-the-limit/thrust-over-time.svg",
    "/images/thesis/hero.webp",
    "/images/thesis/hero_MOBILE.webp",
    "/images/order/2207-primary-v2.webp",
    "/images/order/3115-primary-v8.webp",
    "/images/order/4112-primary-v4.webp",

    # Meta
    "/meta/apple-touch-icon.png",
    "/meta/favicon-16x16.png",
    "/meta/favicon-32x32.png",
    "/meta/og_image.jpg",
    "/meta/site.webmanifest",
]

# HTML Routes to download
ROUTES = [
    ("/", "index.html"),
    ("/thesis/", "thesis/index.html"),
    ("/writing/", "writing/index.html"),
    ("/writing/atlas-testing/", "writing/atlas-testing/index.html"),
    ("/contact/", "contact/index.html"),
    ("/order/", "order/index.html"),
    ("/terms-and-conditions/", "terms-and-conditions/index.html"),
    ("/privacy-policy/", "privacy-policy/index.html"),
    ("/non-existent-page-for-404", "404.html"),
]

def download_file(rel_path, target_file, retries=3):
    url = BASE_URL + rel_path if rel_path.startswith("/") else f"{BASE_URL}/{rel_path}"
    os.makedirs(os.path.dirname(target_file), exist_ok=True)

    # If already downloaded and non-empty, skip
    if os.path.exists(target_file) and os.path.getsize(target_file) > 0:
        return rel_path, os.path.getsize(target_file), "EXISTS"

    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Encoding": "identity",
        "Referer": "https://atlasmotion.com/"
    })

    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read()
                with open(target_file, "wb") as f:
                    f.write(data)
                return rel_path, len(data), "OK"
        except Exception as e:
            if attempt == retries:
                return rel_path, 0, f"FAILED: {e}"
            time.sleep(1.0 * attempt)

    return rel_path, 0, "FAILED"

def main():
    print("=== Atlas Motion Asset Downloader ===")
    print(f"Target directory: {OUTPUT_DIR}\n")

    tasks = []
    # Asset tasks
    for a in ASSETS:
        # local path in public/
        local_rel = a.lstrip("/")
        target = os.path.join(OUTPUT_DIR, local_rel)
        tasks.append((a, target))

    # Route tasks
    for route_url, route_dest in ROUTES:
        target = os.path.join(OUTPUT_DIR, route_dest)
        tasks.append((route_url, target))

    print(f"Total files to download: {len(tasks)}")

    success_count = 0
    fail_count = 0
    total_bytes = 0

    with ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(download_file, rel_path, target): (rel_path, target) for rel_path, target in tasks}
        for future in as_completed(futures):
            rel_path, size, status = future.result()
            if "FAILED" in status:
                print(f"[-] {rel_path} -> {status}")
                fail_count += 1
            else:
                size_str = f"{size / 1024:.1f} KB" if size < 1024*1024 else f"{size / (1024*1024):.2f} MB"
                print(f"[+] {rel_path} ({size_str}) -> {status}")
                success_count += 1
                total_bytes += size

    print(f"\nDownload finished!")
    print(f"Successful: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Total downloaded: {total_bytes / (1024 * 1024):.2f} MB")

    if fail_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
