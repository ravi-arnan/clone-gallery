import os
import re
import json

urls = set()

# 1. From index.html
with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read().replace(r"\u002F", "/")
    # Sanity images
    for u in re.findall(r'https://cdn\.sanity\.io/images/[^\s"\'<>,]+', html):
        urls.add(u)
    # Sanity files
    for u in re.findall(r'https://cdn\.sanity\.io/files/[^\s"\'<>,]+', html):
        urls.add(u)
    # Other images
    for u in re.findall(r'src=["\']([^"\']+\.(?:png|jpg|jpeg|webp|svg|gif))["\']', html, re.I):
        urls.add(u)

# 2. From payload.json
with open("/home/ravi/Projects/floema-clone/public/en/_payload.json", "r", encoding="utf-8") as f:
    pay = f.read().replace(r"\u002F", "/")
    for u in re.findall(r'https://cdn\.sanity\.io/images/[^\s"\'<>,]+', pay):
        urls.add(u)
    for u in re.findall(r'https://cdn\.sanity\.io/files/[^\s"\'<>,]+', pay):
        urls.add(u)

# 3. From CSS files
css_dir = "/home/ravi/Projects/floema-clone/public/_nuxt"
for fn in os.listdir(css_dir):
    if fn.endswith(".css"):
        with open(os.path.join(css_dir, fn), "r", encoding="utf-8") as f:
            c = f.read()
        for u in re.findall(r'url\([\'"]?([^()\'"]+)[\'"]?\)', c):
            if not u.startswith("data:") and not u.endswith(".ttf") and not u.endswith(".woff2"):
                urls.add(u)

print(f"Total unique assets discovered: {len(urls)}")
sanity_images = [u for u in urls if "cdn.sanity.io/images" in u]
sanity_files = [u for u in urls if "cdn.sanity.io/files" in u]
other_assets = [u for u in urls if "cdn.sanity.io" not in u]

print(f"Sanity images: {len(sanity_images)}")
print(f"Sanity files: {len(sanity_files)}")
print(f"Other assets: {len(other_assets)}")
print("Other assets sample:")
for o in sorted(other_assets)[:20]:
    print(" ", o)
