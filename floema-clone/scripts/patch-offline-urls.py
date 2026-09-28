# 1. Patch audio URL in DKtYPyz8.js
audio_js = "/home/ravi/Projects/floema-clone/public/_nuxt/DKtYPyz8.js"
with open(audio_js, "r", encoding="utf-8") as f:
    c = f.read()

target_audio_url = "https://burospaces1.fra1.cdn.digitaloceanspaces.com/floema"
if target_audio_url in c:
    c = c.replace(target_audio_url, "/audio")
    with open(audio_js, "w", encoding="utf-8") as f:
        f.write(c)
    print("Patched audio URL to /audio in DKtYPyz8.js")
else:
    print("Audio URL already patched or not found")

# 2. Patch draco path in ModelView.worker-ChHUB9To.js
worker_js = "/home/ravi/Projects/floema-clone/public/_nuxt/ModelView.worker-ChHUB9To.js"
with open(worker_js, "r", encoding="utf-8") as f:
    w = f.read()

target_draco = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
if target_draco in w:
    w = w.replace(target_draco, "/draco/")
    with open(worker_js, "w", encoding="utf-8") as f:
        f.write(w)
    print("Patched draco URL to /draco/ in ModelView.worker-ChHUB9To.js")
else:
    print("Draco URL already patched or not found")
