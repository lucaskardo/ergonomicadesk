"use client"

import { useEffect } from "react"
import { trackViewCart } from "@lib/tracking"
import { HttpTypes } from "@medusajs/types"

export default function CartTracker({ cart }: { cart: HttpTypes.StoreCart | null }) {
  useEffect(() => {
    if (cart && cart.items?.length) {
      trackViewCart(cart)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
