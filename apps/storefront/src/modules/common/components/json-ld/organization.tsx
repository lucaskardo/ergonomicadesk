export function OrganizationJsonLd({ lang = "es" }: { lang?: "es" | "en" }) {
  const description =
    lang === "en"
      ? "Standing desks, ergonomic chairs, and office accessories in Panama. Free delivery in Panama City. 1-5 year warranty."
      : "Escritorios standing, sillas ergonómicas y accesorios de oficina en Panamá. Envío gratis en Ciudad de Panamá. Garantía de 1-5 años."

  const schema = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: "Ergonómica",
    alternateName: "Ergonomica Office",
    url: "https://ergonomicadesk.com",
    logo: "https://ergonomicadesk.com/logo.svg",
    description,
    telephone: "+507-6953-3776",
    email: "ventas@ergonomicadesk.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 79 Este 14, Coco del Mar",
      addressLocality: "Ciudad de Panamá",
      addressCountry: "PA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 8.9936175,
      longitude: -79.499793,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "12:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "12:00",
      },
    ],
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "PA",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 7,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/FreeReturn",
    },
    sameAs: [
      "https://www.instagram.com/ergonomicadesk/",
      "https://www.facebook.com/ergonomicadesks/",
      "https://twitter.com/ErgonomicaDesk",
      "https://www.linkedin.com/company/ergonomica-desk",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
