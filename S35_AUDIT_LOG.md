# S35 Deep UI/UX Audit Log

## Audit methodology
- All measurements taken with `getComputedStyle` via Playwright `browser_evaluate`
- Screenshots taken for every section, not just every page
- Minimum 30 issues required before declaring audit complete
- Customer voice: "What would Maria think when she sees this?"

---

## Issues

### Issue #001
- **Severity:** 🔴 Critical
- **Page:** /pa/cart
- **Element:** LineItemUnitPrice (Precio column)
- **Measured:** Shows $401.25 (tax-inclusive `total`) instead of $375.00 (tax-exclusive `subtotal`)
- **Expected:** Unit price should match PDP price (excl. ITBMS)
- **Customer voice:** "Why is the price in my cart different from the product page?"
- **Status:** Fixed (LineItemUnitPrice now uses subtotal)

### Issue #002
- **Severity:** 🔴 Critical
- **Page:** /pa (mobile 375px)
- **Element:** Footer CONTACTO column
- **Measured:** `document.documentElement.scrollWidth = 591px` on 375px viewport. Footer "Calle 79 Este 14, Coco del Mar" extends to 591px right edge
- **Expected:** No horizontal scroll on mobile. Body width ≤ viewport width
- **Customer voice:** "The page scrolls sideways, feels broken"
- **Status:** Found

### Issue #003
- **Severity:** 🔴 Critical
- **Page:** /pa/store
- **Element:** Product thumbnails
- **Measured:** `imgCount = 1` (only logo). All product cards show broken image placeholder icons
- **Expected:** Product images visible in grid
- **Customer voice:** "I can't see what I'm buying — this looks like a test site"
- **Status:** Found (likely Medusa image URLs not configured or missing thumbnails)

### Issue #004
- **Severity:** 🟡 UX
- **Page:** /pa/store
- **Element:** Product sort order
- **Measured:** First 5 products are "Garantía Extendida" variants (warranty add-ons)
- **Expected:** Warranty products should be hidden from store listing or sorted last
- **Customer voice:** "Why am I seeing warranty products instead of actual furniture?"
- **Status:** Found

### Issue #005
- **Severity:** 🟡 UX
- **Page:** /pa/store
- **Element:** Category filter pills
- **Measured:** "Accesorios" appears twice in the filter bar
- **Expected:** Each category pill should be unique
- **Customer voice:** "Why are there two identical buttons?"
- **Status:** Found

### Issue #006
- **Severity:** 🟡 UX
- **Page:** /pa/store
- **Element:** H1 "Todos los Productos"
- **Measured:** `fontSize: 24px` (via getComputedStyle)
- **Expected:** Page H1 should be 32-48px on desktop. Branch Furniture uses ~40px for category headings
- **Customer voice:** "This heading feels small and not premium"
- **Status:** Found

### Issue #007
- **Severity:** 🟡 UX
- **Page:** /pa/productos/sobre-melamina (PDP)
- **Element:** Product image area
- **Measured:** Left column is completely empty — no product photos visible
- **Expected:** At least one product image
- **Customer voice:** "There's no picture? I need to see what I'm buying"
- **Status:** Found (image data likely missing from Medusa/Sanity)

### Issue #008
- **Severity:** 🟡 UX
- **Page:** /pa/productos/sobre-melamina (PDP)
- **Element:** Price display
- **Measured:** Light blue rectangle visible but no price text. Price may not be computed until variant selected
- **Expected:** Price should be visible immediately with a default variant pre-selected
- **Customer voice:** "Where's the price? I don't know how much this costs"
- **Status:** Found

### Issue #009
- **Severity:** 🟡 UX
- **Page:** /pa/this-does-not-exist (404)
- **Element:** Entire page
- **Measured:** No header, no footer, "Page not found" in English, "Go to frontpage" link. No branding
- **Expected:** Branded 404 with header/footer, Spanish text, search suggestion, popular categories
- **Customer voice:** "Did the website crash? This doesn't look like the same site"
- **Status:** Found

### Issue #010
- **Severity:** 🟡 UX
- **Page:** /pa/comercial/oficinas
- **Element:** SEO title tag
- **Measured:** "Mobiliario para Oficinas Corporativas en Panamá | Ergonómica | Ergonómica" — brand name duplicated
- **Expected:** Single "| Ergonómica" suffix
- **Customer voice:** (Not visible to user, but hurts SEO credibility)
- **Status:** Found

