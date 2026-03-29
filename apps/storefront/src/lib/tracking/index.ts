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

/**
 * Unified item_id extraction — single policy across all events.
 * Priority: variant.sku → variant_id → product.id
 */
export function getItemId(item: {
  variant?: { sku?: string; id?: string } | null
  variant_id?: string
  product_id?: string
  id?: string
}): string {
  return item.variant?.sku || item.variant?.id || item.variant_id || item.product_id || item.id || "unknown"
}

export function trackEvent(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return
  window.dataLayer = window.dataLayer || []
  // GA4 requires clearing stale ecommerce data before each new ecommerce push
  if (data.ecommerce) {
    window.dataLayer.push({ ecommerce: null })
  }
  window.dataLayer.push({
    event,
    event_id: (data.event_id as string) || generateEventId(),
    ...getMetaCookies(),
    ...data,
  })
}

export function trackViewItem(product: any, variant?: any) {
  const itemId = getItemId({ variant })
  const price = (variant?.calculated_price?.calculated_amount || 0) / 100
  trackEvent("view_item", {
    event_id: generateEventId(itemId),
    ecommerce: {
      currency: "USD",
      value: price,
      items: [
        {
          item_id: itemId,
          item_name: product.title,
          item_category: product.categories?.[0]?.name || "",
          price,
          quantity: 1,
        },
      ],
    },
    content_ids: [itemId],
    content_type: "product",
  })
  // Track in _ergo_viewed cookie for dashboard
  try {
    const existing = document.cookie.match(/_ergo_viewed=([^;]+)/)
    let viewed: string[] = existing
      ? JSON.parse(decodeURIComponent(existing[1]))
      : []
    if (!viewed.includes(itemId)) {
      viewed.unshift(itemId)
      viewed = viewed.slice(0, 10)
    }
    document.cookie = `_ergo_viewed=${encodeURIComponent(JSON.stringify(viewed))}; path=/; max-age=${7 * 86400}; SameSite=Lax`
  } catch {
    // ignore cookie errors
  }
}

export function trackAddToCart(product: any, variant: any, quantity: number) {
  const itemId = getItemId({ variant })
  const price = (variant?.calculated_price?.calculated_amount || 0) / 100
  trackEvent("add_to_cart", {
    event_id: generateEventId(itemId),
    ecommerce: {
      currency: "USD",
      value: price * quantity,
      items: [
        {
          item_id: itemId,
          item_name: product.title,
          price,
          quantity,
        },
      ],
    },
    content_ids: [itemId],
    content_type: "product",
    num_items: quantity,
  })
}

export function trackBeginCheckout(cart: any) {
  const items = (cart.items || []).map((i: any) => ({
    item_id: getItemId(i),
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

export function trackViewItemList(
  items: Array<{ id?: string; title?: string; variants?: Array<{ sku?: string; id?: string }> }>,
  listName: string
) {
  if (typeof window === "undefined" || !window.dataLayer) return
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      item_list_name: listName,
      items: items.slice(0, 20).map((p, i) => ({
        item_id: getItemId({ variant: p.variants?.[0], id: p.id }),
        item_name: p.title,
        index: i,
        item_list_name: listName,
      })),
    },
  })
}

export function trackSelectItem(
  product: { id?: string; title?: string; variants?: Array<{ sku?: string; id?: string }> },
  listName: string,
  index: number
) {
  if (typeof window === "undefined" || !window.dataLayer) return
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "select_item",
    ecommerce: {
      item_list_name: listName,
      items: [{
        item_id: getItemId({ variant: product.variants?.[0], id: product.id }),
        item_name: product.title,
        index,
        item_list_name: listName,
      }],
    },
  })
}

export function trackRemoveFromCart(item: any, currencyCode: string) {
  if (typeof window === "undefined" || !window.dataLayer) return
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "remove_from_cart",
    ecommerce: {
      currency: currencyCode.toUpperCase(),
      value: (item.total || 0) / 100,
      items: [{
        item_id: getItemId(item),
        item_name: item.product_title || item.title,
        quantity: item.quantity,
        price: (item.unit_price || 0) / 100,
      }],
    },
  })
}

export function trackAddShippingInfo(cart: any) {
  if (typeof window === "undefined" || !window.dataLayer) return
  const currency = (cart.region?.currency_code || "usd").toUpperCase()
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "add_shipping_info",
    ecommerce: {
      currency,
      value: (cart.total || 0) / 100,
      shipping_tier: cart.shipping_methods?.[0]?.name || "standard",
      items: (cart.items || []).map((item: any) => ({
        item_id: getItemId(item),
        item_name: item.product_title || item.title,
        quantity: item.quantity,
        price: (item.unit_price || 0) / 100,
      })),
    },
  })
}

export function trackAddPaymentInfo(cart: any, paymentType: string) {
  if (typeof window === "undefined" || !window.dataLayer) return
  const currency = (cart.region?.currency_code || "usd").toUpperCase()
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "add_payment_info",
    ecommerce: {
      currency,
      value: (cart.total || 0) / 100,
      payment_type: paymentType,
      items: (cart.items || []).map((item: any) => ({
        item_id: getItemId(item),
        item_name: item.product_title || item.title,
        quantity: item.quantity,
        price: (item.unit_price || 0) / 100,
      })),
    },
  })
}

export function trackViewCart(cart: any) {
  if (typeof window === "undefined" || !window.dataLayer) return
  const currency = (cart.region?.currency_code || cart.currency_code || "usd").toUpperCase()
  window.dataLayer.push({ ecommerce: null })
  window.dataLayer.push({
    event: "view_cart",
    ecommerce: {
      currency,
      value: (cart.total || cart.subtotal || 0) / 100,
      items: (cart.items || []).map((item: any) => ({
        item_id: getItemId(item),
        item_name: item.product_title || item.title,
        quantity: item.quantity,
        price: (item.unit_price || 0) / 100,
      })),
    },
  })
}

export function trackSearch(query: string, resultCount: number) {
  if (typeof window === "undefined" || !window.dataLayer) return
  window.dataLayer.push({
    event: "search",
    search_term: query,
    search_result_count: resultCount,
  })
}

export function trackGenerateLead(source: string, productTitle?: string, sku?: string) {
  if (typeof window === "undefined" || !window.dataLayer) return
  window.dataLayer.push({
    event: "generate_lead",
    lead_source: source,
    ...(productTitle && { product_name: productTitle }),
    ...(sku && { product_sku: sku }),
  })
}

export function getPurchaseEventId(order: any): string {
  return `purchase_${order.display_id || order.id}`
}

export function trackPurchase(order: any) {
  const items = (order.items || []).map((i: any) => ({
    item_id: getItemId(i),
    item_name: i.title,
    price: (i.unit_price || 0) / 100,
    quantity: i.quantity,
  }))
  trackEvent("purchase", {
    event_id: getPurchaseEventId(order),
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
