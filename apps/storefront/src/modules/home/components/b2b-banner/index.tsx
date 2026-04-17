import Image from "next/image"

const WHATSAPP_URL =
  "https://wa.me/50769533776?text=Hola,%20estoy%20interesado%20en%20una%20cotización%20corporativa"

export default function B2BBanner({ lang }: { lang: "es" | "en" }) {
  const content =
    lang === "en"
      ? {
          pretitle: "For Businesses",
          title: "Equip Your Team to Perform at Their Best",
          subtitle:
            "We design and install complete ergonomic workspaces for offices, coworkings and commercial spaces. Volume discounts, personalized consulting and white-glove delivery included.",
          cta: "Request a Quote",
          offices: "Offices",
          commercial: "Commercial",
          stat1: "25%",
          stat1label: "avg. productivity increase",
          stat2: "$3–6",
          stat2label: "return per $1 invested",
        }
      : {
          pretitle: "Para Empresas",
          title: "Equipá a Tu Equipo Para Rendir al Máximo",
          subtitle:
            "Diseñamos e instalamos espacios de trabajo ergonómicos completos para oficinas, coworkings y espacios comerciales. Descuentos por volumen, asesoría personalizada y entrega e instalación incluida.",
          cta: "Solicitar Cotización",
          offices: "Oficinas",
          commercial: "Comercial",
          stat1: "25%",
          stat1label: "más productividad promedio",
          stat2: "$3–6",
          stat2label: "retorno por cada $1 invertido",
        }

  return (
    <section className="section-y px-4 md:px-8">
      <div className="max-w-[1360px] mx-auto overflow-hidden rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
          {/* Content side */}
          <div className="bg-gray-900 flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-14">
            <p className="text-ergo-sky text-xs uppercase tracking-widest font-semibold mb-4">
              {content.pretitle}
            </p>

            {/* Icon row */}
            <div className="flex gap-5 mb-6">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
                <span>{content.offices}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>Coworkings</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                </svg>
                <span>{content.commercial}</span>
              </div>
            </div>

            <h2 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)" }}>
              {content.title}
            </h2>
            <p className="text-gray-400 leading-relaxed text-sm mb-8 max-w-[420px]">
              {content.subtitle}
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mb-8">
              <div>
                <p className="text-ergo-sky text-2xl font-bold">{content.stat1}</p>
                <p className="text-gray-500 text-xs mt-0.5">{content.stat1label}</p>
              </div>
              <div className="w-px bg-gray-700" />
              <div>
                <p className="text-ergo-sky text-2xl font-bold">{content.stat2}</p>
                <p className="text-gray-500 text-xs mt-0.5">{content.stat2label}</p>
              </div>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start bg-ergo-sky hover:bg-ergo-sky-hover text-gray-900 transition-colors duration-fast px-7 py-3 rounded-lg font-semibold text-sm"
            >
              {content.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Image side */}
          <div className="relative min-h-[280px] lg:min-h-0">
            <Image
              src="/images/b2b-meeting-room.png"
              alt={lang === "en" ? "Modern ergonomic office with standing desks" : "Oficina moderna con standing desks ergonómicos"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle overlay gradient from left to blend with dark content */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, rgba(17,24,39,0.3) 0%, transparent 40%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
