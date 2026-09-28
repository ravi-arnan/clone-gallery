#!/usr/bin/env python3
"""
Comprehensive Asset Downloader for StringTune Clone (https://string-tune.fiddle.digital/)
Downloads 100% of HTML, CSS, JS, Fonts, 3D Models (.glb, .exr), Katana textures, Draco decoders,
Videos (.mp4), Favicons, and Images for a 100% authentic, fully-animated offline replica.
"""

import os
import sys
import time
import re
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://string-tune.fiddle.digital"
PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

ASSETS = [
    # Core Bundles (JS)
    "/_nuxt/entry.ecbf7bdb.js",
    "/_nuxt/default.9c9b6173.js",
    "/_nuxt/IconList.eb73eaa1.js",
    "/_nuxt/GridRow.08569d72.js",
    "/_nuxt/nuxt-link.e60df8fe.js",
    "/_nuxt/index.e3fb11d0.js",
    "/_nuxt/BaseVideo.17b9b97e.js",
    "/_nuxt/CharAvatar.a506e16c.js",
    "/_nuxt/string-storage.34efabf1.js",
    "/_nuxt/index.55a36d6c.js",
    "/_nuxt/MainFooter.9cf989a1.js",
    "/_nuxt/CurrentYear.vue.66e23a3f.js",
    "/_nuxt/SceneCanvas.2950ddea.js",
    "/_nuxt/empty.ffd9963d.js",
    "/_nuxt/error-404.084538b6.js",
    "/_nuxt/error-500.d3b9fa04.js",
    "/_nuxt/index.d1b0689c.js",
    "/_nuxt/database.92a55625.js",
    "/_nuxt/dev-guides.2962b821.js",

    # Core Styles (CSS)
    "/_nuxt/GridRow.aee1d03d.css",
    "/_nuxt/BaseVideo.28a3e9f5.css",
    "/_nuxt/CharAvatar.559e0020.css",
    "/_nuxt/MainFooter.c350568c.css",
    "/_nuxt/SceneCanvas.4fe56d08.css",
    "/_nuxt/index.52748fd2.css",
    "/_nuxt/default.95e9e56d.css",
    "/_nuxt/index.312a1a1b.css",
    "/_nuxt/dev-guides.d37a3659.css",

    # 3D Assets & Environment Maps
    "/models/katana.glb",
    "/models/Wakizashi.glb",
    "/models/lightroom.exr",

    # 3D Katana Textures
    "/models/k_txts/Katana_and_sheath_M_Katana_BaseColor.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Katana_Height.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Katana_Metallic.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Katana_Normal.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Katana_Roughness.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Sheath_BaseColor.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Sheath_Height.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Sheath_Metallic.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Sheath_Normal.1001.jpg",
    "/models/k_txts/Katana_and_sheath_M_Sheath_Roughness.1001.jpg",

    # Draco Decoder Libraries
    "/libs/draco/draco_decoder.wasm",
    "/libs/draco/draco_wasm_wrapper.js",

    # Fonts
    "/fonts/KHTeka-Regular.woff",
    "/fonts/KHTeka-Regular.woff2",
    "/fonts/KHTekaMono-Regular.woff",
    "/fonts/KHTekaMono-Regular.woff2",
    "/fonts/fdsi.eot",
    "/fonts/fdsi.svg",
    "/fonts/fdsi.ttf",
    "/fonts/fdsi.woff",

    # Showcase & Feature Videos
    "/videos/skill-hub-link.mp4",
    "/videos/slash.mp4",
    "/videos/container.mp4",
    "/videos/ripple.mp4",
    "/videos/dev-guides/stdg-presentation.mp4",
    "/videos/tutorials/none.mp4",
    "/videos/tutorials/specials/01.mp4",
    "/videos/tutorials/layouts/01.mp4",
    "/videos/tutorials/layouts/02.mp4",
    "/videos/tutorials/typography/01.mp4",
    "/videos/tutorials/typography/02.mp4",
    "/videos/tutorials/typography/03.mp4",
    "/videos/tutorials/typography/04.mp4",

    # Images & SVG
    "/images/logo-sword.png",
    "/images/r24.svg",
    "/images/r32.svg",
    "/images/r48.svg",
    "/images/r64.svg",
    "/images/string-tune-mask.svg",
    "/images/string-tune-mask-mobile.svg",
    "/images/icons/icon-24_blank.svg",
    "/images/icons/icon-24_download.svg",
    "/images/icons/icon-24_enter.svg",
    "/images/flashing-circle-w.png",
    "/images/general/aika.jpg",
    "/images/general/sensei-oji.jpg",
    "/images/general/aika-8bit-sprite.png",
    "/images/general/footer-polygon-bg.jpg",
    "/images/general/kw.webp",
    "/images/general/oji-8bit-sprite.png",
    "/images/home/bamboo-1.png",
    "/images/home/bamboo-2.png",
    "/images/home/bamboo-3.png",
    "/images/home/bamboo-4.png",
    "/images/home/cloud.jpg",
    "/images/home/flashing-circle-b-half.png",
    "/images/home/flashing-circle-c-half.png",
    "/images/home/flashing-circle.png",
    "/images/home/mask.jpg",
    "/images/home/masonry/control-progress.jpg",
    "/images/home/masonry/fidoru.jpg",
    "/images/home/masonry/ultra-optimized.jpg",
    "/images/home/polygon-bg.jpg",
    "/images/home/storm-graphics-bl.jpg",
    "/images/home/storm-graphics-tr.jpg",
    "/images/home/storm.jpg",
    "/images/home/sword-shadow-bg.png",
    "/images/home/techniques-graphics.jpg",
    "/images/home/tree.png",
    "/share-screen.jpg",

    # Favicons
    "/fav/favicon.ico",
    "/fav/apple-touch-icon-57x57.png",
    "/fav/apple-touch-icon-72x72.png",
    "/fav/apple-touch-icon-114x114.png",
    "/fav/apple-touch-icon-120x120.png",
    "/fav/apple-touch-icon-144x144.png",
    "/fav/apple-touch-icon-152x152.png",
    "/fav/mstile-144x144.png",
]

