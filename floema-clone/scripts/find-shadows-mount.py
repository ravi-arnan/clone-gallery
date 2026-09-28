import os
import re

for fn in os.listdir("/home/ravi/Projects/floema-clone/public/_nuxt"):
    if not fn.endswith(".js"):
        continue
    fpath = os.path.join("/home/ravi/Projects/floema-clone/public/_nuxt", fn)
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        c = f.read()
    if "bottomGroupCanvasContainer" in c or "ShadowsPortal" in c or "Shadows.worker" in c:
        print(f"File {fn} matches:")
        for term in ["bottomGroupCanvasContainer", "ShadowsPortal", "Shadows.worker"]:
            if term in c:
                idx = c.find(term)
                print(f"  [{term}] ... {c[max(0, idx-60):min(len(c), idx+100)]} ...")
