#!/usr/bin/env python3
import os
import re

ROOT_DIR = "/home/ravi/Projects/thewatch-clone"
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

# Walk all files in PUBLIC_DIR and inspect textual files (js, css, html, json)
text_extensions = {".js", ".css", ".html", ".json"}
referenced_paths = set()

# Regex to match paths starting with /assets/ or assets/ or ./ or ../
path_regex = re.compile(r'["\'`](/(?:assets|fonts|images)[^"\'`\s\(\)]*|assets/[^"\'`\s\(\)]*|\./[^"\'`\s\(\)]*|\.\./[^"\'`\s\(\)]*)["\'`]')
css_url_regex = re.compile(r'url\([\'"]?([^\'"\)]+)[\'"]?\)')

for root, _, files in os.walk(PUBLIC_DIR):
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in text_extensions:
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8", errors="ignore") as fh:
                content = fh.read()
                for m in path_regex.findall(content):
                    referenced_paths.add(m)
                for m in css_url_regex.findall(content):
                    referenced_paths.add(m)

# Also check index.html
with open(os.path.join(ROOT_DIR, "index.html"), "r", encoding="utf-8", errors="ignore") as fh:
    content = fh.read()
    for m in path_regex.findall(content):
        referenced_paths.add(m)
    for m in css_url_regex.findall(content):
        referenced_paths.add(m)

print(f"Total unique referenced paths in codebase: {len(referenced_paths)}")
print("\nChecking file resolution:")
resolved = 0
unresolved = []

for p in sorted(referenced_paths):
    clean = p.split("?")[0].split("#")[0]
    # filter out obvious JS identifiers, css selectors, or protocol schemes
    if clean.startswith("data:") or clean.startswith("http") or len(clean) < 3:
        continue
    if clean.startswith("/"):
        local_rel = clean[1:]
    else:
        local_rel = clean

    # normalize relative navigation if needed
    full_p = os.path.normpath(os.path.join(PUBLIC_DIR, local_rel))
    full_root = os.path.normpath(os.path.join(ROOT_DIR, local_rel))

    if (os.path.exists(full_p) and os.path.isfile(full_p)) or (os.path.exists(full_root) and os.path.isfile(full_root)):
        resolved += 1
    else:
        unresolved.append(p)

print(f"Resolved: {resolved}")
print(f"Unresolved / special paths ({len(unresolved)}):")
for u in unresolved:
    print(f"  - {u}")
