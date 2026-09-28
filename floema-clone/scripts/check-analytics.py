with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

for tag in ["googletagmanager", "plausible", "umami"]:
    matches = re.findall(rf'.{{0,50}}{tag}.{{0,50}}', html)
    print(f"Matches for {tag}: {len(matches)}")
    for m in matches:
        print("  ", m.strip())
