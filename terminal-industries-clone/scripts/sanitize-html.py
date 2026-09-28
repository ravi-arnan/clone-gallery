#!/usr/bin/env python3
import re

with open("index.html", "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# 1. Remove external tracker script tags
content = re.sub(r'<script[^>]+(?:contentsquare|salespeak|googletagmanager|apollo)[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
content = re.sub(r'<link[^>]+(?:contentsquare|salespeak|googletagmanager|apollo)[^>]*>', '', content, flags=re.IGNORECASE)

# 2. Rewrite https://a.storyblok.com to /storyblok
# Handle escaped versions inside JSON / script strings
content = content.replace("https:\\/\\/a.storyblok.com\\/", "\\/storyblok\\/")
content = content.replace("https://a.storyblok.com/", "/storyblok/")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated index.html: sanitized trackers and localized Storyblok CDN references.")
