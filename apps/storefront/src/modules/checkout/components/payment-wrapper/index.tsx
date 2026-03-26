"use client"

import React from "react"
import StripeWrapper from "./stripe-wrapper"
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

// Lazy-import Stripe only when a key is configured.
// Top-level import of @stripe/stripe-js auto-injects js.stripe.com even when Stripe
// is not used — dynamic import prevents that when stripeKey is undefined.
const stripePromise = stripeKey
  ? import("@stripe/stripe-js").then(({ loadStripe }) =>
      loadStripe(stripeKey, medusaAccountId ? { stripeAccount: medusaAccountId } : undefined)
    )
  : null

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  if (
    isStripeLike(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children as React.ReactNode}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

export default PaymentWrapper
