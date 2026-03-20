"use client"

import { useLang } from "@lib/i18n/context"
import Link from "next/link"
import { useParams } from "next/navigation"

const Hero = () => {
  const lang = useLang()
  const { countryCode } = useParams()
  const langPrefix = lang === "en" ? "/en" : ""
  const storePath = `/${countryCode}${langPrefix}/store`

  const content = {
    es: {
      headline: "Home office a otro nivel",
      subheadline:
        "Escritorios standing, sillas ergonómicas y todo lo que necesitas para tu oficina en casa. Envío gratis en Ciudad de Panamá.",
      cta: "Ver catálogo",
    },
    en: {
      headline: "Your home office, elevated",
      subheadline:
        "Standing desks, ergonomic chairs, and everything you need for your home office. Free delivery in Panama City.",
      cta: "Shop now",
    },
  }[lang]

  const trustItems = {
    es: [
      { icon: "🚚", label: "Envío gratis >$99" },
      { icon: "🔧", label: "Ensamblaje incluido" },
      { icon: "🛡️", label: "Garantía 1-5 años" },
      { icon: "↩️", label: "Devoluciones en 7 días" },
    ],
    en: [
      { icon: "🚚", label: "Free delivery >$99" },
      { icon: "🔧", label: "Assembly included" },
      { icon: "🛡️", label: "1-5 year warranty" },
      { icon: "↩️", label: "7-day returns" },
    ],
  }[lang]

  return (
    <div className="w-full border-b border-ui-border-base">
      {/* Hero section */}
      <div className="h-[60vh] w-full relative bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-center px-6 gap-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-ui-fg-base leading-tight max-w-3xl">
          {content.headline}
        </h1>
        <p className="text-lg text-ui-fg-subtle max-w-xl leading-relaxed">
          {content.subheadline}
        </p>
        <Link
          href={storePath}
          className="mt-2 inline-flex items-center px-8 py-3 bg-ui-fg-base text-white text-sm font-medium rounded-full hover:bg-ui-fg-subtle transition-colors duration-200"
        >
          {content.cta}
        </Link>
      </div>

      {/* Trust badges */}
      <div className="bg-white border-t border-ui-border-base py-6 px-6">
        <div className="content-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center gap-2 py-2"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs sm:text-sm text-ui-fg-subtle font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
