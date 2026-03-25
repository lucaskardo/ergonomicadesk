"use client"

import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"

function SkuContent({
  variants,
}: {
  variants: HttpTypes.StoreProductVariant[] | undefined
}) {
  const searchParams = useSearchParams()
  const variantId = searchParams.get("v_id")
  const variant = variantId
    ? variants?.find((v) => v.id === variantId)
    : variants?.[0]
  const sku = variant?.sku
  if (!sku) return null
  return (
    <p className="text-[0.72rem] text-ergo-300 mt-1 font-medium">SKU: {sku}</p>
  )
}

export default function ProductSku({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const fallbackSku = product.variants?.[0]?.sku
  return (
    <Suspense
      fallback={
        fallbackSku ? (
          <p className="text-[0.72rem] text-ergo-300 mt-1 font-medium">
            SKU: {fallbackSku}
          </p>
        ) : null
      }
    >
      <SkuContent variants={product.variants ?? undefined} />
    </Suspense>
  )
}
