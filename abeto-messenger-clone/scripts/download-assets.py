#!/usr/bin/env python3
"""
Asset Downloader for Messenger Abeto Clone (https://messenger.abeto.co/)
Downloads all 3D geometries, KTX2/PNG/AVIF textures, audio, fonts, WebAssembly modules,
Web Workers, and UI icons with multi-threaded worker pool.
"""

import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_URL = "https://messenger.abeto.co"
OUTPUT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "public"))

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://messenger.abeto.co/",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
}

# Core files
ASSETS = [
    # Favicons & Social
    "assets/favicon32-BC0QIL61.png",
    "assets/favicon16-B6JSd80n.png",
    "assets/images/social.jpg",

    # CSS & Main JS
    "assets/style-BgpnrCnL.css",
    "assets/webgl-CS4l6lxD.js",
    "assets/App3D-DwM1eiaC.js",

    # Workers
    "assets/glyphworker-DoaYwstb.js",
    "assets/dracoworker-9mmlh0V-.js",
    "assets/geometryworker-WyEueJn9.js",
    "assets/msdfworker-DGxypdow.js",
    "assets/bitmapworker-DtCLhbWB.js",
    "assets/exrworker-Dm3Bkfzh.js",
    "assets/collisionworker-eT5h7hIA.js",
    "assets/charactergeoworker-D8pdYVWP.js",

    # WASM & Transcoders
    "assets/libs/draco/draco_wasm_wrapper.js",
    "assets/libs/draco/draco_decoder.wasm",
    "assets/libs/basis/basis_transcoder.js",
    "assets/libs/basis/basis_transcoder.wasm",
    "assets/libs/glyph/glyph.js",
    "assets/libs/glyph/glyph.wasm",

    # Fonts
    "assets/fonts/heading.font",
    "assets/fonts/planet.font",
    "assets/fonts/REM-Medium.font",
    "assets/fonts/UglyDave-Alternates-optimized.font",

    # Textures & Images
    "assets/images/atlas.png",
    "assets/images/lut.ktx2",
    "assets/images/clouds_noise_64.ktx2",
    "assets/images/clouds_noise_512.ktx2",
    "assets/images/particle_sprites.ktx2",
    "assets/images/noise-simplex-layered-pixellated-highq.ktx2",
    "assets/images/water-noises-highq.ktx2",
    "assets/images/noise-simplex-layered-blur-highq.ktx2",
    "assets/images/galaxy.ktx2",
    "assets/images/noises-terrain.ktx2",
    "assets/images/grass-blades-highq.ktx2",
    "assets/images/trails-noise.ktx2",
    "assets/images/tree-leaves.ktx2",
    "assets/images/tree-leaves-detail.ktx2",
    "assets/images/butterfly-highq.ktx2",
    "assets/images/butterfly-front-highq.ktx2",
    "assets/images/mainchar-eye-highq.ktx2",
    "assets/images/eye-highq.ktx2",
    "assets/images/mouth-highq.ktx2",
    "assets/images/uv/uvchecker-srgb.png",
    "assets/images/uv/uvchecker-srgb.ktx2",
    "assets/images/controls/circles.avif",

    # UI Icons
    "assets/images/ui/arrow.icon",
    "assets/images/ui/cross.icon",
    "assets/images/ui/sidebuttons/list.icon",
    "assets/images/ui/sidebuttons/sound.icon",
    "assets/images/ui/sidebuttons/sound-muted.icon",
    "assets/images/ui/sidebuttons/t-shirt.icon",
    "assets/images/ui/sidebuttons/poo.icon",
    "assets/images/ui/npc-icons/active.icon",
    "assets/images/ui/npc-icons/inactive.icon",
    "assets/images/ui/quests/cave.icon",
    "assets/images/ui/quests/complete.icon",
    "assets/images/ui/quests/flowerlady.icon",
    "assets/images/ui/quests/frebi.icon",
    "assets/images/ui/quests/frieb.icon",
    "assets/images/ui/quests/house.icon",
    "assets/images/ui/quests/musician.icon",
    "assets/images/ui/quests/officeworker.icon",
    "assets/images/ui/quests/temple.icon",
]

