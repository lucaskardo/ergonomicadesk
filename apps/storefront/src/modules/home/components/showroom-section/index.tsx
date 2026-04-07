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
    <section className="section-y bg-ergo-bg-warm">
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
              href="https://wa.me/50769533776"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 mt-6 px-7 py-3.5 text-white font-semibold text-[0.84rem] transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "#25D366",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1EBE5A")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#25D366")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {c.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
