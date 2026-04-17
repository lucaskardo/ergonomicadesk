import { clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="flex flex-col items-end gap-0.5">
      {price.price_type === "sale" && (
        <span
          className="line-through text-xs text-ui-fg-muted font-normal"
          data-testid="original-price"
        >
          {price.original_price}
        </span>
      )}
      <span
        className={clx("text-sm font-semibold", {
          "text-ergo-sky-dark": price.price_type === "sale",
          "text-ui-fg-base": price.price_type !== "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </span>
    </div>
  )
}
