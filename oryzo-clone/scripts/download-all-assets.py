#!/usr/bin/env python3
"""
Comprehensive Asset Downloader for Oryzo.ai Clone (https://oryzo.ai/)
Downloads 100% of HTML, CSS, JS, Fonts, 3D Splatting (.sog, .wasm),
3D Model Buffers (.buf), Textures (.webp, .avif, .png, .jpg),
Rive animations (.riv, .wasm), Videos (.mp4), Webmanifest, and PDFs
for an authentic, fully-animated offline replica.
"""

import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://oryzo.ai"
PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

LOCAL_ASSETS = [
    # Core Bundles
    "/_astro/hoisted.CRsATKbF.js",
    "/_astro/index.TL6TuoJb.css",
    "/_astro/SplatsWorker-DSMxtdkh.js",
    "/_astro/splat_sorter_bg-BfJrILzx.wasm",

    # 3D Gaussian Splats
    "/splats/props.sog",
    "/splats/table_reflection.sog",

    # 3D Model Buffers (.buf)
    "/models/BARK.buf",
    "/models/COASTER_FLIP_ANIM.buf",
    "/models/COFFEE_BEAN.buf",
    "/models/coaster.buf",
    "/models/coaster_hero_animation.buf",
    "/models/featuresAnimations/CAMERA_ANIM.buf",
    "/models/featuresAnimations/COASTER_ANIM.buf",
    "/models/featuresAnimations/COFFEE_ANIM.buf",
    "/models/hand.buf",
    "/models/hand_animation.buf",
    "/models/hero_camera.buf",
    "/models/stack_camera.buf",
    "/models/sustainability_text.buf",
    "/models/sustainability_text_outline.buf",
    "/models/table/COFFEE/COVER.buf",
    "/models/table/COFFEE/CUP.buf",
    "/models/table/COFFEE/LABEL.buf",
    "/models/table/DESK.buf",
    "/models/table/PINBOARD.buf",
    "/models/table/TRAY_COVERS.buf",
    "/models/table/WALL.buf",
    "/models/table/water_bear.buf",
    "/models/wearable/coaster_first.buf",
    "/models/wearable/condom_back.buf",
    "/models/wearable/condom_front.buf",

    # Rive Interactive Animation
    "/rive/oryzo.riv",

    # Fonts
    "/fonts/DM-Mono-400-Latin.woff2",
    "/fonts/Literata.woff2",
    "/fonts/msdf/Inter.json",
    "/fonts/msdf/Inter.webp",

    # Showcase Videos
    "/images/wearable-gallery/bite.mp4",
    "/images/wearable-gallery/yoga.mp4",

    # Social & Gallery Images
    "/images/video_thumb.webp",
    "/images/social-content/3090.webp",
    "/images/social-content/3090_cover.webp",
    "/images/social-content/always_on.webp",
    "/images/social-content/always_on_cover.webp",
    "/images/social-content/color.webp",
    "/images/social-content/drop_test.webp",
    "/images/social-content/drop_test_cover.webp",
    "/images/social-content/edge.webp",
    "/images/social-content/legacy_support.webp",
    "/images/social-content/perfect.webp",
    "/images/social-content/sticker_1.webp",
    "/images/social-content/sticker_2.webp",
    "/images/testimonies/astronut.webp",
    "/images/testimonies/attention.webp",
    "/images/testimonies/flat_earth.webp",
    "/images/testimonies/pirate_king.webp",
    "/images/testimonies/youtuber.webp",
    "/images/wearable-gallery/bikini.webp",
    "/images/wearable-gallery/bikini_on.webp",
    "/images/wearable-gallery/glasses.webp",
    "/images/wearable-gallery/pocket.webp",
    "/images/wearable-gallery/shoulder.webp",
    "/images/wearable-gallery/thumbs/bikini_on.webp",
    "/images/wearable-gallery/thumbs/bite.webp",
    "/images/wearable-gallery/thumbs/glasses.webp",
    "/images/wearable-gallery/thumbs/intro.webp",
    "/images/wearable-gallery/thumbs/outro.webp",
    "/images/wearable-gallery/thumbs/pocket.webp",
    "/images/wearable-gallery/thumbs/shoulder.webp",
    "/images/wearable-gallery/thumbs/yoga.webp",

    # PBR & Scene Textures
    "/textures/LDR_RGB1_0.png",
    "/textures/brdf.png",
    "/textures/coaster/DIFF.webp",
    "/textures/coaster/HEIGHT.webp",
    "/textures/coaster/STACK.webp",
    "/textures/coffee/BASE_COLOR.webp",
    "/textures/coffee/BASE_HARMONICS_0_MOBILE.png",
    "/textures/coffee/LABEL.webp",
    "/textures/coffee/cover-specular.webp",
    "/textures/coffee/smoke/base.webp",
    "/textures/coffee/smoke/harmonics_0.webp",
    "/textures/coffee/smoke/harmonics_1.webp",
    "/textures/coffeeBean/DIFF.webp",
    "/textures/coffeeBean/HEIGHT.webp",
    "/textures/gobo/gobo_b_0.4630597.avif",
    "/textures/gobo/gobo_c_0.38847005.avif",
    "/textures/hero/AI_HAND.webp",
    "/textures/hero/BASE.webp",
    "/textures/hero/cutter_alpha.webp",
    "/textures/hero/cutter_color.webp",
    "/textures/hero/env_hand.webp",
    "/textures/hero/env_hand_spec_20.webp",
    "/textures/hero/env_hero.webp",
    "/textures/hero/eraser_alpha.webp",
    "/textures/hero/eraser_color.webp",
    "/textures/hero/paperclip1_alpha.webp",
    "/textures/hero/paperclip1_color.webp",
    "/textures/hero/paperclip2_alpha.webp",
    "/textures/hero/paperclip2_color.webp",
    "/textures/hero/paperclip3_alpha.webp",
    "/textures/hero/paperclip3_color.webp",
    "/textures/hero/pen_alpha.webp",
    "/textures/hero/pen_color.webp",
    "/textures/hero/pencil_alpha.webp",
    "/textures/hero/pencil_color.webp",
    "/textures/sketches/sketches_a.png",
    "/textures/sketches/sketches_b.png",
    "/textures/smaa-area.png",
    "/textures/smaa-search.png",
    "/textures/sustainability/bark.webp",
    "/textures/table/DESK.webp",
    "/textures/table/DESK_HD.webp",
    "/textures/table/PINBOARD.webp",
    "/textures/table/WALL.webp",
    "/textures/table/WATERBEAR.webp",
    "/textures/table/WATERBEAR_2.webp",
    "/textures/table/cork_closeup.webp",
    "/textures/table/env_grip.webp",
    "/textures/table/env_table.webp",
    "/textures/table/microscopic.webp",
    "/textures/thermal_gradient.webp",
    "/textures/wearable/1.webp",
    "/textures/wearable/1_clip.webp",
    "/textures/wearable/condom/back/base.avif",
    "/textures/wearable/condom/back/harmonics_0.avif",
    "/textures/wearable/condom/back/harmonics_1.avif",
    "/textures/wearable/condom/condom_anim.webp",
    "/textures/wearable/condom/front/base.avif",
    "/textures/wearable/condom/front/harmonics_0.avif",
    "/textures/wearable/condom/front/harmonics_1.avif",
    "/textures/wearable/condom/normal.png",
    "/textures/wearable/condom/pattern.png",
    "/textures/wearable/pin.webp",
    "/textures/wearable/rise.webp",
    "/textures/wearable/wearable_text.webp",

    # Metadata & Icons
    "/meta/favicon-96x96.png",
    "/meta/favicon.svg",
    "/meta/favicon.ico",
    "/meta/apple-touch-icon.png",
    "/meta/site.webmanifest",
    "/meta/web-app-manifest-192x192.png",
    "/meta/web-app-manifest-512x512.png",

    # Extra Documents
    "/terms_and_conditions.pdf",
    "/privacy_policy.pdf",
]

