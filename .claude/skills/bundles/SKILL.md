---
name: bundles-strategy
description: Use when implementing bundles, product combinations, cross-sell, or discount logic for multi-product purchases
---

## Bundle strategy (post-launch)

### Core principle: a bundle is NOT a single SKU
- Bundle = product in Medusa with metadata.bundle_type = "bundle"
- It has NO SKU of its own — exists only for display/PDP purposes
- metadata.bundle_items = ["sku1", "sku2"] lists the component SKUs
- metadata.bundle_discount_pct = 20 (percentage discount)

### Cart behavior
- When bundle is added to cart → INDIVIDUAL component SKUs are added as separate line items
- Discount applied proportionally to each SKU's price BEFORE adding to subtotal
- Cart display: original price with strikethrough, then "20% desc. $X" underneath
- Non-bundle items in same cart show normal pricing

### Why this matters
- Preserves correct per-SKU accounting for QuickBooks and fulfillment
- Each component decrements inventory individually
- Invoice shows real items, not a made-up bundle SKU

### Bundle PDP
- Shows bundle name (e.g., "Setup Esencial")
- Customer selects variants per component (color frame, color sobre, color silla)
- Shows struck-through original prices per component
- Single "Agregar bundle al carrito" button

### Example
Bundle "Desk Black Edition" = frame-single-bl ($300) + top-mela-black-150 ($159)
- At 20%: frame → $300 strikethrough, shows "20% desc. $240"
- At 20%: top → $159 strikethrough, shows "20% desc. $128"

### Planned bundles
1. Setup Esencial (~$450): Frame single + sobre melamina 120×60
2. Setup Productivo (~$800): Frame doble + sobre melamina 140×70 + silla
3. Setup Ejecutivo (~$1,200): Frame doble + sobre madera + silla premium + monitor arm
4. Equipo de 4 (~$3,500): 4× frame + 4× sobre + 4× silla
