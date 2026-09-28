import os

# 1. Patch payload.json
pay_path = "/home/ravi/Projects/floema-clone/public/en/_payload.json"
if os.path.exists(pay_path):
    with open(pay_path, "r", encoding="utf-8") as f:
        p = f.read()
    
    count1 = p.count(r"https:\u002F\u002Fcdn.sanity.io\u002F")
    count2 = p.count("https://cdn.sanity.io/")
    print(f"In payload.json: {count1} escaped URLs, {count2} unescaped URLs")
    
    p = p.replace(r"https:\u002F\u002Fcdn.sanity.io\u002F", r"\u002Fcdn.sanity.io\u002F")
    p = p.replace("https://cdn.sanity.io/", "/cdn.sanity.io/")
    
    with open(pay_path, "w", encoding="utf-8") as f:
        f.write(p)
    print("Patched payload.json successfully!")

# 2. Patch CegNqfpt.js (Sanity image URL builder)
ceg_path = "/home/ravi/Projects/floema-clone/public/_nuxt/CegNqfpt.js"
if os.path.exists(ceg_path):
    with open(ceg_path, "r", encoding="utf-8") as f:
        c = f.read()
    
    count = c.count("https://cdn.sanity.io/images")
    print(f"In CegNqfpt.js: {count} occurrences of https://cdn.sanity.io/images")
    c = c.replace("https://cdn.sanity.io/images", "/cdn.sanity.io/images")
    
    with open(ceg_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("Patched CegNqfpt.js successfully!")
