import os
import re

NUXT_DIR = "/home/ravi/Projects/floema-clone/public/_nuxt"

all_chunks = set()
all_assets = set()
all_models = set()
all_fonts = set()
all_images = set()

chunk_pattern = re.compile(r'["\']([a-zA-Z0-9_\-]+\.js)["\']')
asset_pattern = re.compile(r'["\'](/_nuxt/[a-zA-Z0-9_\-\.]+\.(?:glb|gltf|bin|wasm|hdr|exr|webp|png|jpg|jpeg|svg|woff|woff2|ttf|otf|mp4|webm|css|json))["\']', re.IGNORECASE)
url_pattern = re.compile(r'url\([\'"]?([^()\'"]+)[\'"]?\)', re.IGNORECASE)

for fname in os.listdir(NUXT_DIR):
    fpath = os.path.join(NUXT_DIR, fname)
    if os.path.isfile(fpath):
        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
            for m in chunk_pattern.findall(content):
                if len(m) <= 15 and m.endswith(".js"):
                    all_chunks.add(m)
            for m in asset_pattern.findall(content):
                all_assets.add(m)
            for m in url_pattern.findall(content):
                all_assets.add(m)
            
            # Check for model extensions
            for ext in ["glb", "gltf", "bin", "wasm", "hdr", "exr", "fbx", "obj"]:
                matches = re.findall(rf'["\']([^"\']+\.{ext}[^"\']*)["\']', content, re.I)
                for match in matches:
                    all_models.add(match)

print(f"Discovered {len(all_chunks)} potential chunk references:")
print(sorted(all_chunks)[:30])

print(f"\nDiscovered {len(all_models)} model/3D references:")
for m in sorted(all_models):
    print(" ", m)

print(f"\nDiscovered {len(all_assets)} asset references in downloaded files:")
for a in sorted(all_assets)[:40]:
    print(" ", a)
