import re

with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

title = re.search(r"<title>(.*?)</title>", html, re.I | re.S)
print("Title:", title.group(1) if title else "None")

print("\n=== Stylesheets ===")
for m in re.finditer(r'<link[^>]+rel=["\']stylesheet["\'][^>]*>', html, re.I):
    href = re.search(r'href=["\']([^"\']+)["\']', m.group(0))
    if href:
        print(" ", href.group(1))

print("\n=== Preloads / Modulepreloads ===")
for m in re.finditer(r'<link[^>]+rel=["\'](?:preload|modulepreload)["\'][^>]*>', html, re.I):
    href = re.search(r'href=["\']([^"\']+)["\']', m.group(0))
    as_type = re.search(r'as=["\']([^"\']+)["\']', m.group(0))
    if href:
        print(" ", (as_type.group(1) if as_type else "module"), href.group(1))

print("\n=== Scripts with src ===")
for m in re.finditer(r'<script[^>]+src=["\']([^"\']+)["\'][^>]*>', html, re.I):
    print(" ", m.group(1))
