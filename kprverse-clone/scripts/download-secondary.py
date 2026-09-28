#!/usr/bin/env python3
import os
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
    tasks = []

    # 1. Fonts from _nuxt
    fonts = [
        "ABCWhyteInktrapVariable.7999c8d9.woff2",
        "ABCWhyteInktrapVariable.d1d13179.ttf",
        "ABCWhyteInktrapVariable.e74bb15c.woff",
        "ABCWhytePlusVariable.703e8fca.woff2",
        "ABCWhytePlusVariable.97bfd2fd.woff",
        "ABCWhytePlusVariable.a4374f0d.ttf",
        "ABCWhyteVariable.03b6c8a0.ttf",
        "ABCWhyteVariable.8506f1e8.woff2",
        "ABCWhyteVariable.db468688.woff",
        "HexaframeCF-Bold.6373d9c0.otf",
        "IBMPlexMono-Bold.d0db2b99.ttf",
        "IBMPlexMono-Medium.50f39f34.ttf",
        "IBMPlexMono-Regular.0b129200.ttf",
        "IBMPlexMono-Text.714436a8.ttf",
        "PPFraktionSans-Bold.9b28b898.ttf",
        "PPFraktionSans-Medium.9956017d.ttf"
    ]
    for font in fonts:
        url = f"{BASE_URL}/_nuxt/{font}"
        dest = os.path.join(NUXT_DIR, font)
        tasks.append((url, dest))

    # 2. Sprite sheet JSON files
    sheets = [
        "/images/sheets/header-sprite.json",
        "/images/sheets/logo-anim-low-res-0.json",
        "/images/tableau/factions/energy-left/energy-left-0.json",
        "/images/tableau/factions/energy-left/energy-left-1.json",
        "/images/tableau/factions/energy-right/energy-right-0.json",
        "/images/tableau/factions/energy-right/energy-right-1.json",
        "/images/tableau/keep/beam-ship/beam-ship-0.json",
        "/images/tableau/keep/beam-ship/beam-ship-1.json",
        "/images/tableau/keep/beam-ship/beam-ship-2.json",
        "/images/tableau/keep/character-light/character-light-0.json",
        "/images/tableau/keep/character-light/character-light-1.json",
        "/images/tableau/keep/character-light/character-light-2.json",
        "/images/tableau/keep/kai/kai-0.json",
        "/images/tableau/keep/kai/kai-1.json",
        "/images/tableau/keep/kai/kai-2.json",
        "/images/tableau/keep/kai/kai-3.json",
        "/images/tableau/universe/beam/beam-0.json",
        "/images/tableau/universe/beam/beam-1.json",
        "/images/tableau/universe/beam/beam-2.json",
        "/images/tableau/universe/beam/beam-3.json",
        "/images/tableau/universe/beam/beam-4.json",
        "/images/tableau/universe/magic/magic-0.json",
        "/images/tableau/project/male-hair/male-hair-0.json",
        "/images/tableau/project/male-hair/male-hair-1.json"
    ]
    for s in sheets:
        url = BASE_URL + s
        dest = os.path.join(PUBLIC_DIR, s.lstrip("/"))
        tasks.append((url, dest))

    # 3. Textures
    textures = [
        "/images/compressed/ktx/tableau/extras/pnoise0.ktx2",
        "/images/compressed/ktx/tableau/extras/pnoise.ktx2",
        "/images/compressed/ktx/tableau/extras/pnoise.ktx",
        "/images/compressed/webp/tableau/extras/noise.webp",
        "/images/compressed/webp/tableau/extras/flick.webp",
        "/images/compressed/webp/tableau/flick.webp",
        "/images/collection/character-1.png",
        "/images/tableau/flick.webp",
        "/images/tableau/extras/noise.webp",
        "/images/tableau/extras/flick.webp"
    ]
    for t in textures:
        url = BASE_URL + t
        dest = os.path.join(PUBLIC_DIR, t.lstrip("/"))
        tasks.append((url, dest))

    # 4. Sound files check
    audios = [
        "/audio/UI_menu_CLOSE.mp3",
        "/audio/FX_character_carousel_2.mp3",
        "/audio/FX_text_animation_loop.mp3",
        "/audio/FX_character_carousel_3.mp3",
        "/audio/FX_flow_transition_RELEASE.mp3",
        "/audio/FX_character_carousel_1.mp3",
        "/audio/FX_press_sheen.mp3",
        "/audio/UI_menu_OPEN.mp3",
        "/audio/FX_ALT_intro_animation.mp3",
        "/audio/FX_logo_intro_animation.mp3",
        "/audio/UI_menu_rollover.mp3",
        "/audio/UI_menu_text_rollover.mp3"
    ]
    for a in audios:
        url = BASE_URL + a
        dest = os.path.join(PUBLIC_DIR, a.lstrip("/"))
        tasks.append((url, dest))

    print(f"Executing batch of {len(tasks)} items...")
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in tasks}
        for f in as_completed(futures):
            ok, url, path, msg = f.result()
            rel = os.path.relpath(path, PUBLIC_DIR)
            if ok:
                size = os.path.getsize(path)
                print(f"  [OK] ({size:,} B) {rel}")
            else:
                print(f"  [MISS] {rel}: {msg}")

    # Now inspect all downloaded JSON files to download their sprite images
    print("\nInspecting downloaded JSON files for image references...")
    sprite_images = []
    for root, dirs, files in os.walk(os.path.join(PUBLIC_DIR, "images")):
        for f in files:
            if f.endswith(".json"):
                json_path = os.path.join(root, f)
                try:
                    with open(json_path, "r", encoding="utf-8") as jf:
                        data = json.load(jf)
                    img_name = data.get("meta", {}).get("image")
                    if img_name:
                        img_local_path = os.path.join(root, img_name)
                        img_rel = os.path.relpath(img_local_path, PUBLIC_DIR)
                        img_url = f"{BASE_URL}/{img_rel}"
                        sprite_images.append((img_url, img_local_path))
                except Exception as e:
                    pass

    if sprite_images:
        print(f"Found {len(sprite_images)} sprite image files to download...")
        with ThreadPoolExecutor(max_workers=8) as executor:
            futures = {executor.submit(download_file, u, p): (u, p) for u, p in sprite_images}
            for f in as_completed(futures):
                ok, url, path, msg = f.result()
                rel = os.path.relpath(path, PUBLIC_DIR)
                if ok:
                    size = os.path.getsize(path)
                    print(f"  [SPRITE OK] ({size:,} B) {rel}")
                else:
                    print(f"  [SPRITE MISS] {rel}: {msg}")

if __name__ == "__main__":
    main()
