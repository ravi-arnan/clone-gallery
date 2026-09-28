#!/usr/bin/env python3
import os
import re

RAW_DIR = "/home/ravi/Projects/era-residence-clone/docs/research/raw_pages"
ROOT_DIR = "/home/ravi/Projects/era-residence-clone"

CDN_REPLACEMENTS = [
    ("https://cdn.prod.website-files.com", "/cdn.prod.website-files.com"),
    ("//cdn.prod.website-files.com", "/cdn.prod.website-files.com"),
    ("https://assets.era-residence.com", "/assets.era-residence.com"),
    ("//assets.era-residence.com", "/assets.era-residence.com"),
    ("https://use.typekit.net", "/use.typekit.net"),
    ("//use.typekit.net", "/use.typekit.net"),
    ("https://cdn.jsdelivr.net", "/cdn.jsdelivr.net"),
    ("//cdn.jsdelivr.net", "/cdn.jsdelivr.net"),
    ("https://unpkg.com", "/unpkg.com"),
    ("//unpkg.com", "/unpkg.com"),
    ("https://d3e54v103j8qbb.cloudfront.net", "/d3e54v103j8qbb.cloudfront.net"),
    ("//d3e54v103j8qbb.cloudfront.net", "/d3e54v103j8qbb.cloudfront.net"),
    ("https://pub-157506367d4c4fa1825d7a6d26b687a2.r2.dev", "/pub-157506367d4c4fa1825d7a6d26b687a2.r2.dev"),
    ("//pub-157506367d4c4fa1825d7a6d26b687a2.r2.dev", "/pub-157506367d4c4fa1825d7a6d26b687a2.r2.dev"),
    ("https://assets.slater.app", "/assets.slater.app"),
    ("https://slater.app", "/assets.slater.app"),
    ("//assets.slater.app", "/assets.slater.app"),
    ("//slater.app", "/assets.slater.app"),
]

def sanitize_and_localize_html(html):
    # 1. Remove Google Tag Manager script
    html = re.sub(r'<!-- Google Tag Manager -->.*?<!-- End Google Tag Manager -->', '', html, flags=re.DOTALL)
    html = re.sub(r'<script[^>]*>\s*\(function\(w,d,s,l,i\)\{w\[l\]=w\[l\]\|\|\[\].*?gtm\.js.*?<\/script>', '', html, flags=re.DOTALL)
    html = re.sub(r'<noscript><iframe src="https:\/\/www\.googletagmanager\.com[^"]*".*?<\/noscript>', '', html, flags=re.DOTALL)

    # 2. Add local fonts CSS in head
    if '<link rel="stylesheet" href="/css/fonts.css">' not in html:
        html = html.replace('</head>', '  <link rel="stylesheet" href="/css/fonts.css">\n</head>')

    # 3. Replace all CDN URLs
    for remote, local in CDN_REPLACEMENTS:
        html = html.replace(remote, local)

    # 4. Patch Slater loader script to load local script
    slater_pattern = r"let src = window\.location\.host\.includes\('webflow\.io'\) \? '[^']*' : '[^']*';"
    html = re.sub(slater_pattern, "let src = '/assets.slater.app/slater/20164.js';", html)

    # Also handle alternate quotes
    slater_pattern2 = r'let src\s*=\s*window\.location\.host\.includes\("webflow\.io"\)\s*\?\s*"[^"]*"\s*:\s*"[^"]*";'
    html = re.sub(slater_pattern2, 'let src = "/assets.slater.app/slater/20164.js";', html)

    # 5. Strip integrity and crossorigin attributes from local files to prevent SRI block
    html = re.sub(r'\s*integrity=["\'][^"\']+["\']', '', html)
    html = re.sub(r'\s*crossorigin(?:=["\'][^"\']*["\'])?', '', html)

    return html

def main():
    files = [f for f in os.listdir(RAW_DIR) if f.endswith(".html")]
    print(f"Processing {len(files)} HTML files...")

    for f in sorted(files):
        src_path = os.path.join(RAW_DIR, f)
        with open(src_path, "r", encoding="utf-8") as file:
            content = file.read()

        processed = sanitize_and_localize_html(content)

        # Route mapping:
        # index.html -> ROOT_DIR/index.html
        # apartments.html -> ROOT_DIR/apartments/index.html & ROOT_DIR/apartments.html
        # contact.html -> ROOT_DIR/contact/index.html & ROOT_DIR/contact.html
        # coming-soon.html -> ROOT_DIR/coming-soon/index.html & ROOT_DIR/coming-soon.html
        # apartments_011.html -> ROOT_DIR/apartments/011/index.html & ROOT_DIR/apartments/011.html
        if f == "index.html":
            dest = os.path.join(ROOT_DIR, "index.html")
            with open(dest, "w", encoding="utf-8") as out:
                out.write(processed)
            print("Built -> index.html")
        elif "_" in f and f.startswith("apartments_"):
            unit = f.replace("apartments_", "").replace(".html", "")
            unit_dir = os.path.join(ROOT_DIR, "apartments", unit)
            os.makedirs(unit_dir, exist_ok=True)
            with open(os.path.join(unit_dir, "index.html"), "w", encoding="utf-8") as out:
                out.write(processed)
            # also save as apartments/:id.html
            with open(os.path.join(ROOT_DIR, "apartments", f"{unit}.html"), "w", encoding="utf-8") as out:
                out.write(processed)
            print(f"Built -> apartments/{unit}/index.html")
        else:
            slug = f.replace(".html", "")
            target_dir = os.path.join(ROOT_DIR, slug)
            os.makedirs(target_dir, exist_ok=True)
            with open(os.path.join(target_dir, "index.html"), "w", encoding="utf-8") as out:
                out.write(processed)
            with open(os.path.join(ROOT_DIR, f"{slug}.html"), "w", encoding="utf-8") as out:
                out.write(processed)
            print(f"Built -> {slug}/index.html")

    print("\nAll routes successfully generated!")

if __name__ == "__main__":
    main()
