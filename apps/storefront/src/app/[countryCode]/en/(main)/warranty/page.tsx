import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const baseUrl = `https://ergonomicadesk.com/${countryCode}`

  return {
    title: "Warranty Policy | Ergonómica",
    description:
      "3 to 5 year warranty on all Ergonómica products. Learn what is and isn't covered.",
    alternates: {
      canonical: `${baseUrl}/en/warranty`,
      languages: {
        es: `${baseUrl}/warranty`,
        en: `${baseUrl}/en/warranty`,
        "x-default": `${baseUrl}/warranty`,
      },
    },
  }
}

const warrantyItems = [
  {
    category: "Standing Desks (motorized bases)",
    coverage: "5 years on motor & electronics · 3 years on frame",
  },
  {
    category: "Ergonomic Chairs",
    coverage: "5 years on frame · 3 years on mechanism & upholstery",
  },
  {
    category: "Accessories & Supports",
    coverage: "3 years",
  },
]

const notCovered = [
  "Misuse or improper use of the product",
  "Damage caused by pets (bites, scratches, etc.)",
  "Damage from excessive humidity or storage in improper conditions",
  "Cuts or tears in mesh or upholstery",
  "Normal wear from extended use",
  "Modifications or repairs carried out by unauthorized third parties",
  "Damage from accidents, drops, or excessive force",
]

export default async function WarrantyEnPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  await params

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-6 text-sm text-ui-fg-subtle" aria-label="breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
                Home
              </LocalizedClientLink>
            </li>
            <li className="text-ui-fg-muted">/</li>
            <li className="text-ui-fg-base">Warranty Policy</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-3">
            Warranty Policy
          </h1>
          <p className="text-ui-fg-subtle text-lg mb-10">
            We stand behind every product we sell.
          </p>

          <div className="mb-10">
            <h2 className="text-lg font-semibold text-ui-fg-base mb-4">
              Warranty by Product
            </h2>
            <div className="space-y-3">
              {warrantyItems.map((item) => (
                <div
                  key={item.category}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-4 border border-ui-border-base rounded-xl bg-ui-bg-base"
                >
                  <span className="font-medium text-ui-fg-base sm:w-56 shrink-0">
                    {item.category}
                  </span>
                  <span className="text-ui-fg-subtle text-sm">{item.coverage}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-ui-fg-base mb-3">
              What the warranty covers
            </h2>
            <div className="flex gap-3 p-4 border border-green-200 bg-green-50 rounded-xl">
              <span className="text-green-600 shrink-0 mt-0.5">✓</span>
              <p className="text-ui-fg-subtle">
                Manufacturing defects and product failures under normal home or office use conditions.
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-lg font-semibold text-ui-fg-base mb-3">
              What the warranty does NOT cover
            </h2>
            <ul className="space-y-2">
              {notCovered.map((item, i) => (
                <li key={i} className="flex gap-3 text-ui-fg-subtle">
                  <span className="text-ui-fg-muted shrink-0 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-ui-border-base rounded-xl p-6 bg-ui-bg-subtle">
            <h2 className="text-base font-semibold text-ui-fg-base mb-3">
              How to make a warranty claim
            </h2>
            <ol className="space-y-2 text-sm text-ui-fg-subtle">
              {[
                "Contact us via WhatsApp or email with your order number and photos of the defect.",
                "Ergonómica will evaluate the case and respond within 48 business hours.",
                "If the defect is covered, Ergonómica will coordinate repair or replacement at no cost.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 font-semibold text-ui-fg-muted">{i + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href="https://wa.me/50769533776"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#22c55e] transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="mailto:ventas@ergonomicadesk.com"
                className="inline-flex items-center gap-2 border border-ui-border-base text-ui-fg-base px-4 py-2 rounded-lg text-sm font-medium hover:bg-ui-bg-base transition-colors"
              >
                ventas@ergonomicadesk.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
