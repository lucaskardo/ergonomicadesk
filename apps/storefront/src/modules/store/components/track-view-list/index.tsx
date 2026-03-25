"use client"

import { useEffect, useRef } from "react"
import { trackViewItemList } from "@lib/tracking"

export default function TrackViewList({
  products,
  listName,
}: {
  products: Array<{ id: string; title: string }>
  listName: string
}) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current && products.length > 0) {
      trackViewItemList(products, listName)
      tracked.current = true
    }
  }, [products, listName])

  return null
}
