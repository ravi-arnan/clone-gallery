#!/usr/bin/env python3
"""
Comprehensive Asset Downloader for Lando Norris Clone (https://landonorris.com/)
Downloads 100% of HTML, CSS, JS, Fonts, 3D Models (.glb), HDRIs (.hdr),
MSDF Fonts, Draco decoders, Rive animations (.riv, .wasm), Textures, and Webflow assets
for an authentic, fully-animated offline replica.
"""

import os
import sys
import time
import re
import json
from urllib.parse import urlparse
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")
RESEARCH_DIR = os.path.join(PROJECT_DIR, "docs/research")

# 1. 3D GL, Rive, and Engine Assets
OFFBRAND_ASSETS = [
    # Core Engine & Transitions
    "https://lando.itsoffbrand.io/dev-js/lando-by-OFF+BRAND.05.js",
    "https://assets.itsoffbrand.io/lando/dev-js/transitions-rive-isolate.js",

    # Rive Animations
    "https://lando.itsoffbrand.io/rive/page-transition.riv",
    "https://lando.itsoffbrand.io/rive/reef.riv",
    "https://lando.itsoffbrand.io/rive/phrases.riv",
    "https://lando.itsoffbrand.io/rive/signature.riv",
    "https://lando.itsoffbrand.io/rive/ln4.riv",
    "https://lando.itsoffbrand.io/rive/circuits.riv",
    "https://lando.itsoffbrand.io/rive/btn-ui.riv",
    "https://lando.itsoffbrand.io/rive/mob-landscape.riv",

    # Rive WASM
    "https://unpkg.com/@rive-app/canvas-lite@2.26.4/rive.wasm",

    # 3D GLB Models
    "https://lando.itsoffbrand.io/gl/models/helmet-21.glb",
    "https://lando.itsoffbrand.io/gl/models/disco-02.glb",
    "https://lando.itsoffbrand.io/gl/models/sotd.glb",
    "https://lando.itsoffbrand.io/gl/models/tracks/tracks-06-test.glb",

    # HDRI Lighting Maps
    "https://lando.itsoffbrand.io/gl/hdri/studio_small_08_1k--light.hdr",
    "https://lando.itsoffbrand.io/gl/hdri/studio_small_08_1k--faded.hdr",
    "https://lando.itsoffbrand.io/gl/hdri/studio_small_08_1k--dark.hdr",

    # MSDF 3D Fonts
    "https://lando.itsoffbrand.io/gl/fonts/Brier-Bold-02.webp",
    "https://lando.itsoffbrand.io/gl/fonts/Brier-Bold-msdf.json",
    "https://lando.itsoffbrand.io/gl/fonts/MonaSans-Bold-02.webp",
    "https://lando.itsoffbrand.io/gl/fonts/MonaSans-Bold-msdf.json",

    # Draco Decoder WASM & Wrapper
    "https://lando.itsoffbrand.io/gl/draco/draco_decoder.wasm",
    "https://lando.itsoffbrand.io/gl/draco/draco_wasm_wrapper.js",

    # 3D Textures
    "https://lando.itsoffbrand.io/gl/textures/head/webp/diffuse.webp",
    "https://lando.itsoffbrand.io/gl/textures/head/webp/depth.webp",
    "https://lando.itsoffbrand.io/gl/textures/head/webp/alpha.webp",
    "https://lando.itsoffbrand.io/gl/textures/head/webp/normal.webp",
    "https://lando.itsoffbrand.io/gl/textures/head/webp/roughness.webp",
    "https://lando.itsoffbrand.io/gl/textures/head/webp/shadow.webp",
    "https://lando.itsoffbrand.io/gl/textures/head/webp/shadow-softer-edit.webp",
    "https://lando.itsoffbrand.io/gl/textures/head/webp/shadow-to-zip-edit.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/gold/Norris_Helmet_mat_BaseColor.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/disco/Norris_Helmet_mat_BaseColor.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/Norris_Helmet_mat_Normal.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/Norris_Helmet_mat_Roughness.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/Norris_Helmet_mat_Metallic.webp",
    "https://lando.itsoffbrand.io/gl/textures/glass/webp/Norris_Glass_mat_BaseColor.webp",
    "https://lando.itsoffbrand.io/gl/textures/glass/webp/Norris_Glass_mat_Normal.webp",
    "https://lando.itsoffbrand.io/gl/textures/glass/webp/Norris_Glass_mat_Roughness.webp",
    "https://lando.itsoffbrand.io/gl/textures/glass/webp/Norris_Glass_mat_Metallic.webp",
    "https://lando.itsoffbrand.io/gl/textures/plastic/plastic__matcap-02.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/disco/disco_matcap-01.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/disco/disco_mask-01.webp",
    "https://lando.itsoffbrand.io/gl/textures/helmet/webp/disco/disco_lens-flare-15.webp",
    "https://lando.itsoffbrand.io/gl/textures/noise/noise-03.webp",
    "https://lando.itsoffbrand.io/gl/textures/tracks/lando__matcap-02.webp",
    "https://lando.itsoffbrand.io/gl/textures/not-found/webp/not-found-alpha-6.webp",

    # Cloudfront jQuery
    "https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=67b5a02dc5d338960b17a7e9"
]

