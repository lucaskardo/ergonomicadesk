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
      ? "Warranty Policy | Ergonómica"
      : "Política de Garantía | Ergonómica",
    description: isEn
      ? "3 to 5 year warranty on all Ergonómica products. Learn what is and isn't covered."
      : "Garantía de 3 a 5 años en todos los productos Ergonómica. Conoce qué cubre y qué no.",
    alternates: {
      canonical: `${baseUrl}/warranty`,
      languages: {
        es: `${baseUrl}/warranty`,
        en: `${baseUrl}/en/warranty`,
        "x-default": `${baseUrl}/warranty`,
      },
    },
  }
}

export default async function WarrantyPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  await params
  const lang = await getLang()
  const isEn = lang === "en"

  const warrantyItems = isEn
    ? [
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
    : [
        {
          category: "Standing Desks (bases motorizadas)",
          coverage: "5 años en motor y electrónica · 3 años en estructura",
        },
        {
          category: "Sillas Ergonómicas",
          coverage: "5 años en estructura · 3 años en mecanismo y tapizado",
        },
        {
          category: "Accesorios y Soportes",
          coverage: "3 años",
        },
      ]

  const covered = isEn
    ? "Manufacturing defects and product failures under normal home or office use conditions."
    : "Defectos de fabricación y fallas del producto bajo condiciones normales de uso en ambientes de casa u oficina."

  const notCovered = isEn
    ? [
        "Misuse or improper use of the product",
        "Damage caused by pets (bites, scratches, etc.)",
        "Damage from excessive humidity or storage in improper conditions",
        "Cuts or tears in mesh or upholstery",
        "Normal wear from extended use",
        "Modifications or repairs carried out by unauthorized third parties",
        "Damage from accidents, drops, or excessive force",
      ]
    : [
        "Mal uso o uso inadecuado del producto",
        "Daños causados por mascotas (mordeduras, arañazos, etc.)",
        "Daños por humedad excesiva o almacenamiento en condiciones inadecuadas",
        "Cortes o rasgaduras en la malla o tapizado",
        "Desgaste normal por uso prolongado",
        "Modificaciones o reparaciones realizadas por terceros no autorizados",
        "Daños por accidentes, caídas, o fuerza excesiva",
      ]

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
              {isEn ? "Warranty Policy" : "Política de Garantía"}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-semibold text-ui-fg-base mb-3">
            {isEn ? "Warranty Policy" : "Política de Garantía"}
          </h1>
          <p className="text-ui-fg-subtle text-lg mb-10">
            {isEn
              ? "We stand behind every product we sell."
              : "Respaldamos cada producto que vendemos."}
          </p>

          {/* Warranty by product type */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-ui-fg-base mb-4">
              {isEn ? "Warranty by Product" : "Garantía por Producto"}
            </h2>
            <div className="space-y-3">
              {warrantyItems.map((item) => (
                <div
                  key={item.category}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-4 border border-ui-border-base rounded-lg bg-ui-bg-base"
                >
                  <span className="font-medium text-ui-fg-base sm:w-56 shrink-0">
                    {item.category}
                  </span>
                  <span className="text-ui-fg-subtle text-sm">{item.coverage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What's covered */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-ui-fg-base mb-3">
              {isEn ? "What the warranty covers" : "Qué cubre la garantía"}
            </h2>
            <div className="flex gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
              <span className="text-green-600 shrink-0 mt-0.5">✓</span>
              <p className="text-ui-fg-subtle">{covered}</p>
            </div>
          </div>

          {/* What's NOT covered */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-ui-fg-base mb-3">
              {isEn ? "What the warranty does NOT cover" : "Qué NO cubre la garantía"}
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

          {/* Claim process */}
          <div className="border border-ui-border-base rounded-lg p-6 bg-ui-bg-subtle">
            <h2 className="text-base font-semibold text-ui-fg-base mb-3">
              {isEn ? "How to make a warranty claim" : "Cómo hacer válida la garantía"}
            </h2>
            <ol className="space-y-2 text-sm text-ui-fg-subtle">
              {(isEn ? [
                "Contact us via WhatsApp or email with your order number and photos of the defect.",
                "Ergonómica will evaluate the case and respond within 48 business hours.",
                "If the defect is covered, Ergonómica will coordinate repair or replacement at no cost.",
              ] : [
                "Contactar por WhatsApp o email con número de pedido y fotos del defecto.",
                "Ergonómica evaluará el caso y responderá en 48 horas hábiles.",
                "Si el defecto es cubierto por garantía, Ergonómica coordinará la reparación o reemplazo sin costo.",
              ]).map((step, i) => (
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
                className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
