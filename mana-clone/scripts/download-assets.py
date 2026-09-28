#!/usr/bin/env python3
import os
import sys
import re
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Referer": "https://en.manayerbamate.com/"
}

THEME_ASSETS = [
    "MANA_canette_hibiscus_color_for_mat.png",
    "MANA_canette_melon_mint_mat.png",
    "MANA_canette_pamp_color_for_mat_v2.png",
    "MANA_canette_pamp_roughness__metal_maps.png",
    "MANA_canette_top_normal copy_exr.png",
    "MANA_canette_top_normal%20copy_exr.png",
    "MANA_canette_tropical_color_for_mat.png",
    "MANA_canettes__v5_WEBGL.bin",
    "MANA_canettes__v5_WEBGL.gltf",
    "MANA_hdr.hdr",
    "NeueMontreal-Medium.woff",
    "NeueMontreal-Medium.woff2",
    "NeueMontreal2020-Book.woff",
    "NeueMontreal2020-Book.woff2",
    "NeueMontreal2020-Regular.woff",
    "NeueMontreal2020-Regular.woff2",
    "app.css",
    "bubbles.json",
    "bulle.svg",
    "canette.svg",
    "carte_antiox.json",
    "carte_caf.json",
    "carte_crash.json",
    "carte_vege.json",
    "etoile.svg",
    "fleur.png",
    "fond1.png",
    "fond2.png",
    "fond3.png",
    "fond4.png",
    "global.js",
    "home_bulles.svg",
    "home_eau.svg",
    "home_fleur.svg",
    "home_planet.svg",
    "home_star.svg",
    "i_arrow.svg",
    "i_fb.svg",
    "i_ig.svg",
    "i_li.svg",
    "jeu_happy.json",
    "jeu_jump.json",
    "jeu_paysage.json",
    "jeu_sad.json",
    "jeu_walk.json",
    "lottie_hibi_1.json",
    "lottie_hibi_2.json",
    "lottie_hibi_3.json",
    "lottie_melo_1.json",
    "lottie_melo_2.json",
    "lottie_melo_3.json",
    "lottie_pamp_1.json",
    "lottie_pamp_2.json",
    "lottie_pamp_4.json",
    "lottie_trop_1.json",
    "lottie_trop_2.json",
    "lottie_trop_4.json",
    "mangue.svg",
    "nuage.svg",
    "obs1.svg",
    "obs2.svg",
    "obs3.svg",
    "obs4.svg",
    "obs5.svg",
    "obs6.svg",
    "obs7.svg",
    "transition-faster.json",
    "woman.svg"
]

SHOP_FILES = [
    "1-1eie_827x980_crop_center@2x.jpg",
    "1-1eie_827x980.jpg",
    "2-1eie_827x980_crop_center@2x.jpg",
    "2-1eie_827x980.jpg",
    "boite_827x980_crop_center@2x.jpg",
    "boite_827x980.jpg",
    "favicon-32x32.png",
    "left_5a17133c-fc16-4907-af73-f964dc926e47_700x750_crop_center@2x.jpg",
    "left_5a17133c-fc16-4907-af73-f964dc926e47_700x750_crop_center.jpg",
    "MANA_2024_3d_visuel_2_1920x1080_-_150dpi.jpg",
    "Mana5969_250x250_crop_center@2x.jpg",
    "Mana5969_250x250_crop_center.jpg",
    "Mana6004_250x250_crop_center@2x.jpg",
    "Mana6004_250x250_crop_center.jpg",
    "Mana6031_250x250_crop_center@2x.jpg",
    "Mana6031_250x250_crop_center.jpg",
    "Mana6064_250x250_crop_center@2x.jpg",
    "Mana6064_250x250_crop_center.jpg",
    "menu-box-new_340x280_crop_center@2x.jpg",
    "menu-box-new_340x280_crop_center.jpg",
    "menu-melon-new_340x280_crop_center@2x.jpg",
    "menu-melon-new_340x280_crop_center.jpg",
    "mure_340x280_crop_center@2x.jpg",
    "mure_340x280_crop_center.jpg",
    "mures-01_1f205ae0-9697-4285-bb1b-88a2d02ce70d_827x980_crop_center@2x.jpg",
    "mures-01_1f205ae0-9697-4285-bb1b-88a2d02ce70d_827x980.jpg",
    "mures-02_827x980_crop_center@2x.jpg",
    "mures-02_827x980.jpg",
    "pamplemousse-01_827x980_crop_center@2x.jpg",
    "pamplemousse-01_827x980.jpg",
    "pamplemousse-02_827x980_crop_center@2x.jpg",
    "pamplemousse-02_827x980.jpg",
    "pamplemousse_340x280_crop_center@2x.jpg",
    "pamplemousse_340x280_crop_center.jpg",
    "Rectangle19_340x280_crop_center@2x.jpg",
    "Rectangle19_340x280_crop_center.jpg",
    "Rectangle_20_1cd86e90-220b-43f8-bdbf-389953830b47_340x280_crop_center@2x.jpg",
    "Rectangle_20_1cd86e90-220b-43f8-bdbf-389953830b47_340x280_crop_center.jpg",
    "Rectangle_21_969a0ca3-3087-4139-a9a8-23cd6ad8e82e_340x280_crop_center@2x.jpg",
    "Rectangle_21_969a0ca3-3087-4139-a9a8-23cd6ad8e82e_340x280_crop_center.jpg",
    "Rectangle_22_067f698c-d7b2-4b59-b7ec-4b556e616fb3_340x280_crop_center@2x.jpg",
    "Rectangle_22_067f698c-d7b2-4b59-b7ec-4b556e616fb3_340x280_crop_center.jpg",
    "right_f9e5bdd5-3bee-41c9-996c-ee432de1bd0a_700x750_crop_center@2x.jpg",
    "right_f9e5bdd5-3bee-41c9-996c-ee432de1bd0a_700x750_crop_center.jpg",
    "tropical-01_600x490_crop_center_2x-_2_937b035e-e510-48a2-8a8d-fbeab24afbc7_827x980_crop_center@2x.jpg",
    "tropical-01_600x490_crop_center_2x-_2_937b035e-e510-48a2-8a8d-fbeab24afbc7_827x980.jpg",
    "tropical-01_827x980_crop_center@2x.jpg",
    "tropical-01_827x980.jpg",
    "tropical-02_827x980_crop_center@2x.jpg",
    "tropical-02_827x980.jpg",
    "tropicale_340x280_crop_center@2x.jpg",
    "tropicale_340x280_crop_center.jpg"
]

