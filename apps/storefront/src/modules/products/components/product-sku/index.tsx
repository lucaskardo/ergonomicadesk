"use client"

import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"

export default function ProductSku({
  product,
}: {
  product: HttpTypes.StoreProduct
}) {
  const searchParams = useSearchParams()
  const variantId = searchParams.get("v_id")

  const selectedVariant = variantId
    ? product.variants?.find((v) => v.id === variantId)
    : product.variants?.[0]

  return (
    <>
      {selectedVariant?.sku && (
        <p className="text-xs text-gray-400 font-mono -mt-2">
          SKU: {selectedVariant.sku}
        </p>
      )}
      {selectedVariant?.title && selectedVariant.title !== product.title && (
        <p className="text-sm text-gray-500 -mt-2">{selectedVariant.title}</p>
      )}
    </>
  )
}
