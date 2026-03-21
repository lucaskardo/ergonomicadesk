function generateEventId(seed?: string): string {
  const base = seed || Math.random().toString(36).slice(2)
  return `${base}-${Date.now()}`
}

function getMetaCookies(): Record<string, string> {
  if (typeof document === "undefined") return {}
  const result: Record<string, string> = {}
  document.cookie.split(";").forEach((c) => {
    const [key, val] = c.trim().split("=")
    if (key === "_fbp" || key === "_fbc") result[key] = val
  })
  return result
}

export function trackEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event,
    event_id: (data.event_id as string) || generateEventId(),
    ...getMetaCookies(),
    ...data,
  })
}

export function trackViewItem(product: any, variant?: any) {
  const sku = variant?.sku || product.variants?.[0]?.sku || product.id
  const price = (variant?.calculated_price?.calculated_amount || 0) / 100
  trackEvent("view_item", {
    event_id: generateEventId(sku),
    ecommerce: {
      currency: "USD",
      value: price,
      items: [
        {
          item_id: sku,
          item_name: product.title,
          item_category: product.categories?.[0]?.name || "",
          price,
          quantity: 1,
        },
      ],
    },
    content_ids: [sku],
    content_type: "product",
  })
  // Track in _ergo_viewed cookie for dashboard
  try {
    const existing = document.cookie.match(/_ergo_viewed=([^;]+)/)
    let viewed: string[] = existing
      ? JSON.parse(decodeURIComponent(existing[1]))
      : []
    if (!viewed.includes(sku)) {
      viewed.unshift(sku)
      viewed = viewed.slice(0, 10)
    }
    document.cookie = `_ergo_viewed=${encodeURIComponent(JSON.stringify(viewed))}; path=/; max-age=${7 * 86400}; SameSite=Lax`
  } catch {
    // ignore cookie errors
  }
}

export function trackAddToCart(product: any, variant: any, quantity: number) {
  const sku = variant?.sku || product.id
  const price = (variant?.calculated_price?.calculated_amount || 0) / 100
  trackEvent("add_to_cart", {
    event_id: generateEventId(sku),
    ecommerce: {
      currency: "USD",
      value: price * quantity,
      items: [
        {
          item_id: sku,
          item_name: product.title,
          price,
          quantity,
        },
      ],
    },
    content_ids: [sku],
    content_type: "product",
    num_items: quantity,
  })
}

export function trackBeginCheckout(cart: any) {
  const items = (cart.items || []).map((i: any) => ({
    item_id: i.variant?.sku || i.variant_id,
    item_name: i.title,
    price: (i.unit_price || 0) / 100,
    quantity: i.quantity,
  }))
  trackEvent("begin_checkout", {
    event_id: generateEventId(cart.id),
    ecommerce: {
      currency: "USD",
      value: (cart.total || 0) / 100,
      items,
    },
    content_ids: items.map((i: any) => i.item_id),
    content_type: "product",
  })
}

export function trackPurchase(order: any) {
  const items = (order.items || []).map((i: any) => ({
    item_id: i.variant?.sku || i.variant_id,
    item_name: i.title,
    price: (i.unit_price || 0) / 100,
    quantity: i.quantity,
  }))
  trackEvent("purchase", {
    event_id: generateEventId(order.id),
    ecommerce: {
      transaction_id: order.id,
      currency: "USD",
      value: (order.total || 0) / 100,
      tax: (order.tax_total || 0) / 100,
      shipping: (order.shipping_total || 0) / 100,
      items,
    },
    content_ids: items.map((i: any) => i.item_id),
    content_type: "product",
  })
}
