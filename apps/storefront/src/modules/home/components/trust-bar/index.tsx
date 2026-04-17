const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform duration-base ease-out">
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" className="origin-[5.5px_18.5px] group-hover:animate-[spin_1s_linear_infinite]" />
    <circle cx="18.5" cy="18.5" r="2.5" className="origin-[18.5px_18.5px] group-hover:animate-[spin_1s_linear_infinite]" />
  </svg>
)

const WrenchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-[25deg] transition-transform duration-base ease-out origin-center">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-base ease-out origin-center">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="group-hover:stroke-ergo-sky-dark group-hover:fill-ergo-sky-light/50 transition-colors duration-base" />
    <polyline points="9 12 11 14 15 10" className="group-hover:stroke-[2px] transition duration-base" />
  </svg>
)

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-y-1 transition-transform duration-base ease-out">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    {/* Typing indicator dots */}
    <circle cx="8" cy="11.5" r="1.5" className="fill-currentColor animate-[pulse_1.5s_infinite]" style={{ animationDelay: '0s' }} />
    <circle cx="12" cy="11.5" r="1.5" className="fill-currentColor animate-[pulse_1.5s_infinite]" style={{ animationDelay: '0.2s' }} />
    <circle cx="16" cy="11.5" r="1.5" className="fill-currentColor animate-[pulse_1.5s_infinite]" style={{ animationDelay: '0.4s' }} />
  </svg>
)

type Localized = { es?: string; en?: string }
type TrustBarSanityItem = { _key?: string; emoji?: string; title?: Localized; subtitle?: Localized }
type TrustBarSanityData = { items?: TrustBarSanityItem[] }

const CONTENT = {
  es: [
    { Icon: TruckIcon, title: "Envío Gratis >$99", sub: "Ciudad de Panamá" },
    { Icon: WrenchIcon, title: "Ensamblaje Incluido", sub: "En todos los muebles" },
    { Icon: ShieldIcon, title: "Hasta 5 Años Garantía", sub: "En productos seleccionados" },
    { Icon: ChatIcon, title: "Soporte Directo", sub: "WhatsApp 24/7" },
  ],
  en: [
    { Icon: TruckIcon, title: "Free Shipping >$99", sub: "Panama City" },
    { Icon: WrenchIcon, title: "Assembly Included", sub: "On all furniture" },
    { Icon: ShieldIcon, title: "Up to 5yr Warranty", sub: "On selected products" },
    { Icon: ChatIcon, title: "Direct Support", sub: "WhatsApp 24/7" },
  ],
}

export default function TrustBar({
  lang,
  sanityData,
}: {
  lang: "es" | "en"
  sanityData?: TrustBarSanityData
}) {
  const useSanity = !!(sanityData?.items && sanityData.items.length > 0)
  const sanityItems = useSanity ? sanityData!.items! : []
  const hardcodedItems = CONTENT[lang]

  return (
    <div className="bg-white border-b border-ergo-200/60 overflow-hidden section-y-tight">
      <div className="max-w-[1360px] mx-auto grid grid-cols-2 md:grid-cols-4">
        {useSanity
          ? sanityItems.map((item, i) => (
              <div
                key={item._key ?? i}
                className={`group flex items-center gap-3 px-6 py-5 transition-colors duration-fast hover:bg-ergo-sky-50 cursor-default ${
                  i < sanityItems.length - 1 ? "border-r border-ergo-200/60" : ""
                }`}
              >
                <div className="w-10 h-10 bg-ergo-sky-light text-ergo-sky-dark flex items-center justify-center flex-shrink-0 text-[1.1rem] rounded-base transition-transform duration-base ease-out group-hover:scale-110 group-hover:rotate-3 shadow-soft">
                  {item.emoji}
                </div>
                <div>
                  <p className="text-[0.77rem] font-semibold text-ergo-950 leading-tight">
                    {item.title?.[lang]}
                  </p>
                  <p className="text-[0.68rem] text-ergo-400 mt-0.5">{item.subtitle?.[lang]}</p>
                </div>
              </div>
            ))
          : hardcodedItems.map(({ Icon, title, sub }, i) => (
              <div
                key={title}
                className={`group flex items-center gap-3 px-6 py-5 transition-colors duration-fast hover:bg-ergo-sky-50 cursor-default ${
                  i < hardcodedItems.length - 1 ? "border-r border-ergo-200/60" : ""
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-ergo-sky-light/80 to-ergo-sky-light text-ergo-sky-dark flex items-center justify-center flex-shrink-0 rounded-base transition duration-base ease-out group-hover:shadow-medium group-hover:shadow-ergo-sky-light/50 ring-1 ring-black/5">
                  <Icon />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[0.77rem] font-semibold text-ergo-950 leading-tight transition-transform duration-base group-hover:translate-x-0.5">
                    {title}
                  </p>
                  <p className="text-[0.68rem] text-ergo-400 mt-0.5 transition-transform duration-base group-hover:translate-x-0.5 delay-75">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  )
}
