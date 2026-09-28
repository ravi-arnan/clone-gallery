#!/usr/bin/env python3
import os
import gzip
import struct

ROOT_DIR = "/home/ravi/Projects/cornrevolution-clone/public"
decompressed_count = 0
failed_count = 0

for root, dirs, files in os.walk(ROOT_DIR):
    for f in files:
        if f.endswith(".ktx"):
            p = os.path.join(root, f)
            with open(p, "rb") as fp:
                magic = fp.read(2)
            if magic == b'\x1f\x8b':
                try:
                    with gzip.open(p, "rb") as gz:
                        data = gz.read()
                    with open(p, "wb") as out:
                        out.write(data)
                    rel = os.path.relpath(p, ROOT_DIR)
                    decompressed_count += 1
                    # verify KTX magic
                    is_ktx = data[:12] == b'\xabKTX 11\xbb\r\n\x1a\n'
                    print(f"  [OK] Decompressed {rel} ({len(data)} bytes, valid KTX: {is_ktx})")
                except Exception as e:
                    print(f"  [FAIL] {p}: {e}")
                    failed_count += 1

print(f"\nFinished decompressing KTX files: {decompressed_count} OK, {failed_count} failed.")
