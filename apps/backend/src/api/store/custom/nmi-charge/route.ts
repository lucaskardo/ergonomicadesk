import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { NmiClient, NmiLane } from "../../../../modules/nmi-payment/nmi-client"
import { NMI_PAYMENT_MODULE } from "../../../../modules/nmi-payment"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const logger = req.scope.resolve(ContainerRegistrationKeys.LOGGER) as any

  try {
    return await handleNmiCharge(req, res, logger)
  } catch (err: any) {
    logger.error("[NmiCharge] Unhandled error", { error: err?.message, stack: err?.stack })
    return res.status(500).json({ message: "Internal payment error. Please try again." })
  }
}

async function handleNmiCharge(req: MedusaRequest, res: MedusaResponse, logger: any) {
  // 1. Parse + validate input
  const body = req.body as {
    cart_id?: string
    payment_token?: string
    three_ds?: Record<string, string>
  }
  const { cart_id, payment_token, three_ds } = body

  if (!cart_id || !payment_token) {
    return res.status(400).json({ message: "cart_id and payment_token are required" })
  }

  // 2. Resolve cart server-side — NEVER trust amount from frontend
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY) as any
  const { data: carts } = await query.graph({
    entity: "cart",
    filters: { id: cart_id },
    fields: [
      "id",
      "total",
      "currency_code",
      "completed_at",
      "payment_collection.id",
      "payment_collection.payment_sessions.id",
      "payment_collection.payment_sessions.data",
      "payment_collection.payment_sessions.provider_id",
      "payment_collection.payment_sessions.status",
    ],
  })

  const cart = carts?.[0]
  if (!cart) {
    return res.status(400).json({ message: "Cart not found" })
  }

  // 3. Cart completed check — prevent double-charge
  if (cart.completed_at) {
    return res.status(409).json({ message: "Order already placed" })
  }

  // 4. Find pending NMI payment session
  const sessions: any[] = cart.payment_collection?.payment_sessions ?? []

  // 4a. Check for already-authorized session
  const alreadyAuthorized = sessions.find(
    (s) => s.provider_id?.startsWith("pp_nmi") && s.status === "authorized"
  )
  if (alreadyAuthorized) {
    return res.status(409).json({ message: "Payment already authorized" })
  }

  const session = sessions.find(
    (s) => s.provider_id?.startsWith("pp_nmi") && s.status === "pending"
  )
  if (!session) {
    return res.status(400).json({ message: "No pending NMI payment session found" })
  }

  // 5. Calculate amount server-side — cart.total may be BigNumber object or plain number
  const rawTotal = (cart as any).total
  const amountCents = typeof rawTotal === "object" && rawTotal !== null
    ? Math.round(Number((rawTotal as any).value ?? (rawTotal as any).numeric ?? 0))
    : Number(rawTotal)
  if (!amountCents || amountCents < 100) {
    return res.status(400).json({ message: "Invalid cart total (minimum $1.00)" })
  }
  const amountDollars = (amountCents / 100).toFixed(2)

  // 6. Idempotency check (also covers charged_unreconciled)
  const idempotencyKey = `nmi_${cart_id}_${session.id}`
  const nmiPaymentService = req.scope.resolve(NMI_PAYMENT_MODULE) as any

  const existingIntents = await nmiPaymentService.listNmiPaymentIntents({
    idempotency_key: idempotencyKey,
  })
  const alreadyCharged = existingIntents?.find(
    (i: any) => i.status === "charged" || i.status === "charged_unreconciled"
  )
  if (alreadyCharged) {
    logger.info("[NmiCharge] Idempotent hit — already charged", { idempotencyKey })
    return res.json({
      success: true,
      transaction_id: alreadyCharged.nmi_transaction_id,
    })
  }

  // 7. Create payment intent (pending)
  const [intent] = await nmiPaymentService.createNmiPaymentIntents([
    {
      cart_id,
      session_id: session.id,
      amount_cents: amountCents,
      currency_code: cart.currency_code as string,
      idempotency_key: idempotencyKey,
      status: "pending",
    },
  ])

  // 8. 3DS policy check
  const threeDsMode = process.env.NMI_3DS_MODE || "best_effort"
  if (threeDsMode === "required" && !three_ds?.cavv) {
    return res.status(400).json({ message: "3D Secure authentication required" })
  }

  // 9. Build 3DS extra params
  const extraParams: Record<string, string> = {}
  if (three_ds) {
    if (three_ds.cavv) extraParams.cavv = three_ds.cavv
    if (three_ds.xid) extraParams.xid = three_ds.xid
    if (three_ds.eci) extraParams.eci_value = three_ds.eci
    if (three_ds.cardholder_auth) extraParams.cardholder_auth = three_ds.cardholder_auth
    if (three_ds.three_ds_version) extraParams.three_ds_version = three_ds.three_ds_version
    if (three_ds.directory_server_id) extraParams.directory_server_id = three_ds.directory_server_id
  }

  // 10. Charge via NMI (dual-lane)
  const lane = (process.env.NMI_API_LANE || "v5") as NmiLane
  const nmiClient = new NmiClient(process.env.NMI_SECURITY_KEY!, logger, lane)

  let nmiResult: Awaited<ReturnType<NmiClient["sale"]>>
  try {
    nmiResult = await nmiClient.sale(payment_token, amountDollars, extraParams)
  } catch (err) {
    const msg = (err as Error).message ?? ""
    const isTimeout = msg.includes("timeout")

    await nmiPaymentService.updateNmiPaymentIntents([
      { id: intent.id, status: "failed" },
    ])

    logger.error("[NmiCharge] NMI call failed", { error: msg })

    return res
      .status(isTimeout ? 502 : 500)
      .json({ message: isTimeout ? "Payment gateway timeout. Please try again." : "Payment processing error." })
  }

  // 11. Log attempt (always, even on failure)
  await nmiPaymentService.createNmiPaymentAttemptLogs([
    {
      intent_id: intent.id,
      action: "sale",
      request_amount: amountDollars,
      response_code: nmiResult.responseCode ?? "",
      response_text: nmiResult.responseText ?? "",
      nmi_transaction_id: nmiResult.transactionId || null,
      avs_response: nmiResult.avsResponse || null,
      cvv_response: nmiResult.cvvResponse || null,
      three_ds_eci: three_ds?.eci || null,
      raw_response: JSON.stringify(nmiResult),
    },
  ])

  // 11a. Log full NMI response for debugging
  // NOTE: In NMI sandbox, most test cards are approved regardless of expiration date.
  // In production with real cards, NMI validates expiration, CVV, and AVS correctly.
  logger.info("[NmiCharge] NMI response", {
    response: nmiResult.response,
    responseText: nmiResult.responseText,
    responseCode: nmiResult.responseCode,
    approved: nmiResult.approved,
  })

  // 12. Handle declined / error
  if (!nmiResult.approved) {
    await nmiPaymentService.updateNmiPaymentIntents([
      {
        id: intent.id,
        status: "failed",
        nmi_response_code: nmiResult.responseCode,
      },
    ])

    logger.warn("[NmiCharge] Payment declined", {
      response: nmiResult.response,
      responseText: nmiResult.responseText,
    })

    return res.status(400).json({
      message: "Payment declined. Please try again or use a different card.",
    })
  }

  // 13. Approved — update intent to charged
  await nmiPaymentService.updateNmiPaymentIntents([
    {
      id: intent.id,
      status: "charged",
      nmi_transaction_id: nmiResult.transactionId,
      nmi_auth_code: nmiResult.authCode,
      nmi_response_code: nmiResult.responseCode,
      charged_at: new Date(),
    },
  ])

  // 14. Update payment session data so authorizePayment succeeds
  try {
    const paymentModuleService = req.scope.resolve(Modules.PAYMENT) as any
    await paymentModuleService.updatePaymentSessions([
      {
        id: session.id,
        data: {
          ...(session.data as Record<string, unknown>),
          nmi_status: "charged",
          nmi_transaction_id: nmiResult.transactionId,
          nmi_auth_code: nmiResult.authCode,
        },
      },
    ])
  } catch (err) {
    // Session update failed — mark charged_unreconciled so authorizePayment DB fallback handles it
    await nmiPaymentService.updateNmiPaymentIntents([
      { id: intent.id, status: "charged_unreconciled" },
    ])
    logger.warn(
      "[NmiCharge] Charge OK but session update failed — intent marked charged_unreconciled",
      { error: (err as Error).message, intentId: intent.id }
    )
  }

  return res.json({
    success: true,
    transaction_id: nmiResult.transactionId,
  })
}
