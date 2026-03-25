import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Reconcile stale payment intents.
 * Run periodically (e.g., daily via Railway cron) to detect:
 * - Intents in 'charged_unreconciled' state older than 1 hour
 * - Intents in 'pending' state older than 24 hours
 *
 * Usage: npx medusa exec src/scripts/reconcile-payments.ts
 */
export default async function reconcilePayments({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("[reconcile-payments] Starting reconciliation check...")

  try {
    // Find stale NMI payment intents
    const { data: staleIntents } = await query.graph({
      entity: "nmi_payment_intent",
      fields: ["id", "cart_id", "status", "amount", "nmi_transaction_id", "created_at", "updated_at"],
      filters: {
        status: ["charged_unreconciled", "pending"],
      },
    })

    const now = Date.now()
    let alertCount = 0

    for (const intent of staleIntents as any[]) {
      const updatedAt = new Date(intent.updated_at).getTime()
      const ageHours = (now - updatedAt) / (1000 * 60 * 60)

      if (intent.status === "charged_unreconciled" && ageHours > 1) {
        logger.warn(
          `[reconcile-payments] ALERT: Charged but unreconciled intent ${intent.id} ` +
          `(cart: ${intent.cart_id}, amount: $${(intent.amount / 100).toFixed(2)}, ` +
          `NMI txn: ${intent.nmi_transaction_id}, age: ${ageHours.toFixed(1)}h)`
        )
        alertCount++
      }

      if (intent.status === "pending" && ageHours > 24) {
        logger.info(
          `[reconcile-payments] Stale pending intent ${intent.id} ` +
          `(cart: ${intent.cart_id}, age: ${ageHours.toFixed(1)}h) — can be cleaned up`
        )
      }
    }

    if (alertCount > 0) {
      logger.warn(`[reconcile-payments] ${alertCount} unreconciled payment(s) need attention!`)

      // Optional: Send alert email via Resend
      const RESEND_API_KEY = process.env.RESEND_API_KEY
      const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "ventas@ergonomicadesk.com"
      if (RESEND_API_KEY && RESEND_API_KEY !== "placeholder") {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || "Ergonómica <noreply@ergonomicadesk.com>",
            to: ADMIN_EMAIL,
            subject: `[ALERTA] ${alertCount} pago(s) sin reconciliar — Ergonómica`,
            html: `<p>${alertCount} payment intent(s) están en estado 'charged_unreconciled' por más de 1 hora. Revisar en el admin dashboard.</p>`,
          }),
        })
      }
    } else {
      logger.info("[reconcile-payments] All clear — no stale intents found.")
    }
  } catch (err) {
    logger.error("[reconcile-payments] Error:", err)
  }
}
