import React, { Suspense } from "react"

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
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  selectedVariant,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <ProductTracker product={product} selectedVariant={selectedVariant} />
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative gap-x-8"
        data-testid="product-container"
      >
        {/* Images — Left side, ~60% on desktop */}
        <div className="block w-full small:w-[60%] relative">
          <ImageGallery images={images} />
        </div>

        {/* Info + Actions — Right side, ~40% on desktop, sticky */}
        <div className="flex flex-col small:sticky small:top-48 small:w-[40%] w-full py-8 small:py-0 gap-y-6">
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
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
          <ProductTabs product={product} />
        </div>
      </div>
      <div
        className="content-container my-16 small:my-32"
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
