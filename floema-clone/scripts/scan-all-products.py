import urllib.request
import re

url = "https://floema.com/en/products/_payload.json"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as res:
    text = res.read().decode("utf-8", errors="ignore").replace(r"\u002F", "/")

# Find all sanity file hashes
sanity_files = set(re.findall(r'https://cdn\.sanity\.io/files/535lnz3g/production/[a-f0-9]+(?:\.[a-zA-Z0-9]+)?', text))
print(f"Sanity files in products payload ({len(sanity_files)}):")
for sf in sorted(sanity_files):
    print(" ", sf)

# Find all product routes
prod_routes = set(re.findall(r'/en/products/[a-zA-Z0-9_\-]+/[a-zA-Z0-9_\-]+', text))
print(f"\nProduct routes ({len(prod_routes)}):")
for pr in sorted(prod_routes):
    print(" ", pr)
