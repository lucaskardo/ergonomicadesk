type ProductJsonLdProps = {
  name: string
  description: string | null
  image: string | null
  sku?: string | null
  price: number // in cents
  currency?: string
  url: string
  lang?: "es" | "en"
  inStock?: boolean
}

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  price,
  currency = "USD",
  url,
  lang = "es",
  inStock = true,
}: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    inLanguage: lang,
    name,
    description: description || name,
    ...(image && { image }),
    ...(sku && { sku }),
    brand: {
      "@type": "Brand",
      name: "Ergonómica",
    },
    offers: {
      "@type": "Offer",
      price: (price / 100).toFixed(2),
      priceCurrency: currency,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url,
      seller: {
        "@type": "Organization",
        name: "Ergonómica",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PA",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            minValue: 1,
            maxValue: 3,
          },
        },
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
      },
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
