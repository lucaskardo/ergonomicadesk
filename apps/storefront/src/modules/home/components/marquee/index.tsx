"use client"

const ITEMS = {
  es: [
    "Diseño Ergonómico",
    "Calidad Premium",
    "Envío Gratis",
    "Standing Desks",
    "Showroom Coco del Mar",
    "Asesoría Personalizada",
  ],
  en: [
    "Ergonomic Design",
    "Premium Quality",
    "Free Shipping",
    "Standing Desks",
    "Coco del Mar Showroom",
    "Personal Consulting",
  ],
}

export default function Marquee({ lang }: { lang: "es" | "en" }) {
  const items = ITEMS[lang]
  // Duplicate for seamless loop
  const repeated = [...items, ...items]

  return (
    <div
      className="bg-ergo-950 overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        className="flex whitespace-nowrap animate-marquee motion-reduce:animate-none motion-reduce:[animation-play-state:paused]"
        style={{ width: "max-content" }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-ergo-400 text-[0.8rem] uppercase tracking-widest py-3 px-4">
              {item}
            </span>
            <span className="text-ergo-sky text-[0.7rem] px-1">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
