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

// Decorative placeholder backgrounds — warm ergo neutrals.
// When real category imagery is wired up, these become fallbacks behind <Image />.
const CATEGORY_BG = [
  "linear-gradient(145deg, #EDEDE8 0%, #B0B0A8 100%)",
  "linear-gradient(145deg, #D4D4CC 0%, #8A8A82 100%)",
  "linear-gradient(145deg, #F3EDE5 0%, #B0B0A8 100%)",
  "linear-gradient(145deg, #EDEDE8 0%, #8A8A82 100%)",
  "linear-gradient(145deg, #F8F5F0 0%, #B0B0A8 100%)",
]

const CATEGORIES = [
  { handle: "standing-desks", es: "Standing Desks", en: "Standing Desks", descEs: "Trabaja de pie, rinde más. Desde $299", descEn: "Stand up, perform better. From $299", bg: CATEGORY_BG[0] },
  { handle: "chairs", es: "Sillas", en: "Chairs", descEs: "8 horas sin molestias. Desde $199", descEn: "8 hours without discomfort. From $199", bg: CATEGORY_BG[1] },
  { handle: "office", es: "Oficina", en: "Office", descEs: "El centro de tu productividad. Desde $449", descEn: "The center of your productivity. From $449", bg: CATEGORY_BG[2] },
  { handle: "storage", es: "Almacenamiento", en: "Storage", descEs: "Todo en su lugar, siempre. Desde $129", descEn: "Everything in its place, always. From $129", bg: CATEGORY_BG[3] },
  { handle: "accessories", es: "Accesorios", en: "Accessories", descEs: "Los detalles que completan tu setup. Desde $29", descEn: "The details that complete your setup. From $29", bg: CATEGORY_BG[4] },
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
    <section className="bg-white border-t border-ergo-100 section-y">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-9">
          <div>
            <h2
              className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              {c.heading}{" "}
              <span className="text-ergo-sky-dark">{c.headingAccent}</span>
            </h2>
          </div>
          <Link
            href={`${base}/${storePath}`}
            className="flex items-center gap-1.5 text-[0.8rem] font-semibold text-ergo-sky-dark hover:gap-3 transition duration-base flex-shrink-0"
          >
            {c.viewAll}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile: 2×2 square grid with first 4 categories */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat.handle}
              href={`${base}/${catPath}/${cat.handle}`}
              className="relative overflow-hidden cursor-pointer group aspect-square"
            >
              <div
                className="absolute inset-0 transition-transform duration-slow group-hover:scale-105"
                style={{ background: cat.bg }}
              />
              <div
                className="absolute inset-0 z-10"
                style={{ background: "linear-gradient(to top, rgba(12,18,34,0.55) 0%, transparent 55%)" }}
              />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                <h3 className="font-display font-bold text-white text-[1.05rem] leading-tight">
                  {lang === "en" ? cat.en : cat.es}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: link to see all categories */}
        <div className="lg:hidden mt-4 text-center">
          <Link
            href={`${base}/${catPath}`}
            className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-ergo-sky-dark hover:text-ergo-sky transition-colors"
          >
            {lang === "en" ? "See all categories" : "Ver todas las categorías"}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Desktop: original asymmetric grid */}
        <div
          className="hidden lg:grid lg:grid-cols-[1.4fr_1fr_1fr] gap-3"
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
                className="absolute inset-0 transition-transform duration-slow group-hover:scale-105"
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
                className="absolute top-3.5 right-3.5 z-20 w-[34px] h-[34px] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-x-1.5 -translate-y-1.5 group-hover:translate-x-0 group-hover:translate-y-0 transition duration-base"
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
