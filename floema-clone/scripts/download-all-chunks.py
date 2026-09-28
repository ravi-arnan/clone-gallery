import os
import re
import urllib.request

with open("/home/ravi/Projects/floema-clone/public/_nuxt/DOn5zXw2.js", "r", encoding="utf-8") as f:
    c = f.read()

# Match all filenames like [a-zA-Z0-9_\-\.]+\.(?:js|css)
files = set(re.findall(r'["\'](?:\./)?([a-zA-Z0-9_\-\.]+\.(?:js|css|ttf|woff|woff2))["\']', c))
print(f"Discovered {len(files)} chunk/asset files in entry bundle:")
for f in sorted(files):
    print(" ", f)

out_dir = "/home/ravi/Projects/floema-clone/public/_nuxt"
os.makedirs(out_dir, exist_ok=True)

downloaded = 0
failed = 0
for fn in sorted(files):
    target = os.path.join(out_dir, fn)
    if os.path.exists(target) and os.path.getsize(target) > 0:
        continue
    url = f"https://floema.com/_nuxt/{fn}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as res:
            data = res.read()
            with open(target, "wb") as out:
                out.write(data)
            downloaded += 1
            print(f"Downloaded {fn} ({len(data)} bytes)")
    except Exception as e:
        failed += 1
        print(f"Failed {fn}: {e}")

print(f"\nDone: {downloaded} downloaded, {failed} failed.")
