import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "ventas@ergonomicadesk.com"
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Ergonómica <noreply@ergonomicadesk.com>"
const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
const STOREFRONT_URL = process.env.STOREFRONT_URL || "https://ergonomicadesk.com"

interface OrderPlacedData {
  id: string
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY || RESEND_API_KEY === "placeholder") {
    console.log(`[order-confirmation] DEV MODE — would send to ${to}: ${subject}`)
    return
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[order-confirmation] Failed to send to ${to}:`, err)
  }
}

function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

function buildCustomerEmailHtml(order: any): string {
  const currency = order.currency_code || "usd"
  const shipping = order.shipping_address || {}
  const items = order.items || []

  const itemRows = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0">
        <strong>${item.product_title || item.title}</strong>
        ${item.variant?.sku ? `<br><span style="color:#888;font-size:13px">SKU: ${item.variant.sku}</span>` : ""}
      </td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:center">${item.quantity}</td>
      <td style="padding:12px 8px;border-bottom:1px solid #f0f0f0;text-align:right">${formatMoney(item.total || 0, currency)}</td>
    </tr>`
    )
    .join("")

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8f8f6">
  <div style="max-width:600px;margin:0 auto;padding:32px 16px">
    <div style="text-align:center;margin-bottom:32px">
      <h1 style="font-size:22px;color:#1a1a1a;margin:0">Ergonómica</h1>
      <p style="color:#888;font-size:14px;margin:8px 0 0">Confirmación de Orden</p>
    </div>

    <div style="background:#fff;border:1px solid #e8e8e6;padding:28px">
      <h2 style="font-size:18px;color:#1a1a1a;margin:0 0 8px">¡Gracias por tu compra!</h2>
      <p style="color:#555;font-size:14px;margin:0 0 24px;line-height:1.6">
        Tu orden <strong>#${order.display_id || order.id?.slice(-8)}</strong> ha sido recibida.
        Te contactaremos pronto para coordinar la entrega.
      </p>

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f8f8f6">
            <th style="padding:10px 8px;text-align:left;font-weight:600;color:#555">Producto</th>
            <th style="padding:10px 8px;text-align:center;font-weight:600;color:#555">Cant.</th>
            <th style="padding:10px 8px;text-align:right;font-weight:600;color:#555">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="border-top:2px solid #1a1a1a;margin-top:16px;padding-top:16px;text-align:right">
        <span style="font-size:16px;font-weight:700;color:#1a1a1a">Total: ${formatMoney(order.total || 0, currency)}</span>
      </div>

      <div style="margin-top:28px;padding-top:20px;border-top:1px solid #f0f0f0">
        <h3 style="font-size:14px;color:#555;margin:0 0 8px;font-weight:600">Dirección de envío</h3>
        <p style="color:#333;font-size:14px;margin:0;line-height:1.6">
          ${shipping.first_name || ""} ${shipping.last_name || ""}<br>
          ${shipping.address_1 || ""}<br>
          ${shipping.city || ""}, ${shipping.province || ""}<br>
          ${shipping.phone ? `Tel: ${shipping.phone}` : ""}
        </p>
      </div>
    </div>

    <div style="text-align:center;margin-top:28px;padding:20px 0">
      <p style="color:#888;font-size:13px;margin:0">
        ¿Preguntas? Escríbenos a
        <a href="mailto:ventas@ergonomicadesk.com" style="color:#2A8BBF">ventas@ergonomicadesk.com</a>
        o por <a href="https://wa.me/50769533776" style="color:#2A8BBF">WhatsApp</a>
      </p>
      <p style="color:#aaa;font-size:12px;margin:12px 0 0">
        Ergonómica · Calle 79 Este 14, Coco del Mar, Panamá
      </p>
    </div>
  </div>