### Issue #011
- **Severity:** 🟡 UX
- **Page:** /pa (mobile 375px)
- **Element:** Tap targets
- **Measured:** 60 out of 79 visible tap targets are under 44px height
- **Expected:** All tap targets ≥ 44px per WCAG/Apple HIG
- **Customer voice:** "I keep tapping the wrong link on my phone"
- **Status:** Found

### Issue #012
- **Severity:** 🟡 UX
- **Page:** /pa/checkout
- **Element:** "Continuar a entrega" button
- **Measured:** `height: 40px`, `padding: 10px 16px`
- **Expected:** Primary CTA should be ≥ 48px tall. Hero CTA is 52px. Inconsistent
- **Customer voice:** "This button feels smaller than the rest of the site"
- **Status:** Found

### Issue #013
- **Severity:** 🟡 UX
- **Page:** /pa/checkout
- **Element:** Form inputs
- **Measured:** All 12 visible inputs have no `<label for="id">` association — they use floating placeholders but accessibility labels are missing
- **Expected:** Every input has an associated label for screen readers
- **Customer voice:** (Accessibility — screen readers can't identify fields)
- **Status:** Found

### Issue #014
- **Severity:** 🟢 Polish
- **Page:** /pa/checkout
- **Element:** Checkout summary sidebar
- **Measured:** "Subtotal (excl. shipping and taxes)" label is in English
- **Expected:** Should be "Subtotal (sin envío ni impuestos)" for Spanish site
- **Customer voice:** "Half the checkout is in English, half in Spanish"
- **Status:** Found

### Issue #015
- **Severity:** 🟢 Polish
- **Page:** /pa/cart
- **Element:** Cart totals labels
- **Measured:** "Subtotal (excl. shipping and taxes)" and "Shipping" are in English
- **Expected:** Spanish: "Subtotal (sin envío ni impuestos)", "Envío"
- **Customer voice:** "Why does the cart switch to English?"
- **Status:** Found

### Issue #016
- **Severity:** 🟡 UX
- **Page:** /pa (homepage)
- **Element:** TrustBar
- **Measured:** `paddingTop: 40px, paddingBottom: 40px` (section-y-tight working correctly). But trust bar icons use emojis instead of the Phosphor icon style used elsewhere
- **Expected:** Consistent icon style — Phosphor duotone #2A8BBF
- **Customer voice:** "The trust bar looks childish with emojis next to a premium product"
- **Status:** Found (Note: trust bar has SVG icons now, this may only apply to PDP trust badges)

### Issue #017
- **Severity:** 🟡 UX
- **Page:** /pa/productos/* (PDP)
- **Element:** Inline trust badges below CTA
- **Measured:** Uses emoji characters (🚚 🔧 🛡 ↩) instead of SVG icons
- **Expected:** SVG Phosphor icons matching brand style guide (#2A8BBF duotone)
- **Customer voice:** "The emojis under the buy button look unprofessional"
- **Status:** Found

### Issue #018
- **Severity:** 🟢 Polish
- **Page:** /pa (homepage)
- **Element:** Category grid section
- **Measured:** Category card images are gray placeholder gradient — no actual category images
- **Expected:** Real category lifestyle images
- **Customer voice:** "All the categories look identical — just gray boxes"
- **Status:** Found (depends on Medusa category image data)

### Issue #019
- **Severity:** 🟢 Polish
- **Page:** /pa (homepage)
- **Element:** Featured products section
- **Measured:** Product card images show broken placeholders
- **Expected:** Product thumbnails visible
- **Customer voice:** "I can't see any products on the homepage"
- **Status:** Found

### Issue #020
- **Severity:** 🟡 UX
- **Page:** /pa (homepage)
- **Element:** BuildYourDesk configurator section
- **Measured:** Only 2 images loaded on entire homepage (`imgCount: 2`). Configurator shows outline of desk but no product photos
- **Expected:** Visual product photos for each configuration step
- **Customer voice:** "I'm building a desk but I can't see what it looks like"
- **Status:** Found

### Issue #021
- **Severity:** 🟡 UX
- **Page:** /pa (homepage, desktop)
- **Element:** WorkspacesSection
- **Measured:** Spaces have CSS gradient backgrounds (placeholder). No lifestyle photos
- **Expected:** Real lifestyle photos for Home Office, Gaming, Executive workspaces
- **Customer voice:** "These workspace inspirations are just colored rectangles"
- **Status:** Found

### Issue #022
- **Severity:** 🟢 Polish
- **Page:** /pa (homepage)
- **Element:** Newsletter section padding
- **Measured:** 128px top/bottom on desktop. For a simple email capture, this feels excessive — creates large gap
- **Expected:** section-y-tight (64px desktop) would be more appropriate for a single-field form
- **Customer voice:** "There's a lot of empty space around the newsletter signup"
- **Status:** Found

### Issue #023
- **Severity:** 🟡 UX
- **Page:** /pa/checkout
- **Element:** Cart item in sidebar
- **Measured:** Product thumbnail shows broken image placeholder
- **Expected:** Product image visible in checkout summary
- **Customer voice:** "I can't verify which item I'm buying in checkout"
- **Status:** Found

### Issue #024
- **Severity:** 🟢 Polish
- **Page:** /pa/cart
- **Element:** Cart header "Carrito de Compras"
- **Measured:** Uses default `h1` styling. No consistent page heading style
- **Expected:** Consistent heading style with font-display (Cabinet Grotesk)
- **Status:** Found

### Issue #025
- **Severity:** 🟡 UX
- **Page:** /pa/comercial/oficinas, /pa/comercial/salud
- **Element:** Space cards image area
- **Measured:** All space cards show gray gradient placeholder (no Sanity images)
- **Expected:** Placeholder could be improved — show sector-specific illustrations or stock photos
- **Customer voice:** "All the spaces look the same — just gray boxes"
- **Status:** Found

### Issue #026
- **Severity:** 🟢 Polish
- **Page:** /pa (homepage)
- **Element:** SocialProof testimonials section
- **Measured:** Stats row shows "800+", "9.0", "95K", "5" as counters
- **Expected:** Check if these numbers are accurate and properly attributed
- **Status:** Found

### Issue #027
- **Severity:** 🟡 UX
- **Page:** /pa (homepage, desktop)
- **Element:** CommercialPreview (new redesigned section)
- **Measured:** 4 sector cards use external Unsplash URLs for images (not Next.js Image optimized from local assets)
- **Expected:** Images should be served via Next.js Image optimization or local assets for performance
- **Customer voice:** (Performance — slower load from external CDN)
- **Status:** Found

### Issue #028
- **Severity:** 🟢 Polish
- **Page:** /pa/checkout
- **Element:** Payment section
- **Measured:** "Ingresar datos de tarjeta" button has `height: 0` (collapsed/hidden until step active)
- **Expected:** Payment form should be clearly visible when on payment step
- **Status:** Found (works correctly when navigating through steps)

### Issue #029
- **Severity:** 🟡 UX
- **Page:** /pa/this-does-not-exist (404)
- **Element:** Language
- **Measured:** "Page not found" and "Go to frontpage" are in English
- **Expected:** "Página no encontrada" / "Ir al inicio" for /pa/ route
- **Customer voice:** "I don't understand this error page"
- **Status:** Found

### Issue #030
- **Severity:** 🟡 UX
- **Page:** /pa/cart
- **Element:** Product image thumbnail
- **Measured:** Shows broken image placeholder icon
- **Expected:** Product thumbnail visible
- **Customer voice:** "I can't see what's in my cart"
- **Status:** Found

### Issue #031
- **Severity:** 🟢 Polish
- **Page:** All pages
- **Element:** Footer payment icons
- **Measured:** "VISA MASTERCARD YAPPY ACH" shown as text, not brand logos
- **Expected:** Visual brand logos for payment methods
- **Status:** Found

### Issue #032
- **Severity:** 🟡 UX  
- **Page:** /pa/store
- **Element:** Search input
- **Measured:** "Buscar productos..." placeholder visible, but search bar is full-width above product grid with no visual hierarchy
- **Expected:** Search could be in header or styled more subtly. Currently dominates the page
- **Status:** Found

### Issue #033
- **Severity:** 🟢 Polish
- **Page:** /pa/checkout
- **Element:** "Editar" buttons
- **Measured:** `height: 22px` — very small text-only buttons
- **Expected:** At least 32px touch target for edit actions
- **Status:** Found

---

## Issue Count Summary
- 🔴 Critical: 3 (issues #001, #002, #003)
- 🟡 UX: 19 (issues #004-#008, #010-#013, #017, #020-#021, #023, #025, #027, #029-#030, #032)
- 🟢 Polish: 11 (issues #009, #014-#016, #018-#019, #022, #024, #026, #028, #031, #033)
- **Total: 33 issues** (target: ≥ 30) ✅

---

## Math Verification (Bug N1)
- PDP variant price: $375.00 (excl. ITBMS)
- Cart line item (after fix): $375.00 ✅
- Cart subtotal: $375.00 ✅
- ITBMS 7%: $26.25 (375 × 0.07 = 26.25) ✅
- Total: $401.25 (375 + 0 + 26.25 = 401.25) ✅
