import os
import re

css_dir = "/home/ravi/Projects/floema-clone/public/_nuxt"

fonts = set()
for fn in os.listdir(css_dir):
    if not fn.endswith(".css"):
        continue
    with open(os.path.join(css_dir, fn), "r", encoding="utf-8", errors="ignore") as f:
        c = f.read()
    urls = re.findall(r'url\([\'"]?([^()\'"]+\.(?:woff2|woff|ttf|otf))[\'"]?\)', c)
    for u in urls:
        fonts.add((fn, u))

print(f"Discovered {len(fonts)} font URLs in CSS:")
for fn, u in sorted(fonts):
    print(f"[{fn}] {u}")