# Emojis 0-9 icons
for i in range(10):
    ASSETS.append(f"assets/images/ui/emojis/{i}.icon")

# Audio tracks
AUDIO_LIST = [
    "intro/rune1.ogg",
    "intro/rune2.ogg",
    "intro/rune3.ogg",
    "intro/rune4.ogg",
    "intro/letters.ogg",
    "intro/button-turn.ogg",
    "intro/button-out.ogg",
    "music/bgmusic-highq.ogg",
    "music/bgmusic-mobile.ogg",
    "music/musician.ogg",
    "ambiances/base.ogg",
    "ambiances/factory.ogg",
    "ambiances/forest.ogg",
    "ambiances/city.ogg",
    "ambiances/beach.ogg",
    "ambiances/waterfalls.ogg",
    "ambiances/temple.ogg",
    "character/footsteps4.ogg",
    "character/footsteps-water.ogg",
    "character/jump-start.ogg",
    "character/jump-land.ogg",
    "character/clothes.ogg",
    "character/bubble-starts.ogg",
    "character/bubble-ends.ogg",
    "character/emoji-starts1.ogg",
    "character/emoji-starts2.ogg",
    "character/emoji-starts3.ogg",
    "character/emoji-ends1.ogg",
    "character/emoji-ends2.ogg",
    "character/emoji-ends3.ogg",
    "camera/whoosh2.ogg",
    "camera/zoom-in-5.ogg",
    "camera/zoom-off-5.ogg",
    "ui/title.ogg",
    "ui/buttons2.ogg",
    "ui/hover2.ogg",
    "ui/click2.ogg",
    "ui/click3.ogg",
    "ui/openbox1.ogg",
    "ui/openbox2.ogg",
    "ui/openbox-emote.ogg",
    "ui/openbox-checklist.ogg",
    "ui/paper1.ogg",
    "ui/paper4.ogg",
    "ui/customize.ogg",
    "ui/quest-complete.ogg",
    "dialogues/quest.ogg",
    "dialogues/male1.ogg",
    "dialogues/male2.ogg",
    "dialogues/male3.ogg",
    "dialogues/female1.ogg",
    "dialogues/female2.ogg",
    "dialogues/female3.ogg",
    "dialogues/wtf.ogg",
]
for a in AUDIO_LIST:
    ASSETS.append(f"assets/audio/{a}")

