import urllib.request
import re

for url in [
    "https://floema.com/en/products/golf/palmer-tee-sign/_payload.json",
    "https://floema.com/en/products/urban/byside-bench-plaza/_payload.json",
    "https://floema.com/en/products/_payload.json"
]:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as res:
            data = res.read().decode("utf-8", errors="ignore")
            print(f"URL: {url} - {len(data)} bytes")
            bufs = re.findall(r'[^\s"\'<>]+\.buf', data)
            models = re.findall(r'[^\s"\'<>]+\.(?:glb|gltf|bin|fbx|obj)', data)
            print("  .buf found:", bufs)
            print("  models found:", models)
    except Exception as e:
        print(f"Failed {url}: {e}")
