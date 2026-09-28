import os
import re

worker_path = "/home/ravi/Projects/floema-clone/public/_nuxt/ModelView.worker-ChHUB9To.js"
with open(worker_path, "r", encoding="utf-8", errors="ignore") as f:
    code = f.read()

print(f"ModelView.worker size: {len(code)} bytes")

# Find any url or path in worker
paths = set(re.findall(r'["\'`]([a-zA-Z0-9_\-\.\/]+\.(?:glb|gltf|bin|wasm|hdr|exr|webp|png|jpg|jpeg|svg|json|mp3|ogg))["\'`]', code, re.I))
print(f"File paths in ModelView.worker ({len(paths)}):")
for p in sorted(paths):
    print(" ", p)

# Search for draco
draco = re.findall(r'draco[a-zA-Z0-9_\-]*', code, re.I)
print("Draco mentions:", set(draco[:10]))

# Search for gltf / glb loading logic
gltf_contexts = re.findall(r'.{0,60}load(?:GLTF|Model|Async|\().{0,60}', code)
print("Load calls:", gltf_contexts[:5])

# Let's inspect DKtYPyz8.js for audio URLs
audio_path = "/home/ravi/Projects/floema-clone/public/_nuxt/DKtYPyz8.js"
with open(audio_path, "r", encoding="utf-8", errors="ignore") as f:
    acode = f.read()

audio_urls = re.findall(r'.{0,50}\.mp3.{0,50}', acode)
print("\nAudio URLs context:")
for a in audio_urls[:10]:
    print(" ", a)
