#!/usr/bin/env python3
import os
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = "/home/ravi/Projects/cornrevolution-clone"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
BASE_URL = "https://d1hl9u9k5hiqxp.cloudfront.net"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://cornrevolution.resn.global/"
}

def download_file(rel_path):
    local_path = os.path.join(PUBLIC_DIR, rel_path)
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, rel_path, "already exists"

    url = f"{BASE_URL}/{rel_path}"
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as res:
                ct = res.headers.get("Content-Type", "")
                data = res.read()
                # If server returns HTML fallback for binary asset (404 page), treat as fail
                if "text/html" in ct and not rel_path.endswith((".html", ".htm")):
                    return False, rel_path, "404 HTML fallback returned"
                with open(local_path, "wb") as f:
                    f.write(data)
                return True, rel_path, f"downloaded ({len(data)} bytes)"
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return False, rel_path, f"HTTP 404"
            if attempt == 2:
                return False, rel_path, str(e)
        except Exception as e:
            if attempt == 2:
                return False, rel_path, str(e)

def run_download_batch(file_list, title, max_workers=6):
    print(f"\n=== {title} ({len(file_list)} files) ===")
    completed = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(download_file, rel): rel for rel in file_list}
        for f in as_completed(futures):
            ok, rel, msg = f.result()
            if ok:
                completed += 1
                print(f"  [OK] {rel}: {msg}")
            else:
                failed += 1
                print(f"  [FAIL] {rel}: {msg}")
    print(f"Batch completed: {completed} OK, {failed} failed.")

