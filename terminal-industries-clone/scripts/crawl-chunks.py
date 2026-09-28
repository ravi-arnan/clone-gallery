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

os.makedirs(NUXT_DIR, exist_ok=True)

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, url, local_path, "already exists"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as res, open(local_path, "wb") as f:
            f.write(res.read())
        return True, url, local_path, "downloaded"
    except Exception as e:
        return False, url, local_path, str(e)

def crawl_nuxt_chunks():
    downloaded_set = set(os.listdir(NUXT_DIR))
    round_num = 1

    while True:
        print(f"\n--- Round {round_num} scanning _nuxt chunks ---")
        new_chunks = set()

        for filename in os.listdir(NUXT_DIR):
            if filename.endswith(".js"):
                filepath = os.path.join(NUXT_DIR, filename)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    
                    # Pattern 1: import("./xyz.js")
                    for m in re.findall(r'import\([\'"](?:\./)?([a-zA-Z0-9_\-\.]+\.js)[\'"]\)', content):
                        new_chunks.add(m)
                    
                    # Pattern 2: "video-sequence.worker-B5BJOqje.js" or worker urls
                    for m in re.findall(r'[\'"]([a-zA-Z0-9_\-\.]+(?:\.worker)?[a-zA-Z0-9_\-\.]*\.js)[\'"]', content):
                        if any(c in m for c in ["-", "."]) and len(m) > 6 and not m.startswith("http"):
                            # Check if it resembles Vite hash pattern like BbAL1BKv.js or video-sequence.worker-xxx.js
                            new_chunks.add(m)

                    # Pattern 3: CSS files referenced inside JS
                    for m in re.findall(r'[\'"]([a-zA-Z0-9_\-\.]+\.css)[\'"]', content):
                        new_chunks.add(m)
                except Exception as e:
                    pass

        to_download = [c for c in new_chunks if c not in downloaded_set]
        print(f"Discovered {len(new_chunks)} total referenced files, {len(to_download)} new to download.")

        if not to_download:
            print("All chunks resolved!")
            break

        tasks = []
        for filename in to_download:
            url = f"{BASE_URL}/_nuxt/{filename}"
            local_path = os.path.join(NUXT_DIR, filename)
            tasks.append((url, local_path))

        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = {executor.submit(download_file, u, p): (u, p) for u, p in tasks}
            for f in as_completed(futures):
                ok, url, path, msg = f.result()
                fn = os.path.basename(path)
                if ok:
                    downloaded_set.add(fn)
                    print(f"  [OK] {fn}: {msg}")
                else:
                    # 404s might happen for false positive matches
                    pass

        round_num += 1
        if round_num > 5:
            break

if __name__ == "__main__":
    crawl_nuxt_chunks()
