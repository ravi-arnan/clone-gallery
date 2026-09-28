import urllib.request
import os

MODELS = [
    ("palmer-tee-sign", "https://cdn.sanity.io/files/535lnz3g/production/18a7cfad80564e5a5d02066bd3194c772b3a11ac.buf"),
    ("byside-bench-plaza", "https://cdn.sanity.io/files/535lnz3g/production/65740fd57931f5f6bc617200e9a6a51f5020378f.buf")
]

target_dir = "/home/ravi/Projects/floema-clone/public/models"
os.makedirs(target_dir, exist_ok=True)

# Also preserve the exact sanity URL path locally so any fetch to cdn.sanity.io gets served
sanity_dir = "/home/ravi/Projects/floema-clone/public/cdn.sanity.io/files/535lnz3g/production"
os.makedirs(sanity_dir, exist_ok=True)

for name, url in MODELS:
    fname = os.path.basename(url)
    sanity_target = os.path.join(sanity_dir, fname)
    print(f"Fetching {name} from {url}...")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as res:
        buf_data = res.read()
    
    # Save original .buf
    with open(sanity_target, "wb") as f:
        f.write(buf_data)
    print(f"Saved .buf ({len(buf_data)} bytes) to {sanity_target}")

    # Un-XOR with 91 to get GLB binary
    glb_data = bytearray(buf_data)
    for i in range(len(glb_data)):
        glb_data[i] ^= 91
    
    # Check GLTF magic header "glTF"
    magic = glb_data[:4]
    print(f"Magic header after XOR 91: {magic} (should be b'glTF')")
    
    # Save .glb
    glb_path = os.path.join(target_dir, f"{name}.glb")
    with open(glb_path, "wb") as f:
        f.write(glb_data)
    print(f"Saved {glb_path} ({len(glb_data)} bytes)")
