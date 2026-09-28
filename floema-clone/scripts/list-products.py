import json
import re

with open("/home/ravi/Projects/floema-clone/public/en/_payload.json", "r", encoding="utf-8") as f:
    text = f.read().replace(r"\u002F", "/")

# Look for product slugs or URLs
products = set(re.findall(r'/en/products/[a-zA-Z0-9_\-]+/[a-zA-Z0-9_\-]+', text))
print(f"Products in English ({len(products)}):")
for p in sorted(products):
    print(" ", p)

# Also look for any /products/ in general
all_prod_links = set(re.findall(r'/(?:en|pt|es|fr)/products/[^\s"\'<>]+', text))
print(f"\nAll product links across languages ({len(all_prod_links)}):")
for p in sorted(all_prod_links)[:10]:
    print(" ", p)
