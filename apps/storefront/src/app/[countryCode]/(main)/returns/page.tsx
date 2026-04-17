import { Metadata } from "next"
import { getLang } from "@lib/i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { SITE_URL } from "@lib/util/routes"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const lang = await getLang()
  const baseUrl = `${SITE_URL}/${countryCode}`
  const isEn = lang === "en"

  return {
    title: isEn
      ? "Return Policy | Ergonómica"
      : "Política de Devoluciones | Ergonómica",
    description: isEn
      ? "Ergonómica accepts returns up to 7 days after delivery. Learn more about our return process."
      : "Ergonómica acepta devoluciones hasta 7 días después de la entrega. Conoce nuestro proceso.",
    alternates: {
      canonical: `${baseUrl}/returns`,
      languages: {
        es: `${baseUrl}/returns`,
        en: `${baseUrl}/en/returns`,
        "x-default": `${baseUrl}/returns`,
      },
    },
  }
}

export default async function ReturnsPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  await params
  const lang = await getLang()
  const isEn = lang === "en"

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
              {isEn ? "Return Policy" : "Política de Devoluciones"}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-3">
            {isEn ? "Return Policy" : "Política de Devoluciones"}
          </h1>
          <p className="text-ui-fg-subtle text-lg mb-10">
            {isEn
              ? "We want you to be completely satisfied with your purchase."
              : "Queremos que estés completamente satisfecho con tu compra."}
          </p>

          {/* Highlight box */}
          <div className="bg-ui-bg-subtle border border-ui-border-base rounded-lg p-6 mb-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-ui-fg-base">7</span>
              <span className="text-ui-fg-subtle">
                {isEn ? "calendar days to return" : "días calendario para devolver"}
              </span>
            </div>
            <p className="text-sm text-ui-fg-subtle">
              {isEn
                ? "From the date of delivery."
                : "A partir de la fecha de entrega."}
            </p>
          </div>

          {/* Rules */}
          <div className="space-y-6">

            <div>
              <h2 className="text-lg font-semibold text-ui-fg-base mb-3">
                {isEn ? "When can I return?" : "¿Cuándo puedo devolver?"}
              </h2>
              <ul className="space-y-3">
                {(isEn ? [
                  "We accept returns up to 7 calendar days after delivery.",
                  "For manufacturing defects: full exchange or refund to the original payment method.",
                  "To swap for another product: we issue a store credit for the full value of the returned product.",
                  "The product must be in original condition (no visible use damage, with packaging if possible).",
                ] : [
                  "Aceptamos devoluciones hasta 7 días calendario después de la entrega.",
                  "Para defectos de fábrica: cambio completo o reembolso al mismo método de pago.",
                  "Para cambio por otro producto: emitimos nota de crédito por el valor total del producto devuelto.",
                  "El producto debe estar en condiciones originales (sin daños por uso, con empaque si es posible).",
                ]).map((item, i) => (
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
                {isEn ? "How to return?" : "¿Cómo devolver?"}
              </h2>
              <ul className="space-y-3">
                {(isEn ? [
                  "Contact us via WhatsApp (+507 6953-3776) or email (ventas@ergonomicadesk.com) to coordinate.",
                  "For returns in Panama City, we pick up the product at no cost.",
                  "For returns in provinces, return shipping cost is the customer's responsibility.",
                ] : [
                  "El cliente debe coordinar la devolución contactándonos por WhatsApp (+507 6953-3776) o email (ventas@ergonomicadesk.com).",
                  "Para devoluciones en Ciudad de Panamá, pasamos a recoger el producto sin costo.",
                  "Para devoluciones en provincias, el costo de envío de retorno es responsabilidad del cliente.",
                ]).map((item, i) => (
                  <li key={i} className="flex gap-3 text-ui-fg-subtle">
                    <span className="shrink-0 mt-0.5 text-ui-fg-muted">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ui-border-base rounded-lg p-5 bg-ui-bg-subtle">
              <h2 className="text-base font-semibold text-ui-fg-base mb-2">
                {isEn ? "We do NOT accept returns for:" : "NO aceptamos devoluciones de:"}
              </h2>
              <p className="text-ui-fg-subtle text-sm">
                {isEn
                  ? "Products that have been assembled or show visible use after the 7-day window."
                  : "Productos ensamblados o con uso visible después de los 7 días."}
              </p>
            </div>

          </div>

          {/* CTA */}
          <div className="mt-12 pt-8 border-t border-ui-border-base">
            <p className="text-sm text-ui-fg-subtle mb-4">
              {isEn
                ? "Questions about your return? Contact us:"
                : "¿Preguntas sobre tu devolución? Contáctanos:"}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/50769533776"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
