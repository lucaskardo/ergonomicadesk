"use client"

import Link from "next/link"
import { commercialPath } from "@lib/util/routes"

const CONTENT = {
  es: {
    heading: "Proyectos",
    headingAccent: "comerciales",
    subtitle: "Diseñamos espacios comerciales que funcionan. Asesoría personalizada, descuentos por volumen, entrega e instalación completa.",
    processTitle: "Cómo trabajamos",
    process: [
      { step: "01", title: "Consulta", desc: "Reunión sin costo para entender tus necesidades y espacio." },
      { step: "02", title: "Diseño", desc: "Propuesta con distribución, productos y presupuesto detallado." },
      { step: "03", title: "Instalación", desc: "Entrega, ensamblaje y puesta en marcha con seguimiento." },
    ],
    cta: "Solicitar cotización comercial",
    viewAll: "Ver todos los sectores →",
    sectors: [
      {
        slug: "oficinas",
        icon: "🏢",
        title: "Oficinas Corporativas",
        sub: "Espacios ergonómicos que impulsan productividad",
        tags: ["Estaciones de trabajo", "Salas de reuniones", "Recepción", "Lounge", "Cafetería"],
      },
      {
        slug: "educacion",
        icon: "🎓",
        title: "Educación",
        sub: "Mobiliario que inspira el aprendizaje",
        tags: ["Aulas", "Laboratorios", "Bibliotecas", "Áreas comunes"],
      },
      {
        slug: "horeca",
        icon: "🏨",
        title: "Horeca",
        sub: "Hotels, restaurants & cafés",
        tags: ["Lobby", "Restaurantes", "Cafeterías", "Eventos", "Lounge"],
      },
      {
        slug: "salud",
        icon: "🏥",
        title: "Salud",
        sub: "Espacios clínicos cómodos y funcionales",
        tags: ["Salas de espera", "Consultorios", "Áreas admin"],
      },
    ],
  },
  en: {
    heading: "Commercial",
    headingAccent: "projects",
    subtitle: "We design commercial spaces that work. Personalized consulting, volume discounts, full delivery and installation.",
    processTitle: "How we work",
    process: [
      { step: "01", title: "Consultation", desc: "Free meeting to understand your needs and space." },
      { step: "02", title: "Design", desc: "Proposal with layout, products and detailed budget." },
      { step: "03", title: "Installation", desc: "Delivery, assembly and setup with follow-up." },
    ],
    cta: "Request commercial quote",
    viewAll: "View all sectors →",
    sectors: [
      {
        slug: "oficinas",
        icon: "🏢",
        title: "Corporate Offices",
        sub: "Ergonomic spaces that boost productivity",
        tags: ["Workstations", "Meeting rooms", "Reception", "Lounge", "Cafeteria"],
      },
      {
        slug: "educacion",
        icon: "🎓",
        title: "Education",
        sub: "Furniture that inspires learning",
        tags: ["Classrooms", "Labs", "Libraries", "Common areas"],
      },
      {
        slug: "horeca",
        icon: "🏨",
        title: "Horeca",
        sub: "Hotels, restaurants & cafés",
        tags: ["Lobby", "Restaurants", "Cafes", "Events", "Lounge"],
      },
      {
        slug: "salud",
        icon: "🏥",
        title: "Healthcare",
        sub: "Comfortable and functional clinical spaces",
        tags: ["Waiting rooms", "Offices", "Admin areas"],
      },
    ],
  },
}

export default function CommercialPreview({
  lang,
  countryCode,
}: {
  lang: "es" | "en"
  countryCode: string
}) {
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`
  const c = CONTENT[lang]

  return (
    <section className="bg-ergo-950 py-20">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <h2
            className="font-display font-bold text-white leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
          >
            {c.heading}{" "}
            <span style={{ color: "#5BC0EB" }}>{c.headingAccent}</span>
          </h2>
          <p className="text-[0.9rem] mt-3 max-w-[560px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            {c.subtitle}
          </p>
        </div>

        {/* Sector cards 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
          {c.sectors.map((sector) => (
            <Link
              key={sector.slug}
              href={`${base}${commercialPath(sector.slug)}`}
              className="block p-7 border transition-all duration-300 group"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.background = "rgba(255,255,255,0.08)"
                el.style.borderColor = "rgba(91,192,235,0.3)"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.background = "rgba(255,255,255,0.04)"
                el.style.borderColor = "rgba(255,255,255,0.06)"
              }}
            >
              <div className="text-3xl mb-4">{sector.icon}</div>
              <h3 className="font-display font-bold text-white text-[1.05rem] mb-1">{sector.title}</h3>
              <p className="text-[0.8rem] mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{sector.sub}</p>
              <div className="flex flex-wrap gap-1.5">
                {sector.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.68rem] px-2.5 py-1 font-medium"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        {/* Process */}
        <div className="mb-12">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "#5BC0EB" }}>
            {c.processTitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {c.process.map((step) => (
              <div key={step.step}>
                <span
                  className="font-display font-extrabold text-[1.8rem] leading-none"
                  style={{ color: "#5BC0EB" }}
                >
                  {step.step}
                </span>
                <h4 className="font-semibold text-white text-[0.9rem] mt-2 mb-1">{step.title}</h4>
                <p className="text-[0.78rem] leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-5">
          <a
            href="https://wa.me/50769533776"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-[0.84rem] tracking-[0.01em] transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "#5BC0EB", color: "#1C1C1A" }}
          >
            {c.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link
            href={`${base}/comercial`}
            className="text-[0.84rem] font-semibold transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {c.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
