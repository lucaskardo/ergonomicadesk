import { model } from "@medusajs/framework/utils"

const NmiPaymentIntent = model.define("nmi_payment_intent", {
  id: model.id().primaryKey(),
  cart_id: model.text(),
  session_id: model.text(),
  amount_cents: model.number(),
  currency_code: model.text(),
  idempotency_key: model.text(),
  status: model.text(), // "pending", "charged", "failed", "voided"
  nmi_transaction_id: model.text().nullable(),
  nmi_auth_code: model.text().nullable(),
  nmi_response_code: model.text().nullable(),
  charged_at: model.dateTime().nullable(),
})

export default NmiPaymentIntent
