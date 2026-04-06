# S34 Comprehensive Test Plan & Results

## Status
- Phase 1 fixes: ✅ 8/9 done (Bug #5 BLOCKED — no warranty products seeded)
- Pass 1 audit: ✅
- Pass 2 audit: ✅
- Pass 3 audit: ✅
- Meta-loop: ✅

## Pages to test
| Page | URL | Pass 1 | Pass 2 | Pass 3 |
|---|---|---|---|---|
| Homepage ES | /pa | ✅ | ⏳ | ⏳ |
| Homepage EN | /pa/en | ✅ | ⏳ | ⏳ |
| Store/PLP | /pa/store | ⏳ | ⏳ | ⏳ |
| Category L1 | /pa/categorias/standing-desks | ✅ | ⏳ | ⏳ |
| Category L2 | /pa/categorias/frames | ✅ | ⏳ | ⏳ |
| PDP | /pa/productos/frame-double-bl | ✅ | ⏳ | ⏳ |
| Cart empty | /pa/cart | ⏳ | ⏳ | ⏳ |
| Cart with items | /pa/cart (1+ items) | ✅ | ⏳ | ⏳ |
| Checkout address | step=address | ✅ | ⏳ | ⏳ |
| Checkout shipping | step=delivery | ✅ | ⏳ | ⏳ |
| Checkout payment | step=payment | ✅ | ⏳ | ⏳ |
| Order confirmation | /pa/order/confirmed/{id} | ⏳ | ⏳ | ⏳ |
| Comercial L1 | /pa/comercial | ✅ | ⏳ | ⏳ |
| Comercial L2 | /pa/comercial/oficinas | ⏳ | ⏳ | ⏳ |
| Comercial L3 | /pa/comercial/oficinas/{space} | ⏳ | ⏳ | ⏳ |
| Search modal | from header | ⏳ | ⏳ | ⏳ |
| FAQ | /pa/faq | ⏳ | ⏳ | ⏳ |
| Returns | /pa/devoluciones | ⏳ | ⏳ | ⏳ |
| Warranty info | /pa/warranty | ⏳ | ⏳ | ⏳ |
| Terms | /pa/terms | ⏳ | ⏳ | ⏳ |
| Privacy | /pa/privacy | ⏳ | ⏳ | ⏳ |
| Blog | /pa/blog | ⏳ | ⏳ | ⏳ |
| 404 | /pa/this-does-not-exist | ✅ | ⏳ | ⏳ |

## Viewports
- Desktop: 1440x900
- Tablet: 768x1024
- Mobile: 375x667

## Issues Log

### Issue #001
- **Pass:** 1
- **Page:** /pa (mobile 375px)
- **Severity:** 🔴 Critical
- **Description:** Horizontal scroll on mobile — footer overflows to 591px width
- **Reproduction:** View homepage on 375px wide viewport, scroll right
- **Expected:** No horizontal scroll
- **Actual:** Footer "Contacto" column extends beyond viewport
- **Screenshot:** screenshots/pass1-E01-mobile-homepage.png
- **Suggested fix:** Add responsive grid/flex-wrap to footer on mobile
- **Status:** Fixed — responsive grid-cols-2/3/5

### Issue #002
- **Pass:** 1
- **Page:** /pa/this-does-not-exist
- **Severity:** 🟡 UX issue
- **Description:** 404 page is in English only, has no header/footer, feels disconnected from the site
- **Reproduction:** Visit any non-existent URL
- **Expected:** Bilingual 404 with site navigation
- **Actual:** Generic Next.js 404 with "Page not found" in English
- **Screenshot:** screenshots/pass1-404.png
- **Suggested fix:** Create custom not-found.tsx with bilingual text and site layout
- **Status:** Found

### Issue #003
- **Pass:** 1
- **Page:** /pa (homepage)
- **Severity:** 🟡 UX issue
- **Description:** Hero "Visitar Showroom" CTA links to WhatsApp (wa.me) instead of Google Maps. Sanity CMS override — code fallback is correct but Sanity data overrides it.
- **Reproduction:** Click "Visitar Showroom" in hero
- **Expected:** Google Maps link
- **Actual:** WhatsApp link (Sanity override)
- **Screenshot:** screenshots/pass1-A01-homepage-above-fold.png
- **Suggested fix:** Update Sanity CMS data for hero ctaSecondary.href
- **Status:** Found (needs Sanity CMS update, not a code fix)

### Issue #004
- **Pass:** 1
- **Page:** /pa/categorias/standing-desks
- **Severity:** 🟡 UX issue
- **Description:** First 4 products on Standing Desks PLP show broken image placeholders — products without uploaded images
- **Reproduction:** Visit /pa/categorias/standing-desks
- **Expected:** Product images or proper fallback
- **Actual:** Broken image SVG icon
- **Screenshot:** screenshots/pass1-A06-standing-desks-plp.png
- **Suggested fix:** Either add images to these products or show a branded placeholder
- **Status:** Found (data issue)

### Issue #005
- **Pass:** 1
- **Page:** /pa/categorias/standing-desks
- **Severity:** 🟢 Polish
- **Description:** First 2 products missing prices (variable-price products with no variants selected)
- **Reproduction:** Visit /pa/categorias/standing-desks
- **Expected:** "Desde $X" pricing
- **Actual:** No price shown
- **Screenshot:** screenshots/pass1-A06-standing-desks-plp.png
- **Suggested fix:** Show minimum variant price as "Desde $X"
- **Status:** Found

### Issue #006
- **Pass:** 1
- **Page:** /pa/productos/*
- **Severity:** 🟡 UX issue
- **Description:** No cart drawer/toast feedback after adding product to cart. User has to notice "Carrito (1)" change in header.
- **Reproduction:** Click "Agregar al carrito" on any PDP
- **Expected:** Cart drawer opens or toast notification
- **Actual:** Only header counter updates silently
- **Screenshot:** screenshots/pass1-A15-cart-drawer.png
- **Suggested fix:** Open cart drawer or show toast after addToCart
- **Status:** Found

### Issue #007
- **Pass:** 1
- **Page:** /pa/checkout (payment step)
- **Severity:** 🟢 Polish
- **Description:** NMI card iframe labels in English ("Card number", "Expiration", "Security code") while rest of page is Spanish
- **Reproduction:** Go to payment step, select credit card
- **Expected:** Spanish labels
- **Actual:** English labels (NMI SDK limitation)
- **Screenshot:** screenshots/pass1-A30c-payment-submit-btn.png
- **Suggested fix:** NMI SDK limitation — document for user
- **Status:** Found (NMI limitation)

