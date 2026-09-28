import re
import os
import json

base_dir = '/home/ravi/Projects/sui-clone'
css_path = os.path.join(base_dir, 'public/css/sui-v2.shared.230f7fdb5.min.css')
map_path = os.path.join(base_dir, 'docs/research/url-to-local-map.json')

with open(map_path, 'r') as f:
    url_map = json.load(f)

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Find all url(...) in css
pattern = re.compile(r'url\(([\'"]?)(https?://[^\'")]+)([\'"]?)\)')
matches = pattern.findall(css)
print(f"Total URL matches in CSS: {len(matches)}")

replaced_count = 0
for quote1, u, quote2 in matches:
    clean_u = u.rstrip('"\'),;}>\\')
    if clean_u in url_map:
        local_path = url_map[clean_u]
        css = css.replace(u, local_path)
        replaced_count += 1
    else:
        # Check if basename matches any downloaded font or image
        base = os.path.basename(clean_u)
        for k, v in url_map.items():
            if os.path.basename(k) == base:
                css = css.replace(u, v)
                replaced_count += 1
                break

print(f"Replaced {replaced_count} URLs in CSS")

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS saved.")