# 3D Geometries (.drc)
GEO_LIST = [
    # Intro
    "planets/intro/points.drc",
    "planets/present/intro/planet.drc",
    "planets/present/intro/low/planet.drc",
    "planets/present/intro/water.drc",
    "planets/present/intro/trees.drc",
    "planets/present/intro/clouds.drc",
    "planets/present/intro/title_vertical.drc",
    "planets/present/intro/galaxies.drc",
    "planets/present/intro/button.drc",

    # Present Planet Features & VFX
    "planets/present/cables-1.drc",
    "planets/present/cables-2.drc",
    "planets/present/waterfall_vfx.drc",
    "planets/present/waterfallsplash_vfx.drc",
    "planets/present/waterfall_inlet_vfx.drc",
    "planets/present/beachfoam_vfx.drc",
    "planets/present/smoke-1.drc",
    "planets/present/water.drc",
    "planets/present/grass.drc",
    "planets/present/butterflies.drc",

    # Birds
    "birds/1.drc",
    "birds/2.drc",
    "birds/curve-1.drc",
    "birds/curve-2.drc",

    # Deliveries
    "deliveries/clothes.drc",
    "deliveries/letterwet.drc",
    "deliveries/note.drc",
    "deliveries/offering.drc",
    "deliveries/postcard.drc",
    "deliveries/samplebox.drc",

    # Avatar base & animations
    "avatar/avatar-bones.drc",
    "avatar/avatar-idle.drc",
    "avatar/avatar-run.drc",
    "avatar/avatar-sprint.drc",
    "avatar/avatar-air.drc",
    "avatar/avatar-walk.drc",
    "avatar/avatar-afk1.drc",
    "avatar/avatar-afk2.drc",
    "avatar/avatar-afk3.drc",
    "avatar/accessories/base.drc",

    # NPCs
    "npcs/present/alien/alien-bones.drc",
    "npcs/present/alien/alien-idle.drc",
    "npcs/present/alien/alien.drc",
    "npcs/present/boss/boss-bones.drc",
    "npcs/present/boss/boss-idle.drc",
    "npcs/present/boss/boss.drc",
    "npcs/present/caveman/caveman-bones.drc",
    "npcs/present/caveman/caveman-idle.drc",
    "npcs/present/caveman/caveman.drc",
    "npcs/present/chef/chef-bones.drc",
    "npcs/present/chef/chef-idle.drc",
    "npcs/present/chef/chef.drc",
    "npcs/present/diver/diver-bones.drc",
    "npcs/present/diver/diver-idle.drc",
    "npcs/present/diver/diver-talk-idle.drc",
    "npcs/present/diver/diver-talk.drc",
    "npcs/present/diver/diver.drc",
    "npcs/present/factory-worker-a/factory-worker-a-bones.drc",
    "npcs/present/factory-worker-a/factory-worker-a-idle.drc",
    "npcs/present/factory-worker-a/factory-worker-a.drc",
    "npcs/present/factory-worker-b/curve-1.drc",
    "npcs/present/factory-worker-b/factory-worker-b-bones.drc",
    "npcs/present/factory-worker-b/factory-worker-b-talk.drc",
    "npcs/present/factory-worker-b/factory-worker-b-walk.drc",
    "npcs/present/factory-worker-b/factory-worker-b.drc",
    "npcs/present/factory-worker-c/factory-worker-c-bones.drc",
    "npcs/present/factory-worker-c/factory-worker-c-idle.drc",
    "npcs/present/factory-worker-c/factory-worker-c.drc",
    "npcs/present/female-scientist/female-scientist-bones.drc",
    "npcs/present/female-scientist/female-scientist-idle.drc",
    "npcs/present/female-scientist/female-scientist.drc",
    "npcs/present/fox/fox-bones.drc",
    "npcs/present/fox/fox-idle.drc",
    "npcs/present/fox/fox.drc",
    "npcs/present/male-scientist/male-scientist-bones.drc",
    "npcs/present/male-scientist/male-scientist-idle.drc",
    "npcs/present/male-scientist/male-scientist.drc",
    "npcs/present/mountainman/mountainman-bones.drc",
    "npcs/present/mountainman/mountainman-idle.drc",
    "npcs/present/mountainman/mountainman.drc",
    "npcs/present/musician/musician-bones.drc",
    "npcs/present/musician/musician-idle.drc",
    "npcs/present/musician/musician-talk.drc",
    "npcs/present/musician/musician.drc",
    "npcs/present/office-worker/office-worker-alt.drc",
    "npcs/present/office-worker/office-worker-bones.drc",
    "npcs/present/office-worker/office-worker-idle-talk.drc",
    "npcs/present/office-worker/office-worker-idle.drc",
    "npcs/present/office-worker/office-worker-talk.drc",
    "npcs/present/office-worker/office-worker-walk-alt.drc",
    "npcs/present/office-worker/office-worker-walk.drc",
    "npcs/present/office-worker/office-worker.drc",
    "npcs/present/oldwoman/oldwoman-bones.drc",
    "npcs/present/oldwoman/oldwoman-idle.drc",
    "npcs/present/oldwoman/oldwoman.drc",
    "npcs/present/owl/owl-bones.drc",
    "npcs/present/owl/owl-idle.drc",
    "npcs/present/owl/owl.drc",
    "npcs/present/scout/scout-bones.drc",
    "npcs/present/scout/scout-idle.drc",
    "npcs/present/scout/scout.drc",
    "npcs/present/tall-man-curve.drc",
    "npcs/present/threekid/threekid-bones.drc",
    "npcs/present/threekid/threekid-idle.drc",
    "npcs/present/threekid/threekid.drc",
    "npcs/present/young-lady/young-lady-bones.drc",
    "npcs/present/young-lady/young-lady-idle.drc",
    "npcs/present/young-lady/young-lady-talk-idle.drc",
    "npcs/present/young-lady/young-lady-talk.drc",
    "npcs/present/young-lady/young-lady.drc",
]

