import json
import re

with open("/home/ravi/Projects/floema-clone/public/en/_payload.json", "r", encoding="utf-8") as f:
    text = f.read()

# unescape unicode slashes
text = text.replace(r"\u002F", "/")

# Let's search for files/ in sanity
files = set(re.findall(r'https://cdn\.sanity\.io/files/[^\s"\'<>]+', text))
print(f"Sanity files ({len(files)}):")
for fi in sorted(files):
    print(" ", fi)

# Search for any .glb, .gltf, .usdz, .obj, .fbx, .bin
models = set(re.findall(r'[^\s"\'<>]+\.(?:glb|gltf|usdz|obj|fbx|bin)', text, re.I))
print(f"Any 3D model references in payload ({len(models)}):")
for m in sorted(models):
    print(" ", m)

# Search for "model" or "3d"
terms = set(re.findall(r'["\']([a-zA-Z0-9_\-\/]*3d[a-zA-Z0-9_\-\/]*)["\']', text, re.I))
print(f"3D terms in payload ({len(terms)}):")
for it in list(terms)[:20]:
    print(" ", it)

# Also search for "model"
model_terms = set(re.findall(r'["\']([a-zA-Z0-9_\-\/]*model[a-zA-Z0-9_\-\/]*)["\']', text, re.I))
print(f"Model terms in payload ({len(model_terms)}):")
for it in list(model_terms)[:20]:
    print(" ", it)
