import os
import re

with open("/home/ravi/Projects/floema-clone/public/_nuxt/Co1Lt0hu.js", "r", encoding="utf-8") as f:
    code = f.read()

print("Length of Co1Lt0hu.js:", len(code))

matches = re.findall(r'["\'`]([^\s"\'`]+\.glb[^\s"\'`]*)["\'`]', code, re.I)
print("GLB matches in Co1Lt0hu.js:", matches)

workers = re.findall(r'["\'`]([^\s"\'`]*worker[^\s"\'`]*)["\'`]', code, re.I)
print("Worker matches:", set(workers))

# Search across ALL JS files in public/_nuxt
all_glbs = set()
all_workers = set()
all_audio = set()

for fname in os.listdir("/home/ravi/Projects/floema-clone/public/_nuxt"):
    if not fname.endswith(".js"):
        continue
    fpath = os.path.join("/home/ravi/Projects/floema-clone/public/_nuxt", fname)
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        c = f.read()
    for m in re.findall(r'["\'`]([^\s"\'`]+\.glb[^\s"\'`]*)["\'`]', c, re.I):
        all_glbs.add((fname, m))
    for m in re.findall(r'["\'`]([^\s"\'`]*worker[^\s"\'`]*\.js)["\'`]', c, re.I):
        all_workers.add((fname, m))
    for m in re.findall(r'["\'`]([^\s"\'`]+\.(?:mp3|wav|ogg|m4a|aac)[^\s"\'`]*)["\'`]', c, re.I):
        all_audio.add((fname, m))

print("\n=== ALL GLB MATCHES ===")
for fn, m in all_glbs:
    print(f"[{fn}] {m}")

print("\n=== ALL WORKER MATCHES ===")
for fn, m in all_workers:
    print(f"[{fn}] {m}")

print("\n=== ALL AUDIO MATCHES ===")
for fn, m in all_audio:
    print(f"[{fn}] {m}")
