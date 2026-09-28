#!/usr/bin/env python3
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = "/home/ravi/Projects/thewatch-clone"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
BASE_URL = "https://thewatch.60fps.fr"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://thewatch.60fps.fr/"
}

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, url, local_path, "already exists"
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as res:
                ct = res.headers.get("Content-Type", "")
                data = res.read()
                # If server returns HTML fallback for an asset (e.g. 404 page), treat as not found
                if "text/html" in ct and not local_path.endswith(".html"):
                    return False, url, local_path, "404 HTML fallback returned"
                with open(local_path, "wb") as f:
                    f.write(data)
                return True, url, local_path, f"downloaded ({len(data)} bytes)"
        except Exception as e:
            if attempt == 2:
                return False, url, local_path, str(e)

def run_download_tasks(tasks, title, max_workers=8):
    print(f"\n=== {title} ({len(tasks)} files) ===")
    completed = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in tasks}
        for f in as_completed(futures):
            ok, url, path, msg = f.result()
            rel = os.path.relpath(path, ROOT_DIR)
            if ok:
                completed += 1
                print(f"  [OK] {rel}: {msg}")
            else:
                failed += 1
                print(f"  [FAIL] {rel}: {msg}")
    print(f"Done {title}: {completed} successful, {failed} failed.")

def main():
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    # 1. 3D Models & HDR/EXR textures
    heavy_assets = [
        "assets/watch-DXFPNOEl.glb",
        "assets/model-BhXOvGiC.glb",
        "assets/envmap-kW4EmG7W.exr",
        "assets/metal-B47qzO42.exr",
        "assets/sunrise-B8ECBLua.exr",
        "assets/diffuse-DabpxheI.jpg",
        "assets/noise-solid-Lw93M9Kl.png",
    ]
    tasks = [(f"{BASE_URL}/{a}", os.path.join(PUBLIC_DIR, a)) for a in heavy_assets]
    run_download_tasks(tasks, "3D Models & Texture Assets", max_workers=4)

    # 2. Section Images (4 color variants * 5 images = 20 images)
    img_tasks = []
    for cfg in ["first", "second", "third", "fourth"]:
        for i in range(1, 6):
            rel = f"assets/the-watch/img/images-section/{cfg}_{i}.webp"
            img_tasks.append((f"{BASE_URL}/{rel}", os.path.join(PUBLIC_DIR, rel)))
    run_download_tasks(img_tasks, "Product Gallery Images (20 images)", max_workers=6)

    # 3. Parts Images
    part_tasks = []
    for part in ["dial", "hands", "crystal", "bezel", "lugs", "strap", "buckle", "crown", "caseback", "movement"]:
        rel = f"assets/the-watch/img/parts/{part}.jpg"
        part_tasks.append((f"{BASE_URL}/{rel}", os.path.join(PUBLIC_DIR, rel)))
    run_download_tasks(part_tasks, "Watch Mechanism Parts Images", max_workers=4)

    # 4. Fonts
    font_tasks = []
    inter_weights = ["Black", "Bold", "ExtraBold", "ExtraLight", "Light", "Medium", "Regular", "SemiBold", "Thin"]
    for w in inter_weights:
        for ext in ["woff2", "woff", "ttf"]:
            rel = f"assets/fonts/Inter/Inter-{w}.{ext}"
            font_tasks.append((f"{BASE_URL}/{rel}", os.path.join(PUBLIC_DIR, rel)))

    nekst_weights = ["Black", "Bold", "Light", "Medium", "Regular", "SemiBold", "Thin"]
    for w in nekst_weights:
        for ext in ["woff2", "woff", "ttf"]:
            rel = f"assets/fonts/Nekst/Nekst-{w}.{ext}"
            font_tasks.append((f"{BASE_URL}/{rel}", os.path.join(PUBLIC_DIR, rel)))

    run_download_tasks(font_tasks, "Web Fonts (Inter & Nekst)", max_workers=8)

    # Ensure missing part images fallback to dial.jpg if not found
    dial_path = os.path.join(PUBLIC_DIR, "assets/the-watch/img/parts/dial.jpg")
    if os.path.exists(dial_path):
        with open(dial_path, "rb") as f:
            dial_data = f.read()
        for part in ["hands", "crystal", "bezel", "lugs", "strap", "buckle", "crown", "caseback", "movement"]:
            p_path = os.path.join(PUBLIC_DIR, f"assets/the-watch/img/parts/{part}.jpg")
            if not os.path.exists(p_path) or os.path.getsize(p_path) == 0:
                with open(p_path, "wb") as f:
                    f.write(dial_data)
                print(f"  [FALLBACK] Created fallback part image: {part}.jpg")

if __name__ == "__main__":
    main()
