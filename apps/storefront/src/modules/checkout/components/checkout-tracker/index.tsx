"use client"

import { useEffect } from "react"
import { trackBeginCheckout } from "@lib/tracking"

export default function CheckoutTracker({ cart }: { cart: any }) {
  useEffect(() => {
    if (cart) {
      trackBeginCheckout(cart)
    }
  }, [cart?.id])

  return null
}
