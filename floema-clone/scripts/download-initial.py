import os
import re
import urllib.request
import json

BASE_URL = "https://floema.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://floema.com/en"
}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as res:
        return res.read()

# Let's read index.html
with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find all /_nuxt/ files
nuxt_files = set(re.findall(r'/_nuxt/[a-zA-Z0-9_\-\.]+\.(?:js|css)', html))
print(f"Found {len(nuxt_files)} initial /_nuxt/ files in HTML:")
for nf in sorted(nuxt_files):
    print(" ", nf)

# Also check for payload.json
payload_matches = set(re.findall(r'/[a-zA-Z0-9_\-\.\/]+_payload\.json[^\s"\'<>]*', html))
print(f"Found payload files: {payload_matches}")

# Let's save nuxt files into /home/ravi/Projects/floema-clone/public/_nuxt
os.makedirs("/home/ravi/Projects/floema-clone/public/_nuxt", exist_ok=True)
for nf in nuxt_files:
    target = os.path.join("/home/ravi/Projects/floema-clone/public", nf.lstrip("/"))
    if not os.path.exists(target):
        try:
            print(f"Downloading {nf}...")
            data = fetch(BASE_URL + nf)
            with open(target, "wb") as out:
                out.write(data)
        except Exception as e:
            print(f"Failed {nf}: {e}")

# Also download payload.json
for pf in payload_matches:
    clean_pf = pf.split("?")[0]
    target = os.path.join("/home/ravi/Projects/floema-clone/public", clean_pf.lstrip("/"))
    os.makedirs(os.path.dirname(target), exist_ok=True)
    try:
        print(f"Downloading {pf}...")
        data = fetch(BASE_URL + pf)
        with open(target, "wb") as out:
            out.write(data)
    except Exception as e:
        print(f"Failed {pf}: {e}")
