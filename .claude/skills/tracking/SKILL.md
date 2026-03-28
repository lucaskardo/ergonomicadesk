---
name: tracking-analytics
description: Use when working on analytics, tracking events, UTM attribution, Meta CAPI, GTM, or dataLayer
---

## Tracking architecture
- GTM: GoogleTagManager in root layout, gated by NEXT_PUBLIC_GTM_ID
- All tracking functions in src/lib/tracking/index.ts (client-only)
- UTM capture in src/lib/tracking/utm.ts

## dataLayer events
- view_item: PDP mount (product-tracker component)
- add_to_cart: product-actions component
- begin_checkout: checkout-tracker component
- purchase: purchase-tracker component
- contact_whatsapp: WhatsApp button click

## Event properties
- event_id: deterministic (for deduplication)
- _fbp/_fbc cookies: for Meta matching
- content_ids: product SKUs
- Full ecommerce object per GA4 spec

## UTM & attribution
- _ergo_utm cookie (30 days): utm_*, gclid, fbclid, ctwa_clid, device_type, landing_page
- _ergo_pages cookie: pageview counter
- _ergo_viewed cookie: last 10 SKUs viewed
- Before cart.complete: placeOrder reads cookies server-side → cart.metadata
- Medusa copies cart.metadata → order.metadata automatically

## Order metadata format
```json
{
  "attribution": {
    "utm_source": "facebook", "utm_medium": "cpc",
    "fbclid": "...", "gclid": "...",
    "landing_page": "/pa/products/...",
    "device_type": "mobile", "session_pages": "4"
  },
  "products_viewed": ["sku1", "sku2"],
  "funnel_checkout_started": "2026-03-20T15:05:00Z"
}
```

## Meta CAPI
- Subscriber: src/subscribers/meta-capi.ts
- SHA-256 hashed PII + event_id deduplication
- Fires on order.placed event

## Rules
- NO raw PII in dataLayer
- Tracking functions are client-only — always check typeof window !== "undefined"
- IndexNow subscriber pings search engines on product/page changes
