"use client"

import { useEffect } from "react"
import { trackPurchase } from "@lib/tracking"

export default function PurchaseTracker({ order }: { order: any }) {
  useEffect(() => {
    if (!order) return
    const key = `purchase_tracked_${order.id}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, "1")
    } catch {
      // sessionStorage unavailable (incognito edge cases) — fire anyway
    }
    trackPurchase(order)
  }, [order?.id])

  return null
}
