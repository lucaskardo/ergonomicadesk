import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NMI_PAYMENT_MODULE } from "../../../../modules/nmi-payment"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const nmiPaymentService = req.scope.resolve(NMI_PAYMENT_MODULE) as any

    const offset = parseInt((req.query.offset as string) ?? "0", 10)
    const limit = Math.min(parseInt((req.query.limit as string) ?? "50", 10), 200)

    // List all attempt logs
    const [attempts, count] = await nmiPaymentService.listAndCountNmiPaymentAttemptLogs(
      {},
      { skip: offset, take: limit, order: { created_at: "DESC" } }
    )

    // Get intents to enrich with cart_id and status
    const intentIds = [...new Set((attempts ?? []).map((a: any) => a.intent_id).filter(Boolean))]

    let intentMap: Record<string, any> = {}
    if (intentIds.length) {
      const intents = await nmiPaymentService.listNmiPaymentIntents({ id: intentIds })
      for (const intent of intents ?? []) {
        intentMap[intent.id] = intent
      }
    }

    const enriched = (attempts ?? []).map((attempt: any) => ({
      ...attempt,
      intent: intentMap[attempt.intent_id] ?? null,
    }))

    return res.json({ attempts: enriched, count: count ?? 0, offset, limit })
  } catch (err: any) {
    return res.status(500).json({ message: err?.message ?? "Internal error" })
  }
}
