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
  protected container_: any
  private nmiClient_: NmiClient

  constructor(container: InjectedDependencies, options: NmiProviderOptions) {
    // eslint-disable-next-line prefer-rest-params
    super(...(arguments as unknown as [Record<string, unknown>, NmiProviderOptions]))
    this.container_ = container
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

  async authorizePayment(paymentSessionData: any, context?: any): Promise<any> {
    const data: Record<string, unknown> =
      paymentSessionData?.data !== undefined
        ? (paymentSessionData.data as Record<string, unknown>)
        : paymentSessionData

    // Primary: session data was updated by charge route
    if (data.nmi_status === "charged" || data.nmi_status === "charged_unreconciled") {
      return { status: "captured", data }
    }

    // Fallback: session update failed — check DB for charged intent
    try {
      const nmiModule = this.container_?.resolve?.("nmiPayment") as any
      if (nmiModule) {
        // Try to find by session_id first
        const sessionId = data.id || (paymentSessionData as any)?.id
        let intents: any[] = []
        if (sessionId) {
          intents = await nmiModule.listNmiPaymentIntents({ session_id: sessionId })
        }
        // Fallback: try cart_id from context
        if (!intents?.length) {
          const cartId = (context as any)?.cart_id ?? data.cart_id
          if (cartId) {
            intents = await nmiModule.listNmiPaymentIntents({ cart_id: cartId })
          }
        }
        const found = intents?.find(
          (i: any) => i.status === "charged" || i.status === "charged_unreconciled"
        )
        if (found) {
          this.logger_.info("[NmiProvider] authorizePayment DB fallback — found charged intent", {
            intentId: found.id,
          })
          return {
            status: "captured",
            data: {
              ...data,
              nmi_status: "charged",
              nmi_transaction_id: found.nmi_transaction_id,
              nmi_auth_code: found.nmi_auth_code,
            },
          }
        }
      }
    } catch (err) {
      this.logger_.warn("[NmiProvider] authorizePayment DB fallback error", {
        error: (err as Error).message,
      })
    }

    this.logger_.warn("[NmiProvider] authorizePayment — no charged session or intent found", { data })
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
    if (!transactionId) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot refund: no NMI transaction ID on this payment"
      )
    }

    if (!amountCents || amountCents <= 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Cannot refund: invalid amount"
      )
    }

    const amountDollars = (amountCents / 100).toFixed(2)

    this.logger_.info("[NmiProvider] refundPayment", { transactionId, amountDollars })

    const result = await this.nmiClient_.refund(transactionId, amountDollars)

    // Log refund attempt
    try {
      const nmiModule = this.container_?.resolve?.("nmiPayment") as any
      if (nmiModule) {
        const intents = await nmiModule.listNmiPaymentIntents({ nmi_transaction_id: transactionId })
        const intentId = intents?.[0]?.id || "unknown"
        await nmiModule.createNmiPaymentAttemptLogs([{
          intent_id: intentId,
          action: "refund",
          request_amount: amountDollars,
          response_code: result.responseCode,
          response_text: result.responseText,
          nmi_transaction_id: result.transactionId || null,
          avs_response: null,
          cvv_response: null,
          three_ds_eci: null,
        }])
      }
    } catch (logErr) {
      this.logger_.warn("[NmiProvider] Failed to log refund attempt", { error: (logErr as Error).message })
    }

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

    // Log void attempt
    try {
      const nmiModule = this.container_?.resolve?.("nmiPayment") as any
      if (nmiModule) {
        const intents = await nmiModule.listNmiPaymentIntents({ nmi_transaction_id: transactionId })
        const intentId = intents?.[0]?.id || "unknown"
        await nmiModule.createNmiPaymentAttemptLogs([{
          intent_id: intentId,
          action: "void",
          request_amount: "0",
          response_code: result.responseCode,
          response_text: result.responseText,
          nmi_transaction_id: result.transactionId || null,
          avs_response: null,
          cvv_response: null,
          three_ds_eci: null,
        }])
      }
    } catch (logErr) {
      this.logger_.warn("[NmiProvider] Failed to log void attempt", { error: (logErr as Error).message })
    }

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
