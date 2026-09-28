#!/usr/bin/env python3
import os
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = "/home/ravi/Projects/kprverse-clone"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
BASE_URL = "https://kprverse.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://kprverse.com/"
}

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, local_path, "already exists"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=25) as res, open(local_path, "wb") as fp:
            fp.write(res.read())
        return True, local_path, f"downloaded ({os.path.getsize(local_path)} B)"
    except Exception as e:
        return False, local_path, str(e)

def main():
    tasks = []

    # 1. Three.js basis transcoder
    tasks.append((f"{BASE_URL}/three/basis/basis_transcoder.js", os.path.join(PUBLIC_DIR, "three/basis/basis_transcoder.js")))
    tasks.append((f"{BASE_URL}/three/basis/basis_transcoder.wasm", os.path.join(PUBLIC_DIR, "three/basis/basis_transcoder.wasm")))

    # 2. Project-intro assets
    for ext in [".ktx2", ".webp", ".png"]:
        for prefix in ["/images/compressed/ktx/", "/images/compressed/webp/", "/images/"]:
            for name in ["front-face", "back-face", "front-face-mobile", "back-face-mobile", "trailer-side-media"]:
                rel = f"{prefix.lstrip('/')}project-intro/{name}{ext}"
                tasks.append((f"{BASE_URL}/{rel}", os.path.join(PUBLIC_DIR, rel)))

    # 3. All spritesheet KTX2 and WebP textures
    sprites = [
        "sheets/header-sprite",
        "sheets/logo-anim-low-res-0",
        "tableau/factions/energy-left/energy-left-0",
        "tableau/factions/energy-left/energy-left-1",
        "tableau/factions/energy-right/energy-right-0",
        "tableau/factions/energy-right/energy-right-1",
        "tableau/keep/beam-ship/beam-ship-0",
        "tableau/keep/beam-ship/beam-ship-1",
        "tableau/keep/beam-ship/beam-ship-2",
        "tableau/keep/character-light/character-light-0",
        "tableau/keep/character-light/character-light-1",
        "tableau/keep/character-light/character-light-2",
        "tableau/keep/kai/kai-0",
        "tableau/keep/kai/kai-1",
        "tableau/keep/kai/kai-2",
        "tableau/keep/kai/kai-3",
        "tableau/universe/beam/beam-0",
        "tableau/universe/beam/beam-1",
        "tableau/universe/beam/beam-2",
        "tableau/universe/beam/beam-3",
        "tableau/universe/beam/beam-4",
        "tableau/universe/magic/magic-0"
    ]

    for s in sprites:
        for ext in [".ktx2", ".webp"]:
            # KTX
            rel_ktx = f"images/compressed/ktx/{s}{ext}"
            tasks.append((f"{BASE_URL}/{rel_ktx}", os.path.join(PUBLIC_DIR, rel_ktx)))
            # WebP
            rel_webp = f"images/compressed/webp/{s}{ext}"
            tasks.append((f"{BASE_URL}/{rel_webp}", os.path.join(PUBLIC_DIR, rel_webp)))

    print(f"Total files to fetch: {len(tasks)}")
    success = 0
    fail = 0

    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in tasks}
        for f in as_completed(futures):
            ok, local, msg = f.result()
            rel = os.path.relpath(local, PUBLIC_DIR)
            if ok:
                success += 1
                print(f"  [OK] {rel}: {msg}")
            else:
                fail += 1
                if "404" not in msg and "403" not in msg:
                    print(f"  [FAIL] {rel}: {msg}")

    print(f"\nDownload summary: {success} succeeded, {fail} skipped/404.")

if __name__ == "__main__":
    main()
