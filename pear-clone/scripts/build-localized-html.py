#!/usr/bin/env python3
"""
Build localized, clean HTML files for Pear.no clone.
Ensures local asset resolution for metadata, canonical links, and copies to public/ for static serving.
"""

import os
import re

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

def clean_html(content):
    # Localize metadata URLs
    content = content.replace("https://pear.no/og.jpg", "/og.jpg")
    content = content.replace("https://pear.no/apple-touch-icon.png", "/apple-touch-icon.png")
    content = content.replace("https://pear.no/", "/")
    return content

def main():
    print("=== Localizing HTML for Pear.no Clone ===")
    src_file = os.path.join(PROJECT_DIR, "original.html")
    if not os.path.exists(src_file):
        print("original.html not found!")
        return

    with open(src_file, "r", encoding="utf-8") as f:
        content = f.read()

    cleaned = clean_html(content)

    # Write index.html at root
    out_root = os.path.join(PROJECT_DIR, "index.html")
    with open(out_root, "w", encoding="utf-8") as f:
        f.write(cleaned)

    # Write index.html in public/
    out_pub = os.path.join(PUBLIC_DIR, "index.html")
    with open(out_pub, "w", encoding="utf-8") as f:
        f.write(cleaned)

    print("Successfully built index.html and public/index.html!")

if __name__ == "__main__":
    main()
