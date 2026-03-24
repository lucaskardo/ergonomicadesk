import { getLang } from "@lib/i18n"
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
  const { cheapestPrice } = getProductPrice({ product })
  const category = product.categories?.[0]
  const lang = await getLang()
  const productPath = lang === "en" ? "products" : "productos"

  return (
    <LocalizedClientLink
      href={`/${productPath}/${product.handle}`}
      className="group bg-white border border-ergo-200/60 overflow-hidden transition-all duration-300 cursor-pointer hover:border-transparent hover:-translate-y-1"
      style={{ display: "block" }}
    >
      <div data-testid="product-wrapper" className="flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-ergo-bg-warm overflow-hidden">
          <div className="w-full h-full transition-transform duration-500 group-hover:scale-[1.03]">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
              isFeatured={isFeatured}
            />
          </div>
          {/* Heart icon on hover */}
          <button className="absolute top-2.5 right-2.5 w-8 h-8 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300" aria-label="Save">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ergo-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Info */}
        <div className="px-4 pt-3 pb-4">
          {category && (
            <p className="text-[0.63rem] font-semibold uppercase tracking-[0.07em] text-ergo-sky-dark mb-0.5">
              {category.name}
            </p>
          )}
          <p
            className="text-[0.88rem] font-semibold leading-[1.3] text-ergo-950 line-clamp-2"
            data-testid="product-title"
          >
            {product.title}
          </p>
          {cheapestPrice && (
            <div className="mt-2 text-[1rem] font-bold text-ergo-950">
              <PreviewPrice price={cheapestPrice} />
            </div>
          )}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
