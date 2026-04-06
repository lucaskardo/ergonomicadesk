# S33B — Visual Polish Summary

## Files Modified

### Task 1: Warm palette migration
- `apps/storefront/src/modules/home/components/commercial-preview/index.tsx` — bg-ergo-950 to bg-ergo-bg, all text/card colors adapted
- `apps/storefront/src/modules/home/components/build-your-desk/index.tsx` — bg-ergo-950 to bg-white, SVG scene recolored for light theme
- `apps/storefront/src/modules/home/components/social-proof/index.tsx` — stats bar bg-ergo-950 to bg-ergo-bg-warm
- `apps/storefront/src/app/[countryCode]/(main)/comercial/page.tsx` — "Por qué Ergonómica" section: bg-ergo-950 to bg-ergo-bg-warm

### Task 2: Scroll animations + marquee
- `apps/storefront/src/modules/common/components/scroll-animate/index.tsx` — **NEW** ScrollAnimate wrapper
- `apps/storefront/src/modules/common/components/animated-counter/index.tsx` — **NEW** AnimatedCounter
- `apps/storefront/src/modules/home/components/marquee/index.tsx` — **NEW** Marquee band
- `apps/storefront/tailwind.config.js` — Added fade-up, scale-in, marquee keyframes/animations + clay color token
- `apps/storefront/src/modules/home/components/trust-bar/index.tsx` — Added fade-up stagger
- `apps/storefront/src/modules/home/components/category-grid/index.tsx` — Added scale-in stagger
- `apps/storefront/src/modules/home/components/featured-products-home/index.tsx` — Added fade-up stagger
- `apps/storefront/src/modules/home/components/why-ergonomica/index.tsx` — Added fade-up stagger
- `apps/storefront/src/modules/home/components/social-proof/index.tsx` — Added fade-up reviews + AnimatedCounter stats
- `apps/storefront/src/modules/home/components/commercial-preview/index.tsx` — Added fade-up stagger
- `apps/storefront/src/modules/home/components/blog-preview/index.tsx` — Added scale-in stagger
- `apps/storefront/src/modules/home/components/newsletter/index.tsx` — Added fade-up
- `apps/storefront/src/modules/home/templates/homepage.tsx` — Added Marquee after Hero in fallback

### Task 3: Animated SVG icons
- `apps/storefront/src/modules/commercial/components/animated-icons.tsx` — **NEW** 8 animated SVG icons
- `apps/storefront/src/app/[countryCode]/(main)/comercial/page.tsx` — Replaced $, ✦, ★ with IconFactoryDirect, IconStandingDesk, IconSkyline; replaced 01/02/03 numbers with IconChat, IconFloorPlan, IconDelivery
- `apps/storefront/src/modules/home/components/commercial-preview/index.tsx` — Replaced emoji sector icons with animated SVGs

### Task 4: Palette tokens
- `apps/storefront/tailwind.config.js` — Added `clay: "#E8E0D5"` (sand skipped — too similar to bg-warm)

## Build Result
- TypeScript: PASSES (0 errors in storefront)
- Next.js compilation: PASSES (compiled successfully in ~14s)
- Full build: Cannot complete data collection — Medusa backend is offline (ECONNREFUSED). This is an infrastructure issue, not a code issue.

## Visual Changes

### Homepage (top to bottom)
1. **Hero** — unchanged (dark)
2. **Marquee** — NEW dark band with scrolling text
3. **Trust Bar** — unchanged (white) + fade-up animation
4. **Category Grid** — unchanged (bg-ergo-bg) + scale-in animation
5. **Featured Products** — unchanged (bg-ergo-bg) + fade-up animation
6. **Build Your Desk** — WAS dark, NOW white bg with light-themed controls and SVG scene
7. **Workspaces Section** — unchanged
8. **Social Proof** — reviews unchanged; stats bar WAS dark, NOW bg-ergo-bg-warm with dark text + animated counters
9. **Commercial Preview** — WAS dark, NOW bg-ergo-bg with white cards, warm hover, SVG icons replacing emojis
10. **Blog Preview** — unchanged + scale-in animation
11. **Showroom Section** — unchanged
12. **Newsletter** — unchanged + fade-up animation

### /comercial page
- "Por qué Ergonómica" section: WAS dark, NOW bg-ergo-bg-warm with dark text
- "$", "✦", "★" symbols replaced with animated SVG icons (IconFactoryDirect, IconStandingDesk, IconSkyline)
- "Servicio llave en mano" 01/02/03 steps now have IconChat, IconFloorPlan, IconDelivery alongside numbers

## Risks / Notes
- **Palette rhythm**: CategoryGrid and FeaturedProducts both use bg-ergo-bg consecutively in the fallback homepage. This was pre-existing and not part of the scope to change.
- **SVG offset-path**: IconFactoryDirect uses CSS `offset-path` for the traveling dot animation. Browser support is excellent (95%+) but old Safari versions may not animate the dot.
- **Marquee**: Only added to the hardcoded fallback homepage, not to the Sanity page builder. To add it to Sanity, a new section type would need to be registered.
- **AnimatedCounter**: Parses string values like "500+", "5.0", "15K". If Sanity provides different formats, the parsing might need adjustment.
- **Build-your-desk SVG scene**: Completely recolored for light theme. Without visual comparison, some element colors may need fine-tuning for optimal contrast.
