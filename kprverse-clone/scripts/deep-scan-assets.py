#!/usr/bin/env python3
import os
import sys
import re
import json
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
NUXT_DIR = os.path.join(PUBLIC_DIR, "_nuxt")

BASE_URL = "https://kprverse.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://kprverse.com/"
}

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(NUXT_DIR, exist_ok=True)

def fetch_url(url):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as res:
            return res.read()
    except Exception as e:
        return None

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, url, local_path, "already exists"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=25) as res, open(local_path, "wb") as f:
            f.write(res.read())
        return True, url, local_path, "downloaded"
    except Exception as e:
        return False, url, local_path, str(e)

def main():
    print("=== Step 1: Fetching main index.html ===")
    index_html = fetch_url(BASE_URL)
    if not index_html:
        # Fallback to /tmp/kpr.html
        if os.path.exists("/tmp/kpr.html"):
            with open("/tmp/kpr.html", "rb") as f:
                index_html = f.read()
    
    with open(os.path.join(ROOT_DIR, "index.html"), "wb") as f:
        f.write(index_html)
    
    html_text = index_html.decode("utf-8", errors="ignore")

    print("=== Step 2: Discovering _nuxt bundles from HTML ===")
    nuxt_matches = set(re.findall(r"/_nuxt/[a-zA-Z0-9_\-\.]+\.(?:js|css|svg|png|jpg|webp|woff2|woff)", html_text))
    print(f"Found {len(nuxt_matches)} _nuxt links in HTML")

    nuxt_tasks = []
    for item in sorted(nuxt_matches):
        url = BASE_URL + item
        local_path = os.path.join(PUBLIC_DIR, item.lstrip("/"))
        nuxt_tasks.append((url, local_path))

    print(f"Downloading {len(nuxt_tasks)} _nuxt files with 8 threads...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in nuxt_tasks}
        for f in as_completed(futures):
            ok, url, path, msg = f.result()
            if not ok:
                print(f"  [WARN] Failed {url}: {msg}")

    print("=== Step 3: Deep scanning all JS, CSS, and HTML for all asset references ===")
    discovered_assets = set()

    # Search in all downloaded .js, .css, and index.html
    all_content_files = [os.path.join(ROOT_DIR, "index.html")]
    for root, dirs, files in os.walk(NUXT_DIR):
        for file in files:
            if file.endswith((".js", ".css")):
                all_content_files.append(os.path.join(root, file))

    pattern_static = re.compile(r"""(?:["'])(/(?:images|audio|videos|gltf|data|svg|fonts|draco)/[^"'\s>]+?\.(?:glb|gltf|bin|hdr|ktx|webp|png|jpg|jpeg|svg|mp3|wav|ogg|mp4|webm|json|woff2|woff|ttf))(?:\?[^"'\s>]*)?(?:["'])""")

    for cfile in all_content_files:
        try:
            with open(cfile, "r", encoding="utf-8", errors="ignore") as f:
                c = f.read()
            matches = pattern_static.findall(c)
            for m in matches:
                # clean #json, #texture or fragments
                clean_m = m.split("#")[0].split("?")[0]
                discovered_assets.add(clean_m)
        except Exception as e:
            pass

    print(f"Direct static assets found from code: {len(discovered_assets)}")

    # Add systematic 3D GLB variations
    scenes = [
        "tableaux-keep",
        "tableaux-factions",
        "tableaux-universe",
        "project",
        "collection"
    ]
    res_list = ["2048", "1024", "mobile"]
    for scene in scenes:
        for res in res_list:
            if scene.startswith("tableaux"):
                discovered_assets.add(f"/gltf/compressed/etc1s/{scene}/{scene}-{res}.glb")
                discovered_assets.add(f"/gltf/compressed/etc1s/{scene}/{scene}-{res}-fallback.glb")
                discovered_assets.add(f"/gltf/uncompressed/{scene}/{scene}-{res}.glb")
                discovered_assets.add(f"/gltf/{scene}/{scene}-{res}.glb")
            else:
                discovered_assets.add(f"/gltf/compressed/etc1s/{scene}/{scene}-{res}.glb")
                discovered_assets.add(f"/gltf/compressed/etc1s/{scene}/{scene}.glb")
                discovered_assets.add(f"/gltf/uncompressed/{scene}/{scene}.glb")

    # Add Draco decoder files
    draco_files = [
        "/draco/draco_decoder.wasm",
        "/draco/draco_wasm_wrapper.js",
        "/draco/draco_decoder.js",
        "/draco/gltf/draco_decoder.wasm",
        "/draco/gltf/draco_wasm_wrapper.js"
    ]
    for df in draco_files:
        discovered_assets.add(df)

    # Add KTX2 transcoder files if any
    basis_files = [
        "/basis/basis_transcoder.js",
        "/basis/basis_transcoder.wasm"
    ]
    for bf in basis_files:
        discovered_assets.add(bf)

    print(f"Total candidate asset paths to verify & download: {len(discovered_assets)}")

    asset_tasks = []
    for asset_path in sorted(discovered_assets):
        url = BASE_URL + asset_path
        local_path = os.path.join(PUBLIC_DIR, asset_path.lstrip("/"))
        asset_tasks.append((url, local_path))

    success = 0
    fail = 0
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in asset_tasks}
        for f in as_completed(futures):
            ok, url, path, msg = f.result()
            rel = os.path.relpath(path, PUBLIC_DIR)
            if ok:
                success += 1
                size = os.path.getsize(path)
                print(f"  [OK] ({size:,} B) {rel}")
            else:
                fail += 1
                # Only log non-404 or important failures

    print(f"\nAsset discovery summary: {success} downloaded successfully, {fail} 404/skipped.")

if __name__ == "__main__":
    main()
