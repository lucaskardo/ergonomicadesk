"use client"

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"

type Props = {
  data: HttpTypes.AdminOrder
}

type Intent = {
  id: string
  cart_id: string
  session_id: string
  amount_cents: number
  currency_code: string
  status: string
  nmi_transaction_id: string | null
  nmi_auth_code: string | null
  nmi_response_code: string | null
  charged_at: string | null
}

type Attempt = {
  id: string
  intent_id: string
  action: string
  request_amount: string
  response_code: string
  response_text: string
  nmi_transaction_id: string | null
  avs_response: string | null
  cvv_response: string | null
  three_ds_eci: string | null
  created_at: string
}

const statusColor = (status: string) => {
  if (status === "charged") return "green"
  if (status === "failed") return "red"
  if (status === "voided") return "orange"
  return "grey"
}

const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

const OrderPaymentInfoWidget = ({ data: order }: Props) => {
  const [intent, setIntent] = useState<Intent | null>(null)
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/admin/custom/nmi-payment-info?order_id=${order.id}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setIntent(data.intent ?? null)
        setAttempts(data.attempts ?? [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [order.id])

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2" className="text-ui-fg-base text-sm font-semibold">
          Pago NMI
        </Heading>
      </div>

      <div className="px-6 py-4 flex flex-col gap-3">
        {loading && (
          <Text className="text-ui-fg-subtle text-sm">Cargando...</Text>
        )}

        {error && (
          <Text className="text-ui-fg-error text-sm">{error}</Text>
        )}

        {!loading && !error && !intent && (
          <Text className="text-ui-fg-subtle text-sm italic">Sin datos de pago NMI</Text>
        )}

        {!loading && !error && intent && (
          <>
            <div className="grid grid-cols-[140px_1fr] gap-x-2 gap-y-2">
              <Text className="text-ui-fg-subtle text-sm">Estado</Text>
              <Badge size="xsmall" color={statusColor(intent.status)}>
                {intent.status}
              </Badge>

              <Text className="text-ui-fg-subtle text-sm">Monto</Text>
              <Text className="text-ui-fg-base text-sm font-medium">
                {fmt(intent.amount_cents)} {intent.currency_code?.toUpperCase()}
              </Text>

              {intent.nmi_transaction_id && (
                <>
                  <Text className="text-ui-fg-subtle text-sm">Transaction ID</Text>
                  <Text className="text-ui-fg-base text-sm font-mono break-all">
                    {intent.nmi_transaction_id}
                  </Text>
                </>
              )}

              {intent.nmi_auth_code && (
                <>
                  <Text className="text-ui-fg-subtle text-sm">Auth Code</Text>
                  <Text className="text-ui-fg-base text-sm font-mono">
                    {intent.nmi_auth_code}
                  </Text>
                </>
              )}

              {intent.nmi_response_code && (
                <>
                  <Text className="text-ui-fg-subtle text-sm">Response Code</Text>
                  <Text className="text-ui-fg-base text-sm">{intent.nmi_response_code}</Text>
                </>
              )}

              {intent.charged_at && (
                <>
                  <Text className="text-ui-fg-subtle text-sm">Cobrado</Text>
                  <Text className="text-ui-fg-base text-sm">
                    {new Date(intent.charged_at).toLocaleString("es-PA")}
                  </Text>
                </>
              )}
            </div>

            {attempts.length > 0 && (
              <div className="mt-3 pt-3 border-t border-ui-border-base">
                <Text className="text-ui-fg-subtle text-xs font-semibold uppercase tracking-wide mb-2">
                  Intentos ({attempts.length})
                </Text>
                <div className="flex flex-col gap-2">
                  {attempts.map((a) => (
                    <div
                      key={a.id}
                      className="bg-ui-bg-subtle rounded-md px-3 py-2 text-xs"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-ui-fg-base uppercase">{a.action}</span>
                        <span className="text-ui-fg-subtle">
                          {new Date(a.created_at).toLocaleString("es-PA")}
                        </span>
                      </div>
                      <div className="text-ui-fg-subtle">
                        ${a.request_amount} · {a.response_code} {a.response_text}
                        {a.nmi_transaction_id && (
                          <span className="ml-1 font-mono">· {a.nmi_transaction_id}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
})

export default OrderPaymentInfoWidget
