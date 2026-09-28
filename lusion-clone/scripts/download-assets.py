#!/usr/bin/env python3
import os
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')

PRIMARY_BASE = 'https://lusion.dev'
FALLBACK_BASE = 'https://lusion.co'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Referer': 'https://lusion.co/'
}

# (remote_path, local_relative_to_public)
ASSETS = [
    # Core Bundles
    ('/_astro/hoisted.CUO_IjfL.js', '_astro/hoisted.CUO_IjfL.js'),
    ('/_astro/about.CNa9RfUh.css', '_astro/about.CNa9RfUh.css'),

    # HTML Pages
    ('/', 'index.html'),
    ('/about/', 'about/index.html'),
    ('/projects/', 'projects/index.html'),

    # Meta
    ('/assets/meta/apple-touch-icon.png', 'assets/meta/apple-touch-icon.png'),
    ('/assets/meta/favicon-32x32.png', 'assets/meta/favicon-32x32.png'),
    ('/assets/meta/dark/favicon-32x32.png', 'assets/meta/dark/favicon-32x32.png'),
    ('/assets/meta/favicon-16x16.png', 'assets/meta/favicon-16x16.png'),
    ('/assets/meta/dark/favicon-16x16.png', 'assets/meta/dark/favicon-16x16.png'),
    ('/assets/meta/favicon.ico', 'assets/meta/favicon.ico'),
    ('/assets/meta/dark/favicon.ico', 'assets/meta/dark/favicon.ico'),
    ('/assets/meta/site.webmanifest', 'assets/meta/site.webmanifest'),
    ('/assets/meta/safari-pinned-tab.svg', 'assets/meta/safari-pinned-tab.svg'),
    ('/assets/meta/social_sharing.jpg', 'assets/meta/social_sharing.jpg'),

    # Fonts
    ('/assets/fonts/Aeonik-Medium.woff', 'assets/fonts/Aeonik-Medium.woff'),
    ('/assets/fonts/Aeonik-Medium.woff2', 'assets/fonts/Aeonik-Medium.woff2'),
    ('/assets/fonts/Aeonik-Regular.woff', 'assets/fonts/Aeonik-Regular.woff'),
    ('/assets/fonts/Aeonik-Regular.woff2', 'assets/fonts/Aeonik-Regular.woff2'),
    ('/assets/fonts/Aeonik-RegularItalic.woff', 'assets/fonts/Aeonik-RegularItalic.woff'),
    ('/assets/fonts/Aeonik-RegularItalic.woff2', 'assets/fonts/Aeonik-RegularItalic.woff2'),
    ('/assets/fonts/IBMPlexMono-Medium.woff', 'assets/fonts/IBMPlexMono-Medium.woff'),
    ('/assets/fonts/IBMPlexMono-Medium.woff2', 'assets/fonts/IBMPlexMono-Medium.woff2'),
    ('/assets/fonts/IBMPlexMono-Regular.woff', 'assets/fonts/IBMPlexMono-Regular.woff'),
    ('/assets/fonts/IBMPlexMono-Regular.woff2', 'assets/fonts/IBMPlexMono-Regular.woff2'),
    ('/assets/fonts/LusionMono.woff', 'assets/fonts/LusionMono.woff'),
    ('/assets/fonts/LusionMono.woff2', 'assets/fonts/LusionMono.woff2'),

    # CSS Images & Icons
    ('/assets/images/cards/back.png', 'assets/images/cards/back.png'),
    ('/assets/images/icons/arrow-down.svg', 'assets/images/icons/arrow-down.svg'),
    ('/assets/images/icons/arrow-right.svg', 'assets/images/icons/arrow-right.svg'),

    # Audios
    ('/assets/audios/hover_0.ogg', 'assets/audios/hover_0.ogg'),
    ('/assets/audios/hover_1.ogg', 'assets/audios/hover_1.ogg'),
    ('/assets/audios/hover_2.ogg', 'assets/audios/hover_2.ogg'),
    ('/assets/audios/click_0.ogg', 'assets/audios/click_0.ogg'),
    ('/assets/audios/click_1.ogg', 'assets/audios/click_1.ogg'),
    ('/assets/audios/focus_0.ogg', 'assets/audios/focus_0.ogg'),
    ('/assets/audios/focus_1.ogg', 'assets/audios/focus_1.ogg'),
    ('/assets/audios/focus_2.ogg', 'assets/audios/focus_2.ogg'),
    ('/assets/audios/glass_broken.ogg', 'assets/audios/glass_broken.ogg'),
    ('/assets/audios/page_0.ogg', 'assets/audios/page_0.ogg'),
    ('/assets/audios/page_1.ogg', 'assets/audios/page_1.ogg'),
    ('/assets/audios/generic.ogg', 'assets/audios/generic.ogg'),
    ('/assets/audios/cinematic_0.ogg', 'assets/audios/cinematic_0.ogg'),
    ('/assets/audios/cinematic_2.ogg', 'assets/audios/cinematic_2.ogg'),
    ('/assets/audios/cinematic_3.ogg', 'assets/audios/cinematic_3.ogg'),
    ('/assets/audios/generic_end.ogg', 'assets/audios/generic_end.ogg'),

    # Team Data & Models
    ('/assets/team/team.json', 'assets/team/team.json'),
    ('/assets/team/edan.buf', 'assets/team/edan.buf'),
    ('/assets/team/ffi.buf', 'assets/team/ffi.buf'),
    ('/assets/team/pierre.buf', 'assets/team/pierre.buf'),
    ('/assets/team/yannic.buf', 'assets/team/yannic.buf'),
    ('/assets/team/paul.buf', 'assets/team/paul.buf'),
    ('/assets/team/andrii.buf', 'assets/team/andrii.buf'),
    ('/assets/team/sunny.buf', 'assets/team/sunny.buf'),

    # 3D Models (.buf)
    ('/assets/models/about/bg_box.buf', 'assets/models/about/bg_box.buf'),
    ('/assets/models/about/camera_spline.buf', 'assets/models/about/camera_spline.buf'),
    ('/assets/models/about/letter_placements.buf', 'assets/models/about/letter_placements.buf'),
    ('/assets/models/about/logo_text.buf', 'assets/models/about/logo_text.buf'),
    ('/assets/models/about/person.buf', 'assets/models/about/person.buf'),
    ('/assets/models/about/person_idle.buf', 'assets/models/about/person_idle.buf'),
    ('/assets/models/about/terrain.buf', 'assets/models/about/terrain.buf'),
    ('/assets/models/about/terrain_lines.buf', 'assets/models/about/terrain_lines.buf'),
    ('/assets/models/about/rock_0.buf', 'assets/models/about/rock_0.buf'),
    ('/assets/models/about/rock_0_low.buf', 'assets/models/about/rock_0_low.buf'),
    ('/assets/models/about/rock_animation_0.buf', 'assets/models/about/rock_animation_0.buf'),
    ('/assets/models/about/rock_1.buf', 'assets/models/about/rock_1.buf'),
    ('/assets/models/about/rock_1_low.buf', 'assets/models/about/rock_1_low.buf'),
    ('/assets/models/about/rock_animation_1.buf', 'assets/models/about/rock_animation_1.buf'),
    ('/assets/models/about/rock_2.buf', 'assets/models/about/rock_2.buf'),
    ('/assets/models/about/rock_2_low.buf', 'assets/models/about/rock_2_low.buf'),
    ('/assets/models/about/rock_animation_2.buf', 'assets/models/about/rock_animation_2.buf'),
    ('/assets/models/about/rock_3.buf', 'assets/models/about/rock_3.buf'),
    ('/assets/models/about/rock_3_low.buf', 'assets/models/about/rock_3_low.buf'),
    ('/assets/models/about/rock_animation_3.buf', 'assets/models/about/rock_animation_3.buf'),
    ('/assets/models/about/sphere_l.buf', 'assets/models/about/sphere_l.buf'),
    ('/assets/models/about/sphere_m.buf', 'assets/models/about/sphere_m.buf'),
    ('/assets/models/about/sphere_s.buf', 'assets/models/about/sphere_s.buf'),
    ('/assets/models/about/sphere_xs.buf', 'assets/models/about/sphere_xs.buf'),
    ('/assets/models/home/cross.buf', 'assets/models/home/cross.buf'),
    ('/assets/models/home/cross_ld.buf', 'assets/models/home/cross_ld.buf'),
    ('/assets/models/playground/tunnel.buf', 'assets/models/playground/tunnel.buf'),
    ('/assets/models/plant.buf', 'assets/models/plant.buf'),
    ('/assets/models/lines/line_reel.buf', 'assets/models/lines/line_reel.buf'),
    ('/assets/models/lines/line_goal.buf', 'assets/models/lines/line_goal.buf'),
    ('/assets/models/lines/line_capability.buf', 'assets/models/lines/line_capability.buf'),
    ('/assets/models/lines/line_office.buf', 'assets/models/lines/line_office.buf'),
    ('/assets/models/tunnels/astronaut_helmet.buf', 'assets/models/tunnels/astronaut_helmet.buf'),
    ('/assets/models/tunnels/astronaut_helmet_glass.buf', 'assets/models/tunnels/astronaut_helmet_glass.buf'),
    ('/assets/models/tunnels/astronaut_glove_shoes.buf', 'assets/models/tunnels/astronaut_glove_shoes.buf'),
    ('/assets/models/tunnels/astronaut_wearpack.buf', 'assets/models/tunnels/astronaut_wearpack.buf'),
    ('/assets/models/tunnels/astronaut_animations.buf', 'assets/models/tunnels/astronaut_animations.buf'),
    ('/assets/models/tunnels/astronaut_in_animation.buf', 'assets/models/tunnels/astronaut_in_animation.buf'),
    ('/assets/models/tunnels/astronaut_out_animation.buf', 'assets/models/tunnels/astronaut_out_animation.buf'),
    ('/assets/models/tunnels/broken_glass.buf', 'assets/models/tunnels/broken_glass.buf'),
    ('/assets/models/tunnels/broken_glass_animation.buf', 'assets/models/tunnels/broken_glass_animation.buf'),
    ('/assets/models/tunnels/diamond.buf', 'assets/models/tunnels/diamond.buf'),
    ('/assets/models/tunnels/earth_card.buf', 'assets/models/tunnels/earth_card.buf'),
    ('/assets/models/tunnels/grid_base_hd.buf', 'assets/models/tunnels/grid_base_hd.buf'),
    ('/assets/models/tunnels/grid_base_ld.buf', 'assets/models/tunnels/grid_base_ld.buf'),
    ('/assets/models/tunnels/grid_structure_hd.buf', 'assets/models/tunnels/grid_structure_hd.buf'),
    ('/assets/models/tunnels/grid_structure_ld.buf', 'assets/models/tunnels/grid_structure_ld.buf'),
    ('/assets/models/tunnels/tunnel_block_base.buf', 'assets/models/tunnels/tunnel_block_base.buf'),
    ('/assets/models/tunnels/tunnel_block_wall.buf', 'assets/models/tunnels/tunnel_block_wall.buf'),

    # 3D Textures & Maps
    ('/assets/textures/font.png', 'assets/textures/font.png'),
    ('/assets/textures/LDR_RGB1_0.png', 'assets/textures/LDR_RGB1_0.png'),
    ('/assets/textures/flip_texture.png', 'assets/textures/flip_texture.png'),
    ('/assets/textures/award_gradient.png', 'assets/textures/award_gradient.png'),
    ('/assets/textures/smaa-area.png', 'assets/textures/smaa-area.png'),
    ('/assets/textures/smaa-search.png', 'assets/textures/smaa-search.png'),
    ('/assets/textures/home/matcap.exr', 'assets/textures/home/matcap.exr'),
    ('/assets/textures/home/matcap_ld.exr', 'assets/textures/home/matcap_ld.exr'),
    ('/assets/textures/about/fog.png', 'assets/textures/about/fog.png'),
    ('/assets/textures/about/ground_person_shadow.webp', 'assets/textures/about/ground_person_shadow.webp'),
    ('/assets/textures/about/person.webp', 'assets/textures/about/person.webp'),
    ('/assets/textures/about/person_light.webp', 'assets/textures/about/person_light.webp'),
    ('/assets/textures/about/rocks.webp', 'assets/textures/about/rocks.webp'),
    ('/assets/textures/about/terrain_shadow_light_height.webp', 'assets/textures/about/terrain_shadow_light_height.webp'),
    ('/assets/textures/tunnels/desktop.png', 'assets/textures/tunnels/desktop.png'),
    ('/assets/textures/tunnels/tablet.png', 'assets/textures/tunnels/tablet.png'),
    ('/assets/textures/tunnels/earth.webp', 'assets/textures/tunnels/earth.webp'),
    ('/assets/textures/tunnels/earth_landscape.jpg', 'assets/textures/tunnels/earth_landscape.jpg'),
    ('/assets/textures/tunnels/stickers.png', 'assets/textures/tunnels/stickers.png'),
    ('/assets/textures/tunnels/stickers_low.png', 'assets/textures/tunnels/stickers_low.png'),
    ('/assets/textures/tunnels/white_block.webp', 'assets/textures/tunnels/white_block.webp'),
    ('/assets/textures/tunnels/white_matcap.jpg', 'assets/textures/tunnels/white_matcap.jpg'),
    ('/assets/textures/tunnels/astronaut/face.png', 'assets/textures/tunnels/astronaut/face.png'),
    ('/assets/textures/tunnels/astronaut/astronaut_helmet_arm.webp', 'assets/textures/tunnels/astronaut/astronaut_helmet_arm.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_helmet_base.webp', 'assets/textures/tunnels/astronaut/astronaut_helmet_base.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_helmet_nor.webp', 'assets/textures/tunnels/astronaut/astronaut_helmet_nor.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_glove_shoes_arm.webp', 'assets/textures/tunnels/astronaut/astronaut_glove_shoes_arm.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_glove_shoes_base.webp', 'assets/textures/tunnels/astronaut/astronaut_glove_shoes_base.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_glove_shoes_nor.webp', 'assets/textures/tunnels/astronaut/astronaut_glove_shoes_nor.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_wearpack_arm.webp', 'assets/textures/tunnels/astronaut/astronaut_wearpack_arm.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_wearpack_base.webp', 'assets/textures/tunnels/astronaut/astronaut_wearpack_base.webp'),
    ('/assets/textures/tunnels/astronaut/astronaut_wearpack_nor.webp', 'assets/textures/tunnels/astronaut/astronaut_wearpack_nor.webp'),
    ('/assets/textures/tunnels/grids/greeble_arm.webp', 'assets/textures/tunnels/grids/greeble_arm.webp'),
    ('/assets/textures/tunnels/grids/greeble_base.webp', 'assets/textures/tunnels/grids/greeble_base.webp'),
    ('/assets/textures/tunnels/grids/greeble_nor.webp', 'assets/textures/tunnels/grids/greeble_nor.webp'),
    ('/assets/textures/reel/desktop.mp4', 'assets/textures/reel/desktop.mp4'),
    ('/assets/textures/reel/mobile.mp4', 'assets/textures/reel/mobile.mp4'),
]

