# Page Topology: Mana Yerba Maté

**Target URL:** https://en.manayerbamate.com/  
**Source Type:** Shopify Custom Headless Theme (WebGL Three.js + GSAP + Lottie + Lenis)  
**Layout Hierarchy:**

```
body.template-index [data-boisson, data-modele, data-hdr, data-mure, data-trop, data-melo, data-lottie_*]
├── .mainCanvas (Fixed fullscreen WebGL container: Three.js canette, ACESFilmic, HDR environment map)
├── .offCanvas (Intersection trigger for ticker stop/start)
├── header.c-Header (Sticky navigation, flyout megamenus, cart drawer, language selector, credits modal)
│   ├── .bandeau (Announcement promo bar)
│   ├── .header (Main navbar with logo, nav links, cart toggle, mobile trigger)
│   ├── .sousMenu (Desktop flyout menus: .itemsBoutique, .itemsApprendre)
│   ├── .oCart (Sliding side cart drawer)
│   ├── .credits (Credits overlay modal)
│   └── .innerMenuMob (Mobile navigation drawer)
├── main.content-for-layout
│   ├── section.c-HomeHero
│   │   ├── .c-HomeHero-fond (Dynamic themed background with flavor color shifts)
│   │   ├── .c-HomeHero--part1 (Hero viewport with 3D can overlay, flavor selector carousel, lottie stickers)
│   │   ├── .c-HomeHero--part2 (ScrollTrigger-pinned circular benefits dial with 4 lottie cards)
│   │   └── .c-HomeHero--part3 (Customer quotes and reviews carousel)
│   ├── section.c-imagesDuo (Lifestyle photo duo with parallax depth)
│   ├── section.c-wordParagraph.negativ (Brand statement with rainbow character stagger animations)
│   ├── section.c-productsSlider (Swiper product showcase with animated circle clip-path hover masks)
│   ├── section.c-newsletterSubscribe.negativ (Newsletter email subscription section)
│   └── section.c-instagramPush (Social media lifestyle grid)
└── footer.c-Footer.negativ
    ├── .innerJeu (Playable interactive canvas/lottie runner mini-game)
    │   ├── .walk, .jump, .sad, .happy (Lottie character state animations)
    │   ├── .innerPaysage (Scrolling terrain background)
    │   ├── .nuage1, .nuage2 (GSAP timeline clouds)
    │   ├── .denree (Catchable yerba mate items)
    │   └── .startGame, .startGameMobile (Game controllers and jump trigger)
    └── .innerFooter (Navigation links, legal disclosures, newsletter, socials)
```
