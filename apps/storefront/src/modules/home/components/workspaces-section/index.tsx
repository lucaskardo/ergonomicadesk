import Link from "next/link"

const CONTENT = {
  es: {
    heading: "Inspírate por",
    headingAccent: "espacio",
    viewAll: "Ver todos",
    workspaces: [
      {
        tag: "Home Office",
        title: "El setup productivo",
        description: "Escritorio, silla y accesorios esenciales para trabajar desde casa.",
        cta: "Explorar",
        bg: "linear-gradient(160deg, #8fa8bf 0%, #5e7d9c 100%)",
      },
      {
        tag: "Gaming & Creativo",
        title: "El setup creativo",
        description: "Para sesiones largas y máxima comodidad.",
        cta: "Explorar",
        bg: "linear-gradient(160deg, #6e8aa3 0%, #4d6e8a 100%)",
      },
    ],
  },
  en: {
    heading: "Get inspired by",
    headingAccent: "space",
    viewAll: "View all",
    workspaces: [
      {
        tag: "Home Office",
        title: "The productive setup",
        description: "Desk, chair and essential accessories to work from home.",
        cta: "Explore",
        bg: "linear-gradient(160deg, #8fa8bf 0%, #5e7d9c 100%)",
      },
      {
        tag: "Gaming & Creative",
        title: "The creative setup",
        description: "For long sessions and maximum comfort.",
        cta: "Explore",
        bg: "linear-gradient(160deg, #6e8aa3 0%, #4d6e8a 100%)",
      },
    ],
  },
}

export default function WorkspacesSection({
  lang,
  countryCode,
}: {
  lang: "es" | "en"
  countryCode: string
}) {
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`
  const storePath = lang === "en" ? "store" : "colecciones"
  const c = CONTENT[lang]

  return (
    <section className="py-14 lg:py-24 bg-ergo-bg">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-9">
          <h2
            className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
          >
            {c.heading}{" "}
            <span style={{ color: "#2A8BBF" }}>{c.headingAccent}</span>
          </h2>
          <Link
            href={`${base}/${storePath}`}
            className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-ergo-sky-dark hover:gap-3 transition-all duration-300 flex-shrink-0"
          >
            {c.viewAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Workspace grid — 5fr 4fr */}
        <div
          className="grid"
          style={{ gridTemplateColumns: "5fr 4fr", gap: "3px" }}
        >
          {c.workspaces.map((ws, i) => (
            <Link
              key={ws.tag}
              href={`${base}/${storePath}`}
              className="relative overflow-hidden group cursor-pointer"
              style={{ minHeight: "360px" }}
            >
              {/* Background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
                style={{ background: ws.bg }}
              />
              {/* Overlay */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: "linear-gradient(to top, rgba(12,18,34,0.55) 0%, transparent 55%)",
                }}
              />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-7">
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.1em] mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {ws.tag}
                </p>
                <h3 className="font-display font-bold text-white text-[1.5rem] mb-1.5">
                  {ws.title}
                </h3>
                <p className="text-[0.8rem] leading-[1.5] mb-3.5" style={{ color: "rgba(255,255,255,0.65)", maxWidth: 340 }}>
                  {ws.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-white text-[0.8rem] font-semibold group-hover:gap-3 transition-all duration-300">
                  {ws.cta}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
