import re

with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

canvases = re.findall(r'<canvas[^>]*>', html, re.I)
print(f"Canvas tags in index.html ({len(canvases)}):")
for c in canvases:
    print(" ", c)

keywords = ["canvas", "webgl", "scene", "hero", "model", "shadow", "anim", "three"]
for kw in keywords:
    matches = re.findall(rf'class="[^"]*{kw}[^"]*"', html, re.I)
    print(f"Classes matching '{kw}' ({len(matches)}):")
    for m in list(set(matches))[:5]:
        print("  ", m)
