import os
import re

html_path = '/home/ravi/Projects/sui-clone/original.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Find all section elements and major divs
sections = re.findall(r'<section\b([^>]*)>([\s\S]*?)(?=<\/?section|<\/body|$)', html, re.IGNORECASE)

print(f"Total <section> tags found: {len(sections)}")

for i, (attrs, inner) in enumerate(sections):
    class_match = re.search(r'class=["\']([^"\']+)["\']', attrs)
    id_match = re.search(r'id=["\']([^"\']+)["\']', attrs)
    cls = class_match.group(1) if class_match else "none"
    sid = id_match.group(1) if id_match else "none"
    
    # find heading
    heading_match = re.search(r'<h[1-4]\b[^>]*>([\s\S]*?)<\/h[1-4]>', inner, re.IGNORECASE)
    h_text = ""
    if heading_match:
        h_text = re.sub(r'<[^>]+>', '', heading_match.group(1)).strip().replace('\n', ' ')
    
    print(f"Section {i+1}: class='{cls}' id='{sid}' heading='{h_text[:60]}'")
