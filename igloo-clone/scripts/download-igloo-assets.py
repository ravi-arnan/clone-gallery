#!/usr/bin/env python3
import os
import sys
import shutil
import urllib.request
import urllib.error

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Referer': 'https://www.igloo.inc/'
}

BASE_URL = 'https://www.igloo.inc'
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT_DIR, 'public')

# URL relative to BASE_URL -> local file relative to PUBLIC_DIR
ASSETS = [
    # Root HTML & assets
    ('/assets/index-2eb69c09.js', 'assets/index-2eb69c09.js'),
    ('/assets/App3D-f554a111.js', 'assets/App3D-f554a111.js'),
    ('/assets/audioworker-036a09db.js', 'assets/audioworker-036a09db.js'),
    ('/assets/bitmapworker-046527f8.js', 'assets/bitmapworker-046527f8.js'),
    ('/assets/exrworker-41cbee65.js', 'assets/exrworker-41cbee65.js'),
    ('/assets/msdfworker-ac346fa7.js', 'assets/msdfworker-ac346fa7.js'),
    ('/assets/favicon32-af94112f.png', 'assets/favicon32-af94112f.png'),
    ('/assets/favicon16-9e4401be.png', 'assets/favicon16-9e4401be.png'),
    ('/assets/images/social.jpg', 'assets/images/social.jpg'),

    # Fonts
    ('/assets/IBMPlexMono-Regular-d3034935.woff2', 'assets/IBMPlexMono-Regular-d3034935.woff2'),
    ('/assets/IBMPlexMono-Regular-419d45f6.woff', 'assets/IBMPlexMono-Regular-419d45f6.woff'),
    ('/assets/IBMPlexMono-Medium-897c8c30.woff2', 'assets/IBMPlexMono-Medium-897c8c30.woff2'),
    ('/assets/IBMPlexMono-Medium-1e253194.woff', 'assets/IBMPlexMono-Medium-1e253194.woff'),
    ('/assets/fonts/IBMPlexMono-Medium.json', 'assets/fonts/IBMPlexMono-Medium.json'),
    ('/assets/fonts/IBMPlexMono-Medium-datatexture.ktx2', 'assets/fonts/IBMPlexMono-Medium-datatexture.ktx2'),

    # Libs
    ('/assets/libs/draco/draco_decoder.js', 'assets/libs/draco/draco_decoder.js'),
    ('/assets/libs/draco/draco_wasm_wrapper.js', 'assets/libs/draco/draco_wasm_wrapper.js'),
    ('/assets/libs/draco/draco_decoder.wasm', 'assets/libs/draco/draco_decoder.wasm'),
    ('/assets/libs/basis/basis_transcoder.js', 'assets/libs/basis/basis_transcoder.js'),
    ('/assets/libs/basis/basis_transcoder.wasm', 'assets/libs/basis/basis_transcoder.wasm'),

    # Geometries (.drc)
    ('/assets/geometries/igloo.drc', 'assets/geometries/igloo.drc'),
    ('/assets/geometries/igloo/igloo_cage.drc', 'assets/geometries/igloo/igloo_cage.drc'),
    ('/assets/geometries/igloo/igloo_outline.drc', 'assets/geometries/igloo/igloo_outline.drc'),
    ('/assets/geometries/igloo/patch.drc', 'assets/geometries/igloo/patch.drc'),
    ('/assets/geometries/ground.drc', 'assets/geometries/ground.drc'),
    ('/assets/geometries/mountain.drc', 'assets/geometries/mountain.drc'),
    ('/assets/geometries/floor.drc', 'assets/geometries/floor.drc'),
    ('/assets/geometries/intro_particles.drc', 'assets/geometries/intro_particles.drc'),
    ('/assets/geometries/blurrytext.drc', 'assets/geometries/blurrytext.drc'),
    ('/assets/geometries/blurrytext_cylinder.drc', 'assets/geometries/blurrytext_cylinder.drc'),
    ('/assets/geometries/shattered_ring.drc', 'assets/geometries/shattered_ring.drc'),
    ('/assets/geometries/shattered_ring2.drc', 'assets/geometries/shattered_ring2.drc'),
    ('/assets/geometries/shattered_ring_smoke.drc', 'assets/geometries/shattered_ring_smoke.drc'),
    ('/assets/geometries/smoke_trail.drc', 'assets/geometries/smoke_trail.drc'),
    ('/assets/geometries/ceilingsmoke.drc', 'assets/geometries/ceilingsmoke.drc'),
    ('/assets/geometries/cubes/background_shapes.drc', 'assets/geometries/cubes/background_shapes.drc'),

    # Portfolio Geometries
    ('/assets/geometries/pudgy.drc', 'assets/geometries/pudgy.drc'),
    ('/assets/geometries/overpass_logo.drc', 'assets/geometries/overpass_logo.drc'),
    ('/assets/geometries/abstractlogo.drc', 'assets/geometries/abstractlogo.drc'),
    ('/assets/geometries/cubes/cube1.drc', 'assets/geometries/cubes/cube1.drc'),
    ('/assets/geometries/cubes/cube2.drc', 'assets/geometries/cubes/cube2.drc'),
    ('/assets/geometries/cubes/cube3.drc', 'assets/geometries/cubes/cube3.drc'),

    # Audio (.ogg)
    ('/assets/audio/logo.ogg', 'assets/audio/logo.ogg'),
    ('/assets/audio/beeps.ogg', 'assets/audio/beeps.ogg'),
    ('/assets/audio/beeps2.ogg', 'assets/audio/beeps2.ogg'),
    ('/assets/audio/beeps3.ogg', 'assets/audio/beeps3.ogg'),
    ('/assets/audio/ui-short.ogg', 'assets/audio/ui-short.ogg'),
    ('/assets/audio/ui-long.ogg', 'assets/audio/ui-long.ogg'),
    ('/assets/audio/igloo.ogg', 'assets/audio/igloo.ogg'),
    ('/assets/audio/music-highq.ogg', 'assets/audio/music-highq.ogg'),
    ('/assets/audio/shard.ogg', 'assets/audio/shard.ogg'),
    ('/assets/audio/particles.ogg', 'assets/audio/particles.ogg'),
    ('/assets/audio/enter-project.ogg', 'assets/audio/enter-project.ogg'),
    ('/assets/audio/click-project.ogg', 'assets/audio/click-project.ogg'),
    ('/assets/audio/leave-project.ogg', 'assets/audio/leave-project.ogg'),
    ('/assets/audio/project-text.ogg', 'assets/audio/project-text.ogg'),
    ('/assets/audio/room.ogg', 'assets/audio/room.ogg'),
    ('/assets/audio/manifesto.ogg', 'assets/audio/manifesto.ogg'),
    ('/assets/audio/wind.ogg', 'assets/audio/wind.ogg'),
    ('/assets/audio/circles.ogg', 'assets/audio/circles.ogg'),

    # Textures & Images
    ('/assets/images/igloo/igloo_scene.ktx2', 'assets/images/igloo/igloo_scene.ktx2'),
    ('/assets/images/igloo/igloo_color.ktx2', 'assets/images/igloo/igloo_color.ktx2'),
    ('/assets/images/igloo/igloo_exploded_color.ktx2', 'assets/images/igloo/igloo_exploded_color.ktx2'),
    ('/assets/images/igloo/ground_color.ktx2', 'assets/images/igloo/ground_color.ktx2'),
    ('/assets/images/igloo/ground_glow.ktx2', 'assets/images/igloo/ground_glow.ktx2'),
    ('/assets/images/igloo/ground_sansigloo_color.ktx2', 'assets/images/igloo/ground_sansigloo_color.ktx2'),
    ('/assets/images/igloo/mountain_color.ktx2', 'assets/images/igloo/mountain_color.ktx2'),
    ('/assets/images/igloo/numbers.ktx2', 'assets/images/igloo/numbers.ktx2'),
    ('/assets/images/igloo/triangles_tiling.ktx2', 'assets/images/igloo/triangles_tiling.ktx2'),
    ('/assets/images/cubes/advect.png', 'assets/images/cubes/advect.png'),
    ('/assets/images/cubes/bg.png', 'assets/images/cubes/bg.png'),
    ('/assets/images/cubes/blurrytext_atlas.ktx2', 'assets/images/cubes/blurrytext_atlas.ktx2'),
    ('/assets/images/cubes/cube_scene.ktx2', 'assets/images/cubes/cube_scene.ktx2'),
    ('/assets/images/cubes/dot_pattern.ktx2', 'assets/images/cubes/dot_pattern.ktx2'),
    ('/assets/images/cubes_env.exr', 'assets/images/cubes_env.exr'),
    ('/assets/images/noises/blue-8-128-rgb.ktx2', 'assets/images/noises/blue-8-128-rgb.ktx2'),
    ('/assets/images/ui/arrow-datatexture.ktx2', 'assets/images/ui/arrow-datatexture.ktx2'),
    ('/assets/images/ui/close-datatexture.ktx2', 'assets/images/ui/close-datatexture.ktx2'),
    ('/assets/images/ui/logo-datatexture.ktx2', 'assets/images/ui/logo-datatexture.ktx2'),
    ('/assets/images/ui/sound-datatexture.ktx2', 'assets/images/ui/sound-datatexture.ktx2'),
    ('/assets/images/ui/visit-datatexture.ktx2', 'assets/images/ui/visit-datatexture.ktx2'),
    ('/assets/images/uv/uvchecker-srgb.png', 'assets/images/uv/uvchecker-srgb.png'),
    ('/assets/images/uv/uvchecker-srgb.ktx2', 'assets/images/uv/uvchecker-srgb.ktx2'),
    ('/assets/images/perlin-datatexture.png', 'assets/images/perlin-datatexture.png'),
    ('/assets/images/perlin-datatexture.ktx2', 'assets/images/perlin-datatexture.ktx2'),
    ('/assets/images/numbers-datatexture.ktx2', 'assets/images/numbers-datatexture.ktx2'),
    ('/assets/images/scroll-datatexture.ktx2', 'assets/images/scroll-datatexture.ktx2'),
    ('/assets/images/frost-datatexture.ktx2', 'assets/images/frost-datatexture.ktx2'),
    ('/assets/images/floor_color.ktx2', 'assets/images/floor_color.ktx2'),
    ('/assets/images/bokeh.ktx2', 'assets/images/bokeh.ktx2'),
    ('/assets/images/caustics.ktx2', 'assets/images/caustics.ktx2'),
    ('/assets/images/clouds_noise.ktx2', 'assets/images/clouds_noise.ktx2'),
    ('/assets/images/mosaic.ktx2', 'assets/images/mosaic.ktx2'),
    ('/assets/images/shapes_blurred.ktx2', 'assets/images/shapes_blurred.ktx2'),
    ('/assets/images/wind_noise.ktx2', 'assets/images/wind_noise.ktx2'),

    # Portal Rings Textures
    ('/assets/images/shattered_ring_color.ktx2', 'assets/images/shattered_ring_color.ktx2'),
    ('/assets/images/shattered_ring_ao.ktx2', 'assets/images/shattered_ring_ao.ktx2'),
    ('/assets/images/shattered_ring2_color.ktx2', 'assets/images/shattered_ring2_color.ktx2'),
    ('/assets/images/shattered_ring2_ao.ktx2', 'assets/images/shattered_ring2_ao.ktx2'),

    # Portfolio Cube & Interior Textures
    ('/assets/images/cubes/cube1_roughness.ktx2', 'assets/images/cubes/cube1_roughness.ktx2'),
    ('/assets/images/cubes/cube2_roughness.ktx2', 'assets/images/cubes/cube2_roughness.ktx2'),
    ('/assets/images/cubes/cube3_roughness.ktx2', 'assets/images/cubes/cube3_roughness.ktx2'),
    ('/assets/images/cubes/cube1_normal.ktx2', 'assets/images/cubes/cube1_normal.ktx2'),
    ('/assets/images/cubes/cube2_normal.ktx2', 'assets/images/cubes/cube2_normal.ktx2'),
    ('/assets/images/cubes/cube3_normal.ktx2', 'assets/images/cubes/cube3_normal.ktx2'),
    ('/assets/images/cubes/pudgy_color.ktx2', 'assets/images/cubes/pudgy_color.ktx2'),
    ('/assets/images/cubes/overpass_logo_color.ktx2', 'assets/images/cubes/overpass_logo_color.ktx2'),
    ('/assets/images/cubes/abstractlogo_color.ktx2', 'assets/images/cubes/abstractlogo_color.ktx2'),
    ('/assets/images/pudgy_dark_color.ktx2', 'assets/images/pudgy_dark_color.ktx2'),
    ('/assets/images/overpass_logo_dark_color.ktx2', 'assets/images/overpass_logo_dark_color.ktx2'),
    ('/assets/images/abstractlogo_dark_color.ktx2', 'assets/images/abstractlogo_dark_color.ktx2'),

    # Social Media 3D Volumetric Textures (VDB particle meshes)
    ('/assets/images/volumes/peachesbody_64.ktx2', 'assets/images/volumes/peachesbody_64.ktx2'),
    ('/assets/images/volumes/x_64.ktx2', 'assets/images/volumes/x_64.ktx2'),
    ('/assets/images/volumes/medium_32.ktx2', 'assets/images/volumes/medium_32.ktx2'),
]