EXTERNAL_MAP = [
    # (Remote URL, Local Relative Path)
    ("https://unpkg.com/@rive-app/canvas@2.37.0/rive.wasm", "libs/rive/rive.wasm"),
    ("https://use.typekit.net/pmn6ngx.css", "fonts/typekit/pmn6ngx.css"),
    ("https://p.typekit.net/p.css?s=1&k=pmn6ngx&ht=tk&f=52149.52151&a=83030954&app=typekit&e=css", "fonts/typekit/p.css"),
    ("https://use.typekit.net/af/daa5d6/0000000000000000775abe8b/31/l?primer=388f68b35a7cbf1ee3543172445c23e26935269fadd3b392a13ac7b2903677eb&fvd=n4&v=3", "fonts/typekit/neue-haas-grotesk.woff2"),
]

def download_file(url, local_path, referer="https://oryzo.ai/"):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return (local_path, True, os.path.getsize(local_path), "cached")

    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "Referer": referer,
            "Accept": "*/*"
        }
    )

    retries = 3
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                if response.status == 200:
                    data = response.read()
                    with open(local_path, "wb") as f:
                        f.write(data)
                    return (local_path, True, len(data), "downloaded")
                else:
                    return (local_path, False, response.status, "bad_status")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)
            else:
                return (local_path, False, str(e), "error")

def main():
    print(f"=== Starting Oryzo Asset Download ({len(LOCAL_ASSETS) + len(EXTERNAL_MAP)} queued) ===")
    start_time = time.time()
    downloaded = 0
    cached = 0
    failed = 0
    total_bytes = 0

    tasks = []
    # Local assets
    for rel_path in LOCAL_ASSETS:
        url = f"{BASE_URL}{rel_path}"
        clean_path = rel_path.lstrip("/")
        local_target = os.path.join(PUBLIC_DIR, clean_path)
        tasks.append((url, local_target, "https://oryzo.ai/"))

    # External assets
    for ext_url, rel_path in EXTERNAL_MAP:
        local_target = os.path.join(PUBLIC_DIR, rel_path)
        tasks.append((ext_url, local_target, ext_url))

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(download_file, url, local_p, ref): (url, local_p) for url, local_p, ref in tasks}
        for future in as_completed(futures):
            url_str, local_p_str = futures[future]
            try:
                path_res, success, info, status = future.result()
                rel_disp = os.path.relpath(path_res, PUBLIC_DIR)
                if success:
                    total_bytes += info
                    if status == "cached":
                        cached += 1
                    else:
                        downloaded += 1
                        print(f"  [OK] /{rel_disp} ({info / 1024:.1f} KB)")
                else:
                    failed += 1
                    print(f"  [FAIL] /{rel_disp} - {info}")
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
