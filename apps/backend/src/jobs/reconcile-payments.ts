import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function reconcilePaymentsJob(container: MedusaContainer) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("[reconcile-payments] Starting hourly reconciliation check...")

  try {
    const { data: staleIntents } = await query.graph({
      entity: "nmi_payment_intent",
      fields: ["id", "cart_id", "status", "amount_cents", "nmi_transaction_id", "created_at", "updated_at"],
      filters: {
        status: ["charged_unreconciled", "pending"],
      },
    })

    const now = Date.now()
    let unreconciledCount = 0
    let stalePendingCount = 0

    for (const intent of staleIntents as any[]) {
      const updatedAt = new Date(intent.updated_at).getTime()
      const ageHours = (now - updatedAt) / (1000 * 60 * 60)
      const amountFormatted = `$${((intent.amount_cents ?? intent.amount ?? 0) / 100).toFixed(2)}`

      if (intent.status === "charged_unreconciled" && ageHours > 1) {
        logger.error(
          `[payment-alert] [reconcile-payments] Unreconciled charge: intent ${intent.id} ` +
          `(cart: ${intent.cart_id}, amount: ${amountFormatted}, ` +
          `NMI txn: ${intent.nmi_transaction_id ?? "none"}, age: ${ageHours.toFixed(1)}h)`
        )
        unreconciledCount++
      }

      if (intent.status === "pending" && ageHours > 24) {
        logger.warn(
          `[reconcile-payments] Stale pending intent ${intent.id} ` +
          `(cart: ${intent.cart_id}, amount: ${amountFormatted}, age: ${ageHours.toFixed(1)}h) — abandoned checkout`
        )
        stalePendingCount++
      }
    }

    if (unreconciledCount > 0) {
      logger.error(`[payment-alert] [reconcile-payments] ${unreconciledCount} unreconciled payment(s) require immediate attention`)

      const RESEND_API_KEY = process.env.RESEND_API_KEY
      const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "ventas@ergonomicadesk.com"

      if (RESEND_API_KEY && RESEND_API_KEY !== "placeholder") {
        try {
          const emailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.RESEND_FROM_EMAIL || "Ergonómica <noreply@ergonomicadesk.com>",
              to: ADMIN_EMAIL,
              subject: `[ALERTA] ${unreconciledCount} pago(s) sin reconciliar — Ergonómica`,
              html: `<p>${unreconciledCount} payment intent(s) están en estado <strong>charged_unreconciled</strong> por más de 1 hora. Revisar en el admin dashboard.</p>`,
            }),
          })

          if (!emailRes.ok) {
            logger.warn(`[reconcile-payments] Failed to send alert email: ${await emailRes.text()}`)
          } else {
            logger.info(`[reconcile-payments] Alert email sent to ${ADMIN_EMAIL}`)
          }
        } catch (emailErr: any) {
          logger.warn(`[reconcile-payments] Could not send alert email: ${emailErr?.message ?? emailErr}`)
        }
      }
    } else {
      logger.info("[reconcile-payments] All clear — no unreconciled charges found")
    }

    if (stalePendingCount > 0) {
      logger.info(`[reconcile-payments] ${stalePendingCount} stale pending intent(s) found (abandoned checkouts)`)
    }

    logger.info(`[reconcile-payments] Check complete — unreconciled: ${unreconciledCount}, stale pending: ${stalePendingCount}`)
  } catch (err: any) {
    logger.error(`[reconcile-payments] Job failed: ${err?.message ?? err}`, {
      errorCode: err?.code,
      stack: err?.stack,
    })
  }
}

export const config = {
  name: "reconcile-payments",
  schedule: "0 * * * *", // Every hour
}
