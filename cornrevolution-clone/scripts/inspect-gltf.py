#!/usr/bin/env python3
import urllib.request
import json
import os

BASE_URL = "https://d1hl9u9k5hiqxp.cloudfront.net"
PUBLIC_DIR = "/home/ravi/Projects/cornrevolution-clone/public"

gltf_files = [
    "models/landing/cobb_test.gltf",
    "models/landing/hair.gltf",
    "models/kernel/KERNAL.gltf",
    "images/stalk/stalk_rigged3.gltf",
    "images/stalk/SingleStalk12_db.gltf",
    "assets/pot3.gltf",
    "assets/bg_pot.gltf"
]

all_subassets = set()

for rel in gltf_files:
    local_path = os.path.join(PUBLIC_DIR, rel)
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    url = f"{BASE_URL}/{rel}"
    print(f"Fetching {rel}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as res:
        data = res.read()
        with open(local_path, "wb") as f:
            f.write(data)
        doc = json.loads(data.decode("utf-8"))
        
        # Check buffers (usually .bin)
        for b in doc.get("buffers", []):
            uri = b.get("uri")
            if uri and not uri.startswith("data:"):
                bin_rel = os.path.normpath(os.path.join(os.path.dirname(rel), uri))
                print(f"  Buffer: {bin_rel} ({uri})")
                all_subassets.add(bin_rel)
                
        # Check images (textures in gltf)
        for img in doc.get("images", []):
            uri = img.get("uri")
            if uri and not uri.startswith("data:"):
                img_rel = os.path.normpath(os.path.join(os.path.dirname(rel), uri))
                print(f"  Image: {img_rel} ({uri})")
                all_subassets.add(img_rel)

print(f"\nDiscovered {len(all_subassets)} subassets referenced by GLTF files:")
for a in sorted(all_subassets):
    print(" ", a)
