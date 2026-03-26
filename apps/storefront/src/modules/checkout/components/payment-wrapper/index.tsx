"use client"

import React from "react"
import dynamic from "next/dynamic"
import { HttpTypes } from "@medusajs/types"
import { isStripeLike } from "@lib/constants"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey =
  process.env.NEXT_PUBLIC_STRIPE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY

const medusaAccountId = process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID

// Use next/dynamic so @stripe/stripe-js (which auto-injects js.stripe.com on import)
// is never evaluated when Stripe is not the active payment provider.
const StripeWrapper = stripeKey
  ? dynamic(() => import("./stripe-wrapper"), { ssr: false })
  : null

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  if (
    isStripeLike(paymentSession?.provider_id) &&
    paymentSession &&
    StripeWrapper
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey!}
        stripeAccountId={medusaAccountId}
      >
        {children as React.ReactNode}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

export default PaymentWrapper
