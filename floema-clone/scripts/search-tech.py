import os
import re

NUXT_DIR = "/home/ravi/Projects/floema-clone/public/_nuxt"

keywords = ["glb", "gltf", "draco", "mesh", "three", "gsap", "scrolltrigger", "lenis", "canvas", "webgl", "pizzicato", "sound", "audio", "modelview", "shadow"]

for fname in os.listdir(NUXT_DIR):
    if not fname.endswith(".js"):
        continue
    fpath = os.path.join(NUXT_DIR, fname)
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    
    found = []
    for kw in keywords:
        if kw in content.lower():
            found.append(kw)
    if found:
        print(f"{fname}: {found}")
