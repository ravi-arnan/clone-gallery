#!/usr/bin/env python3
import urllib.request
import re
import os
import json
import xml.etree.ElementTree as ET

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode("utf-8", errors="ignore")

def main():
    print("Fetching sitemap...")
    sitemap_xml = fetch_url("https://www.era-residence.com/sitemap.xml")
    root = ET.fromstring(sitemap_xml)
    urls = [elem.text.strip() for elem in root.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    print(f"Discovered {len(urls)} pages from sitemap.")

    all_assets = set()
    pages_html = {}

    # Assets known beforehand
    all_assets.add("https://use.typekit.net/pig8glj.js")
    all_assets.add("https://use.typekit.net/pig8glj.css")
    all_assets.add("https://use.typekit.net/af/02a0c4/0000000000000000773598f9/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3")
    all_assets.add("https://use.typekit.net/af/ceca40/00000000000000007758dac7/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3")
    all_assets.add("https://assets.slater.app/slater/20164.js?v=1.0")
    all_assets.add("https://assets.slater.app/slater/20164/60900.js?v=567206")
    all_assets.add("https://pub-157506367d4c4fa1825d7a6d26b687a2.r2.dev/tftl-logo_white.json")

    # Flower 3D animated webm videos
    for i in range(1, 8):
        all_assets.add(f"https://assets.era-residence.com/flowers/bougainvillea-flowers_{i:02d}.webm")
    all_assets.add("https://assets.era-residence.com/open-graph.mp4")

    # Now scrape all pages
    for i, page_url in enumerate(urls):
        print(f"[{i+1}/{len(urls)}] Scraping {page_url}...")
        try:
            html = fetch_url(page_url)
            pages_html[page_url] = html

            # 1. Scripts
            scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)["\']', html)
            for s in scripts:
                if s.startswith("//"): s = "https:" + s
                elif s.startswith("/"): s = "https://www.era-residence.com" + s
                all_assets.add(s)

            # 2. Links (css, icons)
            links = re.findall(r'<link[^>]+href=["\']([^"\']+)["\']', html)
            for l in links:
                if l.startswith("//"): l = "https:" + l
                elif l.startswith("/"): l = "https://www.era-residence.com" + l
                if not l.startswith("https://www.era-residence.com/"): # skip canonical self-links
                    all_assets.add(l)

            # 3. Images (img src, srcset)
            imgs = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html)
            for img in imgs:
                if img.startswith("//"): img = "https:" + img
                elif img.startswith("/"): img = "https://www.era-residence.com" + img
                all_assets.add(img)

            srcsets = re.findall(r'srcset=["\']([^"\']+)["\']', html)
            for ss in srcsets:
                parts = ss.split(",")
                for p in parts:
                    u = p.strip().split(" ")[0].strip()
                    if u.startswith("//"): u = "https:" + u
                    elif u.startswith("/"): u = "https://www.era-residence.com" + u
                    if u.startswith("http"):
                        all_assets.add(u)

            # 4. Videos and sources
            sources = re.findall(r'<source[^>]+src=["\']([^"\']+)["\']', html)
            for s in sources:
                if s.startswith("//"): s = "https:" + s
                elif s.startswith("/"): s = "https://www.era-residence.com" + s
                all_assets.add(s)

            # 5. Video posters
            posters = re.findall(r'<video[^>]+poster=["\']([^"\']+)["\']', html)
            for p in posters:
                if p.startswith("//"): p = "https:" + p
                elif p.startswith("/"): p = "https://www.era-residence.com" + p
                all_assets.add(p)

            # 6. inline data-json
            djsons = re.findall(r'data-json=["\']([^"\']+)["\']', html)
            for dj in djsons:
                if dj.startswith("//"): dj = "https:" + dj
                all_assets.add(dj)

            # 7. inline background-image in style or data attributes
            bgs = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', html)
            for bg in bgs:
                if bg.startswith("//"): bg = "https:" + bg
                elif bg.startswith("/"): bg = "https://www.era-residence.com" + bg
                if bg.startswith("http"):
                    all_assets.add(bg)

        except Exception as e:
            print(f"Error fetching {page_url}: {e}")

    # Inspect CSS files to discover fonts & background images referenced inside CSS
    css_urls = [u for u in all_assets if ".css" in u or "css" in u]
    print(f"\nDiscovered {len(css_urls)} CSS files. Inspecting for internal assets...")
    for css_url in css_urls:
        try:
            print(f"Reading CSS: {css_url}")
            css_content = fetch_url(css_url)
            css_refs = re.findall(r'url\(["\']?([^"\'\)]+)["\']?\)', css_content)
            for ref in css_refs:
                ref = ref.strip()
                if ref.startswith("data:"): continue
                if ref.startswith("//"): ref = "https:" + ref
                elif ref.startswith("/"): ref = "https://cdn.prod.website-files.com" + ref
                elif not ref.startswith("http"):
                    base = css_url.rsplit("/", 1)[0]
                    ref = f"{base}/{ref}"
                all_assets.add(ref)
        except Exception as e:
            print(f"Error reading CSS {css_url}: {e}")

    # Filter out page navigation links
    clean_assets = []
    for a in all_assets:
        # Ignore external trackers or domains
        if any(skip in a for skip in ["google-analytics", "googletagmanager", "clarity.ms", "doubleclick", "facebook.net"]):
            continue
        if a.endswith(".com") or a.endswith(".com/"):
            continue
        clean_assets.append(a)

    clean_assets = sorted(list(set(clean_assets)))
    print(f"\nTotal clean unique assets discovered: {len(clean_assets)}")

    output_file = "/home/ravi/Projects/era-residence-clone/docs/research/assets-manifest.json"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w") as f:
        json.dump(clean_assets, f, indent=2)
    print(f"Saved manifest to {output_file}")

    # Also save raw HTML of each page for reference
    raw_dir = "/home/ravi/Projects/era-residence-clone/docs/research/raw_pages"
    os.makedirs(raw_dir, exist_ok=True)
    for p_url, p_html in pages_html.items():
        slug = p_url.replace("https://www.era-residence.com", "").strip("/")
        if not slug: slug = "index"
        slug = slug.replace("/", "_") + ".html"
        with open(os.path.join(raw_dir, slug), "w") as f:
            f.write(p_html)
    print(f"Saved {len(pages_html)} raw pages into {raw_dir}")

if __name__ == "__main__":
    main()
