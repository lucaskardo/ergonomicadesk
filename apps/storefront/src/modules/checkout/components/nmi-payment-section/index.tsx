"use client"

import { Button } from "@medusajs/ui"
import { useState, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "@modules/checkout/components/error-message"
import { placeOrder } from "@lib/data/cart"
import { NmiPayments, NmiThreeDSecure } from "@nmipayments/nmi-pay-react"

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

  const threeDsRef = useRef<any>(null)
  const nmiRef = useRef<any>(null)

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
      // ── STEP 1: 3DS Authentication ─────────────────────────
      let threeDsData: Record<string, string> = {}

      if (threeDsRef.current?.startThreeDSecure) {
        try {
          const billing = cart.billing_address
          const threeDsResult = await threeDsRef.current.startThreeDSecure({
            paymentToken,
            currency: "USD",
            // Amount as string "XX.XX" — validated against NMI sandbox
            amount: ((cart.total || 0) / 100).toFixed(2),
            firstName: billing?.first_name || "",
            lastName: billing?.last_name || "",
            email: cart.email || "",
            address1: billing?.address_1 || "",
            city: billing?.city || "",
            state: billing?.province || "",
            postalCode: billing?.postal_code || "",
            country: billing?.country_code || "PA",
            phone: billing?.phone || "",
          })

          if (threeDsResult) {
            if (threeDsResult.cavv) threeDsData.cavv = threeDsResult.cavv
            if (threeDsResult.xid) threeDsData.xid = threeDsResult.xid
            if (threeDsResult.eci) threeDsData.eci = threeDsResult.eci
            if (threeDsResult.cardHolderAuth)
              threeDsData.cardholder_auth = threeDsResult.cardHolderAuth
            if (threeDsResult.threeDsVersion)
              threeDsData.three_ds_version = threeDsResult.threeDsVersion
            if (threeDsResult.directoryServerId)
              threeDsData.directory_server_id = threeDsResult.directoryServerId
          }
        } catch (threeDsErr: any) {
          // In best_effort mode, continue without 3DS
          // In required mode, backend will reject without cavv
          console.warn("3DS auth failed or unavailable:", threeDsErr.message)
        }
      }

      // ── STEP 2: Charge via backend ─────────────────────────
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
          three_ds:
            Object.keys(threeDsData).length > 0 ? threeDsData : undefined,
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
        // Reset NMI fields for retry
        if (nmiRef.current?.resetFields) {
          nmiRef.current.resetFields()
          setPaymentToken(null)
          setFormComplete(false)
        }
        return
      }

      // ── STEP 3: Charge succeeded — mark it ─────────────────
      setChargeSucceeded(true)

      // ── STEP 4: Complete order ─────────────────────────────
      try {
        await placeOrder()
        // placeOrder handles redirect to confirmation page
      } catch (orderErr: any) {
        // RECOVERY UX: Charge was approved but order couldn't complete
        // Do NOT tell user to retry payment
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

  return (
    <div className="flex flex-col gap-4">
      {/* Card fields */}
      <div className="border border-ui-border-base rounded-lg p-4">
        <p className="text-sm font-medium text-ui-fg-base mb-3">
          {isEnglish ? "Card Details" : "Datos de Tarjeta"}
        </p>

        {tokenizationKey ? (
          <NmiPayments
            ref={nmiRef}
            tokenizationKey={tokenizationKey}
            onChange={handleNmiChange}
            paymentMethods={["card"]}
          />
        ) : (
          <p className="text-sm text-ui-fg-subtle">
            {isEnglish
              ? "Payment configuration error"
              : "Error de configuración de pago"}
          </p>
        )}
      </div>

      {/* 3DS Component — hidden, renders modal when needed */}
      {typeof NmiThreeDSecure !== "undefined" && tokenizationKey && (
        <NmiThreeDSecure
          ref={threeDsRef}
          tokenizationKey={tokenizationKey}
          modal={true}
        />
      )}

      {/* Error */}
      <ErrorMessage error={error} data-testid="nmi-payment-error" />

      {/* Submit — disabled after charge succeeds to prevent double payment */}
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
