with open("/home/ravi/Projects/floema-clone/public/_nuxt/DOn5zXw2.js", "r", encoding="utf-8") as f:
    c = f.read()

import re
matches = re.findall(r'.{0,100}ModelView.{0,100}', c)
print(f"Matches in DOn5zXw2.js: {len(matches)}")
for m in matches[:10]:
    print(" ", m.strip())
