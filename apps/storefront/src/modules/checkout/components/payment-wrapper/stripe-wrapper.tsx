"use client"

import { loadStripe, Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import { createContext } from "react"

type StripeWrapperProps = {
  paymentSession: HttpTypes.StorePaymentSession
  stripeKey: string
  stripeAccountId?: string
  children: React.ReactNode
}

export const StripeContext = createContext(false)

// Module-level cache — loadStripe is only called once per key (this module is only
// loaded via next/dynamic when Stripe is actually needed).
let cachedPromise: Promise<Stripe | null> | null = null
let cachedKey: string | undefined

function getStripePromise(key: string, accountId?: string): Promise<Stripe | null> {
  if (!cachedPromise || cachedKey !== key) {
    cachedKey = key
    cachedPromise = loadStripe(key, accountId ? { stripeAccount: accountId } : undefined)
  }
  return cachedPromise
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  paymentSession,
  stripeKey,
  stripeAccountId,
  children,
}) => {
  if (!paymentSession?.data?.client_secret) {
    throw new Error("Stripe client secret is missing. Cannot initialize Stripe.")
  }

  const stripePromise = getStripePromise(stripeKey, stripeAccountId)

  const options: StripeElementsOptions = {
    clientSecret: paymentSession.data.client_secret as string,
  }

  return (
    <StripeContext.Provider value={true}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

export default StripeWrapper