# Avatar accessories
for i in range(1, 8):
    GEO_LIST.append(f"avatar/accessories/hair{i}.drc")
for i in range(1, 10):
    GEO_LIST.append(f"avatar/accessories/top{i}.drc")
for i in range(1, 8):
    GEO_LIST.append(f"avatar/accessories/bottom{i}.drc")
for i in range(1, 8):
    GEO_LIST.append(f"avatar/accessories/shoes{i}.drc")

# 3D Emojis 1-10
for i in range(1, 11):
    GEO_LIST.append(f"emojis/{i}.drc")

# Chunks 0-9 for terrain full and LODs
for i in range(10):
    GEO_LIST.append(f"planets/present/full_{i}.drc")
    GEO_LIST.append(f"planets/present/full-lod-1_{i}.drc")
    GEO_LIST.append(f"planets/present/full-lod-2_{i}.drc")
    GEO_LIST.append(f"planets/present/full-lod-3_{i}.drc")
    GEO_LIST.append(f"planets/present/low/full_{i}.drc")
    GEO_LIST.append(f"planets/present/low/full-lod-1_{i}.drc")
    GEO_LIST.append(f"planets/present/low/full-lod-3_{i}.drc")

# Hitmesh & tree leaves 0-4
for i in range(5):
    GEO_LIST.append(f"planets/present/hitmesh_{i}.drc")
    GEO_LIST.append(f"planets/present/tree-leaves_{i}.drc")
    GEO_LIST.append(f"planets/present/low/tree-leaves_{i}.drc")

for g in GEO_LIST:
    ASSETS.append(f"assets/geometries/{g}")

# Remove duplicates while preserving order
UNIQUE_ASSETS = []
seen = set()
for a in ASSETS:
    clean = a.strip()
    if clean not in seen:
        seen.add(clean)
        UNIQUE_ASSETS.append(clean)

def download_file(rel_path):
    url = f"{BASE_URL}/{rel_path}"
    dest_path = os.path.join(OUTPUT_ROOT, rel_path)
    
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        return "EXISTS", rel_path, os.path.getsize(dest_path)
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            content_type = resp.headers.get("content-type", "")
            # Cloudflare returns 200 with text/html when a file is missing (SPA fallback)
            if "text/html" in content_type and not rel_path.endswith(".html"):
                return "404_SPA", rel_path, 0
            
            data = resp.read()
            if len(data) == 0:
                return "EMPTY", rel_path, 0
            
            with open(dest_path, "wb") as f:
                f.write(data)
            return "SUCCESS", rel_path, len(data)
    except urllib.error.HTTPError as e:
        return f"HTTP_{e.code}", rel_path, 0
    except Exception as e:
        return f"ERR_{type(e).__name__}", rel_path, 0

def main():
    print(f"Total candidate assets to download: {len(UNIQUE_ASSETS)}")
    print(f"Destination: {OUTPUT_ROOT}")
    
    start_time = time.time()
    success_count = 0
    exists_count = 0
    skipped_404 = 0
    errors = []

    # Using 4 workers to balance speed and laptop thermal safety
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(download_file, path): path for path in UNIQUE_ASSETS}
        for idx, future in enumerate(as_completed(futures), 1):
            status, path, size = future.result()
            if status == "SUCCESS":
                success_count += 1
                print(f"[{idx}/{len(UNIQUE_ASSETS)}] [OK] {path} ({size:,} bytes)")
            elif status == "EXISTS":
                exists_count += 1
                print(f"[{idx}/{len(UNIQUE_ASSETS)}] [CACHED] {path} ({size:,} bytes)")
            elif status == "404_SPA":
                skipped_404 += 1
            else:
                errors.append((path, status))
                print(f"[{idx}/{len(UNIQUE_ASSETS)}] [{status}] {path}")

    elapsed = time.time() - start_time
    print("\n" + "="*50)
    print(f"Download complete in {elapsed:.1f}s")
    print(f"  Downloaded: {success_count}")
    print(f"  Existing/Cached: {exists_count}")
    print(f"  SPA 404s (non-existent): {skipped_404}")
    print(f"  Errors: {len(errors)}")
    print("="*50)

if __name__ == "__main__":
    main()
