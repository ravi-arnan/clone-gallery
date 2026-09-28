# Page Topology & Component Breakdown: Terminal Industries

Source: https://terminal-industries.com/

## 1. Global Layout & Shell
- **Header (`SiteHeader` / `Navigation`):**
  - Terminal logo (SVG vector with animated hover)
  - Navigation links: `Platform`, `Solutions`, `Resources`, `Company`, `Contact`
  - Floating CTA pill: `Schedule a Demo` / `Contact`
  - Mobile burger navigation with fullscreen drawer menu
- **Background Canvas (`BackgroundCanvas`):**
  - Absolute positioned background canvas layer
  - Dynamic theme modes (`dark`, `green`, `white`)
  - Organic ambient color transitions controlled via CSS variables and GSAP ticker

## 2. Homepage Sections
1. **Hero Section (`VideoCarousel` & `VideoSequenceScroll`):**
   - Canvas-rendered 3D yard simulation sequence (410 frames desktop, 409 frames mobile)
   - Scrubbed in real time via GSAP ScrollTrigger
   - `ScrollIndicator`: Interactive floating cursor follower tracking mouse dampening (`mouseDamp`)
   - `ScrollContent`: 3-stage headline progression revealing value propositions synchronized with sequence scrub
2. **Value Prop & Benchmark Notches (`NotchSection`):**
   - High-contrast notched container dividers
   - Monospace KPI metrics and odometer counter animations
3. **Features & 3D Solutions Sequence (`SolutionsFeatures`):**
   - 272-frame 3D sequence (`/static/frames/solutions/webp/{index}.webp`)
   - SplitText line animations (`split-text-line`) with Expo easing
   - Multi-stage step indicators and odometer number counter (`01`, `02`, `03`)
4. **Pre-Rendered Showcase Media (`VideoCard` / Storyblok Videos):**
   - High-definition MP4 renders (`vid_3-1_prerender_1.mp4`, `vid_3-2_prerender_1.mp4`, etc.)
   - High-res diagrams (`yard.png`, `dock-doors.png`, `gate-entry.jpg`)
5. **Customer Social Proof & Enterprise Logos:**
   - Vector client marques (Prologis, Ryder, Lineage, Foxconn, DSV, TJX, etc.)
   - Customer quotes with editorial portrait photography
6. **Footer:**
   - Newsletter subscription form (`/api/subscribe`)
   - Legal, social links, and security compliance badges (SOC2)
