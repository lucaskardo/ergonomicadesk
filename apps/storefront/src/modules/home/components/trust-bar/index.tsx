"use client"

import { useLang } from "@lib/i18n/context"

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
)

const WrenchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const TrustBar = () => {
  const lang = useLang()

  const items =
    lang === "en"
      ? [
          { Icon: TruckIcon, title: "Free Shipping >$99", sub: "Panama City", teal: true },
          { Icon: WrenchIcon, title: "Assembly Included", sub: "On all furniture", teal: true },
          { Icon: ShieldIcon, title: "Up to 5yr Warranty", sub: "On selected products", teal: true },
          { Icon: WhatsAppIcon, title: "Direct Support", sub: "WhatsApp 24/7", green: true },
        ]
      : [
          { Icon: TruckIcon, title: "Envío Gratis >$99", sub: "Ciudad de Panamá", teal: true },
          { Icon: WrenchIcon, title: "Ensamblaje Incluido", sub: "En todos los muebles", teal: true },
          { Icon: ShieldIcon, title: "Hasta 5 Años Garantía", sub: "En productos seleccionados", teal: true },
          { Icon: WhatsAppIcon, title: "Soporte Directo", sub: "WhatsApp 24/7", green: true },
        ]

  return (
    <div className="bg-white border-y border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ Icon, title, sub, green }) => (
            <div key={title} className="flex items-center gap-3">
              <span className={green ? "text-green-500" : "text-teal-600"}>
                <Icon />
              </span>
              <div>
                <p className="font-semibold text-sm text-gray-900">{title}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustBar
