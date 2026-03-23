import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { NMI_PAYMENT_MODULE } from "../../../../modules/nmi-payment"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const order_id = req.query.order_id as string | undefined

  if (!order_id) {
    return res.status(400).json({ message: "order_id is required" })
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
    const nmiPaymentService = req.scope.resolve(NMI_PAYMENT_MODULE) as any

    // Get order with payment sessions to find the NMI session ID
    const { data: orders } = await query.graph({
      entity: "order",
      filters: { id: order_id },
      fields: [
        "id",
        "payment_collections.id",
        "payment_collections.payment_sessions.id",
        "payment_collections.payment_sessions.provider_id",
      ],
    })

    const order = orders?.[0]
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Find NMI payment session
    const sessions: any[] = (order.payment_collections ?? []).flatMap(
      (pc: any) => pc.payment_sessions ?? []
    )
    const nmiSession = sessions.find((s: any) => s.provider_id?.startsWith("pp_nmi"))

    if (!nmiSession) {
      return res.json({ intent: null, attempts: [] })
    }

    // Find intent by session_id
    const intents = await nmiPaymentService.listNmiPaymentIntents({
      session_id: nmiSession.id,
    })

    if (!intents?.length) {
      return res.json({ intent: null, attempts: [] })
    }

    const intent = intents[0]

    // Get all attempt logs for this intent
    const attempts = await nmiPaymentService.listNmiPaymentAttemptLogs({
      intent_id: intent.id,
    })

    return res.json({ intent, attempts: attempts ?? [] })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message ?? "Internal error" })
  }
}
