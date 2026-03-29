"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, isNmi, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { placeOrder } from "@lib/data/cart"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useRef } from "react"
import { useLang } from "@lib/i18n/context"
import { getTranslations } from "@lib/i18n"
import { trackAddPaymentInfo } from "@lib/tracking"
import dynamic from "next/dynamic"

const NmiCardFields = dynamic(() => import("../nmi-card-fields"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3 mt-4">
      <div className="h-10 bg-ui-bg-subtle rounded" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 bg-ui-bg-subtle rounded" />
        <div className="h-10 bg-ui-bg-subtle rounded" />
      </div>
    </div>
  ),
})

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const lang = useLang()
  const t = getTranslations(lang)
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )
  const [nmiToken, setNmiToken] = useState<string | null>(null)
  const [chargeSucceeded, setChargeSucceeded] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const cardFieldsRef = useRef<any>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method) || isNmi(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    trackAddPaymentInfo(cart, selectedPaymentMethod || "manual")

    try {
      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      // For Stripe: if no session yet, stay to collect card details
      if (isStripeLike(selectedPaymentMethod) && !activeSession && !checkActiveSession) {
        setIsLoading(false)
        return
      }

      // For NMI: charge immediately, then place order
      if (isNmi(selectedPaymentMethod)) {
        if (!nmiToken) {
          setError(lang === "en" ? "Please enter your card details" : "Ingresa los datos de tu tarjeta")
          setIsLoading(false)
          return
        }

        // Step 1: Charge NMI
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
        const chargeRes = await fetch(`${backendUrl}/store/custom/nmi-charge`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          body: JSON.stringify({
            cart_id: cart.id,
            payment_token: nmiToken,
            ...(turnstileToken && { turnstile_token: turnstileToken }),
          }),
        })

        const raw = await chargeRes.text()

        if (!chargeRes.ok) {
          let msg: string
          try { msg = JSON.parse(raw).message } catch { msg = raw }
          setError(
            msg || (lang === "en"
              ? "Payment declined. Please check your card and try again."
              : "Pago rechazado. Verifica tu tarjeta e intenta de nuevo.")
          )
          // Scroll to error and highlight card fields
          const cardContainer = document.querySelector("[data-nmi-card-container]")
          cardContainer?.classList.add("border-red-500", "border-2")
          cardContainer?.scrollIntoView({ behavior: "smooth", block: "center" })
          setTimeout(() => cardContainer?.classList.remove("border-red-500", "border-2"), 5000)
          cardFieldsRef.current?.resetFields?.()
          setNmiToken(null)
          setIsLoading(false)
          return
        }

        // Step 2: Charge succeeded — complete the order
        setChargeSucceeded(true)

        try {
          await placeOrder()
          // placeOrder redirects to order confirmed page automatically
        } catch (orderErr: any) {
          // placeOrder uses redirect() which throws NEXT_REDIRECT — let it propagate
          if (orderErr?.digest?.startsWith?.("NEXT_REDIRECT")) {
            throw orderErr
          }
          setError(
            lang === "en"
              ? "Your payment was received but the order could not be confirmed automatically. Our team is reviewing it — you will receive a confirmation shortly."
              : "Tu pago fue recibido pero la orden no pudo confirmarse automáticamente. Nuestro equipo lo está validando — recibirás una confirmación pronto."
          )
          setIsLoading(false)
        }
        return
      }

      // For Manual/other: just complete (existing Medusa flow handles it)
      try {
        await placeOrder()
      } catch (orderErr: any) {
        if (orderErr?.digest?.startsWith?.("NEXT_REDIRECT")) {
          throw orderErr
        }
        setError(orderErr.message)
        setIsLoading(false)
      }
    } catch (err: any) {
      // Let NEXT_REDIRECT propagate
      if (err?.digest?.startsWith?.("NEXT_REDIRECT")) {
        throw err
      }
      setError(err.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          {t.checkout.payment}
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              {t.checkout.edit}
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && (availablePaymentMethods?.length ?? 0) > 0 && (
            <>
              <RadioGroup
                value={selectedPaymentMethod}
                onChange={(value: string) => setPaymentMethod(value)}
              >
                {availablePaymentMethods.map((paymentMethod) => (
                  <div key={paymentMethod.id}>
                    {isStripeLike(paymentMethod.id) ? (
                      <StripeCardContainer
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                        paymentInfoMap={paymentInfoMap}
                        setCardBrand={setCardBrand}
                        setError={setError}
                        setCardComplete={setCardComplete}
                      />
                    ) : (
                      <PaymentContainer
                        paymentInfoMap={paymentInfoMap}
                        paymentProviderId={paymentMethod.id}
                        selectedPaymentOptionId={selectedPaymentMethod}
                      />
                    )}
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {isNmi(selectedPaymentMethod) && isOpen && (
            <div className="border border-ui-border-base rounded-lg p-4 mt-4" data-nmi-card-container>
              <p className="text-sm font-medium text-ui-fg-base mb-3">
                {lang === "en" ? "Card Details" : "Datos de Tarjeta"}
              </p>
              <div className="min-h-[120px]">
                <NmiCardFields
                  ref={cardFieldsRef}
                  tokenizationKey={process.env.NEXT_PUBLIC_NMI_TOKENIZATION_KEY || ""}
                  onTokenChange={(token: string | null, complete: boolean) => {
                    setNmiToken(token)
                  }}
                />
              </div>
            </div>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.checkout.payment_method}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                {t.checkout.gift_card}
              </Text>
            </div>
          )}

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />

          <Button
            size="large"
            className="mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
              (isNmi(selectedPaymentMethod) && !nmiToken) ||
              (!selectedPaymentMethod && !paidByGiftcard) ||
              chargeSucceeded
            }
            data-testid="submit-payment-button"
          >
            {isNmi(selectedPaymentMethod)
              ? (nmiToken
                ? t.checkout.place_order
                : t.checkout.enter_card_details)
              : isStripeLike(selectedPaymentMethod)
                ? (!activeSession
                  ? t.checkout.enter_card_details
                  : t.checkout.place_order)
                : t.checkout.place_order}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {t.checkout.payment_method}
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[activeSession?.provider_id]?.title ||
                    activeSession?.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  {t.checkout.payment_details}
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {isStripeLike(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : t.checkout.another_step}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.checkout.payment_method}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                {t.checkout.gift_card}
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment
