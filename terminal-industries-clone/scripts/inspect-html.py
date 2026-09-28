import re
import os

with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    text = f.read()

print("Length of index.html:", len(text))
title_match = re.search(r"<title>(.*?)</title>", text, re.I)
print("Title:", title_match.group(1) if title_match else "None")

scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', text)
print(f"\nScripts ({len(scripts)}):")
for s in scripts[:20]:
    print(" ", s)

links = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', text)
print(f"\nLinks/Stylesheets ({len(links)}):")
for l in links[:20]:
    print(" ", l)

keywords = ["glb", "gltf", "three", "gsap", "canvas", "frame", "model", "texture", "shader", "draco", "spline", "woff2", "mp4", "webm"]
for kw in keywords:
    matches = set(re.findall(rf'[^"\'\s<>\(\)]*{kw}[^"\'\s<>\(\)]*', text, re.I))
    print(f"Keyword '{kw}': {len(matches)} distinct occurrences (sample: {list(matches)[:5]})")
