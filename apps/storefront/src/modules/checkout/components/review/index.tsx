"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useLang } from "@lib/i18n/context"
import { getTranslations } from "@lib/i18n"

const Review = ({ cart }: { cart: any }) => {
  const lang = useLang()
  const t = getTranslations(lang)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [hasRefreshed, setHasRefreshed] = useState(false)

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    (cart.payment_collection || paidByGiftcard)

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  // If review is open but no payment session, refresh once to get fresh cart
  useEffect(() => {
    if (isOpen && previousStepsCompleted && !paymentSession && !paidByGiftcard && !hasRefreshed) {
      const timer = setTimeout(() => {
        setHasRefreshed(true)
        router.refresh()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isOpen, previousStepsCompleted, paymentSession, paidByGiftcard, hasRefreshed, router])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none": !isOpen,
            }
          )}
        >
          {t.checkout.review}
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                {t.checkout.review_terms}
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