def map_url_to_local_path(url):
    parsed = urlparse(url)
    netloc = parsed.netloc
    path = parsed.path.lstrip("/")

    if "unpkg.com" in netloc and "rive.wasm" in path:
        return os.path.join(PUBLIC_DIR, "libs/rive/rive.wasm")
    elif "lando.itsoffbrand.io" in netloc:
        return os.path.join(PUBLIC_DIR, path)
    elif "assets.itsoffbrand.io" in netloc:
        # e.g. lando/dev-js/transitions-rive-isolate.js -> dev-js/transitions-rive-isolate.js
        clean = path.replace("lando/", "")
        return os.path.join(PUBLIC_DIR, clean)
    elif "d3e54v103j8qbb.cloudfront.net" in netloc:
        return os.path.join(PUBLIC_DIR, "js/jquery-3.5.1.min.js")
    elif "cdn.prod.website-files.com" in netloc:
        return os.path.join(PUBLIC_DIR, "cdn-website-files", path)
    else:
        return os.path.join(PUBLIC_DIR, netloc, path)

def collect_all_urls():
    urls = set(OFFBRAND_ASSETS)

    # From original.html
    html_file = os.path.join(PROJECT_DIR, "original.html")
    if os.path.exists(html_file):
        with open(html_file, "r", encoding="utf-8") as f:
            html = f.read()
        for m in re.findall(r'https:\/\/cdn\.prod\.website-files\.com\/[^\s\"\'\<\>]+', html):
            urls.add(m)

    # From network requests
    net_file = os.path.join(RESEARCH_DIR, "network-requests.json")
    if os.path.exists(net_file):
        with open(net_file, "r", encoding="utf-8") as f:
            reqs = json.load(f)
        for r in reqs:
            u = r['url']
            if any(k in u for k in ['cdn.prod.website-files.com', 'lando.itsoffbrand.io', 'assets.itsoffbrand.io', 'unpkg.com/@rive-app', 'cloudfront.net']):
                urls.add(u)

    return sorted(urls)

def download_asset(url):
    local_target = map_url_to_local_path(url)
    os.makedirs(os.path.dirname(local_target), exist_ok=True)

    if os.path.exists(local_target) and os.path.getsize(local_target) > 0:
        return (url, local_target, True, os.path.getsize(local_target), "cached")

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Referer": "https://landonorris.com/",
            "Accept": "*/*"
        }
    )

    retries = 3
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status == 200:
                    data = response.read()
                    with open(local_target, "wb") as f:
                        f.write(data)
                    return (url, local_target, True, len(data), "downloaded")
                else:
                    return (url, local_target, False, response.status, "bad_status")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)
            else:
                return (url, local_target, False, str(e), "error")

def main():
    urls = collect_all_urls()
    print(f"=== Starting Lando Norris Asset Download ({len(urls)} queued) ===")
    start_time = time.time()
    downloaded = 0
    cached = 0
    failed = 0
    total_bytes = 0

    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(download_asset, u): u for u in urls}
        for future in as_completed(futures):
            url_str = futures[future]
            try:
                url_res, local_p, success, info, status = future.result()
                rel_disp = os.path.relpath(local_p, PUBLIC_DIR)
                if success:
                    total_bytes += info
                    if status == "cached":
                        cached += 1
                    else:
                        downloaded += 1
                        print(f"  [OK] /{rel_disp} ({info / 1024:.1f} KB)")
                else:
                    failed += 1
                    print(f"  [FAIL] {url_str} - {info}")
            except Exception as e:
                failed += 1
                print(f"  [ERROR] {url_str} - {e}")

    elapsed = time.time() - start_time
    print("\n=== Download Summary ===")
    print(f"Total time: {elapsed:.2f}s")
    print(f"Downloaded: {downloaded}")
    print(f"Cached: {cached}")
    print(f"Failed: {failed}")
    print(f"Total size: {total_bytes / (1024 * 1024):.2f} MB")

if __name__ == "__main__":
    main()