# 12 Projects
PROJECT_IDS = [
    'oryzo_ai', 'atlas_motion', 'devin_ai', 'of_the_oak', 'everswap',
    'porsche_dream_machine', 'synthetic_human', 'spatial_fusion',
    'spaace', 'ddd_2024', 'choo_choo_world', 'soda_experience'
]

# Add project HTMLs and WebGL depth card assets
for pid in PROJECT_IDS:
    ASSETS.append((f'/projects/{pid}/', f'projects/{pid}/index.html'))
    ASSETS.append((f'/assets/projects/{pid}/home.webp', f'assets/projects/{pid}/home.webp'))
    ASSETS.append((f'/assets/projects/{pid}/home_depth.webp', f'assets/projects/{pid}/home_depth.webp'))

def download_file(item):
    remote_path, local_rel = item
    local_path = os.path.join(PUBLIC_DIR, local_rel)

    # Don't re-download if already exists and non-empty
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, local_rel, os.path.getsize(local_path), 'cached'

    os.makedirs(os.path.dirname(local_path), exist_ok=True)

    # Try PRIMARY_BASE, then FALLBACK_BASE
    bases = [PRIMARY_BASE, FALLBACK_BASE]
    last_err = None
    for b in bases:
        url = b + remote_path
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                with open(local_path, 'wb') as f:
                    f.write(data)
                return True, local_rel, len(data), 'downloaded'
        except Exception as e:
            last_err = e

    return False, local_rel, 0, str(last_err)

