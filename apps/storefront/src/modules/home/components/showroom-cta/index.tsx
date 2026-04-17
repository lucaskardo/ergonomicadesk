const CONTENT = {
  es: {
    tag: "Showroom",
    heading: "Visítanos en",
    headingAccent: "Coco del Mar",
    address: "Calle 79 Este 14, Coco del Mar",
    city: "Ciudad de Panamá",
    hours: "Lun–Vie 12PM–6PM · Sáb 9AM–12PM",
    phone: "+507 6953-3776",
    waLabel: "Escribir por WhatsApp",
    mapsLabel: "Cómo llegar",
    desc: "Prueba nuestros standing desks y sillas ergonómicas antes de comprar. Nuestro equipo te asesora personalmente.",
  },
  en: {
    tag: "Showroom",
    heading: "Visit us in",
    headingAccent: "Coco del Mar",
    address: "Calle 79 Este 14, Coco del Mar",
    city: "Panama City",
    hours: "Mon–Fri 12PM–6PM · Sat 9AM–12PM",
    phone: "+507 6953-3776",
    waLabel: "Message on WhatsApp",
    mapsLabel: "Get directions",
    desc: "Try our standing desks and ergonomic chairs before you buy. Our team gives you personalized advice.",
  },
}

export default function ShowroomCTA({ lang }: { lang: "es" | "en" }) {
  const c = CONTENT[lang]

  return (
    <section className="bg-ergo-bg section-y">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Map placeholder */}
          <div
            className="relative overflow-hidden bg-gradient-to-br from-ergo-100 to-ergo-200"
            style={{ minHeight: 320 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.7!2d-79.499793!3d8.9936175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8faca8e2b9272055%3A0x6a9de150083231c9!2sErgonomica%20Home%20Office!5e0!3m2!1ses!2spa!4v1700000000000!5m2!1ses!2spa"
              width="100%"
              height="100%"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ergonómica Showroom"
            />
          </div>

          {/* Info */}
          <div className="bg-white border border-ergo-200/60 p-10 flex flex-col justify-center gap-6">
            <div>
              <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ergo-sky-dark flex items-center gap-2">
                <span className="w-6 h-[1.5px] bg-ergo-sky inline-block" />
                {c.tag}
              </span>
              <h2
                className="font-display font-bold text-ergo-950 mt-3 leading-[1.1] tracking-tight"
                style={{ fontSize: "clamp(1.6rem, 2.4vw, 2rem)", letterSpacing: "-0.02em" }}
              >
                {c.heading}{" "}
                <span className="text-ergo-sky-dark">{c.headingAccent}</span>
              </h2>
              <p className="text-[0.9rem] text-ergo-600 mt-3 leading-relaxed max-w-sm">{c.desc}</p>
            </div>

            <div className="flex flex-col gap-2 text-[0.84rem]">
              <div className="flex items-start gap-2.5 text-ergo-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mt-0.5 flex-shrink-0 text-ergo-sky-dark">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <p className="font-medium text-ergo-950">{c.address}</p>
                  <p className="text-ergo-400">{c.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-ergo-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ergo-sky-dark">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{c.hours}</span>
              </div>
              <div className="flex items-center gap-2.5 text-ergo-600">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-ergo-sky-dark">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.38 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z" />
                </svg>
                <a href="tel:+50769533776" className="hover:text-ergo-sky-dark transition-colors">{c.phone}</a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://wa.me/50769533776"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-[0.84rem] text-white transition duration-base hover:-translate-y-0.5 bg-whatsapp hover:bg-whatsapp-hover"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {c.waLabel}
              </a>
              <a
                href="https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 border-[1.5px] border-ergo-200 text-ergo-800 font-semibold text-[0.84rem] hover:border-ergo-950 transition duration-base"
              >
                {c.mapsLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
