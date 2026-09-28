with open("/home/ravi/Projects/floema-clone/public/_nuxt/DOn5zXw2.js", "r", encoding="utf-8") as f:
    c = f.read()

idx = c.find("ModelView.CI1QsZ_0.css")
print(c[max(0, idx-400):min(len(c), idx+200)])
