#!/usr/bin/env python3
import os
import json

PUBLIC_DIR = os.path.abspath("public")

manifest = {
    "total_files": 0,
    "total_bytes": 0,
    "categories": {
        "3d_models": [],
        "theatre_states": [],
        "rive_animations": [],
        "fonts": [],
        "stylesheets": [],
        "scripts": [],
        "decoders": [],
        "videos": [],
        "images": []
    }
}

for root, dirs, files in os.walk(PUBLIC_DIR):
    for f in files:
        if f.endswith(".tmp"):
            continue
        full_path = os.path.join(root, f)
        rel_path = os.path.relpath(full_path, PUBLIC_DIR)
        size = os.path.getsize(full_path)
        manifest["total_files"] += 1
        manifest["total_bytes"] += size
        
        entry = {"path": rel_path, "size": size}
        lower = f.lower()
        if lower.endswith(('.glb', '.gltf', '.usdz')):
            manifest["categories"]["3d_models"].append(entry)
        elif "theatre-project-state" in lower:
            manifest["categories"]["theatre_states"].append(entry)
        elif lower.endswith('.riv'):
            manifest["categories"]["rive_animations"].append(entry)
        elif lower.endswith(('.woff2', '.woff', '.ttf', '.otf')):
            manifest["categories"]["fonts"].append(entry)
        elif lower.endswith('.css'):
            manifest["categories"]["stylesheets"].append(entry)
        elif lower.endswith(('.js', '.mjs')):
            manifest["categories"]["scripts"].append(entry)
        elif lower.endswith('.wasm') or 'draco' in lower:
            manifest["categories"]["decoders"].append(entry)
        elif lower.endswith(('.mp4', '.webm', '.mov')):
            manifest["categories"]["videos"].append(entry)
        elif lower.endswith(('.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.ktx2')):
            manifest["categories"]["images"].append(entry)

manifest["summary"] = {k: len(v) for k, v in manifest["categories"].items()}
manifest["total_size_mb"] = round(manifest["total_bytes"] / (1024 * 1024), 2)

with open("docs/research/assets-manifest.json", "w", encoding="utf-8") as out:
    json.dump(manifest, out, indent=2)

print(f"Manifest generated: {manifest['total_files']} files, {manifest['total_size_mb']} MB")
for k, v in manifest["summary"].items():
    print(f"  {k}: {v}")
