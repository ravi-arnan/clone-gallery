#!/usr/bin/env python3
"""
Build localized, clean HTML files for Alche Studio clone.
Neutralizes external telemetry, ensures correct local asset resolution,
and copies all page routes into public/ for multi-path static serving.
"""

import os
import re
import shutil

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

HTML_FILES = [
    "index.html",
    "about/index.html",
    "news/index.html",
    "works/index.html",
    "stellla/index.html",
    "contact/index.html",
    "privacypolicy/index.html",
    "license/index.html",
    "works/detail/997ia9e6cty7/index.html",
    "works/detail/lqlwmmtrsd6s/index.html",
    "works/detail/8ekyy7vviu/index.html",
    "works/detail/uqdzssjeiox/index.html",
    "works/detail/05tscxftkq/index.html",
    "works/detail/x-7xjmugndty/index.html"
]

def clean_html(content):
    # 1. Replace external Google Analytics with local safe stub
    content = re.sub(
        r'<script[^>]*googletagmanager\.com/gtag/js[^>]*></script>',
        '<script>/* Google Analytics Stub */ window.dataLayer = window.dataLayer || []; function gtag(){ dataLayer.push(arguments); }</script>',
        content
    )
    content = re.sub(
        r'<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\(\x27js\x27, new Date\(\)\);\s*gtag\(\x27config\x27, \x27G-[A-Z0-9]+\x27\);\s*</script>',
        '',
        content
    )

    # 2. Ensure og:image is local /ogp.jpg
    content = content.replace("https://alche.studio/ogp.jpg", "/ogp.jpg")

    return content

def main():
    print("=== Localizing HTML Files ===")
    for rel_path in HTML_FILES:
        src_path = os.path.join(PROJECT_DIR, rel_path)
        if not os.path.exists(src_path):
            print(f"Skipping missing: {rel_path}")
            continue

        with open(src_path, "r", encoding="utf-8") as f:
            content = f.read()

        cleaned = clean_html(content)

        # Write back to root location
        with open(src_path, "w", encoding="utf-8") as f:
            f.write(cleaned)

        # Also write to public/ mirror
        pub_path = os.path.join(PUBLIC_DIR, rel_path)
        os.makedirs(os.path.dirname(pub_path), exist_ok=True)
        with open(pub_path, "w", encoding="utf-8") as f:
            f.write(cleaned)

        print(f"  [OK] Localized {rel_path}")

    print("HTML Localization completed successfully!")

if __name__ == "__main__":
    main()
