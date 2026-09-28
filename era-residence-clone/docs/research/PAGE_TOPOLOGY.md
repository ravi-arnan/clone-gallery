# ERA Residence — Page Topology & Architecture

## Overview
- **Target Site:** `https://www.era-residence.com/`
- **Application Type:** Luxury Real Estate Interactive Web Experience
- **Core Technologies:** Webflow DOM structure, GSAP 3.15 + ScrollTrigger + CustomEase + SplitText, Lenis Smooth Scroll, Barba.js SPA Transitions, Lottie Web Animation, HTML5 Alpha WebM / MOV 3D Flower Simulations.

---

## Route Topology

```
/
├── (Home Page)                     # Master experiential landing page
│   ├── Preloader                   # Master brand preloader with circular SVG animation
│   ├── Navigation                  # Floating interactive nav with magnetic items & mobile drawer
│   ├── Hero Section                # 3D perspective scale & translateZ background
│   ├── Intro & Philosophy          # SplitText editorial typography reveal
│   ├── Benefits Intro              # Expanding circular typography with dynamic word spacing
│   ├── Location Section (Horizontal)# GSAP horizontal scrub pinned track with 3D floating flowers
│   ├── Architecture Reveal         # Dual polygon clip-path morph with expanding 3D bougainvillea
│   ├── Residences Preview          # Interactive apartment highlights & hover previews
│   ├── Amenities Section           # Scale-in zoom container & feature highlights
│   └── Footer Section              # Inset morphing clip-path with contact CTA & newsletter
│
├── /apartments                     # Full inventory & master unit selector
│   ├── Hero Banner                 # Editorial header & quick stats
│   ├── Filter & Sort Bar           # Multi-category filter (bedrooms, floor, orientation, price)
│   ├── Grid / List Views           # Filterable residence cards with floor plan previews
│   └── Building Diagram            # Interactive level selector with pulse pins
│
├── /apartments/:id                 # 25 Detailed unit pages (011, 012, ..., 224)
│   ├── Apartment Header            # Unit number, specs (sqm, bedrooms, floor, orientation)
│   ├── Interactive Floor Plan      # High-res SVG/WebP architectural drawings with zoom
│   ├── Gallery Slider              # Interior & exterior photo carousel with counter
│   ├── Specifications Table        # Detailed area breakdown & finishes
│   └── Inquiry Sticky CTA          # Direct inquiry form trigger
│
├── /contact                        # Inquiries, showroom booking & sales team
│   ├── Contact Form                # Name, email, phone, apartment preference, message
│   ├── Office & Showroom Details   # Address, hours, phone, interactive map pin
│   └── Legal & Developer Credits   # TFTL developer credentials & branding
│
└── /coming-soon                    # Exclusive teaser portal
```

---

## Master Layout & Z-Index Layering

1. `z-index: 1000` — `#master-preloader`: Full-screen brand intro curtain with circular progress SVG.
2. `z-index: 900` — `#modal-menu`, `#modal-cta`: Full-screen navigation overlay and inquiry drawer.
3. `z-index: 500` — Navigation bar (`.nav-w`): Fixed floating brand logo and menu toggle.
4. `z-index: 200` — Floating 3D WebM bougainvillea flowers (`.flower.*`): Absolutely positioned alpha video layers responding to scroll parallax.
5. `z-index: 100` — Fixed floating pins and tip popups (`.pin`, `[data-modal-tip]`).
6. `z-index: 10` — Main scroll content container (`#app`, `[data-barba="container"]`).
7. `z-index: 1` — Background media layers (`.hero-w_bg`, `.loc-w_bg`, parallax images).

---

## Key Assets Mapping

- **3D Bougainvillea Flower Simulations:**
  - `bougainvillea-flowers_01.webm` through `07.webm` (WebM VP9 with Alpha channel)
  - `bougainvillea-flowers_01.mov` through `07.mov` (Apple HEVC with Alpha channel)
- **Typography:**
  - `ambroise-francois-std` (Luxury serif display, Adobe Typekit)
  - `sloop-script-three` (Editorial calligraphic accents, Adobe Typekit)
  - `Maison Neue` / `Maison Neue Extended` (Clean geometric sans-serif for UI & specs)
- **Lottie Brand Engine:**
  - `tftl-logo_white.json` (Vector animated signature of TFTL developer)
