import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SITE_URL, alternateUrls } from "@lib/util/routes"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params

  return {
    title: "FAQ | Ergonómica — Ergonomic Furniture Panama",
    description:
      "Frequently asked questions about shipping, products, returns, and payments at Ergonómica.",
    alternates: {
      canonical: `${SITE_URL}/${countryCode}/en/faq`,
      languages: alternateUrls(countryCode, "/faq"),
    },
  }
}

const sections = [
  {
    title: "Shipping & Delivery",
    items: [
      {
        q: "How much does shipping cost?",
        a: "Shipping is FREE in Panama City for orders over $99. For provinces, cost varies by location. Contact us via WhatsApp for a quote.",
      },
      {
        q: "How long does delivery take?",
        a: "In Panama City, we deliver in 1–3 business days. Free professional assembly included. For provinces, 3–7 business days.",
      },
      {
        q: "Is assembly included?",
        a: "Yes. All deliveries in Panama City include free professional assembly. For provinces, assembly has an additional cost.",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        q: "What warranty do products have?",
        a: "Our products have a 3 to 5 year warranty depending on the product. Warranty covers manufacturing defects under normal home or office use. Does not cover misuse, pet damage, excessive humidity, or wear from improper use.",
      },
      {
        q: "Can I try products before buying?",
        a: "Yes, visit our showroom in Coco del Mar. We're open Monday to Friday 12PM–6PM and Saturdays 9AM–12PM.",
      },
      {
        q: "Are the standing desks motorized?",
        a: "Yes, all our standing desks have electric motors with touch screen, 3 preset height memories, and anti-collision technology. Speed up to 38mm/s and capacity up to 200kg.",
      },
    ],
  },
  {
    title: "Returns",
    items: [
      {
        q: "What is the return policy?",
        a: "We accept returns up to 7 days after delivery. For manufacturing defects, we offer full exchange or refund. If you want to swap for another product, we issue a store credit for the full value. Product must be in original condition.",
      },
    ],
  },
  {
    title: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, Yappy (Banco General), direct ACH, and bank transfer.",
      },
      {
        q: "Can I pay on delivery?",
        a: "For orders under $500, yes we accept payment on delivery by card or Yappy. For orders over $500, we require a 50% deposit.",
      },
    ],
  },
  {
    title: "B2B / Corporate",
    items: [
      {
        q: "Do you offer volume discounts?",
        a: "Yes. For purchases of 5+ units, we offer corporate discounts. Contact us via WhatsApp or email for a personalized quote.",
      },
    ],
  },
]

export default async function FAQEnPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  await params

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ui-fg-subtle" aria-label="breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
                Home
              </LocalizedClientLink>
            </li>
            <li className="text-ui-fg-muted">/</li>
            <li className="text-ui-fg-base">FAQ</li>
          </ol>
        </nav>

        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-ui-fg-subtle text-lg">
            Everything you need to know about our products and services.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-ui-fg-base mb-3 pb-2 border-b border-ui-border-base">
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group border border-ui-border-base rounded-lg overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer text-ui-fg-base font-medium hover:bg-ui-bg-subtle select-none list-none">
                      <span>{item.q}</span>
                      <span className="shrink-0 text-ui-fg-subtle group-open:rotate-180 transition-transform">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-4 pt-1 text-ui-fg-subtle leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: sections.flatMap((s) =>
                s.items.map((faq) => ({
                  "@type": "Question",
                  name: faq.q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a,
                  },
                }))
              ),
            }),
          }}
        />

        <div className="mt-12 p-6 bg-ui-bg-subtle rounded-xl text-center">
          <p className="text-ui-fg-base font-medium mb-2">Still have questions?</p>
          <p className="text-ui-fg-subtle text-sm mb-4">
            Write us on WhatsApp and we'll answer right away.
          </p>
          <a
            href="https://wa.me/50769533776"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-[#22c55e] transition-colors"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
