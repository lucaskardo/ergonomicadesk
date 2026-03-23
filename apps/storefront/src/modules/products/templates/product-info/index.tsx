import { HttpTypes } from "@medusajs/types"
import ProductSku from "@modules/products/components/product-sku"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const category = product.categories?.[0]

  return (
    <div id="product-info" className="flex flex-col">
      {/* Category tag */}
      {category && (
        <span className="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-ergo-sky-dark mb-1">
          {category.name}
        </span>
      )}

      {/* Title */}
      <h1
        className="font-display font-bold text-ergo-950 leading-[1.15] tracking-tight"
        style={{ fontSize: "clamp(1.6rem, 2.4vw, 2rem)", letterSpacing: "-0.02em" }}
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {/* SKU — client component so it updates when user selects a variant */}
      <ProductSku product={product} />
    </div>
  )
}

export default ProductInfo
