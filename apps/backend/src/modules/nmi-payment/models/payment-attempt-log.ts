import { model } from "@medusajs/framework/utils"

const NmiPaymentAttemptLog = model.define("nmi_payment_attempt_log", {
  id: model.id().primaryKey(),
  intent_id: model.text(),
  action: model.text(), // "sale", "refund", "void"
  request_amount: model.text(),
  response_code: model.text(),
  response_text: model.text(),
  nmi_transaction_id: model.text().nullable(),
  avs_response: model.text().nullable(),
  cvv_response: model.text().nullable(),
  three_ds_eci: model.text().nullable(),
})

export default NmiPaymentAttemptLog
