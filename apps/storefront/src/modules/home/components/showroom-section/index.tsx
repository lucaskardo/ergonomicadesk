"use client"

const CONTENT = {
  es: {
    title: "Visita nuestro showroom",
    subtitle: "Prueba cada producto antes de comprarlo. Nuestro equipo te asesora para la combinación perfecta.",
    address: "Calle 79 Este 14, Coco del Mar",
    hours: "Lun–Vie 12–6PM · Sáb 9–12PM",
    phone: "+507 6953-3776",
    badge: "Showroom Coco del Mar",
    cta: "Agenda una visita",
  },
  en: {
    title: "Visit our showroom",
    subtitle: "Try before you buy. Our team advises you on the perfect combination.",
    address: "Calle 79 Este 14, Coco del Mar",
    hours: "Mon–Fri 12–6PM · Sat 9–12PM",
    phone: "+507 6953-3776",
    badge: "Coco del Mar Showroom",
    cta: "Book a visit",
  },
}

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.1 6.1l.9-.9a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
  </svg>
)

export default function ShowroomSection({ lang }: { lang: "es" | "en" }) {
  const c = CONTENT[lang]

  return (
    <section className="py-14 lg:py-24">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-11 items-center">
          {/* Image side */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(145deg, #c8d5e3 0%, #8ea3bb 100%)",
              }}
            />
            {/* Badge */}
            <div
              className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 text-[0.73rem] font-semibold z-10"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span style={{ color: "#2A8BBF" }}>
                <MapPinIcon />
              </span>
              {c.badge}
            </div>
          </div>

          {/* Info side */}
          <div>
            <h2
              className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.2rem)", letterSpacing: "-0.02em" }}
            >
              {c.title}
            </h2>
            <p className="text-[0.92rem] text-ergo-400 mt-3 leading-relaxed" style={{ maxWidth: 380 }}>
              {c.subtitle}
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-[0.83rem] text-ergo-400">
                <span style={{ color: "#2A8BBF" }}><MapPinIcon /></span>
                {c.address}
              </div>
              <div className="flex items-center gap-2.5 text-[0.83rem] text-ergo-400">
                <span style={{ color: "#2A8BBF" }}><ClockIcon /></span>
                {c.hours}
              </div>
              <div className="flex items-center gap-2.5 text-[0.83rem] text-ergo-400">
                <span style={{ color: "#2A8BBF" }}><PhoneIcon /></span>
                {c.phone}
              </div>
            </div>

            <a
              href="https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-6 px-7 py-3.5 bg-ergo-sky-dark hover:bg-ergo-sky text-white font-semibold text-[0.84rem] transition-all duration-300 hover:-translate-y-0.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {c.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
