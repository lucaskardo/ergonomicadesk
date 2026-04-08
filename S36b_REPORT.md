# S36b Structural Fixes — Report

## Status Table

| Phase | Description | Status | Commit | Screenshots |
|-------|-------------|--------|--------|-------------|
| 1 | White backgrounds on product sections | ✅ | `97e8405` | `phase1-home-backgrounds.png` |
| 2 | Category grid mobile 2×2 squares | ✅ | `d83f9b0` | `phase2-category-mobile.png`, `phase2-category-desktop.png` |
| 3 | Commercial preview button promotion | ✅ | `5f00523` | `phase3-commercial-desktop.png` |
| 4 | Build-your-desk categorized accessories + cart sync | ✅ | `522881f` | `phase4-build-your-desk.png`, `phase4-cart-drawer.png` |
| 5 | Section spacing audit | ✅ (no changes needed) | `80fe0ed` | `phase5-home-spacing-desktop.png`, `phase5-home-spacing-mobile.png` |

## SKU Audit Results

**EXIST (17 of 21):**
- frame-single-bl, frame-single-wh, frame-double-bl, frame-double-wh, frame-3stage-bl, frame-3stage-wh
- stand-arm-single-bl, stand-arm-single-wh, stand-arm-double-bl, stand-arm-double-wh, stand-arm-heavy-single-bl
- cabinet-3drawer-slim-bl, cabinet-3drawer-slim-wh, cabinet-3drawer-comp-bl, cabinet-3drawer-comp-wh
- stand-laptop-adjus-sl, pad-ecoleather-80x40-bl

**MISSING (4 — Lucas needs to create these in Medusa admin):**
- `frame-l-bl` — L-shaped frame, black
- `frame-l-wh` — L-shaped frame, white
- `stand-arm-heavy-single-wh` — Heavy duty arm, white (black variant exists)
- `stand-tablet-adjus-large-bl` — Adjustable tablet stand, large

## Health Check Results (7/8)

| Assertion | Result | Notes |
|-----------|--------|-------|
| whatsapp_still_round | ✅ PASS | FAB div has `border-radius: 9999px` |
| featured_white | ✅ PASS | `rgb(255, 255, 255)` |
| commercial_primary_btn | ⚠️ SKIP | Commercial preview section not rendered on current Sanity homepage (code is correct, component works in fallback) |
| spacing_consistent | ✅ PASS | All 8 sections have 128px symmetric padding at 1440px |
| mobile_category_square | ✅ PASS | 4 cards, aspect ratio 1.0 |
| has_brazos | ✅ PASS | "BRAZOS PARA MONITOR" renders |
| has_archivadores | ✅ PASS | "ARCHIVADORES" renders |
| has_soportes | ✅ PASS | "SOPORTES Y ACCESORIOS" renders |

## Cart Drawer Sync

- `ergo:cart:added` event dispatched BEFORE the try block (matches product-actions pattern)
- `startTransition(() => router.refresh())` in finally block for background server component refresh
- Cart counter updated from (1) to (3) to (5) across test clicks — items added successfully
- Drawer opens immediately on event dispatch (verified visually, auto-closes after 5 seconds)

## Phase 5 Spacing Audit — No Outliers

All 9 homepage sections at 1440px:
- Hero: 0px/0px (expected — full-bleed)
- All other sections: 128px/128px (section-y at desktop breakpoint)
- Trust bar, why-ergonomica use section-y-tight (40px mobile, 64px desktop)
- Commercial pages use intentional py-* values from S35 redesign (not converted)

## 5-Minute Visual Checklist for Lucas

After merge:
- [ ] `/pa` mobile (375px) — category grid is 2×2 squares + "Ver todas las categorías" link
- [ ] `/pa` — featured products on white background (no cream)
- [ ] `/pa` — commercial section: TWO visible buttons visible when Sanity adds `commercialPreviewSection` to homepage builder (currently only in fallback)
- [ ] `/pa` — build-your-desk: 3 accessory categories (Brazos, Archivadores, Soportes) with color swatches
- [ ] `/pa` — build-your-desk: add to cart opens drawer immediately
- [ ] `/pa` — scroll full page: consistent vertical spacing between sections
- [ ] Create missing SKUs in Medusa admin: frame-l-bl, frame-l-wh, stand-arm-heavy-single-wh, stand-tablet-adjus-large-bl
