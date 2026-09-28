with open("/home/ravi/Projects/floema-clone/index.html", "r", encoding="utf-8") as f:
    html = f.read()

count = html.count("https://cdn.sanity.io/")
print(f"Replacing {count} occurrences of https://cdn.sanity.io/ in index.html...")
html = html.replace("https://cdn.sanity.io/", "/cdn.sanity.io/")

# Also disable external analytics scripts to ensure 0 external network requests
html = html.replace('src="https://cloud.umami.is/script.js"', 'src="/analytics-stub.js"')
html = html.replace('href="https://plausible.io/js/script.js"', 'href="/analytics-stub.js"')
html = html.replace('href="https://www.googletagmanager.com/gtm.js?id=GTM-TTGLTQDL"', 'href="/analytics-stub.js"')

with open("/home/ravi/Projects/floema-clone/index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Updated index.html successfully!")
