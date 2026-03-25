import React, { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { categoryPath } from "@lib/util/routes"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import ProductTracker from "@modules/products/components/product-tracker"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
  selectedVariant?: HttpTypes.StoreProductVariant
  initialVariantId?: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  selectedVariant,
  initialVariantId,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <ProductTracker product={product} selectedVariant={selectedVariant} />

      {/* Breadcrumb */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 pt-5">
        <div className="flex items-center gap-1.5 text-[0.75rem] text-ergo-400">
          <LocalizedClientLink href="/" className="hover:text-ergo-sky-dark transition-colors">Home</LocalizedClientLink>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
            <path d="M9 18l6-6-6-6" />
          </svg>
          {product.categories?.[0] && (
            <>
              <LocalizedClientLink href={categoryPath(product.categories[0].handle)} className="hover:text-ergo-sky-dark transition-colors">
                {product.categories[0].name}
              </LocalizedClientLink>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </>
          )}
          <span className="text-ergo-600 font-medium">{product.title}</span>
        </div>
      </div>

      {/* Main PDP layout: 50/50 */}
      <div
        className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-6 grid grid-cols-1 small:grid-cols-2 gap-12 items-start"
        data-testid="product-container"
      >
        {/* Left: Images */}
        <div className="w-full">
          <ImageGallery images={images} />
        </div>

        {/* Right: Info + Actions, sticky on desktop */}
        <div className="flex flex-col small:sticky small:top-24 gap-0" data-testid="product-info-container">
          <ProductInfo product={product} />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} initialVariantId={initialVariantId} />
          </Suspense>
          <ProductTabs product={product} />
        </div>
      </div>

      {/* Related products */}
      <div
        className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-16"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
