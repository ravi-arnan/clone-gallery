import os
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = "/home/ravi/Projects/floema-clone"
PUBLIC = os.path.join(ROOT, "public")

all_sanity_urls = set()

def extract_urls(text):
    t = text.replace(r"\u002F", "/").replace(r"\/", "/")
    for m in re.findall(r'https?://cdn\.sanity\.io/(?:images|files)/[a-zA-Z0-9_\-\.\/]+', t):
        clean = m.rstrip('"\'`<>(),;\\')
        all_sanity_urls.add(clean)

# From index.html
with open(os.path.join(ROOT, "index.html"), "r", encoding="utf-8") as f:
    extract_urls(f.read())

# From all json, js, css in public/
for dp, _, fns in os.walk(PUBLIC):
    for fn in fns:
        if fn.endswith((".json", ".js", ".css", ".html")):
            try:
                with open(os.path.join(dp, fn), "r", encoding="utf-8", errors="ignore") as f:
                    extract_urls(f.read())
            except Exception:
                pass

print(f"Total Sanity assets identified: {len(all_sanity_urls)}")

# Check which ones need downloading
to_download = []
for u in sorted(all_sanity_urls):
    rel = u.replace("https://", "").replace("http://", "")
    target = os.path.join(PUBLIC, rel)
    if not os.path.exists(target) or os.path.getsize(target) == 0:
        to_download.append((u, target))

print(f"Need to download: {len(to_download)} files (already present: {len(all_sanity_urls) - len(to_download)})")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
}

def download_file(url, target):
    os.makedirs(os.path.dirname(target), exist_ok=True)
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as res:
                data = res.read()
                with open(target, "wb") as f:
                    f.write(data)
                return True, url, len(data)
        except Exception as e:
            if attempt == 2:
                return False, url, str(e)

completed = 0
failed = 0
failed_list = []

with ThreadPoolExecutor(max_workers=12) as executor:
    futures = {executor.submit(download_file, u, t): u for u, t in to_download}
    for f in as_completed(futures):
        ok, u, info = f.result()
        if ok:
            completed += 1
            if completed % 50 == 0 or completed == len(to_download):
                print(f"Progress: {completed}/{len(to_download)} downloaded")
        else:
            failed += 1
            failed_list.append((u, info))

print(f"\nDownload summary: {completed} successful, {failed} failed.")
if failed_list:
    print(f"Failed files ({len(failed_list)}):")
    for u, err in failed_list[:10]:
        print(f"  {u}: {err}")
