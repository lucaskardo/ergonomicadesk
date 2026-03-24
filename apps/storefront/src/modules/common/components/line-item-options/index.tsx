import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  if (!variant) return null

  // Show SKU if available, otherwise show variant options (Color, Size, etc.)
  const sku = variant.sku
  const optionValues = variant.options
    ?.map((o: any) => o.value)
    .filter(Boolean)
    .join(" / ")

  // Don't show generic "Default Title" or empty strings
  const variantTitle = variant.title
  const isGenericTitle =
    !variantTitle ||
    variantTitle.toLowerCase() === "default title" ||
    variantTitle === "-"

  const displayText = sku
    ? `SKU: ${sku}`
    : optionValues
    ? optionValues
    : isGenericTitle
    ? null
    : variantTitle

  if (!displayText) return null

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block txt-small text-ui-fg-muted w-full overflow-hidden text-ellipsis"
    >
      {displayText}
    </Text>
  )
}

export default LineItemOptions