def download_file(url_path, local_rel_path):
    dest = os.path.join(PUBLIC_DIR, local_rel_path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        print(f"Skipping existing: {local_rel_path} ({os.path.getsize(dest)} bytes)")
        return True

    full_url = f"{BASE_URL}{url_path}"
    try:
        req = urllib.request.Request(full_url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            ctype = resp.headers.get('content-type', '')
            if 'text/html' in ctype and not url_path.endswith('.html'):
                print(f"FAILED (HTML returned for non-html): {url_path}")
                return False
            with open(dest, 'wb') as f:
                f.write(content)
            print(f"OK ({len(content)} bytes): {local_rel_path}")
            return True
    except Exception as e:
        print(f"ERROR downloading {full_url}: {e}")
        return False

def sync_volumes():
    src_dir = os.path.join(PUBLIC_DIR, 'assets', 'images', 'volumes')
    target_dir = os.path.join(PUBLIC_DIR, 'assets', 'volumes')
    os.makedirs(target_dir, exist_ok=True)
    if os.path.exists(src_dir):
        for item in os.listdir(src_dir):
            s = os.path.join(src_dir, item)
            d = os.path.join(target_dir, item)
            if os.path.isfile(s) and (not os.path.exists(d) or os.path.getsize(d) != os.path.getsize(s)):
                shutil.copy2(s, d)
                print(f"Synced volume to alternate path: assets/volumes/{item}")

def main():
    print(f"Starting download of {len(ASSETS)} assets into {PUBLIC_DIR}...")
    success = 0
    failed = []
    for url_path, local_path in ASSETS:
        ok = download_file(url_path, local_path)
        if ok:
            success += 1
        else:
            failed.append((url_path, local_path))
    
    sync_volumes()

    print("\n-------------------------------------------")
    print(f"Download complete: {success}/{len(ASSETS)} successful.")
    if failed:
        print(f"Failed count: {len(failed)}")
        for f in failed:
            print(f" - {f[0]}")
        sys.exit(1)
    else:
        print("All assets verified and downloaded successfully.")

if __name__ == '__main__':
    main()
