"use client"

import { Button } from "@medusajs/ui"
import { useState, useCallback, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import { placeOrder } from "@lib/data/cart"

// DO NOT import @nmipayments/nmi-pay-react at file level
// The SDK uses DOM classes that crash in SSR

type Props = {
  cart: HttpTypes.StoreCart
  session: any
  notReady: boolean
}

export default function NmiPaymentSection({ cart, session, notReady }: Props) {
  // Dynamic SDK components — loaded client-side only
  const [readyToRender, setReadyToRender] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)
  const nmiComponentsRef = useRef<{ NmiPayments: any } | null>(null)

  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const [formComplete, setFormComplete] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chargeSucceeded, setChargeSucceeded] = useState(false)

  const nmiRef = useRef<any>(null)

  // Load NMI SDK client-side only
  useEffect(() => {
    let cancelled = false
    import("@nmipayments/nmi-pay-react")
      .then((mod) => {
        if (cancelled) return
        nmiComponentsRef.current = { NmiPayments: mod.NmiPayments }
        // Delay rendering to let the DOM stabilize after step transition
        setTimeout(() => {
          if (!cancelled) setReadyToRender(true)
        }, 500)
      })
      .catch((err) => {
        if (cancelled) return
        setSdkError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const pathname = usePathname()
  const isEnglish = pathname?.includes("/en")

  const tokenizationKey =
    (session?.data?.tokenizationKey as string) ||
    process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY ||
    ""

  const handleNmiChange = useCallback(
    (response: any) => {
      if (response?.token) {
        setPaymentToken(response.token)
        setFormComplete(true)
      } else {
        setPaymentToken(null)
        setFormComplete(false)
      }
      if (error) setError(null)
    },
    [error]
  )

  const handleSubmit = async () => {
    if (!paymentToken) {
      setError(isEnglish ? "Please enter your card details" : "Ingresa los datos de tu tarjeta")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const threeDsData: Record<string, string> = {}
      // 3DS disabled in sandbox — will be re-integrated for production with proper mounting

      // Charge
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const chargeRes = await fetch(`${backendUrl}/store/custom/nmi-charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          cart_id: cart.id,
          payment_token: paymentToken,
        }),
      })

      const chargeData = await chargeRes.json()

      if (!chargeRes.ok) {
        setError(
          chargeData.message ||
            (isEnglish
              ? "Payment declined. Please check your card and try again."
              : "Pago rechazado. Verifica tu tarjeta e intenta de nuevo.")
        )
        setSubmitting(false)
        if (nmiRef.current?.resetFields) {
          nmiRef.current.resetFields()
          setPaymentToken(null)
          setFormComplete(false)
        }
        return
      }

      setChargeSucceeded(true)

      try {
        await placeOrder()
      } catch (orderErr: any) {
        setError(
          isEnglish
            ? "Your payment was received but the order could not be confirmed automatically. Our team is reviewing it — you will receive a confirmation shortly."
            : "Tu pago fue recibido pero la orden no pudo confirmarse automáticamente. Nuestro equipo lo está validando — recibirás una confirmación pronto."
        )
        setSubmitting(false)
        return
      }
    } catch (err: any) {
      if (chargeSucceeded) {
        setError(
          isEnglish
            ? "Your payment was received but the order could not be confirmed automatically. Our team is reviewing it."
            : "Tu pago fue recibido pero la orden no pudo confirmarse. Nuestro equipo lo está validando."
        )
      } else {
        setError(err.message || (isEnglish ? "An error occurred" : "Ocurrió un error"))
      }
      setSubmitting(false)
    }
  }

  // Get component from ref (avoids re-renders from state)
  const NmiPaymentsComp = nmiComponentsRef.current?.NmiPayments

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-ui-border-base rounded-lg p-4">
        <p className="text-sm font-medium text-ui-fg-base mb-3">
          {isEnglish ? "Card Details" : "Datos de Tarjeta"}
        </p>

        {sdkError ? (
          <p className="text-sm text-red-500">
            {isEnglish ? "Failed to load payment form" : "Error al cargar el formulario de pago"}
          </p>
        ) : !readyToRender || !NmiPaymentsComp ? (
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-ui-bg-subtle rounded" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-ui-bg-subtle rounded" />
              <div className="h-10 bg-ui-bg-subtle rounded" />
            </div>
          </div>
        ) : tokenizationKey ? (
          <NmiPaymentsComp
            ref={nmiRef}
            tokenizationKey={tokenizationKey}
            onChange={handleNmiChange}
            paymentMethods={["card"]}
          />
        ) : (
          <p className="text-sm text-ui-fg-subtle">
            {isEnglish ? "Payment configuration error" : "Error de configuración de pago"}
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
