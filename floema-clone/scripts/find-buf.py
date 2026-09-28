import re

with open("/home/ravi/Projects/floema-clone/public/en/_payload.json", "r", encoding="utf-8") as f:
    text = f.read().replace(r"\u002F", "/")

bufs = set(re.findall(r'[^\s"\'<>]+\.buf', text, re.I))
print(f"Bufs in payload: {len(bufs)}")
for b in sorted(bufs):
    print(" ", b)
