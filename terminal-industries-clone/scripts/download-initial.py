#!/usr/bin/env python3
import os
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = "/home/ravi/Projects/terminal-industries-clone"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
NUXT_DIR = os.path.join(PUBLIC_DIR, "_nuxt")
BASE_URL = "https://terminal-industries.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://terminal-industries.com/"
}

os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(NUXT_DIR, exist_ok=True)

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, url, local_path, "exists"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=25) as res, open(local_path, "wb") as f:
            f.write(res.read())
        return True, url, local_path, "downloaded"
    except Exception as e:
        return False, url, local_path, str(e)

def main():
    with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8", errors="ignore") as f:
        html_text = f.read()

    # Find all _nuxt files
    nuxt_links = set(re.findall(r'/_nuxt/[a-zA-Z0-9_\-\.]+\.(?:js|css|woff2|woff|ttf|svg|png|jpg|webp)', html_text))
    print(f"Found {len(nuxt_links)} _nuxt files in index.html")

    # Find all /static/ files
    static_links = set(re.findall(r'/(?:static|images|videos|fonts)/[a-zA-Z0-9_\-\./]+\.(?:js|css|woff2|woff|ttf|svg|png|jpg|webp|mp4|webm|webmanifest|ico)', html_text))
    print(f"Found {len(static_links)} static files in index.html")

    tasks = []
    for link in nuxt_links:
        tasks.append((BASE_URL + link, os.path.join(PUBLIC_DIR, link.lstrip("/"))))
    for link in static_links:
        tasks.append((BASE_URL + link, os.path.join(PUBLIC_DIR, link.lstrip("/"))))

    print(f"Downloading {len(tasks)} initial assets...")
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in tasks}
        for f in as_completed(futures):
            ok, url, path, msg = f.result()
            if not ok:
                print(f"  [FAIL] {url}: {msg}")
            else:
                print(f"  [OK] {url.split('/')[-1]}: {msg}")

if __name__ == "__main__":
    main()
