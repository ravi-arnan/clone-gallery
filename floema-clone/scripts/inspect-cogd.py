with open("/home/ravi/Projects/floema-clone/public/_nuxt/CoGd372E.js", "r", encoding="utf-8") as f:
    c = f.read()

print("Length of CoGd372E.js:", len(c))
# Look for model or gltf or url or props
import re
print("Matches for 'model':")
for m in re.findall(r'.{0,60}model.{0,60}', c, re.I)[:10]:
    print(" ", m.strip())

print("\nMatches for 'worker':")
for m in re.findall(r'.{0,60}worker.{0,60}', c, re.I)[:10]:
    print(" ", m.strip())
