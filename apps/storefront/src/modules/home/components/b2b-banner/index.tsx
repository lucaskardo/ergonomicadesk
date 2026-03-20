"use client"

import { useLang } from "@lib/i18n/context"

const WHATSAPP_URL =
  "https://wa.me/50769533776?text=Hola,%20estoy%20interesado%20en%20una%20cotización%20corporativa"

const B2BBanner = () => {
  const lang = useLang()

  const content =
    lang === "en"
      ? {
          pretitle: "For Businesses",
          title: "Corporate Solutions",
          subtitle:
            "We outfit offices, coworkings and commercial spaces. Volume discounts, personalized consulting and delivery with installation included.",
          cta: "Request Quote",
        }
      : {
          pretitle: "Para Empresas",
          title: "Soluciones Corporativas",
          subtitle:
            "Equipamos oficinas, coworkings y espacios comerciales. Descuentos por volumen, asesoría personalizada y entrega e instalación incluida.",
          cta: "Solicitar Cotización",
        }

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="bg-gray-900 rounded-2xl py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-teal-400 text-sm uppercase tracking-widest font-semibold">
            {content.pretitle}
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">{content.title}</h2>
          <p className="mt-4 text-gray-400 leading-relaxed">{content.subtitle}</p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block border-2 border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-gray-900 transition-colors duration-200 px-8 py-3 rounded-lg font-semibold"
          >
            {content.cta}
          </a>
        </div>
      </div>
    </section>
  )
}

export default B2BBanner
