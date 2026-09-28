#!/usr/bin/env python3
"""
Build localized, clean HTML files for StringTune clone.
Ensures local asset resolution, neutralizes external telemetry (PostHog/Cloudflare Insights/GTag),
and writes index.html to project root and public/ for static serving.
"""

import os
import re

PROJECT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PUBLIC_DIR = os.path.join(PROJECT_DIR, "public")

def clean_html(content):
    # Remove external beacon scripts if present
    content = re.sub(r'<script[^>]*static\.cloudflareinsights\.com[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*eu-assets\.i\.posthog\.com[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*googletagmanager\.com[^>]*>.*?</script>', '', content, flags=re.DOTALL)

    # Keep a valid dummy public key so posthog doesn't complain about missing token,
    # but route host to a harmless local path
    content = content.replace(
        'posthogHost:"https://eu.i.posthog.com"',
        'posthogHost:"/api/posthog"'
    )
    content = content.replace(
        'gtag:{enabled:true,id:"",initCommands:[],config:{},tags:[],loadingStrategy:"defer",url:"https://www.googletagmanager.com/gtag/js"}',
        'gtag:{enabled:false,id:"",initCommands:[],config:{},tags:[],loadingStrategy:"defer",url:""}'
    )

    # Localize any canonical or og:url if needed
    content = content.replace("https://string-tune.fiddle.digital/", "/")

    return content

def main():
    print("=== Localizing HTML for StringTune Clone ===")
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

    print("Successfully generated index.html and public/index.html!")

if __name__ == "__main__":
    main()
