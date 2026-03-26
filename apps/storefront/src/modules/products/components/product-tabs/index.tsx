"use client"

import { HttpTypes } from "@medusajs/types"
import Accordion from "./accordion"
import { useLang } from "@lib/i18n/context"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

// ── Spec label maps ───────────────────────────────────────────────────────────

const SPEC_LABELS: Record<string, { es: string; en: string }> = {
  warranty: { es: "Garantía", en: "Warranty" },
  weight: { es: "Peso", en: "Weight" },
  max_weight_capacity: { es: "Capacidad de peso", en: "Weight capacity" },
  height_range: { es: "Rango de altura", en: "Height range" },
  speed: { es: "Velocidad", en: "Speed" },
  motors: { es: "Motores", en: "Motors" },
  noise_level: { es: "Nivel de ruido", en: "Noise level" },
  memory_presets: { es: "Memorias", en: "Memory presets" },
  anti_collision: { es: "Anticolisión", en: "Anti-collision" },
  tools_included: { es: "Herramientas incluidas", en: "Tools included" },
  compatible_top_length: { es: "Largo compatible", en: "Compatible top length" },
  compatible_top_width: { es: "Ancho compatible", en: "Compatible top width" },
  back_material: { es: "Material respaldo", en: "Back material" },
  seat_material: { es: "Material asiento", en: "Seat material" },
  lumbar_support: { es: "Soporte lumbar", en: "Lumbar support" },
  armrests: { es: "Apoyabrazos", en: "Armrests" },
  headrest: { es: "Reposacabezas", en: "Headrest" },
  base_material: { es: "Base", en: "Base material" },
  gas_lift: { es: "Pistón", en: "Gas lift" },
  bifma_certified: { es: "Certificado BIFMA", en: "BIFMA certified" },
  material: { es: "Material", en: "Material" },
  dimensions: { es: "Dimensiones", en: "Dimensions" },
  cable_management: { es: "Manejo de cables", en: "Cable management" },
  lock_type: { es: "Cerradura", en: "Lock" },
  soft_close: { es: "Cierre suave", en: "Soft close" },
  wheels: { es: "Ruedas", en: "Wheels" },
  privacy_panel: { es: "Panel de privacidad", en: "Privacy panel" },
  compatible_frames: { es: "Bases compatibles", en: "Compatible frames" },
}

// Fields to hide from the specs table
const HIDDEN_FIELDS = new Set(["assembly_required"])

// ── Shipping content ──────────────────────────────────────────────────────────

const SHIPPING_TEXT = {
  es: "Envío gratis en pedidos mayores a $99 en Ciudad de Panamá. Ensamblaje incluido en todos los muebles. Devoluciones dentro de 7 días. Para envíos a provincias, contáctanos por WhatsApp.",
  en: "Free delivery on orders over $99 in Panama City. Assembly included on all furniture. Returns within 7 days. For provincial shipping, contact us via WhatsApp.",
}

// ── Main component ────────────────────────────────────────────────────────────

const ProductTabs = ({ product }: ProductTabsProps) => {
  const lang = useLang()
  const t = lang === "en" ? "en" : "es"

  const specs = product.metadata
    ? Object.entries(product.metadata as Record<string, string>).filter(
        ([key, val]) =>
          !HIDDEN_FIELDS.has(key) &&
          val !== undefined &&
          val !== null &&
          String(val).trim() !== "" &&
          !["true", "false"].includes(String(val))  // hide boolean flags
      )
    : []

  const accordionTabs = [
    ...(specs.length > 0
      ? [
          {
            label: t === "en" ? "Specifications" : "Especificaciones",
            component: <SpecsTab specs={specs} lang={t} />,
          },
        ]
      : []),
    {
      label: t === "en" ? "Shipping & Warranty" : "Envío y Garantía",
      component: <ShippingTab lang={t} />,
    },
  ]

  return (
    <div className="w-full mt-6 border-t border-ergo-200/60">
      {/* Description always visible */}
      <DescriptionTab product={product} />

      {/* Specs and Shipping in accordion */}
      <Accordion type="multiple">
        {accordionTabs.map((tab, i) => (
          <Accordion.Item key={i} title={tab.label} headingSize="medium" value={tab.label}>
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

// ── Description tab ───────────────────────────────────────────────────────────

const DescriptionTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-4 pb-5 text-[0.85rem] text-ergo-600 leading-[1.7]">
      {product.description ? (
        <p className="whitespace-pre-line">{product.description}</p>
      ) : (
        <p className="text-ergo-300 italic">—</p>
      )}
    </div>
  )
}

// ── Specs tab ─────────────────────────────────────────────────────────────────

const SpecsTab = ({
  specs,
  lang,
}: {
  specs: [string, string][]
  lang: "es" | "en"
}) => {
  return (
    <div className="py-3 pb-5">
      <div className="flex flex-col">
        {specs.map(([key, value]) => {
          const labelDef = SPEC_LABELS[key]
          const label = labelDef ? labelDef[lang] : key.replace(/_/g, " ")
          return (
            <div key={key} className="flex border-b border-ergo-200/60 last:border-0 py-2.5 text-[0.82rem]">
              <span className="w-[45%] font-semibold text-ergo-800">{label}</span>
              <span className="w-[55%] text-ergo-400">{String(value)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Shipping tab ──────────────────────────────────────────────────────────────

const ShippingTab = ({ lang }: { lang: "es" | "en" }) => {
  return (
    <div className="py-4 pb-5 text-[0.85rem] text-ergo-600 leading-[1.7]">
      <p>{SHIPPING_TEXT[lang]}</p>
    </div>
  )
}

export default ProductTabs
