"use client"

import dynamic from "next/dynamic"
import { Button } from "@medusajs/ui"
import { useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import { placeOrder } from "@lib/data/cart"
import type { NmiCardFieldsHandle } from "../nmi-card-fields"

const NmiCardFields = dynamic(() => import("../nmi-card-fields"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3">
      <div className="h-10 bg-ui-bg-subtle rounded" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-ui-bg-subtle rounded" />
        <div className="h-10 bg-ui-bg-subtle rounded" />
      </div>
    </div>
  ),
})

type Props = {
  cart: HttpTypes.StoreCart
  session: any
  notReady: boolean
}

export default function NmiPaymentSection({ cart, session, notReady }: Props) {
  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const [formComplete, setFormComplete] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chargeSucceeded, setChargeSucceeded] = useState(false)

  const cardFieldsRef = useRef<NmiCardFieldsHandle>(null)

  const pathname = usePathname()
  const isEnglish = pathname?.includes("/en")

  const tokenizationKey =
    (session?.data?.tokenizationKey as string) ||
    process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY ||
    ""

  const handleSubmit = async () => {
    if (!paymentToken) {
      setError(
        isEnglish
          ? "Please enter your card details"
          : "Ingresa los datos de tu tarjeta"
      )
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const chargeRes = await fetch(`${backendUrl}/store/custom/nmi-charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          cart_id: cart.id,
          payment_token: paymentToken,
        }),
      })

      const chargeData = await chargeRes.json()

      if (!chargeRes.ok) {
        // NMI PSP decline vs technical/infrastructure error
        const isDecline =
          chargeRes.status === 400 &&
          chargeData.message?.toLowerCase().includes("declined")
        setError(
          isDecline
            ? (isEnglish
                ? "Payment declined. Please try again or use a different card."
                : "Pago rechazado. Intenta de nuevo o usa una tarjeta diferente.")
            : (chargeData.message ||
                (isEnglish
                  ? "Payment could not be processed. Please refresh and try again."
                  : "No se pudo procesar el pago. Recarga e inténtalo de nuevo."))
        )
        setSubmitting(false)
        cardFieldsRef.current?.resetFields()
        setPaymentToken(null)
        setFormComplete(false)
        return
      }

      setChargeSucceeded(true)

      try {
        await placeOrder()
      } catch {
        setError(
          isEnglish
            ? "Your payment was received but the order could not be confirmed automatically. Our team is reviewing it — you will receive a confirmation shortly."
            : "Tu pago fue recibido pero la orden no pudo confirmarse automáticamente. Nuestro equipo lo está validando — recibirás una confirmación pronto."
        )
        setSubmitting(false)
      }
    } catch (err: any) {
      if (chargeSucceeded) {
        setError(
          isEnglish
            ? "Your payment was received but the order could not be confirmed automatically. Our team is reviewing it."
            : "Tu pago fue recibido pero la orden no pudo confirmarse. Nuestro equipo lo está validando."
        )
      } else {
        setError(
          isEnglish
            ? "Connection error. Please check your internet and try again."
            : "Error de conexión. Verifica tu internet e inténtalo de nuevo."
        )
      }
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-ui-border-base rounded-lg p-4">
        <p className="text-sm font-medium text-ui-fg-base mb-3">
          {isEnglish ? "Card Details" : "Datos de Tarjeta"}
        </p>

        {tokenizationKey ? (
          <NmiCardFields
            ref={cardFieldsRef}
            tokenizationKey={tokenizationKey}
            onTokenChange={(token, complete) => {
              setPaymentToken(token)
              setFormComplete(complete)
              if (error) setError(null)
            }}
          />
        ) : (
          <p className="text-sm text-ui-fg-subtle">
            {isEnglish
              ? "Payment configuration error"
              : "Error de configuración de pago"}
          </p>
        )}
      </div>

      <ErrorMessage error={error} data-testid="nmi-payment-error" />

      <Button
        size="large"
        onClick={handleSubmit}
        isLoading={submitting}
        disabled={!formComplete || submitting || notReady || chargeSucceeded}
        data-testid="nmi-submit-order-button"
      >
        {isEnglish ? "Place Order" : "Realizar Pedido"}
      </Button>
    </div>
  )
}
