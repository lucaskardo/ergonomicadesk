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
    title: "Return Policy | Ergonómica",
    description:
      "Ergonómica accepts returns up to 7 days after delivery. Learn more about our return process.",
    alternates: {
      canonical: `${baseUrl}/en/returns`,
      languages: {
        es: `${baseUrl}/returns`,
        en: `${baseUrl}/en/returns`,
        "x-default": `${baseUrl}/returns`,
      },
    },
  }
}

export default async function ReturnsEnPage({
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
            <li className="text-ui-fg-base">Return Policy</li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-3">
            Return Policy
          </h1>
          <p className="text-ui-fg-subtle text-lg mb-10">
            We want you to be completely satisfied with your purchase.
          </p>

          <div className="bg-ui-bg-subtle border border-ui-border-base rounded-xl p-6 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-ui-fg-base">7</span>
              <span className="text-ui-fg-subtle">calendar days to return</span>
            </div>
            <p className="text-sm text-ui-fg-subtle">From the date of delivery.</p>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-ui-fg-base mb-3">
                When can I return?
              </h2>
              <ul className="space-y-3">
                {[
                  "We accept returns up to 7 calendar days after delivery.",
                  "For manufacturing defects: full exchange or refund to the original payment method.",
                  "To swap for another product: we issue a store credit for the full value of the returned product.",
                  "The product must be in original condition (no visible use damage, with packaging if possible).",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-ui-fg-subtle">
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-ui-bg-subtle border border-ui-border-base flex items-center justify-center text-xs text-ui-fg-muted font-medium">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-ui-fg-base mb-3">
                How to return?
              </h2>
              <ul className="space-y-3">
                {[
                  "Contact us via WhatsApp (+507 6953-3776) or email (ventas@ergonomicadesk.com) to coordinate.",
                  "For returns in Panama City, we pick up the product at no cost.",
                  "For returns in provinces, return shipping cost is the customer's responsibility.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-ui-fg-subtle">
                    <span className="shrink-0 mt-0.5 text-ui-fg-muted">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ui-border-base rounded-xl p-5 bg-ui-bg-subtle">
              <h2 className="text-base font-semibold text-ui-fg-base mb-2">
                We do NOT accept returns for:
              </h2>
              <p className="text-ui-fg-subtle text-sm">
                Products that have been assembled or show visible use after the 7-day window.
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-ui-border-base">
            <p className="text-sm text-ui-fg-subtle mb-4">
              Questions about your return? Contact us:
            </p>
            <div className="flex flex-wrap gap-3">
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
                className="inline-flex items-center gap-2 border border-ui-border-base text-ui-fg-base px-4 py-2 rounded-lg text-sm font-medium hover:bg-ui-bg-subtle transition-colors"
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
