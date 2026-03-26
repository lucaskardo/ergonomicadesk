import { SITE_URL } from "@lib/util/routes"

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
  weight?: number | null        // kg
  material?: string | null
  mpn?: string | null
  specs?: Record<string, string> | null  // warranty, max_weight_capacity, speed, etc.
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
  weight,
  material,
  mpn,
  specs,
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
    ...(mpn && { mpn }),
    ...(weight && {
      weight: {
        "@type": "QuantitativeValue",
        value: weight,
        unitCode: "KGM",
      },
    }),
    ...(material && { material }),
    ...(specs && Object.keys(specs).length > 0 && {
      additionalProperty: Object.entries(specs).map(([propName, value]) => ({
        "@type": "PropertyValue",
        name: propName,
        value,
      })),
    }),
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
        url: SITE_URL,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "USD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PA",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "d",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "d",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PA",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
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
