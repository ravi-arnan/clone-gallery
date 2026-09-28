# Sharplink.com Page Topology

- **Source Target:** https://www.sharplink.com/
- **Cloned Location:** `/home/ravi/Projects/sharplink-clone`
- **Architecture:** Nuxt 3 Client Hydration + Three.js r179 WebGPU/WebGL2 + GSAP ScrollTrigger + DotLottie + Chart.js

---

## Visual Order & Sections Hierarchy

1. **Header & Navigation (`site-header`, `navigation-wrapper`, `navbar`):**
   - Fixed top overlay with backdrop blur filter
   - Ticker stock bar ($SBET, Ethereum metrics, market quote)
   - Menu drawer toggle with animated SVG hamburger / close icons

2. **Hero Section (`home-hero`, `wrapped-hero`):**
   - Background video autoplaying looping stream: `shrp_homepagehero_30fps.webm`
   - Split-text heading reveals with staggered GSAP transitions
   - Dual Call to Actions (Explore Opportunities, View Dashboard)
   - Real-time ETH treasury statistics badge

3. **Banner Section (`home-banner`, `banner__content`):**
   - High-impact positioning text reveal
   - Grid lines styling with SVG dashed patterns

4. **Productivity Section (`productivity-chart`, `chart-wrapper`, `card-productivity`):**
   - Interactive Canvas 0: Chart.js rendering ETH staking / productivity yields
   - Dynamic counter badge and metric highlights

5. **Propositions & Machine Stack (`proposition-header`, `slider-container`, `slider`):**
   - 5 full-scale machine architecture illustration slides (`shrp_machine_1` through `5.avif`)
   - Scroll-linked interactive transitions
   - Canvas 1: DotLottie Canvas player running `shrp_stack.json`

6. **Opportunity Section (`card-opportunity`, `opportunity-header`):**
   - Dual format video player: `shrp_homeopportunity_chrome.webm` / `safari.mp4`
   - Interactive benefit cards with icons (`icoopp_1` through `4.webp`)
   - Nasdaq corporate validation logos (`logonasdaq.svg`, `nasdaq_logo-1.png`)

7. **News & Ecosystem Fund Section (`section-news`, `LatestArticles`):**
   - Galaxy Sharplink Ecosystem Liquidity Fund announcement
   - Filter tabs, article cards, date badges

8. **FAQ Accordion (`section-faq`, `faq-header`):**
   - Interactive accordion item toggle with smooth expansion animations

9. **Pre-Footer & 3D Interactive Logo (`logo-canvas`, `webgl-wrapper`):**
   - Canvas 2: Three.js r179 WebGPU/WebGL2 running `packed_texture.png` with custom shader nodes
   - Dynamic mouse move tracking, vertex lerping, and 3D floating coordinates (`vertex-label`)

10. **Footer Section (`site-footer`, `footer-grid`, `footer-lines`):**
    - Newsletter alert widget
    - Sitemap navigation links
    - Legal compliance notes and copyright
