const WHATSAPP_URL =
  "https://wa.me/50769533776?text=Hola,%20estoy%20interesado%20en%20una%20cotización%20corporativa"

export default function B2BBanner({ lang }: { lang: "es" | "en" }) {
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
          <div className="flex justify-center gap-6 mt-4 mb-2">
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <span>{lang === "en" ? "Offices" : "Oficinas"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Coworkings</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
              </svg>
              <span>{lang === "en" ? "Commercial" : "Comercial"}</span>
            </div>
          </div>
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
