import { HttpTypes } from "@medusajs/types"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const ProductInfo = ({ product }: ProductInfoProps) => {
  const category = product.categories?.[0]
  const skuVariant = product.variants?.[0]
  const sku = skuVariant?.sku

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

      {/* SKU */}
      {sku && (
        <p className="text-[0.72rem] text-ergo-300 mt-1 font-medium">
          SKU: {sku}
        </p>
      )}

      {/* Rating stars (static placeholder) */}
      <div className="flex items-center gap-1.5 mt-2.5">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < 5} />)}
        </div>
        <span className="text-[0.78rem] text-ergo-400 font-medium">
          (4.8 · 24 reseñas)
        </span>
      </div>
    </div>
  )
}

export default ProductInfo
