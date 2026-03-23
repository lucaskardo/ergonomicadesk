import { MedusaService } from "@medusajs/framework/utils"
import NmiPaymentIntent from "./models/payment-intent"
import NmiPaymentAttemptLog from "./models/payment-attempt-log"

class NmiPaymentModuleService extends MedusaService({
  NmiPaymentIntent,
  NmiPaymentAttemptLog,
}) {}

export default NmiPaymentModuleService
