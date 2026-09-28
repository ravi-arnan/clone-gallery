# Interactive Behaviors & Motion Engineering: Lando Norris Clone

## 1. Arsitektur Interaktivitas

Situs mengandalkan orkestrasi paralel antara tiga mesin grafis:
1. **Three.js (r174)**: Mengelola ruang 3D, rendering helm F1, efek pencahayaan berbasis HDRI, dan track splines.
2. **GSAP + ScrollTrigger + Lenis**: Mengatur sinkronisasi posisi kamera 3D dengan scroll progress pengguna.
3. **Rive Canvas Runtime**: Mengatur animasi vektor interaktif pada elemen UI mikro dengan State Machine bawaan.

---

## 2. 3D WebGL Engine (`window.landoGL`)

Engine WebGL diinisialisasi oleh script `lando-by-OFF+BRAND.05.js` yang mengekspos API kontrol global:
- `window.landoGL.params.backgroundScene`: Mengontrol palet warna dinamis (`COLOR_BACKGROUND`, `COLOR_FOREGROUND`) yang berganti mengikuti atribut elemen `data-gl-change-track`, `data-gl-change-from`, dan `data-gl-change-to`.
- `window.landoGL.updateColors()`: Memicu re-interpolasi shader seragam saat background theme berubah.

### PBR & Texture Management:
- **Draco Compression**: Menggunakan `/gl/draco/draco_decoder.wasm` untuk dekompresi cepat model geometri helm (`helmet-21.glb`) dan sirkuit (`tracks-06-test.glb`).
- **HDRI Environment Maps**: Tiga varian exposure studio (`studio_small_08_1k--light.hdr`, `--faded.hdr`, `--dark.hdr`) dimuat secara asinkron untuk simulasi refleksi realistis pada visor helm dan material emas/disco.
- **MSDF (Multi-channel Signed Distance Field) Text**: Font `Brier-Bold-02` dan `MonaSans-Bold-02` di-render langsung di WebGL tanpa pecah pada berbagai tingkat zoom.

---

## 3. Motion & Scroll Sync (GSAP + Lenis)

- **Smooth Scrolling (Lenis)**:
  - Menginterpolasi pergerakan roda mouse/touchpad untuk memberikan sensasi pergerakan inersia yang halus.
  - Setiap tick Lenis memicu update pada camera transform Three.js.
- **ScrollTrigger Timelines**:
  - Saat pengguna menggulir ke bawah, kamera Three.js bermanuver melintasi helm:
    - Segmen Hero: Helm menghadap depan dengan sedikit rotasi mengikuti pointer kursor.
    - Segmen Bio: Kamera mendekati detail visor dan stiker helm.
    - Segmen Vault: Helm berputar 360 derajat menampilkan varian livery emas dan disko.
    - Segmen Circuits: Kamera beralih ke rendering spline trek 3D.

---

## 4. Rive State Machines & Micro-interactions

Situs menggunakan 8 file `.riv` yang berjalan di WebAssembly:
1. `page-transition.riv`: State machine untuk transisi navigasi dan kurtain pembuka halaman.
2. `phrases.riv`: Tipografi kinetik yang merangkai frasa motivasi dan kata kunci Lando.
3. `signature.riv`: Animasi goresan kuas tanda tangan Lando Norris yang dipicu saat elemen masuk ke viewport.
4. `ln4.riv`: Logo morphing animasi LN4 pada menu dan footer.
5. `circuits.riv`: Indikator pin dan minimap interaktif untuk grand prix Formula 1.
6. `reef.riv` & `btn-ui.riv`: Hover effects dan magnetic button feedback pada tombol navigasi.
7. `mob-landscape.riv`: Animasi prompt rotasi layar jika diakses via perangkat mobile orientasi potret/lanskap.

---

## 5. Offline Hardening & Local Routing

Untuk menjamin 100% fungsionalitas tanpa koneksi internet atau ketergantungan CDN eksternal:
- Variabel internal Three.js `vQ` dialihkan ke path lokal `/gl`.
- Variabel Rive path `mj` dan `pR` dialihkan ke path lokal `/rive/`.
- Rive WebAssembly engine di-hardcode ke `/libs/rive/rive.wasm` sehingga tidak melakukan fetch ke `unpkg.com`.
- Semua tracker, pixel iklan, dan telemetry (Google Tag Manager, Klaviyo, Iubenda) telah dihilangkan tanpa merusak lifecycle event Webflow atau Three.js.
