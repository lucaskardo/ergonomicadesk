import { Metadata } from "next"
import { getLang } from "@lib/i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const lang = await getLang()
  const baseUrl = `https://ergonomicadesk.com/${countryCode}`
  const isEn = lang === "en"

  return {
    title: isEn
      ? "FAQ | Ergonómica — Ergonomic Furniture Panama"
      : "Preguntas Frecuentes | Ergonómica — Muebles Ergonómicos Panamá",
    description: isEn
      ? "Frequently asked questions about shipping, products, returns, and payments at Ergonómica."
      : "Preguntas frecuentes sobre envíos, productos, devoluciones y pagos en Ergonómica.",
    alternates: {
      canonical: `${baseUrl}/faq`,
      languages: {
        es: `${baseUrl}/faq`,
        en: `${baseUrl}/en/faq`,
        "x-default": `${baseUrl}/faq`,
      },
    },
  }
}

type FAQItem = { q: string; a: string }
type FAQSection = { title: string; items: FAQItem[] }

function getFAQData(isEn: boolean): FAQSection[] {
  return [
    {
      title: isEn ? "Shipping & Delivery" : "Envíos y Entregas",
      items: [
        {
          q: isEn ? "How much does shipping cost?" : "¿Cuánto cuesta el envío?",
          a: isEn
            ? "Shipping is FREE in Panama City for orders over $99. For provinces, cost varies by location. Contact us via WhatsApp for a quote."
            : "El envío es GRATIS en Ciudad de Panamá para pedidos mayores a $99. Para provincias, el costo varía según la ubicación. Contáctanos por WhatsApp para una cotización.",
        },
        {
          q: isEn ? "How long does delivery take?" : "¿Cuánto tarda la entrega?",
          a: isEn
            ? "In Panama City, we deliver in 1–3 business days. Free professional assembly included. For provinces, 3–7 business days."
            : "En Ciudad de Panamá, entregamos en 1–3 días hábiles. Incluimos ensamblaje profesional gratis. Para provincias, 3–7 días hábiles.",
        },
        {
          q: isEn ? "Is assembly included?" : "¿Incluyen ensamblaje?",
          a: isEn
            ? "Yes. All deliveries in Panama City include free professional assembly. For provinces, assembly has an additional cost."
            : "Sí. Todas las entregas en Ciudad de Panamá incluyen ensamblaje profesional sin costo adicional. Para provincias, el ensamblaje tiene un costo adicional.",
        },
      ],
    },
    {
      title: isEn ? "Products" : "Productos",
      items: [
        {
          q: isEn ? "What warranty do products have?" : "¿Qué garantía tienen los productos?",
          a: isEn
            ? "Our products have a 3 to 5 year warranty depending on the product. Warranty covers manufacturing defects under normal home or office use. Does not cover misuse, pet damage, excessive humidity, or wear from improper use."
            : "Nuestros productos tienen garantía de 3 a 5 años dependiendo del producto. La garantía cubre defectos de fabricación en condiciones normales de uso en casa u oficina. No cubre mal uso, daños por mascotas, humedad excesiva, o desgaste por uso inadecuado.",
        },
        {
          q: isEn ? "Can I try products before buying?" : "¿Puedo probar los productos antes de comprar?",
          a: isEn
            ? "Yes, visit our showroom in Coco del Mar. We're open Monday to Friday 12PM–6PM and Saturdays 9AM–12PM."
            : "Sí, visítanos en nuestro showroom en Coco del Mar. Estamos abiertos de lunes a viernes 12PM–6PM y sábados 9AM–12PM.",
        },
        {
          q: isEn ? "Are the standing desks motorized?" : "¿Los standing desks son motorizados?",
          a: isEn
            ? "Yes, all our standing desks have electric motors with touch screen, 3 preset height memories, and anti-collision technology. Speed up to 38mm/s and capacity up to 200kg."
            : "Sí, todos nuestros standing desks tienen motor eléctrico con pantalla táctil, 3 memorias de altura preestablecidas, y tecnología anticolisión. Velocidad hasta 38mm/s y capacidad hasta 200kg.",
        },
      ],
    },
    {
      title: isEn ? "Returns" : "Devoluciones",
      items: [
        {
          q: isEn ? "What is the return policy?" : "¿Cuál es la política de devoluciones?",
          a: isEn
            ? "We accept returns up to 7 days after delivery. For manufacturing defects, we offer full exchange or refund. If you want to swap for another product, we issue a store credit for the full value. Product must be in original condition."
            : "Aceptamos devoluciones hasta 7 días después de la entrega. Si es por defecto de fábrica, hacemos cambio o reembolso completo. Si deseas cambiar el producto por otro, emitimos una nota de crédito por el valor completo. El producto debe estar en condiciones originales.",
        },
      ],
    },
    {
      title: isEn ? "Payments" : "Pagos",
      items: [
        {
          q: isEn ? "What payment methods do you accept?" : "¿Qué métodos de pago aceptan?",
          a: isEn
            ? "We accept Visa, Mastercard, Yappy (Banco General), direct ACH, and bank transfer."
            : "Aceptamos Visa, Mastercard, Yappy (Banco General), ACH directo, y transferencia bancaria.",
        },
        {
          q: isEn ? "Can I pay on delivery?" : "¿Puedo pagar contra entrega?",
          a: isEn
            ? "For orders under $500, yes we accept payment on delivery by card or Yappy. For orders over $500, we require a 50% deposit."
            : "Para pedidos menores a $500, sí aceptamos pago contra entrega con tarjeta o Yappy. Para pedidos mayores, requerimos un adelanto del 50%.",
        },
      ],
    },
    {
      title: isEn ? "B2B / Corporate" : "B2B / Corporativo",
      items: [
        {
          q: isEn ? "Do you offer volume discounts?" : "¿Hacen descuentos por volumen?",
          a: isEn
            ? "Yes. For purchases of 5+ units, we offer corporate discounts. Contact us via WhatsApp or email for a personalized quote."
            : "Sí. Para compras de 5 o más unidades, ofrecemos descuentos corporativos. Contáctanos por WhatsApp o email para una cotización personalizada.",
        },
      ],
    },
  ]
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  await params
  const lang = await getLang()
  const isEn = lang === "en"
  const sections = getFAQData(isEn)

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-ui-fg-subtle" aria-label="breadcrumb">
          <ol className="flex items-center gap-2">
            <li>
              <LocalizedClientLink href="/" className="hover:text-ui-fg-base">
                {isEn ? "Home" : "Inicio"}
              </LocalizedClientLink>
            </li>
            <li className="text-ui-fg-muted">/</li>
            <li className="text-ui-fg-base">
              {isEn ? "FAQ" : "Preguntas Frecuentes"}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-3">
            {isEn ? "Frequently Asked Questions" : "Preguntas Frecuentes"}
          </h1>
          <p className="text-ui-fg-subtle text-lg">
            {isEn
              ? "Everything you need to know about our products and services."
              : "Todo lo que necesitas saber sobre nuestros productos y servicios."}
          </p>
        </div>

        {/* FAQ Sections */}
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
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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

        {/* CTA */}
        <div className="mt-12 p-6 bg-ui-bg-subtle rounded-xl text-center">
          <p className="text-ui-fg-base font-medium mb-2">
            {isEn ? "Still have questions?" : "¿Aún tienes dudas?"}
          </p>
          <p className="text-ui-fg-subtle text-sm mb-4">
            {isEn
              ? "Write us on WhatsApp and we'll answer right away."
              : "Escríbenos por WhatsApp y te respondemos de inmediato."}
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
