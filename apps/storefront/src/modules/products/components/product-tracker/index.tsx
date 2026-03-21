"use client"

import { useEffect } from "react"
import { trackViewItem } from "@lib/tracking"

type ProductTrackerProps = {
  product: any
  selectedVariant?: any
}

export default function ProductTracker({
  product,
  selectedVariant,
}: ProductTrackerProps) {
  useEffect(() => {
    trackViewItem(product, selectedVariant)
  }, [product, selectedVariant])

  return null
}
