import { defineRouteConfig } from "@medusajs/admin-sdk"
import { CreditCard } from "@medusajs/icons"
import { Container, Heading, Text, Badge, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"

const LIMIT = 50

type Attempt = {
  id: string
  intent_id: string
  action: string
  request_amount: string
  response_code: string
  response_text: string
  nmi_transaction_id: string | null
  created_at: string
  intent: {
    id: string
    cart_id: string
    status: string
    amount_cents: number
    currency_code: string
  } | null
}

const statusColor = (status: string) => {
  if (status === "charged") return "green"
  if (status === "failed") return "red"
  if (status === "voided") return "orange"
  return "grey"
}

const responseColor = (code: string) => {
  if (code === "100") return "green"
  return "red"
}

const PaymentAttemptsPage = () => {
  const [attempts, setAttempts] = useState<Attempt[]>([])
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = (off: number) => {
    setLoading(true)
    fetch(`/admin/custom/payment-attempts?offset=${off}&limit=${LIMIT}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((data) => {
        setAttempts(data.attempts ?? [])
        setCount(data.count ?? 0)
        setOffset(off)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(0)
  }, [])

  const totalPages = Math.ceil(count / LIMIT)
  const currentPage = Math.floor(offset / LIMIT) + 1

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading level="h1" className="text-ui-fg-base">
            Payment Attempts
          </Heading>
          <Text className="text-ui-fg-subtle text-sm mt-1">
            {count} registros en total
          </Text>
        </div>
      </div>

      {error && (
        <div className="px-6 py-4">
          <Text className="text-ui-fg-error text-sm">{error}</Text>
        </div>
      )}

      {loading && (
        <div className="px-6 py-4">
          <Text className="text-ui-fg-subtle text-sm">Cargando...</Text>
        </div>
      )}

      {!loading && !error && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Fecha</Table.HeaderCell>
              <Table.HeaderCell>Acción</Table.HeaderCell>
              <Table.HeaderCell>Monto</Table.HeaderCell>
              <Table.HeaderCell>Resp. Code</Table.HeaderCell>
              <Table.HeaderCell>Resp. Text</Table.HeaderCell>
              <Table.HeaderCell>Transaction ID</Table.HeaderCell>
              <Table.HeaderCell>Cart ID</Table.HeaderCell>
              <Table.HeaderCell>Estado Intent</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {attempts.map((a) => (
              <Table.Row key={a.id}>
                <Table.Cell className="text-sm whitespace-nowrap">
                  {new Date(a.created_at).toLocaleString("es-PA")}
                </Table.Cell>
                <Table.Cell>
                  <Badge size="xsmall" color={a.action === "sale" ? "blue" : "orange"}>
                    {a.action}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-sm font-medium">
                  ${a.request_amount}
                </Table.Cell>
                <Table.Cell>
                  <Badge size="xsmall" color={responseColor(a.response_code)}>
                    {a.response_code}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="text-sm max-w-[180px] truncate">
                  {a.response_text}
                </Table.Cell>
                <Table.Cell className="font-mono text-xs">
                  {a.nmi_transaction_id ?? "—"}
                </Table.Cell>
                <Table.Cell className="font-mono text-xs max-w-[140px] truncate">
                  {a.intent?.cart_id ?? "—"}
                </Table.Cell>
                <Table.Cell>
                  {a.intent ? (
                    <Badge size="xsmall" color={statusColor(a.intent.status)}>
                      {a.intent.status}
                    </Badge>
                  ) : (
                    <span className="text-ui-fg-subtle text-xs">—</span>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
            {attempts.length === 0 && (
              <Table.Row>
                <td colSpan={8} className="text-center text-ui-fg-subtle text-sm py-8">
                  Sin registros de intentos de pago
                </td>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <Text className="text-ui-fg-subtle text-sm">
            Página {currentPage} de {totalPages}
          </Text>
          <div className="flex gap-2">
            <button
              disabled={offset === 0}
              onClick={() => load(Math.max(0, offset - LIMIT))}
              className="text-sm px-3 py-1 rounded border border-ui-border-base disabled:opacity-40 hover:bg-ui-bg-subtle"
            >
              Anterior
            </button>
            <button
              disabled={offset + LIMIT >= count}
              onClick={() => load(offset + LIMIT)}
              className="text-sm px-3 py-1 rounded border border-ui-border-base disabled:opacity-40 hover:bg-ui-bg-subtle"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Payment Attempts",
  icon: CreditCard,
})

export default PaymentAttemptsPage
