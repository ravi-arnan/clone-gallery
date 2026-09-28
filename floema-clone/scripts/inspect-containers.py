with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

import re

for term in ["bottomGroupCanvasContainer", 'class="shadows"']:
    idx = html.find(term)
    if idx != -1:
        print(f"\nContext for {term}:")
        print(html[max(0, idx-200):min(len(html), idx+300)])
