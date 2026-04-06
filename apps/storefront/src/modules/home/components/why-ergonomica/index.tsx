// Renamed visually to WorkspaceInspiration but kept same filename/export for backward compat

const CONTENT = {
  es: {
    heading: "Transforma tu",
    headingAccent: "espacio de trabajo",
    subtitle: "Espacios diseñados para la productividad y el confort",
    cards: [
      {
        tag: "Home Office",
        title: "El espacio que mereces",
        desc: "Standing desks, sillas mesh y almacenamiento inteligente para tu home office.",
        bg: "linear-gradient(145deg, #2E2E2B 0%, #4A4A45 100%)",
      },
      {
        tag: "Gaming & Creativo",
        title: "Setup sin límites",
        desc: "Soportes de monitores, sillas gaming y escritorios que se adaptan a tu flujo.",
        bg: "linear-gradient(145deg, #1C1C1A 0%, #2E2E2B 100%)",
      },
    ],
    benefits: [
      { title: "Showroom Coco del Mar", desc: "Prueba antes de comprar. Lun–Vie 12–6PM, Sáb 9–12PM." },
      { title: "Entrega + Ensamblaje", desc: "Gratis en Ciudad de Panamá en pedidos >$99." },
      { title: "Hasta 5 Años Garantía", desc: "Servicio técnico local. +500 oficinas equipadas." },
    ],
  },
  en: {
    heading: "Transform your",
    headingAccent: "workspace",
    subtitle: "Spaces designed for productivity and comfort",
    cards: [
      {
        tag: "Home Office",
        title: "The space you deserve",
        desc: "Standing desks, mesh chairs and smart storage for your home office.",
        bg: "linear-gradient(145deg, #2E2E2B 0%, #4A4A45 100%)",
      },
      {
        tag: "Gaming & Creative",
        title: "Setup without limits",
        desc: "Monitor arms, gaming chairs and desks that adapt to your workflow.",
        bg: "linear-gradient(145deg, #1C1C1A 0%, #2E2E2B 100%)",
      },
    ],
    benefits: [
      { title: "Coco del Mar Showroom", desc: "Try before you buy. Mon–Fri 12–6PM, Sat 9–12PM." },
      { title: "Delivery + Assembly", desc: "Free in Panama City on orders >$99." },
      { title: "Up to 5 Years Warranty", desc: "Local tech support. 500+ offices outfitted." },
    ],
  },
}

export default function WhyErgonomica({ lang }: { lang: "es" | "en" }) {
  const c = CONTENT[lang]

  return (
    <section className="bg-ergo-bg-warm section-y-tight">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <h2
            className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
          >
            {c.heading}{" "}
            <span style={{ color: "#2A8BBF" }}>{c.headingAccent}</span>
          </h2>
          <p className="text-[0.88rem] text-ergo-400 mt-2">{c.subtitle}</p>
        </div>

        {/* 2-column grid: workspace cards + benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-3">
          {/* Workspace cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {c.cards.map((card) => (
              <div
                key={card.tag}
                className="relative overflow-hidden cursor-pointer group"
                style={{ minHeight: 280, background: card.bg }}
              >
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(12,18,34,0.7) 0%, rgba(12,18,34,0.1) 60%)",
                  }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="inline-block text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ergo-sky mb-2">
                    {card.tag}
                  </span>
                  <h3 className="font-display font-bold text-white text-lg leading-tight">{card.title}</h3>
                  <p className="text-[0.78rem] text-white/70 mt-1.5 leading-relaxed">{card.desc}</p>
                </div>
                {/* Hover accent */}
                <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits column */}
          <div className="flex flex-col gap-3">
            {c.benefits.map((b) => (
              <div
                key={b.title}
                className="flex-1 bg-white border border-ergo-200/60 p-6 flex flex-col justify-center"
              >
                <div className="w-8 h-0.5 bg-ergo-sky mb-3" />
                <h3 className="font-semibold text-ergo-950 text-[0.9rem]">{b.title}</h3>
                <p className="text-[0.78rem] text-ergo-400 mt-1.5 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
