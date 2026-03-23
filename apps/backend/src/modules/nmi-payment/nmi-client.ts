export type NmiLane = "transact" | "v5"

export type NmiResponse = {
  response: string      // "1"=approved, "2"=declined, "3"=error
  responseText: string
  authCode: string
  transactionId: string
  avsResponse: string
  cvvResponse: string
  responseCode: string
  approved: boolean
}

type SimpleLogger = {
  info: (msg: string, data?: unknown) => void
  warn: (msg: string, data?: unknown) => void
  error: (msg: string, data?: unknown) => void
}

const TRANSACT_URL = "https://secure.networkmerchants.com/api/transact.php"
const V5_BASE = "https://secure.nmi.com/api/v5/payments"
const TIMEOUT_MS = 15_000

export class NmiClient {
  private securityKey: string
  private lane: NmiLane
  private logger: SimpleLogger

  constructor(securityKey: string, logger: SimpleLogger, lane: NmiLane = "v5") {
    this.securityKey = securityKey
    this.logger = logger
    this.lane = lane
  }

  private normalizeTransact(raw: Record<string, string>): NmiResponse {
    return {
      response: raw.response ?? "3",
      responseText: raw.responsetext ?? "",
      authCode: raw.authcode ?? "",
      transactionId: raw.transactionid ?? "",
      avsResponse: raw.avsresponse ?? "",
      cvvResponse: raw.cvvresponse ?? "",
      responseCode: raw.response_code ?? "",
      approved: raw.response === "1",
    }
  }

  private normalizeV5(raw: Record<string, unknown>): NmiResponse {
    // NMI Payments API v5 response shape
    const approved =
      raw.result === "approved" ||
      raw.response === 1 ||
      raw.response === "1" ||
      raw.response === "approved"
    const declined = raw.result === "declined" || raw.response === 2 || raw.response === "2"
    return {
      response: approved ? "1" : declined ? "2" : "3",
      responseText: ((raw.response_text ?? raw.responsetext ?? raw.message ?? "") as string),
      authCode: ((raw.auth_code ?? raw.authcode ?? "") as string),
      transactionId: ((raw.id ?? raw.transaction_id ?? raw.transactionid ?? "") as string),
      avsResponse: ((raw.avs_response ?? raw.avsresponse ?? "") as string),
      cvvResponse: ((raw.cvv_response ?? raw.cvvresponse ?? "") as string),
      responseCode: ((raw.response_code ?? raw.result_code ?? "") as string),
      approved,
    }
  }

  private async withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    try {
      return await fn(controller.signal)
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        this.logger.error("[NmiClient] Request timed out after 15s")
        throw new Error("NMI gateway timeout — do NOT retry")
      }
      throw err
    } finally {
      clearTimeout(timer)
    }
  }

  private async postTransact(params: Record<string, string>): Promise<NmiResponse> {
    const body = new URLSearchParams({ security_key: this.securityKey, ...params })
    return this.withTimeout(async (signal) => {
      const res = await fetch(TRANSACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal,
      })
      const text = await res.text()
      const raw = Object.fromEntries(new URLSearchParams(text).entries())
      const normalized = this.normalizeTransact(raw)
      this.logger.info("[NmiClient:transact]", {
        response: normalized.response,
        transactionId: normalized.transactionId,
        responseCode: normalized.responseCode,
      })
      return normalized
    })
  }

  private async postV5(path: string, body: Record<string, unknown>): Promise<NmiResponse> {
    return this.withTimeout(async (signal) => {
      const res = await fetch(`${V5_BASE}/${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.securityKey,
        },
        body: JSON.stringify(body),
        signal,
      })
      const text = await res.text()
      let raw: Record<string, unknown>
      try {
        raw = JSON.parse(text) as Record<string, unknown>
      } catch (_parseErr) {
        throw new Error(`NMI v5 non-JSON response (HTTP ${res.status}): ${text.slice(0, 200)}`)
      }
      const normalized = this.normalizeV5(raw)
      this.logger.info("[NmiClient:v5]", {
        response: normalized.response,
        transactionId: normalized.transactionId,
        responseCode: normalized.responseCode,
      })
      return normalized
    })
  }

  async sale(
    paymentToken: string,
    amountDollars: string,
    extraParams?: Record<string, string>
  ): Promise<NmiResponse> {
    if (this.lane === "v5") {
      const body: Record<string, unknown> = {
        amount: amountDollars,
        payment_details: { payment_token: paymentToken },
      }
      if (extraParams?.cavv || extraParams?.eci) {
        body.payer_auth = {
          cavv: extraParams.cavv,
          xid: extraParams.xid,
          eci: extraParams.eci_value ?? extraParams.eci,
          cardholder_auth: extraParams.cardholder_auth,
          three_ds_version: extraParams.three_ds_version,
          directory_server_id: extraParams.directory_server_id,
        }
      }
      return this.postV5("sale", body)
    }
    return this.postTransact({
      type: "sale",
      payment_token: paymentToken,
      amount: amountDollars,
      currency: "USD",
      ...(extraParams ?? {}),
    })
  }

  async refund(transactionId: string, amountDollars: string): Promise<NmiResponse> {
    if (this.lane === "v5") {
      return this.postV5("refund", { transaction_id: transactionId, amount: amountDollars })
    }
    return this.postTransact({ type: "refund", transactionid: transactionId, amount: amountDollars })
  }

  async voidTxn(transactionId: string): Promise<NmiResponse> {
    if (this.lane === "v5") {
      return this.postV5("void", { transaction_id: transactionId })
    }
    return this.postTransact({ type: "void", transactionid: transactionId })
  }
}
