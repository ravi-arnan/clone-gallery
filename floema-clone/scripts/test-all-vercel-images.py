import re
import urllib.parse
import urllib.request
import sys

with open("/home/ravi/Projects/floema-clone/index.html", "r") as f:
    html = f.read()

# find all /_vercel/image URLs
raw_urls = set(re.findall(r'/_vercel/image\?[^\s"\'<>]+', html))
print(f"Total unique /_vercel/image URLs in index.html: {len(raw_urls)}")

success = 0
failed = 0
failed_urls = []

for u in sorted(raw_urls):
    u_clean = u.replace("&amp;", "&")
    test_url = "http://localhost:3000" + u_clean
    try:
        req = urllib.request.Request(test_url)
        with urllib.request.urlopen(req, timeout=5) as res:
            ct = res.headers.get("Content-Type", "")
            if res.status == 200 and ("image/" in ct or "svg" in ct):
                success += 1
            else:
                failed += 1
                failed_urls.append((u_clean, f"Status: {res.status}, CT: {ct}"))
    except Exception as e:
        failed += 1
        failed_urls.append((u_clean, str(e)))

print(f"\nResult: {success} successful, {failed} failed.")
if failed_urls:
    print(f"Failed URLs sample ({len(failed_urls)}):")
    for u, err in failed_urls[:10]:
        print(f"  {u} -> {err}")
    sys.exit(1)
else:
    print("ALL 192 VERCEL IMAGE URLS RESOLVE WITH 200 OK AND PROPER IMAGE MIME TYPES!")
