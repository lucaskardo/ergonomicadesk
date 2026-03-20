import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  selectedVariant?: HttpTypes.StoreProductVariant
}

const ProductInfo = ({ product, selectedVariant }: ProductInfoProps) => {
  const displayVariant = selectedVariant ?? product.variants?.[0]
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4 lg:max-w-[500px] mx-auto">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <Heading
          level="h2"
          className="text-3xl leading-10 text-ui-fg-base"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        {/* SKU display — updates when variant is selected via v_id URL param */}
        {displayVariant?.sku && (
          <p className="text-xs text-gray-400 font-mono -mt-2">
            SKU: {displayVariant.sku}
          </p>
        )}
        {selectedVariant?.title && selectedVariant.title !== product.title && (
          <p className="text-sm text-gray-500 -mt-2">{selectedVariant.title}</p>
        )}

        <Text
          className="text-medium text-ui-fg-subtle whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
