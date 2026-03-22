import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
    >
      <div data-testid="product-wrapper" className="flex flex-col">
        {/* Image with scale hover effect */}
        <div className="overflow-hidden rounded-lg bg-ui-bg-subtle">
          <div className="transform transition-transform duration-300 ease-out group-hover:scale-105">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col mt-3 gap-y-1 px-1">
          <div className="flex items-start justify-between gap-x-2">
            <p
              className="text-sm text-ui-fg-base font-medium leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors"
              data-testid="product-title"
            >
              {product.title}
            </p>
            {cheapestPrice && (
              <div className="flex items-center gap-x-1 shrink-0 text-sm font-semibold text-ui-fg-base">
                <PreviewPrice price={cheapestPrice} />
              </div>
            )}
          </div>
          {product.variants?.[0]?.sku && (
            <p className="text-[10px] text-gray-400 font-mono">
              {product.variants[0].sku}
            </p>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