# Tutorial basics videos 01-16
for i in range(1, 17):
    ASSETS.append(f"/videos/tutorials/basics/{str(i).zfill(2)}.mp4")

def download_file(rel_path, target_root=PUBLIC_DIR, prefix=BASE_URL):
    url = f"{prefix}{rel_path}"
    clean_path = rel_path.lstrip("/")
    local_file = os.path.join(target_root, clean_path)
    os.makedirs(os.path.dirname(local_file), exist_ok=True)

    if os.path.exists(local_file) and os.path.getsize(local_file) > 0:
        return (rel_path, True, os.path.getsize(local_file), "cached")

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Referer": "https://string-tune.fiddle.digital/",
            "Accept": "*/*"
        }
    )

    retries = 3
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status == 200:
                    data = response.read()
                    with open(local_file, "wb") as f:
                        f.write(data)
                    return (rel_path, True, len(data), "downloaded")
                else:
                    return (rel_path, False, response.status, "bad_status")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)
            else:
                return (rel_path, False, str(e), "error")

def main():
    print(f"=== Starting StringTune Asset Download ({len(ASSETS)} queued) ===")
    start_time = time.time()
    downloaded = 0
    cached = 0
    failed = 0
    total_bytes = 0

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(download_file, p): p for p in ASSETS}
        for future in as_completed(futures):
            path_str = futures[future]
            try:
                rel_path, success, info, status = future.result()
                if success:
                    total_bytes += info
                    if status == "cached":
                        cached += 1
                    else:
                        downloaded += 1
                        print(f"  [OK] {rel_path} ({info / 1024:.1f} KB)")
                else:
                    failed += 1
                    print(f"  [FAIL] {rel_path} - {info}")
            except Exception as e:
                failed += 1
                print(f"  [ERROR] {path_str} - {e}")

    elapsed = time.time() - start_time
    print("\n=== Download Summary ===")
    print(f"Total time: {elapsed:.2f}s")
    print(f"Downloaded: {downloaded}")
    print(f"Cached: {cached}")
    print(f"Failed: {failed}")
    print(f"Total size: {total_bytes / (1024 * 1024):.2f} MB")

if __name__ == "__main__":
    main()
