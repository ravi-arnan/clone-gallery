import re

with open('/home/ravi/Projects/sui-clone/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove all integrity="..." and crossorigin="..." attributes
html = re.sub(r'\s+integrity="[^"]*"', '', html)
html = re.sub(r'\s+crossorigin="[^"]*"', '', html)
html = re.sub(r'\s+crossorigin', '', html)

# 2. Remove Cloudflare challenge script and iframe
cf_pattern = re.compile(r'<script>\(function\(\)\{function c\(\)\{var b=a\.contentDocument[\s\S]*?<\/script>', re.IGNORECASE)
html = cf_pattern.sub('', html)

# 3. Fix background videos in SuiFest and KBW sections
# Add proper src, poster, autoplay, loop, muted, playsinline
html = html.replace(
    'data-src="/videos/691f406519b3dfde2cd51d5c_SuiFest_cutdown_compressed_k3v5qf.mp4"',
    'src="/videos/691f406519b3dfde2cd51d5c_SuiFest_cutdown_compressed_k3v5qf.mp4" autoplay="" loop="" muted="" playsinline="" data-src="/videos/691f406519b3dfde2cd51d5c_SuiFest_cutdown_compressed_k3v5qf.mp4"'
)
html = html.replace(
    'data-poster="https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/6a107cd557216221b723ad29_68e8e0120513ba12c5cd12e0_691f406519b3dfde2cd51d5c_SuiFest_cutdown_compressed_poster.0000000.avif"',
    'poster="/images/SuiFest_poster.avif" data-poster="/images/SuiFest_poster.avif"'
)

html = html.replace(
    'data-src="/videos/691f3e1bf5b109fa1da4a892_KBW_cutdown_compressed_d23c5r.mp4"',
    'src="/videos/691f3e1bf5b109fa1da4a892_KBW_cutdown_compressed_d23c5r.mp4" autoplay="" loop="" muted="" playsinline="" data-src="/videos/691f3e1bf5b109fa1da4a892_KBW_cutdown_compressed_d23c5r.mp4"'
)
html = html.replace(
    'data-poster="https://cdn.prod.website-files.com/68e8e0120513ba12c5cd12e0/6a107d77fd7d4ca80c0f5236_68e8e0120513ba12c5cd12e0_691f3e1bf5b109fa1da4a892_KBW_cutdown_compressed_poster.0000000.avif"',
    'poster="/images/KBW_poster.avif" data-poster="/images/KBW_poster.avif"'
)

# 4. Remove form-124 script tag if present
html = re.sub(r'<script src="[^"]*form-124\.js"[^>]*><\/script>', '', html)

with open('/home/ravi/Projects/sui-clone/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("index.html cleaned and patched successfully!")
