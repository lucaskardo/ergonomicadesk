/**
 * Meta Conversions API — Server-side Purchase event subscriber
 *
 * EVENT SPLIT (deduplication strategy):
 * ─────────────────────────────────────
 * Browser-side (GTM → fbq):  view_item, add_to_cart, begin_checkout, purchase
 * Server-side (this file):   Purchase only
 *
 * DEDUPLICATION:
 * Both events share the same event_id = `purchase_${order.display_id}`.
 * Meta deduplicates when event_name + event_id match across browser and server
 * within a 48-hour window. The browser must send the same event_id via the
 * dataLayer `event_id` field (see tracking/index.ts → getPurchaseEventId).
 *
 * REQUIRED ENV VARS:
 *   META_PIXEL_ID             — Facebook Pixel numeric ID
 *   META_CAPI_ACCESS_TOKEN    — System user token with ads_management permission
 *   META_TEST_EVENT_CODE      — (optional) for Events Manager test mode
 *   STOREFRONT_URL            — canonical storefront origin, e.g. https://ergonomicadesk.com
 */
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import * as crypto from "crypto"

const PIXEL_ID = process.env.META_PIXEL_ID || ""
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || ""

interface OrderPlacedData {
  id: string
}

/** Order fields fetched via query.graph() for CAPI reporting */
interface CapiOrder {
  id: string
  display_id?: number
  email?: string
  total?: number | { value?: number; numeric?: number }
  currency_code?: string
  metadata?: Record<string, unknown>
  items?: Array<{
    variant?: { sku?: string }
    variant_id?: string
    quantity: number
  }>
  shipping_address?: {
    phone?: string
    first_name?: string
    last_name?: string
    city?: string
    country_code?: string
  }
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

    const typedOrder = order as unknown as CapiOrder
    const meta = (typedOrder.metadata || {}) as Record<string, unknown>
    const attribution = (meta.attribution as Record<string, string>) || {}
    const email = typedOrder.email || ""
    const phone = typedOrder.shipping_address?.phone || ""
    const firstName = typedOrder.shipping_address?.first_name || ""
    const lastName = typedOrder.shipping_address?.last_name || ""
    const city = typedOrder.shipping_address?.city || ""
    const countryCode = typedOrder.shipping_address?.country_code || ""

    if (!email) {
      logger.warn(`[meta-capi] Order ${orderId} has no email — CAPI user_data will be sparse`)
    }

    // Use order display_id as event_id for stable dedup (browser sends same ID)
    const eventId = `purchase_${typedOrder.display_id || typedOrder.id}`

    const eventData: Record<string, unknown> = {
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
        currency: (typedOrder.currency_code || "usd").toUpperCase(),
        value: (typeof typedOrder.total === "object" && typedOrder.total !== null
          ? Number(typedOrder.total.value ?? typedOrder.total.numeric ?? 0)
          : Number(typedOrder.total ?? 0)) / 100,
        content_type: "product",
        contents: (typedOrder.items || []).map((item) => ({
          id: item.variant?.sku || item.variant_id,
          quantity: item.quantity,
        })),
        order_id: typedOrder.display_id || typedOrder.id,
        ...(attribution.utm_source && { utm_source: attribution.utm_source }),
        ...(attribution.utm_campaign && { utm_campaign: attribution.utm_campaign }),
      },
    }

    const displayId = typedOrder.display_id || orderId
    const value = (typeof typedOrder.total === "object" && typedOrder.total !== null
      ? Number(typedOrder.total.value ?? typedOrder.total.numeric ?? 0)
      : Number(typedOrder.total ?? 0)) / 100
    const currency = (typedOrder.currency_code || "usd").toUpperCase()
    const itemCount = typedOrder.items?.length ?? 0
    logger.info(
      `[meta-capi] Sending Purchase event — order: ${displayId}, event_id: ${eventId}, value: ${value} ${currency}, items: ${itemCount}`
    )

    const payload = {
      data: [eventData],
      ...(process.env.NODE_ENV !== "production" && process.env.META_TEST_EVENT_CODE
        ? { test_event_code: process.env.META_TEST_EVENT_CODE }
        : {}),
    }

    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )

    const responseBody = await response.text()

    if (!response.ok) {
      logger.error(
        `[meta-capi] Purchase event FAILED — order: ${displayId}, http: ${response.status}, pixelId: ${PIXEL_ID}, response: ${responseBody}`
      )
    } else {
      logger.info(
        `[meta-capi] Purchase event OK — order: ${displayId}, response: ${responseBody}`
      )
    }
  } catch (err: any) {
    logger.error(`[meta-capi] Unexpected error processing order ${orderId}: ${err?.message ?? err} (code: ${err?.code ?? "none"})`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
