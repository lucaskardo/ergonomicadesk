"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { commercialPath } from "@lib/util/routes"

/* ─── Sector data with spaces ─── */
const SECTORS = [
  {
    slug: "oficinas",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    title: { es: "Oficinas Corporativas", en: "Corporate Offices" },
    tagline: { es: "Productividad y bienestar laboral", en: "Productivity and workplace wellness" },
    description: {
      es: "Mobiliario contract-grade para oficinas que cuidan la salud, retienen talento y proyectan profesionalismo.",
      en: "Contract-grade furniture for offices that protect health, retain talent, and project professionalism.",
    },
    spaces: [
      { key: "workstations", name: { es: "Estaciones de Trabajo", en: "Workstations" } },
      { key: "reuniones", name: { es: "Salas de Reunión", en: "Meeting Rooms" } },
      { key: "ejecutivas", name: { es: "Oficinas Ejecutivas", en: "Executive Offices" } },
      { key: "lounge-seating", name: { es: "Áreas de Descanso", en: "Lounge Areas" } },
      { key: "recepcion", name: { es: "Recepción", en: "Reception" } },
      { key: "cafeteria", name: { es: "Cafetería", en: "Cafeteria" } },
    ],
  },
  {
    slug: "educacion",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop",
    title: { es: "Educación", en: "Education" },
    tagline: { es: "Estudiantes cómodos, mejor rendimiento", en: "Comfortable students, better performance" },
    description: {
      es: "Mobiliario para colegios, universidades y centros de capacitación. Resistente al uso intensivo, promueve postura saludable.",
      en: "Furniture for schools, universities, and training centers. Resistant to intensive use, promotes healthy posture.",
    },
    spaces: [
      { key: "aulas", name: { es: "Aulas", en: "Classrooms" } },
      { key: "labs", name: { es: "Laboratorios", en: "Labs" } },
      { key: "bibliotecas", name: { es: "Biblioteca", en: "Library" } },
      { key: "auditorios", name: { es: "Auditorios", en: "Auditoriums" } },
      { key: "profesores", name: { es: "Sala de Profesores", en: "Faculty Lounge" } },
    ],
  },
  {
    slug: "horeca",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    title: { es: "Horeca", en: "Hospitality" },
    tagline: { es: "Diseño que eleva la experiencia", en: "Design that elevates the experience" },
    description: {
      es: "Hoteles, restaurantes y cafés con materiales resistentes al uso comercial 24/7. Diseño que eleva la experiencia del huésped.",
      en: "Hotels, restaurants, and cafés with materials resistant to 24/7 commercial use. Design that elevates guest experience.",
    },
    spaces: [
      { key: "lobby", name: { es: "Lobby y Recepción", en: "Lobby & Reception" } },
      { key: "restaurantes", name: { es: "Restaurante y Bar", en: "Restaurant & Bar" } },
      { key: "cafes", name: { es: "Café y Coworking", en: "Café & Coworking" } },
      { key: "terrazas", name: { es: "Terrazas", en: "Terraces" } },
      { key: "eventos", name: { es: "Salones para Eventos", en: "Event Rooms" } },
    ],
  },
  {
    slug: "salud",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop",
    title: { es: "Salud", en: "Healthcare" },
    tagline: { es: "Confort para pacientes y profesionales", en: "Comfort for patients and professionals" },
    description: {
      es: "Sillas con soporte lumbar clínico, escritorios ajustables y mobiliario fácil de desinfectar para clínicas y centros médicos.",
      en: "Chairs with clinical lumbar support, adjustable desks, and easy-to-disinfect furniture for clinics and medical centers.",
    },
    spaces: [
      { key: "espera", name: { es: "Salas de Espera", en: "Waiting Rooms" } },
      { key: "consultorios", name: { es: "Consultorios", en: "Consulting Rooms" } },
      { key: "recepcion", name: { es: "Recepción Clínica", en: "Clinical Reception" } },
      { key: "admin", name: { es: "Administración", en: "Administration" } },
    ],
  },
]

