#!/usr/bin/env python3
import os
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = "/home/ravi/Projects/kprverse-clone"
NUXT_DIR = os.path.join(ROOT_DIR, "public", "_nuxt")
BASE_URL = "https://kprverse.com/_nuxt"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://kprverse.com/"
}

def download_file(filename):
    local_path = os.path.join(NUXT_DIR, filename)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, filename, "already exists"
    url = f"{BASE_URL}/{filename}"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as res, open(local_path, "wb") as fp:
            fp.write(res.read())
        return True, filename, f"downloaded ({os.path.getsize(local_path)} B)"
    except Exception as e:
        return False, filename, str(e)

def main():
    all_chunks = set()
    for f in os.listdir(NUXT_DIR):
        if f.endswith(".js"):
            with open(os.path.join(NUXT_DIR, f), "r", encoding="utf-8", errors="ignore") as fp:
                c = fp.read()
            for m in re.findall(r"\./([a-zA-Z0-9_\-\.]+\.(?:js|svg|png|jpg|webp))", c):
                all_chunks.add(m)

    missing = [f for f in sorted(all_chunks) if not os.path.exists(os.path.join(NUXT_DIR, f))]
    print(f"Total missing chunks to download: {len(missing)}")

    success = 0
    fail = 0

    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(download_file, fn): fn for fn in missing}
        for f in as_completed(futures):
            ok, name, msg = f.result()
            if ok:
                success += 1
                print(f"  [OK] {name}: {msg}")
            else:
                fail += 1
                print(f"  [FAIL] {name}: {msg}")

    print(f"\nDownload summary: {success} succeeded, {fail} failed.")

if __name__ == "__main__":
    main()
