import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"
import TrackViewList from "@modules/store/components/track-view-list"
import TrackProductClick from "@modules/products/components/product-preview/track-click"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // edit this function to define your related products logic
  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  if (product.tags) {
    queryParams.tag_id = product.tags
      .map((t) => t.id)
      .filter(Boolean) as string[]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    )
  })

  const related = products.slice(0, 4)

  if (!related.length) {
    return null
  }

  const isEn = countryCode === "en"

  return (
    <div className="product-page-constraint bg-white">
      <div className="flex flex-col items-center text-center mb-8">
        <p className="text-2xl-regular text-ui-fg-base max-w-lg">
          {isEn ? "You might also like" : "También te puede interesar"}
        </p>
      </div>

      <TrackViewList
        products={related.map((p) => ({
          id: p.id!,
          title: p.title!,
          variants: p.variants?.map((v) => ({ sku: v.sku ?? undefined, id: v.id })),
        }))}
        listName="related_products"
      />
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-4">
        {related.map((product, idx) => (
          <li key={product.id}>
            <TrackProductClick
              product={{
                id: product.id!,
                title: product.title!,
                variants: product.variants?.map((v) => ({ sku: v.sku ?? undefined, id: v.id })),
              }}
              listName="related_products"
              index={idx}
            >
              <Product region={region} product={product} />
            </TrackProductClick>
          </li>
        ))}
      </ul>
    </div>
  )
}
