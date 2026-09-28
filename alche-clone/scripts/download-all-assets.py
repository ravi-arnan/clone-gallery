#!/usr/bin/env python3
"""
Comprehensive Asset Downloader for Alche Studio Clone (https://alche.studio/)
Downloads 100% of HTML routes, Astro JS & CSS bundles, 3D GLB models, CubeTexture environment maps,
Lottie animation JSONs, audio/sound effects (.mp3), showcase videos (.mp4), CMS AVIF cards,
and raster graphics for a 100% offline, fully-animated replica.
"""

import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://alche.studio"
PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

# Complete asset manifest
ASSETS = [
    # Core Astro Bundles (JS & CSS)
    "/_astro/index.DnJ5xLaK.css",
    "/_astro/about.DKIoZJhT.css",
    "/_astro/index.CQ0ApTUm.css",
    "/_astro/about.Bk-C3ZjO.css",
    "/_astro/about.CKFe_wyj.css",
    "/_astro/news.CIol-JvY.css",
    "/_astro/stellla.DlNku1_C.css",
    "/_astro/works.D0SUTMok.css",
    "/_astro/page.SNkKDTDH.js",
    "/_astro/index.astro_astro_type_script_index_0_lang.Cn_goiN_.js",
    "/_astro/index.astro_astro_type_script_index_0_lang.CauODnqH.js",

    # Fonts
    "/_astro/google-sans-code-latin-400-normal.5lTHPz_z.woff2",
    "/_astro/ibm-plex-mono-latin-400-normal.Dm_PoFIZ.woff2",
    "/_astro/ibm-plex-sans-jp-latin-400-normal.CDdMl-oX.woff2",
    "/_astro/ibm-plex-sans-jp-latin-400-normal.D5LEXcjN.woff",

    # 3D Model (.glb)
    "/common/scene.glb",

    # CubeTexture Environment Map
    "/envmap/px.png",
    "/envmap/nx.png",
    "/envmap/py.png",
    "/envmap/ny.png",
    "/envmap/pz.png",
    "/envmap/nz.png",

    # Audio (.mp3)
    "/sounds/bgm.mp3",
    "/sounds/mission_in.mp3",
    "/sounds/typing.mp3",
    "/sounds/works_in.mp3",

    # Videos (.mp4)
    "/top/service/stellla.mp4",
    "/top/service/ue.mp4",
    "/top/service/uefn.mp4",
    "/stellla/kv.mp4",

    # Lottie Animation JSONs
    "/common/loading/bg/data.json",
    "/common/loading/logo/data.json",
    "/top/outro/data.json",

    # Common & Top Graphics
    "/404/ascii_texture.png",
    "/common/loading.svg",
    "/common/alche_logo.svg",
    "/top/logo.png",
    "/top/works-title.png",
    "/top/service-title.png",
    "/top/fortnite.png",
    "/top/ue2.png",
    "/stellla/logo_stellla.png",
    "/favicon.png",
    "/favicon/000.png",
    "/ogp.jpg",

    # About Page Assets
    "/about/main_pic.webp",
    "/about/photos/1.webp",
    "/about/photos/2.webp",
    "/about/photos/3.webp",
    "/about/photos/4.webp",
    "/about/photos/5.webp",
    "/about/photos/6.webp",
    "/about/photos/7.webp",
    "/about/photos/8.webp",
    "/about/photos/9.webp",
    "/about/collaboration/1.png",
    "/about/collaboration/2.png",
    "/about/collaboration/3.png",
    "/about/collaboration/4.png",
    "/about/collaboration/5.png",
    "/about/collaboration/6.png",
    "/about/collaboration/7.png",
    "/about/collaboration/8.png",
    "/about/collaboration/9.png",
    "/about/collaboration/10.png",
    "/about/collaboration/11.png",
    "/about/collaboration/12.png",
    "/about/collaboration/13.png",
    "/about/collaboration/14.png",
    "/about/collaboration/15.png",
    "/about/collaboration/16.png",

    # Stellla Page Assets
    "/stellla/company/1.png",
    "/stellla/company/2.png",
    "/stellla/company/3.png",
    "/stellla/company/4.png",
    "/stellla/points/01.webp",
    "/stellla/points/02.webp",
    "/stellla/points/03.webp",
    "/stellla/function/icons/fortnite.png",
    "/stellla/function/icons/ue2.png",
    "/stellla/function/icons/customize/00.png",
    "/stellla/function/icons/customize/01.png",
    "/stellla/function/icons/customize/02.png",
    "/stellla/function/icons/customize/03.png",
    "/stellla/function/icons/money/00.png",
    "/stellla/function/icons/money/01.png",
    "/stellla/function/icons/money/02.png",
    "/stellla/function/icons/money/03.png",
    "/stellla/function/icons/multiplayer/00.png",
    "/stellla/function/icons/multiplayer/01.png",
    "/stellla/function/icons/multiplayer/02.png",
    "/stellla/function/icons/web/00.png",
    "/stellla/function/icons/web/01.png",
    "/stellla/function/icons/web/02.png",
    "/stellla/function/icons/web/03.png",

    # CMS Portfolio Media (.avif)
    "/cms-media/01M0P0PYDAH4ZV2BNP86F774ZZ-w1200.avif",
    "/cms-media/01M0P0Q40NC0JRQG62315JAEKZ-w1200.avif",
    "/cms-media/01M0P0Q7Y0JJVK0QJC1DEKFCYW-w1200.avif",
    "/cms-media/01M0P0Q7Y0JJVK0QJC1DEKFCYW-w800.avif",
    "/cms-media/01M0P0QEPW33D4YQEFN09K01JW-w1200.avif",
    "/cms-media/01M0P0QEPW33D4YQEFN09K01JW-w800.avif",
    "/cms-media/01M0P0RBSKX29V4DWWXHT6GCYS-w1200.avif",
    "/cms-media/01M0P0RN92GR6P3GT0V7ZYV8HG-w1200.avif",
    "/cms-media/01M0P0RWQJS08Q2XRVC78DDFWE-w1200.avif",
    "/cms-media/01M0P0RWQJS08Q2XRVC78DDFWE-w800.avif",
    "/cms-media/01M0P0RYEXA8R54HTQB627SEXV-w1200.avif",
    "/cms-media/01M0P0RYEXA8R54HTQB627SEXV-w800.avif",
    "/cms-media/01M0P0SVF5XHVWD2JZA940M1PC-w1200.avif",
    "/cms-media/01M0P0SVF5XHVWD2JZA940M1PC-w800.avif",
    "/cms-media/01M0P0V5S683FHKG4TEWAEX91P-w1200.avif",
    "/cms-media/01M0P0VBMNY3NMZ4T26YM10ST5-w1200.avif",
    "/cms-media/01M0P0VFNSP0Y409T4K5BAE240-w1200.avif",
    "/cms-media/01M0P0W6DWRKC22KF6651ZHGM0-w1200.avif",
    "/cms-media/01M0P0WAWX2PY1KCC0NMG6H21H-w1200.avif",
    "/cms-media/01M0P0WD8XM7VP4CEF6KA8HCTA-w1200.avif",
    "/cms-media/01M0P0WHRCZVQ51VE2MY08YG93-w1200.avif",
    "/cms-media/01M0P0WHRCZVQ51VE2MY08YG93-w800.avif",
    "/cms-media/01M0P0WVNF8RJ12TMGF53RJ9T9-w1200.avif",
    "/cms-media/01M0P0X25ZPDW8AEE00EY4D0M8-w1200.avif"
]

