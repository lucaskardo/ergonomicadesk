export default function WhyErgonomica({ lang }: { lang: "es" | "en" }) {
  const content =
    lang === "en"
      ? {
          title: "Why Ergonómica?",
          items: [
            {
              title: "Showroom in Coco del Mar",
              description: "Try before you buy. Mon-Fri 12-6PM, Sat 9-12PM.",
              icon: "showroom",
            },
            {
              title: "Free Delivery + Assembly",
              description:
                "In Panama City on orders over $99. Professional setup included.",
              icon: "delivery",
            },
            {
              title: "Up to 5 Year Warranty",
              description: "Local tech support included. +500 offices outfitted.",
              icon: "warranty",
            },
          ],
        }
      : {
          title: "¿Por qué Ergonómica?",
          items: [
            {
              title: "Showroom en Coco del Mar",
              description: "Prueba antes de comprar. Lun-Vie 12-6PM, Sáb 9-12PM.",
              icon: "showroom",
            },
            {
              title: "Entrega + Ensamblaje Gratis",
              description:
                "En Ciudad de Panamá en pedidos >$99. Instalación profesional incluida.",
              icon: "delivery",
            },
            {
              title: "Hasta 5 Años de Garantía",
              description: "Servicio técnico local incluido. +500 oficinas equipadas.",
              icon: "warranty",
            },
          ],
        }

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          {content.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.items.map((item) => (
            <div
              key={item.icon}
              className="bg-white rounded-xl p-6 border border-gray-100 text-center"
            >
              <div className="flex justify-center mb-4">
                {item.icon === "showroom" && (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                )}
                {item.icon === "delivery" && (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 3h15v13H1z" />
                    <path d="M16 8h4l3 3v5h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                )}
                {item.icon === "warranty" && (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0d9488"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
