"use client"

import { useLang } from "@lib/i18n/context"
import { useParams } from "next/navigation"
import Link from "next/link"

const Hero = () => {
  const lang = useLang()
  const { countryCode } = useParams()
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`

  const content =
    lang === "en"
      ? {
          pretitle: "Home Office Next Level",
          title: "Ergonomic Furniture\nfor Your Productivity",
          subtitle:
            "Standing desks, ergonomic chairs and office solutions with free shipping and assembly included in Panama City.",
          cta_primary: "Browse Products",
          cta_secondary: "Build Your Desk",
        }
      : {
          pretitle: "Home Office a Otro Nivel",
          title: "Muebles Ergonómicos\npara Tu Productividad",
          subtitle:
            "Escritorios de pie, sillas ergonómicas y soluciones de oficina con envío gratis y ensamblaje incluido en Ciudad de Panamá.",
          cta_primary: "Explorar Productos",
          cta_secondary: "Arma Tu Escritorio",
        }

  return (
    <section className="bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text — 60% */}
          <div className="flex-1 md:w-3/5">
            <p className="text-sm uppercase tracking-widest text-teal-600 font-semibold">
              {content.pretitle}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight whitespace-pre-line">
              {content.title}
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-lg leading-relaxed">
              {content.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={`${base}/store`}
                className="inline-flex justify-center items-center px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                {content.cta_primary}
              </Link>
              <Link
                href={`${base}/categories/standing-desks`}
                className="inline-flex justify-center items-center px-8 py-3 border-2 border-gray-300 hover:border-teal-600 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                {content.cta_secondary}
              </Link>
            </div>
          </div>

          {/* Image placeholder — 40% */}
          <div className="w-full md:w-2/5">
            <div className="aspect-[4/3] bg-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">
                {lang === "en" ? "Photo coming soon" : "Foto próximamente"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
