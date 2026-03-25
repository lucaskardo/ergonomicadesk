# Attribution Handoff — Order Metadata for CRM Integration

This document describes what attribution data is captured, how it ends up in `order.metadata`, and how to consume it in Kommo or any CRM.

---

## How Attribution Works

Attribution is captured on the browser as the customer navigates the storefront. The data is stored in cookies and attached to the order when checkout completes (`placeOrder` server action).

### Cookies captured (client-side, `utm.ts`)

| Cookie | TTL | Purpose |
|--------|-----|---------|
| `_ergo_utm` | 30 days | Last-touch UTM + context. Legacy key, read by `placeOrder`. |
| `_ergo_ft` | 180 days | **First-touch** attribution — set once, never overwritten. |
| `_ergo_lt` | 30 days | **Last-touch** attribution — overwritten on every new UTM hit. |
| `_ergo_sid` | ~30 min | Session ID — resets on inactivity. |
| `_ergo_lid` | 180 days | Lead ID — stable across sessions, persists 180 days. |
| `_ergo_pages` | 1 day | Session page count (increments per pageview). |
| `_ergo_viewed` | 7 days | Last 10 product SKUs viewed (JSON array). |
| `_fbp` | 90 days | Meta browser pixel cookie (set by Meta Pixel JS). |
| `_fbc` | 30 days | Meta click ID cookie (set from `fbclid` URL param). |

UTM params captured: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `ctwa_clid`.

Auto-detected sources (when no UTM but referrer present): `google/organic`, `facebook/social`, `instagram/social`, `bing/organic`, `direct/none`, or `{domain}/referral`.

---

## Order Metadata Schema

When `placeOrder` runs, the following metadata is attached to the cart before `cart.complete`. Medusa copies `cart.metadata → order.metadata` automatically.

```json
{
  "attribution": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "standing-desks-panama",
    "utm_term": "escritorio standing",
    "utm_content": "video_ad_1",
    "gclid": "",
    "gbraid": "",
    "wbraid": "",
    "fbclid": "ABCDEF123",
    "ctwa_clid": "",
    "landing_page": "/pa/productos/frame-double-bl",
    "referrer": "https://www.facebook.com/",
    "timestamp": "2026-03-25T14:30:00.000Z",
    "device_type": "mobile",
    "session_pages": "4",
    "session_id": "m4ab3_x9z2k1",
    "lead_id": "1j2k3_ab4cd5",
    "first_touch": {
      "utm_source": "google",
      "utm_medium": "cpc",
      "utm_campaign": "brand",
      "landing_page": "/pa/",
      "timestamp": "2026-03-20T10:00:00.000Z",
      "device_type": "desktop",
      "session_id": "a1b2c3_xyz"
    },
    "_fbp": "fb.1.1700000000000.1234567890",
    "_fbc": "fb.1.1700000000000.ABCDEF123"
  },
  "products_viewed": ["frame-double-bl-sku", "chair-xtcv2-mesh-sku"],
  "funnel_checkout_started": "2026-03-25T14:28:00.000Z"
}
```

### Field reference

| Path | Type | Description |
|------|------|-------------|
| `attribution.utm_source` | string | Traffic source (`google`, `facebook`, `direct`, etc.) |
| `attribution.utm_medium` | string | Traffic medium (`cpc`, `organic`, `social`, `email`, etc.) |
| `attribution.utm_campaign` | string | Campaign name (from UTM tag) |
| `attribution.utm_term` | string | Search keyword (from UTM tag) |
| `attribution.utm_content` | string | Ad variant (from UTM tag) |
| `attribution.gclid` | string | Google click ID |
| `attribution.fbclid` | string | Facebook click ID |
| `attribution.ctwa_clid` | string | WhatsApp click-to-chat click ID |
| `attribution.landing_page` | string | First URL path the user hit on this session |
| `attribution.referrer` | string | HTTP referrer of the landing page |
| `attribution.device_type` | string | `mobile` / `tablet` / `desktop` |
| `attribution.session_pages` | string | Number of pages viewed this session |
| `attribution.session_id` | string | Random session identifier |
| `attribution.lead_id` | string | Stable lead identifier (persists 180 days across sessions) |
| `attribution.first_touch` | object | Same structure as above, for the very first visit ever |
| `attribution._fbp` | string | Meta browser pixel cookie |
| `attribution._fbc` | string | Meta click ID cookie |
| `products_viewed` | string[] | Up to 10 SKUs viewed before checkout |
| `funnel_checkout_started` | ISO string | When `placeOrder` was triggered |

---

## Reading from Medusa

### Admin API (backend)
```bash
GET /admin/orders/:id
# Returns order.metadata with the full attribution object
```

### Query (in workflows/subscribers)
```ts
const { data: [order] } = await query.graph({
  entity: "order",
  fields: ["id", "display_id", "metadata"],
  filters: { id: orderId },
})
const attribution = order.metadata?.attribution || {}
```

---

## Kommo CRM Integration

When creating or updating a lead in Kommo via webhook or API call, map the fields as follows:

```json
{
  "leads": [{
    "name": "Ergonómica — Orden #{{order.display_id}}",
    "custom_fields_values": [
      { "field_code": "UTM_SOURCE",   "values": [{ "value": "{{attribution.utm_source}}" }] },
      { "field_code": "UTM_MEDIUM",   "values": [{ "value": "{{attribution.utm_medium}}" }] },
      { "field_code": "UTM_CAMPAIGN", "values": [{ "value": "{{attribution.utm_campaign}}" }] },
      { "field_code": "DEVICE_TYPE",  "values": [{ "value": "{{attribution.device_type}}" }] },
      { "field_code": "LANDING_PAGE", "values": [{ "value": "{{attribution.landing_page}}" }] },
      { "field_code": "LEAD_ID",      "values": [{ "value": "{{attribution.lead_id}}" }] },
      { "field_code": "FIRST_SOURCE", "values": [{ "value": "{{attribution.first_touch.utm_source}}" }] }
    ]
  }]
}
```

### Source attribution logic for CRM

Use this priority order to set the CRM lead source field:

1. If `ctwa_clid` is present → source = `whatsapp_ctwa`
2. If `fbclid` is present OR `utm_source == "facebook"` → source = `facebook_ads`
3. If `gclid` / `gbraid` / `wbraid` is present OR `utm_source == "google"` AND `utm_medium == "cpc"` → source = `google_ads`
4. If `utm_medium == "organic"` → source = `organic_search`
5. If `utm_medium == "social"` → source = `organic_social`
6. If `utm_source == "direct"` → source = `direct`
7. Otherwise → source = `referral`

For multi-touch attribution, compare `first_touch.utm_source` vs `attribution.utm_source` (last touch) to understand the full journey.

---

## Notes

- `lead_id` is stable across sessions for 180 days — use it to deduplicate leads in the CRM if the same customer places multiple orders.
- `funnel_checkout_started` is when the order was placed, not when the customer first viewed the cart.
- All timestamps are ISO 8601 UTC.
- Meta CAPI uses `_fbp` and `_fbc` from `order.metadata.attribution` for server-side event matching (see `subscribers/meta-capi.ts`).