def main():
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    # 1. Bundles and maps
    bundles = [
        "loader.76ceb4644b28bd9c30b5.js",
        "main.76ceb4644b28bd9c30b5.js",
        "vendors~main.76ceb4644b28bd9c30b5.js",
        "loader.76ceb4644b28bd9c30b5.js.map",
        "main.76ceb4644b28bd9c30b5.js.map",
        "vendors~main.76ceb4644b28bd9c30b5.js.map"
    ]
    run_download_batch(bundles, "Core Bundles & Source Maps", max_workers=4)

    # 2. SVGs, Fonts & MSDF Data
    font_and_vector = [
        "svg/svg.svg",
        "fonts/Gilroy/gilroy.json",
        "fonts/Gilroy/gilroy-msdf.png",
        "fonts/Gilroy/3714E1_B_0.woff2",
        "fonts/Gilroy/3714E1_B_0.woff",
        "fonts/Gilroy/3714E1_B_0.ttf",
        "fonts/Manifold/manifold.json",
        "fonts/Manifold/manifold-msdf.png",
        "fonts/Manifold/gradient-map.png",
        "fonts/Manifold/manifold-cf-extra-bold.woff2",
        "fonts/Manifold/manifold-cf-extra-bold.woff",
        "fonts/Manifold/manifold-cf-extra-bold.ttf"
    ]
    run_download_batch(font_and_vector, "Fonts & MSDF Vector Assets", max_workers=4)

    # 3. UI Images & Icons
    ui_images = [
        "images/arrowhead-down.png",
        "images/rotate-icon.png",
        "images/overlay-bg.jpg",
        "images/spinner.png",
        "images/icons/icons-0.png",
        "images/icons/icons-1.png",
        "images/icons/icons-2.png",
        "images/icons/arrow-link.png",
        "images/icons/arrow-link-external.png",
        "images/field/map-grade.png",
        "textures/corteva-logo.png",
        "textures/registered.png",
        "textures/testing/post-noise.png",
        "textures/field/map-field-diffuse-combined0@mipmaps.png",
        "textures/field/map-field-diffuse-0.png"
    ]
    run_download_batch(ui_images, "UI Textures & Spritesheets", max_workers=4)

    # 4. Favicons & Social Cards
    favicons = [
        "favicon/apple-touch-icon.png",
        "favicon/favicon-32x32.png",
        "favicon/favicon-16x16.png",
        "favicon/site.webmanifest",
        "favicon/safari-pinned-tab.svg",
        "favicon/favicon.ico",
        "favicon/browserconfig.xml",
        "fb.jpg",
        "tw.jpg"
    ]
    run_download_batch(favicons, "Favicons & Metadata", max_workers=4)

    # 5. Placeholders (Desktop & Mobile)
    placeholders = []
    for mode in ["desktop", "mobile"]:
        for sec in ["landing", "science", "stalk", "field", "result"]:
            placeholders.append(f"images/placeholder/{mode}/{sec}.jpg")
    run_download_batch(placeholders, "Placeholder Images", max_workers=5)

    # 6. 3D GLTF Models, Buffers & Textures
    models_3d = [
        "models/landing/cobb_test.gltf",
        "models/landing/cobb_test.bin",
        "models/landing/hair.gltf",
        "models/landing/hair.bin",
        "models/kernel/KERNAL.gltf",
        "models/kernel/KERNAL.bin",
        "images/stalk/stalk_rigged3.gltf",
        "images/stalk/stalk_rigged3.bin",
        "images/stalk/SingleStalk12_db.gltf",
        "images/stalk/SingleStalk12_db.bin",
        "images/stalk/SingleStalk2.png",
        "assets/pot3.gltf",
        "assets/pot3.bin",
        "assets/bg_pot.gltf",
        "assets/bg_pot.bin"
    ]
    run_download_batch(models_3d, "3D GLTF Models & Buffers", max_workers=4)

    # 7. Compressed KTX Textures (s3tc and astc formats)
    ktx_base_list = [
        "landing/graded/alpha.ktx",
        "landing/hair/alpha.ktx",
        "landing/graded/TOP_L.ktx",
        "landing/graded/TOP_R.ktx",
        "landing/graded/BOTTOM_L.ktx",
        "landing/graded/BOTTOM_R.ktx",
        "landing/hair/HAIR_TOP_L_.ktx",
        "landing/hair/HAIR_TOP_R_.ktx",
        "landing/hair/HAIR_BOTTOM_L_.ktx",
        "landing/hair/HAIR_BOTTOM_R_.ktx",
        "field/map-ground-diffuse@mipmaps.ktx",
        "field/map-cloud-noise@mipmaps.ktx",
        "kernel/map_diffuse_kernel.ktx",
        "kernel/map_bump_kernel.ktx",
        "kernel/map_matcap_mult.ktx",
        "kernel/map_matcap_screen.ktx",
        "kernel/map_bg.ktx",
        "testing/soil/soil_default@mipmaps.ktx",
        "testing/soil-normal.ktx",
        "testing/soil-displacement.ktx",
        "testing/soil/soil_nutrients_clay@mipmaps.ktx",
        "testing/soil/soil_nutrients_loam@mipmaps.ktx",
        "testing/soil/soil_nutrients_sand@mipmaps.ktx",
        "testing/plantShadow.ktx",
        "testing/bg.ktx",
        "testing/bg_corn.ktx",
        "testing/SingleStalk_DifF_0007@mipmaps.ktx",
        "testing/SingleStalk_DifF_0007_reveal@mipmaps.ktx",
        "testing/revealMap.ktx",
        "testing/SingleStalk_DifF_0007_DEAD@mipmaps.ktx",
        "testing/main-stalk/stalk-screen@mipmaps.ktx",
        "testing/main-stalk/stalk_diffuse_flat@mipmaps.ktx",
        "testing/main-stalk/stalk_diffuse_shadow@mipmaps.ktx",
        "testing/main-stalk/stalk_energy@mipmaps.ktx",
        "testing/rainTexture.ktx",
        "testing/lens-flare.ktx",
        "pot/diffuse_pot@mipmaps.ktx",
        "pot/bg_pot_diffuse.ktx"
    ]

    # Download s3tc (Desktop)
    s3tc_list = [f"compressed/s3tc/{k}" for k in ktx_base_list]
    run_download_batch(s3tc_list, "Compressed Textures: S3TC (Desktop)", max_workers=6)

    # Download astc (Mobile / Modern GPUs)
    astc_list = [f"compressed/astc/{k}" for k in ktx_base_list]
    run_download_batch(astc_list, "Compressed Textures: ASTC (Mobile/Modern)", max_workers=6)

    print("\nAll download batches finished!")

if __name__ == "__main__":
    main()
