import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"
import { NmiClient, NmiLane } from "../nmi-payment/nmi-client"

type SimpleLogger = {
  info: (msg: string, data?: unknown) => void
  warn: (msg: string, data?: unknown) => void
  error: (msg: string, data?: unknown) => void
}

type InjectedDependencies = {
  logger: SimpleLogger
  [key: string]: unknown
}

type NmiProviderOptions = {
  securityKey: string
  tokenizationKey: string
}

class NmiPaymentProviderService extends AbstractPaymentProvider<NmiProviderOptions> {
  static identifier = "nmi"

  protected logger_: SimpleLogger
  protected options_: NmiProviderOptions
  private nmiClient_: NmiClient

  constructor(container: InjectedDependencies, options: NmiProviderOptions) {
    // eslint-disable-next-line prefer-rest-params
    super(...(arguments as unknown as [Record<string, unknown>, NmiProviderOptions]))
    this.logger_ = container.logger as SimpleLogger
    this.options_ = options

    const lane = (process.env.NMI_API_LANE || "v5") as NmiLane
    this.nmiClient_ = new NmiClient(options.securityKey, this.logger_, lane)
  }

  static validateOptions(options: NmiProviderOptions): void {
    if (!options.securityKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "NMI securityKey is required"
      )
    }
    if (!options.tokenizationKey) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "NMI tokenizationKey is required"
      )
    }
  }

  async initiatePayment(_context: unknown): Promise<any> {
    const id = `nmi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    return {
      id,
      data: {
        id,
        tokenizationKey: this.options_.tokenizationKey,
      },
    }
  }

  async authorizePayment(paymentSessionData: any): Promise<any> {
    // Normalize: Medusa v2 may call with (data) or ({ data })
    const data: Record<string, unknown> =
      paymentSessionData?.data !== undefined
        ? (paymentSessionData.data as Record<string, unknown>)
        : paymentSessionData

    // Charge route sets nmi_status="charged" on session data before placeOrder is called
    if (data.nmi_status === "charged" || data.nmi_status === "charged_unreconciled") {
      return { status: "captured", data }
    }

    this.logger_.warn("[NmiProvider] authorizePayment called without charged session data", { data })
    return { status: "error", data }
  }

  async capturePayment(input: any): Promise<any> {
    // No-op: NMI type=sale is auth+capture in one step
    const data = input?.data !== undefined ? input.data : input
    return { data }
  }

  async refundPayment(input: any): Promise<any> {
    let data: Record<string, unknown>
    let amountCents: number

    if (typeof input === "object" && input !== null && "data" in input) {
      data = input.data
      amountCents = input.amount ?? 0
    } else {
      data = input
      // eslint-disable-next-line prefer-rest-params
      amountCents = (arguments[1] as number) ?? 0
    }

    const transactionId = data.nmi_transaction_id as string
    const amountDollars = (amountCents / 100).toFixed(2)

    this.logger_.info("[NmiProvider] refundPayment", { transactionId, amountDollars })

    const result = await this.nmiClient_.refund(transactionId, amountDollars)

    if (!result.approved) {
      this.logger_.error("[NmiProvider] Refund failed", {
        responseText: result.responseText,
        responseCode: result.responseCode,
      })
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `NMI refund failed: ${result.responseText}`
      )
    }

    return {
      data: {
        ...data,
        nmi_refund_transaction_id: result.transactionId,
      },
    }
  }

  async cancelPayment(input: any): Promise<any> {
    const data: Record<string, unknown> =
      input?.data !== undefined ? input.data : input
    const transactionId = data.nmi_transaction_id as string | undefined

    if (!transactionId) {
      return { data }
    }

    this.logger_.info("[NmiProvider] cancelPayment (void)", { transactionId })

    const result = await this.nmiClient_.voidTxn(transactionId)

    if (!result.approved) {
      this.logger_.warn("[NmiProvider] Void failed", {
        responseText: result.responseText,
      })
    }

    return {
      data: { ...data, nmi_void_transaction_id: result.transactionId },
    }
  }

  async deletePayment(input: any): Promise<any> {
    const data = input?.data !== undefined ? input.data : input
    return { data }
  }

  async getPaymentStatus(input: any): Promise<any> {
    const data: Record<string, unknown> =
      input?.data !== undefined ? input.data : input

    if (data.nmi_status === "charged" || data.nmi_status === "charged_unreconciled") {
      return { status: "captured" }
    }
    return { status: "pending" }
  }

  async retrievePayment(input: any): Promise<any> {
    const data = input?.data !== undefined ? input.data : input
    return { data }
  }

  async updatePayment(context: any): Promise<any> {
    return { data: context?.data ?? {} }
  }

  async getWebhookActionAndData(_webhookData: unknown): Promise<any> {
    return { action: "not_supported" }
  }
}

export default NmiPaymentProviderService