def download_file(url, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
        return True, local_path, "already exists"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=20) as response, open(local_path, "wb") as out_file:
            out_file.write(response.read())
        return True, local_path, "downloaded"
    except Exception as e:
        return False, local_path, str(e)

def main():
    tasks = []

    # 1. Theme assets
    base_theme_url = "https://manayerbamate.com/cdn/shop/t/18/assets/"
    dest_theme_dir = os.path.join(PUBLIC_DIR, "cdn", "shop", "t", "18", "assets")
    dest_short_dir = os.path.join(PUBLIC_DIR, "assets")

    for filename in THEME_ASSETS:
        encoded_fn = urllib.parse.quote(filename)
        url = base_theme_url + encoded_fn
        dest_path = os.path.join(dest_theme_dir, filename)
        tasks.append((url, dest_path))

    # 2. Shop files
    base_files_url = "https://manayerbamate.com/cdn/shop/files/"
    dest_files_dir = os.path.join(PUBLIC_DIR, "cdn", "shop", "files")

    for filename in SHOP_FILES:
        encoded_fn = urllib.parse.quote(filename)
        url = base_files_url + encoded_fn
        dest_path = os.path.join(dest_files_dir, filename)
        tasks.append((url, dest_path))

    # 3. Accelerated checkout CSS
    tasks.append((
        "https://manayerbamate.com/cdn/shopifycloud/portable-wallets/latest/accelerated-checkout-backwards-compat.css",
        os.path.join(PUBLIC_DIR, "cdn", "shopifycloud", "portable-wallets", "latest", "accelerated-checkout-backwards-compat.css")
    ))

    print(f"Starting download of {len(tasks)} assets with 8 threads...")
    success_count = 0
    fail_count = 0

    with ThreadPoolExecutor(max_workers=8) as executor:
        future_to_task = {executor.submit(download_file, url, path): (url, path) for url, path in tasks}
        for future in as_completed(future_to_task):
            url, path = future_to_task[future]
            ok, target, msg = future.result()
            rel = os.path.relpath(target, PUBLIC_DIR)
            if ok:
                success_count += 1
                print(f"[OK] {rel} ({msg})")
            else:
                fail_count += 1
                print(f"[FAILED] {url} -> {rel}: {msg}")

    # Create symlinks or copies in public/assets/ for convenience
    os.makedirs(dest_short_dir, exist_ok=True)
    for filename in os.listdir(dest_theme_dir):
        src = os.path.join(dest_theme_dir, filename)
        dst = os.path.join(dest_short_dir, filename)
        if not os.path.exists(dst):
            try:
                os.symlink(os.path.relpath(src, dest_short_dir), dst)
            except Exception:
                pass

    print(f"\nDownload summary: {success_count} succeeded, {fail_count} failed.")

if __name__ == "__main__":
    main()
