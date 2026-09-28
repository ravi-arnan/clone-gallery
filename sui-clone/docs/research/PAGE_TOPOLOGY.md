# Page Topology: Sui.io

Target URL: `https://www.sui.io/`

## Arsitektur & Hierarki Komponen

Halaman beranda Sui.io dibangun dengan arsitektur web modern yang memadukan Webflow runtime, GSAP 3.15 suite, Lenis smooth scrolling, Rive WASM runtime, Lottie animation engine, dan Canvas 2D image sequence.

```
+-----------------------------------------------------------------------------------+
| Navigation Bar (Sticky / Glassmorphism / Dropdown Menus / Language Selector)      |
+-----------------------------------------------------------------------------------+
| Section 1: Hero Section (`hero-section custom_hero`)                              |
| - Noise canvas overlay (`.noise.absolutetop`)                                     |
| - Background looping video (`Sui - New Homepage Visual`)                          |
| - Hero typography ("Where AI transacts", subtext, dual CTA buttons)               |
+-----------------------------------------------------------------------------------+
| Section 2 & 3: Marquee Showcases (`home-carousel`)                                |
| - Ticker logos dan partner ecosystem marquee                                      |
| - Infinite continuous scroll animation                                            |
+-----------------------------------------------------------------------------------+
| Section 4: Grid Blink Wrapper (`blink_wrap`)                                      |
| - Interactive grid lines and point light animation (DrawSVG / Stagger)            |
+-----------------------------------------------------------------------------------+
| Section 5: Canvas Sequence & Timeline (`#canvasPin` & `.timeline_wrapper`)        |
| - Canvas sequence player (76 frames 3D sequence pinned on scroll)                 |
| - Heading: "The stack autonomous systems run on"                                  |
| - 6 Interactive Rive Animation Cards:                                             |
|   1. 01 Sui (Core Layer)                                                          |
|   2. 02 Agent knowledge store (Walrus - Data Storage.riv)                         |
|   3. 03 Execution Layer                                                           |
|   4. 04 Verifiable agent compute (Nautilus - Verifiable Off Chain.riv)            |
|   5. 05 Settlement Layer                                                          |
|   6. 06 Verifiable agent identity (SuiNS - Identity Management.riv)               |
| - Dynamic progress bar with dotted connector indicators                          |
+-----------------------------------------------------------------------------------+
| Section 6: Feature Selection Tabs (`home-selection`)                              |
| - Heading: "Policy-enforced assets"                                               |
| - Interactive state switcher dengan Lottie animation embeds                       |
| - Card showcase metrics                                                           |
+-----------------------------------------------------------------------------------+
| Section 7: Benefits Section (`home-benefits`)                                     |
| - Heading: "For businesses" & "For developers"                                    |
| - Dual-view interactive switcher, card grids, highlight accents                   |
+-----------------------------------------------------------------------------------+
| Section 8: Industry Showcase (`home-industry`)                                    |
| - Heading: "Industry transformation powered by Sui"                               |
| - Interactive expandable rows: Gaming, Institutions, DeFi, AI, Research           |
| - Dynamic hover preview states dengan Lottie & ScrambleText                       |
+-----------------------------------------------------------------------------------+
| Section 9: Video Explainer Loop (`home-loop`)                                     |
| - "Sui explainer video: The full stack, built on Sui"                             |
| - Cinematic video cutdowns (SuiFest, KBW, overview)                               |
+-----------------------------------------------------------------------------------+
| Global Footer                                                                     |
| - Multi-column site directory, social links, newsletter signup, copyright        |
+-----------------------------------------------------------------------------------+
```
