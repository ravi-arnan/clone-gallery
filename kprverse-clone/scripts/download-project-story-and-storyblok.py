#!/usr/bin/env python3
import os
import re
import json
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
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
        with urllib.request.urlopen(req, timeout=30) as res, open(local_path, "wb") as f:
            f.write(res.read())
        return True, url, local_path, "downloaded"
    except Exception as e:
        return False, url, local_path, str(e)

def main():
    tasks = []

    # 1. Project Story Assets (female-cloth, female-hair, male-hair)
    groups = [
        ("female-cloth", 3),
        ("female-hair", 2),
        ("male-hair", 2)
    ]

    for name, count in groups:
        for s in range(count):
            # JSON
            j_path = f"images/project-story/{name}/{name}-{s}.json"
            tasks.append((f"{BASE_URL}/{j_path}", os.path.join(PUBLIC_DIR, j_path)))

            # Formats: png, webp, ktx2
            tasks.append((f"{BASE_URL}/images/project-story/{name}/{name}-{s}.png", os.path.join(PUBLIC_DIR, f"images/project-story/{name}/{name}-{s}.png")))
            tasks.append((f"{BASE_URL}/images/compressed/webp/project-story/{name}/{name}-{s}.webp", os.path.join(PUBLIC_DIR, f"images/compressed/webp/project-story/{name}/{name}-{s}.webp")))
            tasks.append((f"{BASE_URL}/images/compressed/ktx/project-story/{name}/{name}-{s}.ktx2", os.path.join(PUBLIC_DIR, f"images/compressed/ktx/project-story/{name}/{name}-{s}.ktx2")))
            tasks.append((f"{BASE_URL}/images/compressed/webp/project-story/{name}/{name}-{s}-mobile.webp", os.path.join(PUBLIC_DIR, f"images/compressed/webp/project-story/{name}/{name}-{s}-mobile.webp")))
            tasks.append((f"{BASE_URL}/images/compressed/ktx/project-story/{name}/{name}-{s}-mobile.ktx2", os.path.join(PUBLIC_DIR, f"images/compressed/ktx/project-story/{name}/{name}-{s}-mobile.ktx2")))

    # 2. Parse Storyblok URLs from index.html
    index_file = os.path.join(ROOT_DIR, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8", errors="ignore") as f:
            html = f.read()
        decoded = html.replace(r"\u002F", "/").replace(r"\/", "/")
        storyblok_urls = set(re.findall(r"https?://a\.storyblok\.com/[^\s\"\x27<>]+", decoded))
        print(f"Found {len(storyblok_urls)} Storyblok URLs in index.html")
        for sb_url in storyblok_urls:
            # Map URL path to public/storyblok/f/165555/...
            parsed = urllib.parse.urlparse(sb_url)
            rel_path = "storyblok" + parsed.path
            local_dest = os.path.join(PUBLIC_DIR, rel_path.lstrip("/"))
            tasks.append((sb_url, local_dest))

    print(f"Starting download of {len(tasks)} items with 8 threads...")
    success = 0
    fail = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in tasks}
        for f in as_completed(futures):
            ok, url, path, msg = f.result()
            rel = os.path.relpath(path, PUBLIC_DIR)
            if ok:
                success += 1
                size = os.path.getsize(path)
                print(f"  [OK] ({size:,} B) {rel}")
            else:
                fail += 1
                if not "404" in msg and not "403" in msg:
                    print(f"  [FAIL] {rel}: {msg}")

    print(f"\nCompleted: {success} succeeded, {fail} skipped/failed.")

if __name__ == "__main__":
    main()
