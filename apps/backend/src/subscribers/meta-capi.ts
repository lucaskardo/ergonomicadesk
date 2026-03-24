import type { SubscriberConfig, SubscriberArgs } from "@medusajs/framework"
import { createHash } from "crypto"

const PIXEL_ID = process.env.META_PIXEL_ID
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex")
}

export default async function metaCapiHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  if (!PIXEL_ID || !ACCESS_TOKEN) return

  const query = container.resolve("query")

  try {
    const { data: [order] } = await (query as any).graph({
      entity: "order",
      fields: [
        "id",
        "total",
        "currency_code",
        "items.*",
        "items.variant.*",
        "shipping_address.*",
        "metadata",
      ],
      filters: { id: event.data.id },
    })

    if (!order) return

    const meta = (order as any).metadata || {}
    const attribution = meta.attribution || {}
    const shipping = (order as any).shipping_address || {}

    const userData: Record<string, any> = {
      country: ["pa"],
    }
    if (shipping.email) userData.em = [sha256(shipping.email)]
    if (shipping.phone) userData.ph = [sha256(shipping.phone)]
    if (shipping.city) userData.ct = [sha256(shipping.city)]
    if (shipping.postal_code) userData.zp = [sha256(shipping.postal_code)]
    if (attribution._fbc) userData.fbc = attribution._fbc
    if (attribution._fbp) userData.fbp = attribution._fbp

    const items = (order as any).items || []
    const contentIds = items.map((i: any) => i.variant?.sku || i.variant_id)
    const value = ((order as any).total || 0) / 100

    const eventId = `${order.id}-${Date.now()}`

    const eventData = {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: `https://ergonomicadesk.com/pa/order/${order.id}/confirmed`,
      action_source: "website",
      user_data: userData,
      custom_data: {
        currency: "USD",
        value,
        content_ids: contentIds,
        content_type: "product",
        num_items: items.length,
      },
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [eventData],
          access_token: ACCESS_TOKEN,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error("Meta CAPI error:", error)
    }
  } catch (error) {
    console.error("Meta CAPI subscriber failed:", error)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
