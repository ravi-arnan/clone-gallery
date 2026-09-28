import subprocess
import time
import urllib.request
import os
import sys

# Start server
server_proc = subprocess.Popen(
    ["node", "server.mjs"],
    cwd="/home/ravi/Projects/floema-clone",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

time.sleep(1.5)

endpoints = [
    ("/", "text/html"),
    ("/en", "text/html"),
    ("/_nuxt/DOn5zXw2.js", "application/javascript"),
    ("/_nuxt/entry.D9Lu-YTe.css", "text/css"),
    ("/_nuxt/Images.worker-DJGdEiMP.js", "application/javascript"),
    ("/_nuxt/Shadows.worker-C5dCWLRm.js", "application/javascript"),
    ("/_nuxt/ModelView.worker-ChHUB9To.js", "application/javascript"),
    ("/3d/shadows/packed_texture_3.png", "image/png"),
    ("/3d/shadows/noiseTexture.png", "image/png"),
    ("/3d/envmaps/HDR_Light_Studio_Free_HDRI_Design_13.exr", "image/x-exr"),
    ("/draco/draco_decoder.wasm", "application/wasm"),
    ("/draco/draco_decoder.js", "application/javascript"),
    ("/models/palmer-tee-sign.glb", "model/gltf-binary"),
    ("/models/byside-bench-plaza.glb", "model/gltf-binary"),
    ("/audio/about-foreground.mp3", "audio/mpeg"),
    ("/_nuxt/Zimula-Variable.Cb2n2uX-.ttf", "font/ttf")
]

print("=== TESTING HTTP SERVER ENDPOINTS ===")
success = True
for ep, expected_ct in endpoints:
    url = f"http://localhost:3000{ep}"
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as res:
            status = res.status
            ct = res.headers.get("Content-Type", "")
            data = res.read()
            if status == 200 and expected_ct in ct:
                print(f"  [OK] {ep:45} -> Status: {status} | Size: {len(data):8} bytes | CT: {ct.split(';')[0]}")
            else:
                print(f"  [WARN] {ep:45} -> Status: {status} | CT: {ct} (expected {expected_ct})")
                success = False
    except Exception as e:
        print(f"  [FAIL] {ep:45} -> Error: {e}")
        success = False

# Test HTTP Range request on audio
try:
    range_req = urllib.request.Request("http://localhost:3000/audio/about-foreground.mp3", headers={"Range": "bytes=0-1023"})
    with urllib.request.urlopen(range_req, timeout=5) as res:
        range_header = res.headers.get("Content-Range", "")
        data = res.read()
        print(f"\nRange test audio (bytes=0-1023): Status {res.status}, Range: {range_header}, Received {len(data)} bytes")
        if len(data) == 1024:
            print("  [OK] Range streaming works perfectly!")
        else:
            print("  [WARN] Unexpected range length:", len(data))
except Exception as e:
    print(f"  [FAIL] Range test error: {e}")
    success = False

# Kill server process
server_proc.terminate()
try:
    server_proc.wait(timeout=3)
except Exception:
    server_proc.kill()

print("\nResult:", "ALL TESTS PASSED!" if success else "SOME TESTS FAILED!")
if not success:
    sys.exit(1)