# HTML routes to download & localize
HTML_ROUTES = [
    ("", "index.html"),
    ("about/", "about/index.html"),
    ("news/", "news/index.html"),
    ("works/", "works/index.html"),
    ("stellla/", "stellla/index.html"),
    ("contact/", "contact/index.html"),
    ("privacypolicy/", "privacypolicy/index.html"),
    ("license/", "license/index.html"),
    # Featured Works Details
    ("works/detail/997ia9e6cty7/", "works/detail/997ia9e6cty7/index.html"),
    ("works/detail/lqlwmmtrsd6s/", "works/detail/lqlwmmtrsd6s/index.html"),
    ("works/detail/8ekyy7vviu/", "works/detail/8ekyy7vviu/index.html"),
    ("works/detail/uqdzssjeiox/", "works/detail/uqdzssjeiox/index.html"),
    ("works/detail/05tscxftkq/", "works/detail/05tscxftkq/index.html"),
    ("works/detail/x-7xjmugndty/", "works/detail/x-7xjmugndty/index.html")
]

def download_file(rel_path, target_root=PUBLIC_DIR, prefix=BASE_URL):
    url = f"{prefix}{rel_path}"
    # local path
    clean_path = rel_path.lstrip("/")
    local_file = os.path.join(target_root, clean_path)
    os.makedirs(os.path.dirname(local_file), exist_ok=True)

    if os.path.exists(local_file) and os.path.getsize(local_file) > 0:
        return (rel_path, True, os.path.getsize(local_file), "cached")

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Referer": "https://alche.studio/"
    }

    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            with open(local_file, "wb") as f:
                f.write(content)
            return (rel_path, True, len(content), "downloaded")
    except Exception as e:
        return (rel_path, False, 0, str(e))

