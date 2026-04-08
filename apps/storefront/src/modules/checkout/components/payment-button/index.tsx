"use client"

import { isManual, isStripeLike, isNmi } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useRef, useState } from "react"
import ErrorMessage from "../error-message"
import { TurnstileWidget } from "../turnstile"
import { useLang } from "@lib/i18n/context"
import { getTranslations } from "@lib/i18n"
import { usePathname } from "next/navigation"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const lang = useLang()
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isNmi(paymentSession?.provider_id):
      return <NmiChargeButton cart={cart} notReady={notReady} />
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    default:
      return <Button disabled>{lang === "es" ? "Seleccionar método de pago" : "Select a payment method"}</Button>
  }
}

const NmiChargeButton = ({
  cart,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
}) => {
  const pathname = usePathname()
  const isEnglish = pathname?.includes("/en")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const turnstileTokenRef = useRef<string | null>(null)

  const handleCharge = async () => {
    // Verify Turnstile challenge if site key is configured
    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
      if (!turnstileTokenRef.current) {
        setError(
          isEnglish
            ? "Please wait for the security check to complete."
            : "Espera a que termine la verificación de seguridad."
        )
        return
      }
      try {
        const verifyRes = await fetch("/api/turnstile-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: turnstileTokenRef.current }),
        })
        if (!verifyRes.ok) {
          setError(
            isEnglish
              ? "Security check failed. Please refresh and try again."
              : "Verificación de seguridad fallida. Recarga e inténtalo de nuevo."
          )
          turnstileTokenRef.current = null
          return
        }
      } catch {
        // Network error — fail closed: if Turnstile is configured, a verification
        // failure (including network errors) must block payment to prevent bot abuse.
        setError(
          isEnglish
            ? "Security check failed. Please refresh and try again."
            : "Verificación de seguridad fallida. Recarga e inténtalo de nuevo."
        )
        turnstileTokenRef.current = null
        return
      }
    }

    const token = sessionStorage.getItem("nmi_payment_token")
    if (!token) {
      setError(
        isEnglish
          ? "No payment token. Go back to the Payment step."
          : "No hay token de pago. Regresa al paso de Pago."
      )
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
      const res = await fetch(`${backendUrl}/store/custom/nmi-charge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key":
            process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({ cart_id: cart.id, payment_token: token }),
      })
      const raw = await res.text()
      if (!res.ok) {
        let msg: string
        try { msg = JSON.parse(raw).message } catch { msg = raw }
        const isDecline = res.status === 400 && msg?.toLowerCase().includes("declined")
        setError(
          isDecline
            ? (isEnglish ? "Payment declined. Please try again or use a different card." : "Pago rechazado. Intenta de nuevo o usa una tarjeta diferente.")
            : (msg || (isEnglish ? "Payment could not be processed. Please refresh and try again." : "No se pudo procesar el pago. Recarga e inténtalo de nuevo."))
        )
        setSubmitting(false)
        sessionStorage.removeItem("nmi_payment_token")
        return
      }
      sessionStorage.removeItem("nmi_payment_token")
      await placeOrder()
    } catch (err: any) {
      if (err?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw err
      }
      setError(
        isEnglish
          ? "Connection error. Please check your internet and try again."
          : "Error de conexión. Verifica tu internet e inténtalo de nuevo."
      )
      setSubmitting(false)
    }
  }

  return (
    <>
      <TurnstileWidget
        onVerify={(t) => { turnstileTokenRef.current = t }}
        onExpire={() => { turnstileTokenRef.current = null }}
      />
      <Button
        size="large"
        className="ergo-checkout-btn"
        onClick={handleCharge}
        isLoading={submitting}
        disabled={notReady || submitting}
      >
        {isEnglish ? "Place Order" : "Realizar Pedido"}
      </Button>
      <ErrorMessage error={error} />
    </>
  )
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const lang = useLang()
  const t = getTranslations(lang)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      if (err?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw err
      }
      setErrorMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements ? true : false

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session?.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address?.first_name +
              " " +
              cart.billing_address?.last_name,
            address: {
              city: cart.billing_address?.city ?? undefined,
              country: cart.billing_address?.country_code ?? undefined,
              line1: cart.billing_address?.address_1 ?? undefined,
              line2: cart.billing_address?.address_2 ?? undefined,
              postal_code: cart.billing_address?.postal_code ?? undefined,
              state: cart.billing_address?.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address?.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message || null)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        className="ergo-checkout-btn"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        {t.checkout.place_order}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
  const lang = useLang()
  const t = getTranslations(lang)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    try {
      await placeOrder()
    } catch (err: any) {
      // redirect() throws a NEXT_REDIRECT error — let it propagate so Next.js handles navigation
      if (err?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw err
      }
      setErrorMessage(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        className="ergo-checkout-btn"
        data-testid="submit-order-button"
      >
        {t.checkout.place_order}
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
