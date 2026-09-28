import os
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = "/home/ravi/Projects/floema-clone"
PUBLIC = os.path.join(ROOT, "public")

with open(os.path.join(ROOT, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

# Collect all cdn.sanity.io URLs
urls = set(re.findall(r'https://cdn\.sanity\.io/(?:images|files)/[^\s"\'<>?,]+', html))

# Also from payload
payload_path = os.path.join(PUBLIC, "en/_payload.json")
if os.path.exists(payload_path):
    with open(payload_path, "r", encoding="utf-8") as f:
        pay = f.read().replace(r"\u002F", "/")
    for u in re.findall(r'https://cdn\.sanity\.io/(?:images|files)/[^\s"\'<>?,]+', pay):
        urls.add(u)

print(f"Total Sanity assets to download: {len(urls)}")

def download_one(u):
    # url looks like: https://cdn.sanity.io/images/535lnz3g/production/hash-WxH.ext
    # or https://cdn.sanity.io/files/...
    rel = u.replace("https://", "")
    target = os.path.join(PUBLIC, rel)
    if os.path.exists(target) and os.path.getsize(target) > 0:
        return True, u, target, "cached"
    os.makedirs(os.path.dirname(target), exist_ok=True)
    try:
        req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as res:
            data = res.read()
            with open(target, "wb") as out:
                out.write(data)
            return True, u, target, f"{len(data)} bytes"
    except Exception as e:
        return False, u, target, str(e)

completed = 0
failed = 0
tasks = list(urls)

with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(download_one, u): u for u in tasks}
    for f in as_completed(futures):
        ok, u, target, msg = f.result()
        if ok:
            completed += 1
            if completed % 25 == 0:
                print(f"Progress: {completed}/{len(tasks)} downloaded")
        else:
            failed += 1
            print(f"Failed {u}: {msg}")

print(f"\nFinal: {completed} successful, {failed} failed.")
