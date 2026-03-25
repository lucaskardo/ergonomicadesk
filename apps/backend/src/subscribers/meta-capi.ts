import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import * as crypto from "crypto"

const PIXEL_ID = process.env.META_PIXEL_ID || ""
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || ""

interface OrderPlacedData {
  id: string
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex")
}

export default async function metaCapiHandler({
  event,
  container,
}: SubscriberArgs<OrderPlacedData>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    logger.info("[meta-capi] PIXEL_ID or ACCESS_TOKEN not set — skipping")
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const orderId = event.data.id

  try {
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id", "display_id", "email", "total", "currency_code", "metadata",
        "items.*", "items.variant.sku",
        "shipping_address.*",
      ],
      filters: { id: orderId },
    })

    if (!order) {
      logger.warn(`[meta-capi] Order ${orderId} not found — skipping CAPI event`)
      return
    }

    const meta = (order.metadata || {}) as any
    const attribution = meta.attribution || {}
    const email = (order as any).email || ""
    const phone = (order.shipping_address as any)?.phone || ""
    const firstName = (order.shipping_address as any)?.first_name || ""
    const lastName = (order.shipping_address as any)?.last_name || ""
    const city = (order.shipping_address as any)?.city || ""
    const countryCode = (order.shipping_address as any)?.country_code || ""

    if (!email) {
      logger.warn(`[meta-capi] Order ${orderId} has no email — CAPI user_data will be sparse`)
    }

    // Use order display_id as event_id for stable dedup (browser sends same ID)
    const eventId = `purchase_${(order as any).display_id || order.id}`

    const eventData: any = {
      event_name: "Purchase",
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: (() => {
        const storefront = (process.env.STOREFRONT_URL || "https://ergonomicadesk.com").replace(/\/$/, "")
        const landingPage = attribution.landing_page || ""
        const langPrefix = landingPage.includes("/pa/en/") ? "/pa/en" : "/pa"
        return `${storefront}${langPrefix}/order/${order.id}/confirmed`
      })(),
      action_source: "website",
      user_data: {
        ...(email && { em: [sha256(email)] }),
        ...(phone && { ph: [sha256(phone.replace(/\D/g, ""))] }),
        ...(firstName && { fn: [sha256(firstName)] }),
        ...(lastName && { ln: [sha256(lastName)] }),
        ...(city && { ct: [sha256(city)] }),
        ...(countryCode && { country: [sha256(countryCode)] }),
        ...(attribution._fbp && { fbp: attribution._fbp }),
        ...(attribution._fbc && { fbc: attribution._fbc }),
        ...(attribution.lead_id && { external_id: [sha256(attribution.lead_id)] }),
      },
      custom_data: {
        currency: ((order as any).currency_code || "usd").toUpperCase(),
        value: ((order as any).total || 0) / 100,
        content_type: "product",
        contents: ((order as any).items || []).map((item: any) => ({
          id: item.variant?.sku || item.variant_id,
          quantity: item.quantity,
        })),
        order_id: (order as any).display_id || order.id,
        ...(attribution.utm_source && { utm_source: attribution.utm_source }),
        ...(attribution.utm_campaign && { utm_campaign: attribution.utm_campaign }),
      },
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [eventData],
          ...(process.env.NODE_ENV !== "production" && process.env.META_TEST_EVENT_CODE
            ? { test_event_code: process.env.META_TEST_EVENT_CODE }
            : {}),
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      logger.error(`[meta-capi] Failed to send Purchase event for order ${(order as any).display_id || orderId}: ${err}`, {
        orderId,
        displayId: (order as any).display_id,
        pixelId: PIXEL_ID,
        httpStatus: response.status,
      })
    } else {
      logger.info(`[meta-capi] Purchase event sent for order ${(order as any).display_id || order.id}`)
    }
  } catch (err: any) {
    logger.error(`[meta-capi] Unexpected error processing order ${orderId}: ${err?.message ?? err} (code: ${err?.code ?? "none"})`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
