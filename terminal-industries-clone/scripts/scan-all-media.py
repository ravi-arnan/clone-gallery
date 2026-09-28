import os
import re

nuxt_dir = "public/_nuxt"
all_3d_media = set()
for fname in os.listdir(nuxt_dir):
    if fname.endswith(".js"):
        p = os.path.join(nuxt_dir, fname)
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            c = f.read()
        for ext in ["glb", "gltf", "hdr", "exr", "mp4", "webm", "bin", "wasm", "webp", "png", "svg"]:
            matches = re.findall(rf'["\']([^"\'\s<>]+\.{ext})["\']', c)
            for m in matches:
                all_3d_media.add(m)

print("Found media references in JS bundles:", len(all_3d_media))
for item in sorted(all_3d_media):
    print("  Media:", item)
