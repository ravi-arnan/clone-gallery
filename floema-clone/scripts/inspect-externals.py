import re

with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Find all external URLs in index.html (http/https)
externals = set(re.findall(r'https?://[^\s"\'<>]+', html))
print(f"External URLs in index.html ({len(externals)}):")
domains = set()
for ext in externals:
    m = re.match(r'https?://([^/]+)', ext)
    if m:
        domains.add(m.group(1))

for d in sorted(domains):
    print("  domain:", d)
