"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

// Stripe is not the active PSP on this project.
// @stripe/stripe-js has an import-time side effect that injects js.stripe.com as a
// <script> tag as soon as the module is evaluated — even inside a next/dynamic wrapper,
// because Turbopack statically follows import() references and bundles them regardless
// of runtime conditions.
//
// Keeping StripeWrapper = null removes stripe-wrapper from the bundle graph entirely,
// preventing the js.stripe.com request on every page load.
//
// To enable Stripe in the future:
//   1. Set NEXT_PUBLIC_STRIPE_KEY in .env.local
//   2. Replace null with:
//      import dynamic from "next/dynamic"
//      const StripeWrapper = dynamic(() => import("./stripe-wrapper"), { ssr: false })

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  return <div>{children}</div>
}

export default PaymentWrapper
