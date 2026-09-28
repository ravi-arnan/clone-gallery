import re
import urllib.parse
import os

with open("/home/ravi/Projects/floema-clone/index.html", "r") as f:
    html = f.read()

vercel_urls = re.findall(r'/_vercel/image\?[^\s"\'<>]+', html)
print(f"Total /_vercel/image URLs in index.html: {len(vercel_urls)}")

PUBLIC = "/home/ravi/Projects/floema-clone/public"
found = 0
not_found = 0

for u in vercel_urls:
    u_clean = u.replace("&amp;", "&")
    parsed = urllib.parse.urlparse(u_clean)
    qs = urllib.parse.parse_qs(parsed.query)
    target = qs.get("url", [""])[0]
    # strip https://cdn.sanity.io/ or cdn.sanity.io
    rel = target.replace("https://cdn.sanity.io/", "").replace("http://cdn.sanity.io/", "")
    local_path = os.path.join(PUBLIC, "cdn.sanity.io", rel)
    if os.path.exists(local_path):
        found += 1
    else:
        not_found += 1
        if not_found <= 5:
            print("  Missing target:", target)

print(f"Target images on disk: {found} found, {not_found} missing")
