import re

with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

print("=== ICONS & META LINKS ===")
for m in re.finditer(r'<link[^>]+>', html):
    tag = m.group(0)
    if any(k in tag for k in ["icon", "manifest", "video", "audio", "font"]):
        print(" ", tag)

print("\n=== VIDEOS ===")
for m in re.finditer(r'<video[^>]*>', html):
    print(" ", m.group(0))

print("\n=== SVGs ===")
svgs = re.findall(r'<svg[^>]*>', html)
print(f"Total inline SVGs: {len(svgs)}")
