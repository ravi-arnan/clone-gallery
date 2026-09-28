#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = "/home/ravi/Projects/terminal-industries-clone"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")
BASE_URL = "https://terminal-industries.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://terminal-industries.com/"
}

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, url, local_path, "exists"
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=30) as res, open(local_path, "wb") as f:
                f.write(res.read())
            return True, url, local_path, "downloaded"
        except Exception as e:
            if attempt == 2:
                return False, url, local_path, str(e)

def run_download_tasks(tasks, title, max_workers=10):
    print(f"\n=== {title} ({len(tasks)} files) ===")
    completed = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(download_file, u, p): (u, p) for u, p in tasks}
        for f in as_completed(futures):
            ok, url, path, msg = f.result()
            if ok:
                completed += 1
            else:
                failed += 1
                print(f"  [FAIL] {url}: {msg}")
            if (completed + failed) % 50 == 0 or (completed + failed) == len(tasks):
                print(f"  Progress: {completed + failed}/{len(tasks)} (Completed: {completed}, Failed: {failed})")
    print(f"Done {title}: {completed} successful, {failed} failed.")

def main():
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    # 1. Desktop Hero Frames (410 frames: 0 to 409)
    desktop_tasks = []
    for i in range(410):
        rel = f"static/frames/home/desktop/webp/hero_anim_desktop_60_{i}.webp"
        url = f"{BASE_URL}/{rel}"
        local_path = os.path.join(PUBLIC_DIR, rel)
        desktop_tasks.append((url, local_path))
    run_download_tasks(desktop_tasks, "Desktop Hero Animation Frames (410)", max_workers=12)

    # 2. Mobile Hero Frames (409 frames: 0 to 408)
    mobile_tasks = []
    for i in range(409):
        rel = f"static/frames/home/mobile/webp/hero_anim_mobile_60_{i}.webp"
        url = f"{BASE_URL}/{rel}"
        local_path = os.path.join(PUBLIC_DIR, rel)
        mobile_tasks.append((url, local_path))
    run_download_tasks(mobile_tasks, "Mobile Hero Animation Frames (409)", max_workers=12)

    # 3. Solutions Features Frames (272 frames: 0 to 271)
    solutions_tasks = []
    for i in range(272):
        rel = f"static/frames/solutions/webp/{i}.webp"
        url = f"{BASE_URL}/{rel}"
        local_path = os.path.join(PUBLIC_DIR, rel)
        solutions_tasks.append((url, local_path))
    run_download_tasks(solutions_tasks, "Solutions Features Frames (272)", max_workers=12)

    # 4. Static Images & Blur
    static_tasks = [
        (f"{BASE_URL}/static/images/blur.png", os.path.join(PUBLIC_DIR, "static/images/blur.png")),
        (f"{BASE_URL}/static/images/gartner.svg", os.path.join(PUBLIC_DIR, "static/images/gartner.svg")),
        (f"{BASE_URL}/static/images/linkedin.svg", os.path.join(PUBLIC_DIR, "static/images/linkedin.svg")),
        (f"{BASE_URL}/static/images/x.svg", os.path.join(PUBLIC_DIR, "static/images/x.svg")),
        (f"{BASE_URL}/static/images/youtube.svg", os.path.join(PUBLIC_DIR, "static/images/youtube.svg")),
        (f"{BASE_URL}/static/apple-touch-icon.png", os.path.join(PUBLIC_DIR, "static/apple-touch-icon.png")),
        (f"{BASE_URL}/static/favicon-96x96.png", os.path.join(PUBLIC_DIR, "static/favicon-96x96.png")),
        (f"{BASE_URL}/static/favicon.svg", os.path.join(PUBLIC_DIR, "static/favicon.svg")),
        (f"{BASE_URL}/static/favicon.ico", os.path.join(PUBLIC_DIR, "static/favicon.ico")),
        (f"{BASE_URL}/static/site.webmanifest", os.path.join(PUBLIC_DIR, "static/site.webmanifest")),
    ]
    # Fonts
    for font in [
        "SuisseIntl-Regular.woff2", "SuisseIntl-Medium.woff2", "SuisseIntl-Semibold.woff2", "SuisseIntl-Book.woff2",
        "GeistMono-Regular.woff2", "GeistMono-SemiBold.woff2", "GeistMono-Bold.woff2"
    ]:
        static_tasks.append((f"{BASE_URL}/static/fonts/{font}", os.path.join(PUBLIC_DIR, f"static/fonts/{font}")))
    run_download_tasks(static_tasks, "Static Images and Fonts")

    # 5. Storyblok Assets (Videos and Images)
    storyblok_file = os.path.join(ROOT_DIR, "scripts/storyblok-assets.json")
    if os.path.exists(storyblok_file):
        with open(storyblok_file, "r") as f:
            storyblok_urls = json.load(f)
        sb_tasks = []
        for u in storyblok_urls:
            # Map https://a.storyblok.com/f/337048/... to public/storyblok/f/337048/...
            parsed = urllib.parse.urlparse(u)
            rel_path = parsed.path.lstrip("/")
            local_path = os.path.join(PUBLIC_DIR, "storyblok", rel_path)
            sb_tasks.append((u, local_path))
        run_download_tasks(sb_tasks, f"Storyblok Media Assets ({len(sb_tasks)})", max_workers=10)

if __name__ == "__main__":
    main()