const LABELS = {
  es: {
    eyebrow: "PROYECTOS COMERCIALES",
    heading: "Espacios que impulsan",
    headingAccent: "resultados",
    subtitle: "Mobiliario contract-grade para oficinas, educación, hospitalidad y salud en Panamá.",
    explore: "Explorar",
    viewSpaces: "Ver espacios",
    cta: "Solicitar cotización comercial",
    viewAll: "Ver todos los sectores →",
    stats: [
      { value: "200+", label: "proyectos completados" },
      { value: "80+", label: "empresas confían en nosotros" },
      { value: "10", label: "años de experiencia" },
    ],
  },
  en: {
    eyebrow: "COMMERCIAL PROJECTS",
    heading: "Spaces that drive",
    headingAccent: "results",
    subtitle: "Contract-grade furniture for offices, education, hospitality, and healthcare in Panama.",
    explore: "Explore",
    viewSpaces: "View spaces",
    cta: "Request commercial quote",
    viewAll: "View all sectors →",
    stats: [
      { value: "200+", label: "projects completed" },
      { value: "80+", label: "businesses trust us" },
      { value: "10", label: "years of experience" },
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
  const [activeSector, setActiveSector] = useState<string | null>(null)
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`
  const l = LABELS[lang]
  const active = SECTORS.find((s) => s.slug === activeSector)

  return (
    <section className="bg-ergo-950 section-y">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] mb-4" style={{ color: "#5BC0EB" }}>
            {l.eyebrow}
          </p>
          <h2
            className="font-display font-bold text-white leading-[1.08] tracking-tight"
            style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)", letterSpacing: "-0.02em" }}
          >
            {l.heading}{" "}
            <span style={{ color: "#5BC0EB" }}>{l.headingAccent}</span>
          </h2>
          <p
            className="text-[0.92rem] mt-4 mx-auto max-w-[520px] leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {l.subtitle}
          </p>
        </div>

        {/* 2×2 Bold Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {SECTORS.map((sector) => {
            const isActive = activeSector === sector.slug
            return (
              <button
                key={sector.slug}
                type="button"
                onClick={() => setActiveSector(isActive ? null : sector.slug)}
                className="relative overflow-hidden text-left group focus:outline-none"
                style={{ aspectRatio: "4/3" }}
              >
                {/* Image */}
                <Image
                  src={sector.image}
                  alt={sector.title[lang]}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background: isActive
                      ? "linear-gradient(to top, rgba(42,139,191,0.85) 0%, rgba(28,28,26,0.6) 100%)"
                      : "linear-gradient(to top, rgba(28,28,26,0.85) 0%, rgba(28,28,26,0.25) 50%, transparent 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-7">
                  <h3
                    className="font-display font-bold text-white leading-tight mb-1"
                    style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}
                  >
                    {sector.title[lang]}
                  </h3>
                  <p className="text-[0.8rem] text-white/60 mb-3">
                    {sector.tagline[lang]}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-[0.75rem] font-semibold uppercase tracking-[0.06em] transition-all duration-300"
                    style={{ color: isActive ? "#fff" : "#5BC0EB" }}
                  >
                    {isActive ? (
                      <>
                        {l.viewSpaces}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                      </>
                    ) : (
                      <>
                        {l.explore}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </>
                    )}
                  </span>
                </div>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "#5BC0EB" }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Expandable spaces panel */}
        <div
          className="overflow-hidden transition-all duration-500 ease-in-out"
          style={{
            maxHeight: active ? 400 : 0,
            opacity: active ? 1 : 0,
          }}
        >
          {active && (
            <div className="border border-white/10 p-6 sm:p-8 mb-3" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-start">
                {/* Left: description + spaces */}
                <div>
                  <p className="text-[0.88rem] text-white/60 leading-relaxed mb-6 max-w-xl">
                    {active.description[lang]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {active.spaces.map((space) => (
                      <Link
                        key={space.key}
                        href={`${base}${commercialPath(active.slug, space.key)}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[0.78rem] font-medium transition-all duration-200 border"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          borderColor: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.7)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(91,192,235,0.15)"
                          e.currentTarget.style.borderColor = "rgba(91,192,235,0.4)"
                          e.currentTarget.style.color = "#5BC0EB"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)"
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                          e.currentTarget.style.color = "rgba(255,255,255,0.7)"
                        }}
                      >
                        {space.name[lang]}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </Link>
                    ))}
                  </div>
                </div>
                {/* Right: CTA to sector page */}
                <Link
                  href={`${base}${commercialPath(active.slug)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-[0.82rem] tracking-[0.01em] transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0 self-end"
                  style={{ background: "#5BC0EB", color: "#1C1C1A" }}
                >
                  {lang === "en" ? `Explore ${active.title.en}` : `Explorar ${active.title.es}`}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-10 border-t border-b border-white/10 my-10">
          {l.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="font-display font-bold text-white text-[1.6rem] sm:text-[2rem] leading-none" style={{ color: "#5BC0EB" }}>
                {stat.value}
              </span>
              <p className="text-[0.72rem] sm:text-[0.78rem] mt-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTAs — primary "Ver sectores" (sky-dark), secondary "Cotizar ya" (white outline) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {/* Primary: Ver sectores comerciales */}
          <Link
            href={`${base}/comercial`}
            className="inline-flex items-center justify-center gap-2 bg-ergo-sky-dark hover:bg-ergo-sky text-white font-semibold text-[0.92rem] py-4 px-8 transition-colors min-w-[240px]"
          >
            {l.viewAll.replace(" →", "")}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          {/* Secondary: Cotizar ya por WhatsApp */}
          <a
            href="https://wa.me/50769533776?text=Hola%2C+quiero+cotizar+mobiliario+para+un+proyecto+comercial"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white font-semibold text-[0.92rem] py-4 px-8 transition-colors min-w-[240px]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
            </svg>
            {l.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
