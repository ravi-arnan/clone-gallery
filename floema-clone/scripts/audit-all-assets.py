import os
import re

ROOT = "/home/ravi/Projects/floema-clone"
all_sanity_urls = set()
all_local_assets = set()

def extract_from_text(text):
    # normalize unicode slashes
    t = text.replace(r"\u002F", "/").replace(r"\/", "/")
    # Find all sanity URLs
    for m in re.findall(r'https?://cdn\.sanity\.io/(?:images|files)/[a-zA-Z0-9_\-\.\/]+', t):
        # clean trailing punctuation/quotes/brackets
        clean = m.rstrip('"\'`<>(),;\\')
        all_sanity_urls.add(clean)
    
    # Find all /_nuxt/ or relative paths
    for m in re.findall(r'["\'](/_nuxt/[a-zA-Z0-9_\-\.]+)["\']', t):
        all_local_assets.add(m)
    for m in re.findall(r'["\'](/3d/[a-zA-Z0-9_\-\.\/]+)["\']', t):
        all_local_assets.add(m)
    for m in re.findall(r'["\'](/audio/[a-zA-Z0-9_\-\.\/]+)["\']', t):
        all_local_assets.add(m)

# 1. index.html
with open(os.path.join(ROOT, "index.html"), "r", encoding="utf-8") as f:
    extract_from_text(f.read())

# 2. All files in public/
for dp, _, fns in os.walk(os.path.join(ROOT, "public")):
    for fn in fns:
        if fn.endswith((".json", ".js", ".css", ".html")):
            fpath = os.path.join(dp, fn)
            try:
                with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
                    extract_from_text(f.read())
            except Exception:
                pass

print(f"Total unique Sanity URLs found: {len(all_sanity_urls)}")
print(f"Total local assets found: {len(all_local_assets)}")

# Check how many Sanity URLs are already downloaded
missing_sanity = []
downloaded_sanity = []

for u in sorted(all_sanity_urls):
    rel = u.replace("https://", "").replace("http://", "")
    target = os.path.join(ROOT, "public", rel)
    if os.path.exists(target) and os.path.getsize(target) > 0:
        downloaded_sanity.append(u)
    else:
        missing_sanity.append(u)

print(f"Sanity URLs downloaded: {len(downloaded_sanity)}")
print(f"Sanity URLs MISSING: {len(missing_sanity)}")

if missing_sanity:
    print("\nSample missing Sanity URLs (first 20):")
    for m in missing_sanity[:20]:
        print(" ", m)