def download_html(route, filename):
    url = f"{BASE_URL}/{route}"
    local_file = os.path.join(PROJECT_DIR, filename)
    os.makedirs(os.path.dirname(local_file), exist_ok=True)

    headers = {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode("utf-8")
            with open(local_file, "w", encoding="utf-8") as f:
                f.write(content)
            return (filename, True, len(content), "ok")
    except Exception as e:
        return (filename, False, 0, str(e))

def main():
    print(f"=== Starting Alche Studio Asset Downloader ===")
    print(f"Target Base: {BASE_URL}")
    print(f"Public Directory: {PUBLIC_DIR}")
    print(f"Total Assets: {len(ASSETS)}")
    print(f"Total HTML Routes: {len(HTML_ROUTES)}")

    start_time = time.time()
    total_bytes = 0
    success_count = 0
    fail_count = 0

    # 1. Download HTML routes
    print("\n--- Downloading HTML Routes ---")
    for route, fname in HTML_ROUTES:
        fn, ok, size, msg = download_html(route, fname)
        if ok:
            print(f"  [OK] {fname} ({size:,} chars)")
        else:
            print(f"  [FAIL] {fname}: {msg}")

    # 2. Download Static & 3D Assets (Multi-threaded)
    print("\n--- Downloading Static & 3D Assets ---")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_file, asset): asset for asset in ASSETS}
        for future in as_completed(futures):
            asset_path = futures[future]
            try:
                path, ok, size, status = future.result()
                if ok:
                    success_count += 1
                    total_bytes += size
                    print(f"  [{status.upper()}] {path} ({size:,} bytes)")
                else:
                    fail_count += 1
                    print(f"  [FAILED] {path}: {status}")
            except Exception as e:
                fail_count += 1
                print(f"  [EXC] {asset_path}: {e}")

    # 3. Download Typekit SDK
    print("\n--- Downloading Typekit SDK ---")
    tk_res, tk_ok, tk_size, tk_msg = download_file("/ukr2yqt.js", target_root=os.path.join(PUBLIC_DIR, "typekit"), prefix="https://use.typekit.net")
    if tk_ok:
        print(f"  [OK] Typekit script downloaded ({tk_size:,} bytes)")

    elapsed = time.time() - start_time
    print(f"\n==========================================")
    print(f"Download Summary:")
    print(f"  Successful: {success_count} / {len(ASSETS)}")
    print(f"  Failed: {fail_count}")
    print(f"  Total Data Size: {total_bytes / (1024*1024):.2f} MB")
    print(f"  Elapsed Time: {elapsed:.2f}s")
    print(f"==========================================")

    if fail_count > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
