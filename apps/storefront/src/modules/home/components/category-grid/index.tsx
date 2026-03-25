import Link from "next/link"

const CONTENT = {
  es: {
    heading: "Explora",
    headingAccent: "nuestras categorías",
    viewAll: "Ver todo",
  },
  en: {
    heading: "Explore",
    headingAccent: "our categories",
    viewAll: "View all",
  },
}

const CATEGORIES = [
  {
    handle: "standing-desks",
    es: "Standing Desks",
    en: "Standing Desks",
    descEs: "82 productos",
    descEn: "82 products",
    bg: "linear-gradient(145deg, #c8d5e3 0%, #9bb0c9 100%)",
  },
  {
    handle: "chairs",
    es: "Sillas",
    en: "Chairs",
    descEs: "35 productos",
    descEn: "35 products",
    bg: "linear-gradient(145deg, #b5c5d6 0%, #8ea3bb 100%)",
  },
  {
    handle: "office",
    es: "Oficina",
    en: "Office",
    descEs: "46 productos",
    descEn: "46 products",
    bg: "linear-gradient(145deg, #bcc9d8 0%, #95a8be 100%)",
  },
  {
    handle: "storage",
    es: "Almacenamiento",
    en: "Storage",
    descEs: "19 productos",
    descEn: "19 products",
    bg: "linear-gradient(145deg, #c0cdd9 0%, #9aadbe 100%)",
  },
  {
    handle: "accessories",
    es: "Accesorios",
    en: "Accessories",
    descEs: "54 productos",
    descEn: "54 products",
    bg: "linear-gradient(145deg, #b8c7d8 0%, #92a5b9 100%)",
  },
]

export default function CategoryGrid({
  lang,
  countryCode,
}: {
  lang: "es" | "en"
  countryCode: string
}) {
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`
  const catPath = lang === "en" ? "categories" : "categorias"
  const storePath = lang === "en" ? "store" : "colecciones"
  const c = CONTENT[lang]

  return (
    <section className="bg-ergo-bg py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-9">
          <div>
            <h2
              className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              {c.heading}{" "}
              <span style={{ color: "#2A8BBF" }}>{c.headingAccent}</span>
            </h2>
          </div>
          <Link
            href={`${base}/${storePath}`}
            className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-ergo-sky-dark hover:gap-3 transition-all duration-300 flex-shrink-0"
          >
            {c.viewAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* CSS Grid — first item spans 2 rows, 3px gaps */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-3"
          style={{
            gridTemplateRows: "1fr 1fr",
            height: "clamp(380px, 45vw, 520px)",
          }}
        >
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.handle}
              href={`${base}/${catPath}/${cat.handle}`}
              className={`relative overflow-hidden cursor-pointer group${i === 0 ? " lg:row-span-2" : ""}`}
            >
              {/* Background */}
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ background: cat.bg }}
              />
              {/* Bottom overlay */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: "linear-gradient(to top, rgba(12,18,34,0.45) 0%, transparent 50%)",
                }}
              />
              {/* Content */}
              <div
                className="absolute bottom-0 left-0 right-0 z-20"
                style={{ padding: i === 0 ? "28px" : "22px" }}
              >
                <h3
                  className="font-display font-bold text-white"
                  style={{ fontSize: i === 0 ? "1.7rem" : "1.15rem" }}
                >
                  {lang === "en" ? cat.en : cat.es}
                </h3>
                <p className="text-[0.72rem] font-medium mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {lang === "en" ? cat.descEn : cat.descEs}
                </p>
              </div>
              {/* Arrow on hover */}
              <div
                className="absolute top-3.5 right-3.5 z-20 w-[34px] h-[34px] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-1.5 -translate-y-1.5 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