def main():
    print(f'Starting asset download for {len(ASSETS)} items...')
    start_time = time.time()

    success_count = 0
    cached_count = 0
    fail_count = 0
    total_bytes = 0
    failed_items = []

    # Parallel download with 8 threads
    with ThreadPoolExecutor(max_workers=8) as executor:
        future_to_item = {executor.submit(download_file, item): item for item in ASSETS}
        for future in as_completed(future_to_item):
            success, rel_path, size, status = future.result()
            if success:
                total_bytes += size
                if status == 'cached':
                    cached_count += 1
                else:
                    success_count += 1
                    print(f'  [OK] {rel_path} ({size:,} bytes)')
            else:
                fail_count += 1
                failed_items.append((rel_path, status))
                print(f'  [FAIL] {rel_path}: {status}')

    elapsed = time.time() - start_time
    print('\n==============================')
    print(f'Done in {elapsed:.2f}s')
    print(f'Downloaded: {success_count}')
    print(f'Cached: {cached_count}')
    print(f'Failed: {fail_count}')
    print(f'Total Size: {total_bytes / (1024*1024):.2f} MB')
    print('==============================')

    if failed_items:
        print('\nFailed downloads:')
        for path, err in failed_items:
            print(f'  - {path}: {err}')
        sys.exit(1)
    else:
        print('\nAll core assets downloaded successfully!')

if __name__ == '__main__':
    main()
