#!/usr/bin/env python3
import os
import re
import urllib.request
import urllib.parse
import json

OXYGEN_BASE = "https://cdn.shopify.com/oxygen-v2/47215/49013/102837/4351350/assets/"
OUTPUT_DIR = "public/oxygen-assets"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load discovered scripts
with open("docs/research/all_discovered_assets.json", "r") as f:
    data = json.load(f)

discovered_modules = set(data.get("scripts_to_fetch", []))
for url in data.get("assets", {}).get("js", []):
    if "oxygen-v2" in url:
        discovered_modules.add(url)

# Specific scene modules we know from Background.js
scenes = [
    'FinanceScene-BDwc32O0.js', 'FallbackImageScene-UE1mO4Xz.js', 'MarketingScene-Dfjygwwd.js',
    'SidekickScene-BjZodfEY.js', 'OperationsScene-DdGQqwgR.js', 'RetailScene-C_gTk6Ga.js',
    'B2BScene-DkNPida2.js', 'ShippingScene-CzO3hhHj.js', 'HeroScene-BSrKcflv.js',
    'CheckoutScene-zmnsTHZx.js', 'AgenticScene-CjbqotvP.js', 'OnlineScene-BMHIFUKS.js',
    'DeveloperScene-BjLCbQRY.js', 'ShopAppScene-BGpEYXgJ.js', 'Background-CGKUhMwd.js',
    'RiveInner-BZXVDs83.js', 'detect-gpu.esm-rYSyepAo.js', 'GlobalNavigationContainer-DD0GcKXP.js',
    'PopupChannel-BMQolA7i.js', 'entry.client-CXIPWjPz.js', 'manifest-40e0f26c.js',
    'components-BdJai906.js', 'rive-DN8nxF7J.js', 'constants-NW-dxha3.js',
    'index-C9-WQbCX.js', 'useLogError-_a0fPD4U.js', 'root-CklYXyH2.js',
    '(_locale).editions.winter2026-DhFtUF58.js', 'Button-DiM4TpFi.js',
    'meta-CwiYJk4F.js', '(_locale).editions.winter2026-DbqN2bd0.js'
]

for s in scenes:
    discovered_modules.add(OXYGEN_BASE + s)

print(f"Total modules to download and inspect: {len(discovered_modules)}")

downloaded = {}
queue = list(discovered_modules)
headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"}

while queue:
    url = queue.pop(0)
    filename = url.split("/")[-1]
    if filename in downloaded:
        continue
    
    local_path = os.path.join(OUTPUT_DIR, filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(local_path, "wb") as f:
                f.write(content)
            downloaded[filename] = len(content)
            print(f"Downloaded {filename} ({len(content):,} bytes)")
            
            # Scan text for new imports
            text = content.decode("utf-8", errors="ignore")
            # look for imports like ./Foo-123.js
            new_imports = re.findall(r'[\'"](\./[a-zA-Z0-9_\-\.]+\.js)[\'"]', text)
            for imp in new_imports:
                clean_name = imp.replace("./", "")
                if clean_name not in downloaded and clean_name not in [u.split('/')[-1] for u in queue]:
                    queue.append(OXYGEN_BASE + clean_name)
    except Exception as e:
        print(f"Failed {filename}: {e}")

print(f"\nCompleted downloading {len(downloaded)} Oxygen JS modules.")
