"use client"

import { trackSelectItem } from "@lib/tracking"

export default function TrackProductClick({
  children,
  product,
  listName,
  index,
}: {
  children: React.ReactNode
  product: { id: string; title: string }
  listName: string
  index: number
}) {
  return (
    <div onClick={() => trackSelectItem(product, listName, index)}>
      {children}
    </div>
  )
}
