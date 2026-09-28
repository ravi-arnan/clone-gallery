import os
import re

search_terms = ["burospaces", "digitaloceanspaces", "/3d/", "draco", ".exr", ".hdr", ".glb", ".gltf"]

def search_in_file(fpath):
    with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
        c = f.read()
    results = {}
    for term in search_terms:
        matches = [m.start() for m in re.finditer(re.escape(term), c, re.I)]
        if matches:
            results[term] = []
            for idx in matches[:5]:
                snippet = c[max(0, idx-100):min(len(c), idx+150)]
                results[term].append(snippet.replace("\n", " "))
    return results

root = "/home/ravi/Projects/floema-clone/public"
for dirpath, _, filenames in os.walk(root):
    for fn in filenames:
        fpath = os.path.join(dirpath, fn)
        res = search_in_file(fpath)
        if res:
            print(f"\n--- File: {os.path.relpath(fpath, root)} ---")
            for term, snippets in res.items():
                print(f"Term '{term}':")
                for s in snippets:
                    print(f"   ... {s} ...")
