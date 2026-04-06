import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { collectionPath } from "@lib/util/routes"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import TrackViewList from "@modules/store/components/track-view-list"
import TrackProductClick from "@modules/products/components/product-preview/track-click"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="content-container section-y">
      <div className="flex justify-between mb-8">
        <Text className="txt-xlarge">{collection.title}</Text>
        <InteractiveLink href={collectionPath(collection.handle)}>
          View all
        </InteractiveLink>
      </div>
      <TrackViewList
        products={pricedProducts.map((p) => ({
          id: p.id!,
          title: p.title!,
          variants: p.variants?.map((v) => ({ sku: v.sku ?? undefined, id: v.id })),
        }))}
        listName={`collection_${collection.handle}`}
      />
      <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
        {pricedProducts &&
          pricedProducts.map((product, idx) => (
            <li key={product.id}>
              <TrackProductClick
                product={{
                  id: product.id!,
                  title: product.title!,
                  variants: product.variants?.map((v) => ({ sku: v.sku ?? undefined, id: v.id })),
                }}
                listName={`collection_${collection.handle}`}
                index={idx}
              >
                <ProductPreview product={product} region={region} isFeatured />
              </TrackProductClick>
            </li>
          ))}
      </ul>
    </div>
  )
}
