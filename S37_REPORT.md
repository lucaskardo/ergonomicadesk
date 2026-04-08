# S37 Report — Mobile-first foundation + nav redesign

## Phase 0 — S36b verification

| Assertion | Result | Notes |
|-----------|--------|-------|
| featured_products_white | PASS | transparent (inherits white) |
| category_grid_white | PASS | rgb(255,255,255) |
| commercial_two_buttons | DEFERRED | Homepage renders simpler "Para Empresas" component, not commercial-preview with 2x2 sectors. S36b fix exists in code but component not used on homepage. |
| commercial_primary_visible | DEFERRED | Same as above |
| commercial_secondary_visible | DEFERRED | Same as above |
| byd_brazos | PASS | "Brazos para monitor" present |
| byd_archivadores | PASS | "Archivadores" present |
| byd_soportes | PASS | "Soportes" present |
| spacing_sections_padded | PASS | 8 sections with >=96px padding |
| mobile_category_grid_exists | PASS | 2x2 grid, 4 cards, aspect ratio 1:1 (square) |
| mobile_card_square | PASS | Math.abs(w-h) < 10 |
| drawer_visible | FAIL | Cart items added (9->11) but no auto-open drawer. Existing behavior, not a regression. |

**Verdict:** No S36b regressions found. All fixes verified except commercial preview (DEFERRED — different component on homepage). Proceeding to Phase 1.

## Phase 1 — Tailwind config

Comment-only change documenting breakpoint policy: Tailwind defaults (sm/md/lg/xl/2xl from preset) for all new code. Legacy custom breakpoints kept for backwards compat.

## Phase 2 — Mobile-first audit

| Component | Lines | sm: | md: | lg: | xl: | small: | medium: | large: | clamp() | Score |
|-----------|-------|-----|-----|-----|-----|--------|---------|--------|---------|-------|
| newsletter | 100 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | WEAK |
| trust-bar | 108 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | WEAK |
| checkout-form | 37 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | WEAK |
| featured-products | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | WEAK |
| marquee | 19 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | WEAK |
| build-your-desk | 640 | 1 | 0 | 2 | 0 | 0 | 0 | 0 | 1 | OK |
| showroom-cta | 121 | 1 | 0 | 2 | 0 | 0 | 0 | 0 | 1 | OK |
| showroom-section | 122 | 1 | 1 | 1 | 0 | 0 | 0 | 0 | 1 | OK |
| workspaces-section | 128 | 1 | 0 | 2 | 0 | 0 | 0 | 0 | 1 | OK |
| cart | 44 | 0 | 0 | 2 | 0 | 1 | 0 | 0 | 0 | OK |

Legacy breakpoint usage: 26 files using `small:`, 4 using `medium:`, 1 using `large:`. Total: 26 unique files.

**Priority targets for this session:** newsletter (WEAK, 100 lines), build-your-desk (OK but 640 lines).

## Phase 3 — Nav redesign

**Desktop (1440px):** 4-item nav — Productos (with hover dropdown), Comercial, Showroom, Cotizar CTA (sky-dark bg with WhatsApp icon). Dropdown verified: 5 categories + "Ver tienda completa" link (VERIFIED_BY_CODE — CSS group-hover confirmed in markup, forced-visible screenshot taken).

**Laptop (1024px):** Desktop nav visible, burger hidden. Breakpoint transition at lg (1024px) works correctly.

**Tablet (768px):** Burger visible, no desktop nav.

**Mobile (375px):** Burger visible, desktop nav hidden. Drawer: white background (rgb(255,255,255)), 319px wide, Productos accordion with 5 categories + "Ver tienda completa", Comercial, Showroom links, prominent "Cotizar por WhatsApp" CTA (bg rgb(42,139,191)), secondary links (Blog, Garantia, Sobre nosotros), language switcher + copyright footer.

**Legacy breakpoint migration in nav:** `large:hidden` -> `lg:hidden`, `large:flex` -> `lg:flex`, `small:flex` -> `lg:flex` (LanguageSwitcher wrapper).

## Phase 4 — Newsletter

Mobile-first responsive fixes:
- Form: `flex-col sm:flex-row` (stacks vertically on mobile)
- Input: `text-base` (prevents iOS zoom on focus), `min-h-[48px]`
- Button: `min-h-[48px]` touch target
- Padding: `px-4 sm:px-5`

## Phase 5 — Build-your-desk mobile audit

Touch target fixes (12 buttons too small -> 3 remaining, all toggle switches):
- Frame color buttons: added `min-h-[44px]`
- Monitor arm option buttons: added `min-h-[44px]`
- Cabinet option buttons: added `min-h-[44px]`
- Color swatch circles: `w-6 h-6` -> `w-9 h-9` (24px -> 36px)
- Stands toggle rows: added `min-h-[44px]`
- Add-to-cart button: added `min-h-[48px]`

## Phase 6 — Health check

| # | Assertion | Result |
|---|-----------|--------|
| 1 | nav_cta_visible (desktop) | PASS |
| 2 | nav_burger_hidden (desktop) | PASS |
| 3 | nav_productos_button (desktop) | PASS |
| 4 | whatsapp_round (S36a regression) | PASS |
| 5 | byd_brazos (S36b regression) | PASS |
| 6 | byd_archivadores (S36b regression) | PASS |
| 7 | nav_visible_at_1024 (laptop breakpoint) | PASS |
| 8 | mobile_burger_visible | PASS |
| 9 | mobile_desktop_nav_hidden | PASS |
| 10 | mobile_category_grid (S36b Phase 2) | PASS |
| 11 | drawer_open (mobile interaction) | PASS |
| 12 | accordion_categories === 5 | PASS |

**Score: 12/12**

## Screenshots
- apps/storefront/screenshots/s37/

## 5-minute checklist for Lucas
1. /pa on mobile (375): hamburger top-left, no desktop nav links
2. Tap hamburger -> drawer slides in from left, light background (white)
3. Tap "Productos" -> expands showing 5 categories + "Ver tienda completa"
4. Tap "Cotizar por WhatsApp" in drawer -> opens WhatsApp
5. /pa on desktop (1440): see Productos / Comercial / Showroom / Cotizar (4 items)
6. Hover Productos -> dropdown with 5 categories + Ver tienda completa
7. /pa scroll: build-your-desk has 3 categorized accessory sections
8. Add a desk to cart -> cart counter increases (drawer behavior may vary)
9. /pa: featured products on white background, no cream patches
10. /pa mobile: category grid is 2x2 squares

## Deferred (S38+)
- PDP mobile redesign
- Store/category mobile filters
- Cart/checkout mobile sticky CTAs
- Migrate remaining `small:`/`medium:`/`large:` to `lg:`/`xl:`/`2xl:` (legacy cleanup)
- Product photos in Cloudflare R2
- /nosotros page (currently aliased to /showroom in drawer)
- Custom 404
