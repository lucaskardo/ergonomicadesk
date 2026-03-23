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
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [sdkError, setSdkError] = useState<string | null>(null)
  const nmiComponentsRef = useRef<{ NmiPayments: any; NmiThreeDSecure: any } | null>(null)
  const [mountKey, setMountKey] = useState(0)

  const [paymentToken, setPaymentToken] = useState<string | null>(null)
  const [formComplete, setFormComplete] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chargeSucceeded, setChargeSucceeded] = useState(false)

  const nmiRef = useRef<any>(null)
  const threeDsRef = useRef<any>(null)

  // Load NMI SDK client-side only
  useEffect(() => {
    console.log("[NMI] useEffect fired, importing SDK...")
    let cancelled = false
    import("@nmipayments/nmi-pay-react")
      .then((mod) => {
        if (cancelled) return
        nmiComponentsRef.current = {
          NmiPayments: mod.NmiPayments,
          NmiThreeDSecure: mod.NmiThreeDSecure,
        }
        console.log("[NMI] SDK loaded successfully")
        setSdkLoaded(true)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("Failed to load NMI SDK:", err)
        setSdkError(err.message)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Force re-mount of NmiPayments after SDK loads so iframes initialize against a live DOM node
  useEffect(() => {
    if (!sdkLoaded) return
    console.log("[NMI] sdkLoaded=true, scheduling re-mount via requestAnimationFrame")
    let rafId: number
    const schedule = () => {
      rafId = requestAnimationFrame(() => {
        console.log("[NMI] re-mounting NmiPayments (mountKey bump)")
        setMountKey((k) => k + 1)
      })
    }
    schedule()
    return () => cancelAnimationFrame(rafId)
  }, [sdkLoaded])

  const pathname = usePathname()
  const isEnglish = pathname?.includes("/en")

  const tokenizationKey =
    (session?.data?.tokenizationKey as string) ||
    process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY ||
    ""

  // cart.total in Medusa v2 may be BigNumber object
  const rawTotal = (cart as any).total
  const totalCents =
    typeof rawTotal === "object" && rawTotal !== null
      ? Number((rawTotal as any).value ?? (rawTotal as any).numeric ?? 0)
      : Number(rawTotal || 0)

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
      // 3DS
      let threeDsData: Record<string, string> = {}
      if (threeDsRef.current?.startThreeDSecure) {
        try {
          const billing = cart.billing_address
          const threeDsResult = await threeDsRef.current.startThreeDSecure({
            paymentToken,
            currency: "USD",
            amount: (totalCents / 100).toFixed(2),
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
            if (threeDsResult.cardHolderAuth) threeDsData.cardholder_auth = threeDsResult.cardHolderAuth
            if (threeDsResult.threeDsVersion) threeDsData.three_ds_version = threeDsResult.threeDsVersion
            if (threeDsResult.directoryServerId) threeDsData.directory_server_id = threeDsResult.directoryServerId
          }
        } catch (threeDsErr: any) {
          console.warn("3DS auth failed or unavailable:", threeDsErr.message)
        }
      }

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
          three_ds: Object.keys(threeDsData).length > 0 ? threeDsData : undefined,
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

  // Get components from ref (avoids re-renders from state)
  const NmiPaymentsComp = nmiComponentsRef.current?.NmiPayments
  const NmiThreeDSecureComp = nmiComponentsRef.current?.NmiThreeDSecure

  console.log("[NMI] Rendering NmiPaymentsComp:", !!NmiPaymentsComp, "tokenKey:", !!tokenizationKey, "sdkLoaded:", sdkLoaded, "mountKey:", mountKey)

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
        ) : !sdkLoaded || !NmiPaymentsComp ? (
          <div className="animate-pulse space-y-3">
            <div className="h-10 bg-ui-bg-subtle rounded" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-ui-bg-subtle rounded" />
              <div className="h-10 bg-ui-bg-subtle rounded" />
            </div>
          </div>
        ) : tokenizationKey ? (
          <NmiPaymentsComp
            key={mountKey}
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

      {/* 3DS: mount only after token exists */}
      {NmiThreeDSecureComp && tokenizationKey && paymentToken && (
        <NmiThreeDSecureComp
          ref={threeDsRef}
          tokenizationKey={tokenizationKey}
          modal={true}
        />
      )}

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
