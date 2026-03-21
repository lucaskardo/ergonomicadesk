"use client"

import { useEffect } from "react"
import { trackPurchase } from "@lib/tracking"

export default function PurchaseTracker({ order }: { order: any }) {
  useEffect(() => {
    if (order) {
      trackPurchase(order)
    }
  }, [order?.id])

  return null
}