</body>
</html>`
}

function buildAdminEmailHtml(order: any): string {
  const currency = order.currency_code || "usd"
  const shipping = order.shipping_address || {}
  const items = order.items || []
  const email = order.email || "N/A"

  const itemRows = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px">${item.variant?.sku || "N/A"}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px">${item.product_title || item.title}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;font-size:13px">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-size:13px">${formatMoney(item.unit_price || 0, currency)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-size:13px">${formatMoney(item.total || 0, currency)}</td>
    </tr>`
    )
    .join("")

  // UTM attribution from metadata
  const meta = order.metadata || {}
  const attribution = meta.attribution || {}
  const utmSource = attribution.utm_source || "direct"
  const utmMedium = attribution.utm_medium || ""
  const utmCampaign = attribution.utm_campaign || ""

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:monospace;background:#fff">
  <h2 style="color:#1a1a1a;margin:0 0 4px">🛒 Nueva Orden #${order.display_id || order.id?.slice(-8)}</h2>
  <p style="color:#888;font-size:13px;margin:0 0 20px">${new Date().toLocaleString("es-PA", { timeZone: "America/Panama" })}</p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
    <tr style="background:#f5f5f5">
      <td style="padding:8px;font-weight:bold;font-size:13px">Cliente</td>
      <td style="padding:8px;font-size:13px">${shipping.first_name || ""} ${shipping.last_name || ""}</td>
    </tr>
    <tr>
      <td style="padding:8px;font-weight:bold;font-size:13px">Email</td>
      <td style="padding:8px;font-size:13px">${email}</td>
    </tr>
    <tr style="background:#f5f5f5">
      <td style="padding:8px;font-weight:bold;font-size:13px">Teléfono</td>
      <td style="padding:8px;font-size:13px">${shipping.phone || "N/A"}</td>
    </tr>
    <tr>
      <td style="padding:8px;font-weight:bold;font-size:13px">Dirección</td>
      <td style="padding:8px;font-size:13px">${shipping.address_1 || ""}, ${shipping.city || ""}, ${shipping.province || ""}</td>
    </tr>
    <tr style="background:#f5f5f5">
      <td style="padding:8px;font-weight:bold;font-size:13px">UTM</td>
      <td style="padding:8px;font-size:13px">${utmSource}${utmMedium ? ` / ${utmMedium}` : ""}${utmCampaign ? ` / ${utmCampaign}` : ""}</td>
    </tr>
  </table>

  <h3 style="margin:0 0 8px;font-size:14px">Productos</h3>
  <table style="width:100%;border-collapse:collapse">
    <thead>
      <tr style="background:#e8e8e6">
        <th style="padding:8px;text-align:left;font-size:12px">SKU</th>
        <th style="padding:8px;text-align:left;font-size:12px">Producto</th>
        <th style="padding:8px;text-align:center;font-size:12px">Cant</th>
        <th style="padding:8px;text-align:right;font-size:12px">Unit</th>
        <th style="padding:8px;text-align:right;font-size:12px">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div style="margin-top:16px;padding-top:12px;border-top:2px solid #1a1a1a;text-align:right">
    <strong style="font-size:16px">TOTAL: ${formatMoney(order.total || 0, currency)}</strong>
  </div>
</body>
</html>`
}

export default async function orderConfirmationHandler({
  event,
  container,
}: SubscriberArgs<OrderPlacedData>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const orderId = event.data.id
  logger.info(`[order-confirmation] Processing order ${orderId}`)

  try {
    // Fetch full order with items, variants, addresses
    const { data: [order] } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "subtotal",
        "tax_total",
        "currency_code",
        "metadata",
        "items.*",
        "items.variant.sku",
        "items.variant.title",
        "shipping_address.*",
      ],
      filters: { id: orderId },
    })

    if (!order) {
      logger.warn(`[order-confirmation] Order ${orderId} not found`)
      return
    }

    // 1. Send customer confirmation
    const customerEmail = order.email
    if (customerEmail) {
      await sendEmail(
        customerEmail,
        `Orden confirmada #${order.display_id || order.id?.slice(-8)} — Ergonómica`,
        buildCustomerEmailHtml(order)
      )
      logger.info(`[order-confirmation] Customer email sent to ${customerEmail}`)
    }

    // 2. Send admin notification
    await sendEmail(
      ADMIN_EMAIL,
      `🛒 Nueva Orden #${order.display_id || order.id?.slice(-8)} — ${formatMoney(order.total || 0, order.currency_code || "usd")}`,
      buildAdminEmailHtml(order)
    )
    logger.info(`[order-confirmation] Admin email sent to ${ADMIN_EMAIL}`)

  } catch (err: any) {
    logger.error(`[order-confirmation] Failed to process order ${orderId}: ${err?.message ?? err} (code: ${err?.code ?? "none"})`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
