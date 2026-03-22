import Link from "next/link"

const CONTENT = {
  es: {
    label: "Standing Desks & Ergonomía · Panamá",
    title: "Espacios de trabajo que impulsan tu",
    titleAccent: "productividad",
    subtitle: "Standing desks, sillas ergonómicas y accesorios premium. Envío gratis + ensamblaje incluido en Ciudad de Panamá.",
    ctaPrimary: "Explorar Productos",
    ctaSecondary: "Visitar Showroom",
  },
  en: {
    label: "Standing Desks & Ergonomics · Panama",
    title: "Workspaces that boost your",
    titleAccent: "productivity",
    subtitle: "Standing desks, ergonomic chairs and premium accessories. Free shipping + assembly included in Panama City.",
    ctaPrimary: "Browse Products",
    ctaSecondary: "Visit Showroom",
  },
}

export default function Hero({
  lang,
  countryCode,
}: {
  lang: "es" | "en"
  countryCode: string
}) {
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`
  const c = CONTENT[lang]

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: "clamp(480px, 80vh, 720px)",
        background: "linear-gradient(135deg, #E8ECF2 0%, #D5DCE8 40%, #C4CDE0 100%)",
      }}
    >
      {/* Radial gradient accents */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 60%, rgba(91,192,235,0.1) 0%, transparent 55%), radial-gradient(ellipse at 30% 30%, rgba(20,184,166,0.06) 0%, transparent 50%)",
        }}
      />
      {/* Overlay fade to left */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(248,250,251,0.94) 0%, rgba(248,250,251,0.65) 42%, rgba(248,250,251,0.15) 68%, transparent 100%)",
        }}
      />

      <div
        className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col justify-center"
        style={{ minHeight: "clamp(480px, 80vh, 720px)" }}
      >
        {/* Label */}
        <div className="flex items-center gap-2 mb-5">
          <span className="block w-6 h-[1.5px] bg-ergo-sky-dark" />
          <span
            className="text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "#2A8BBF" }}
          >
            {c.label}
          </span>
        </div>

        {/* H1 */}
        <h1
          className="font-display font-extrabold text-ergo-950 leading-[1.06] tracking-tight"
          style={{
            fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)",
            maxWidth: 560,
            letterSpacing: "-0.03em",
          }}
        >
          {c.title}{" "}
          <span style={{ color: "#2A8BBF" }}>{c.titleAccent}</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-ergo-400 leading-relaxed mt-5"
          style={{ maxWidth: 400, fontSize: "0.98rem" }}
        >
          {c.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href={`${base}/store`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-ergo-sky-dark text-white font-semibold text-[0.84rem] tracking-[0.01em] hover:bg-ergo-sky transition-all duration-300 hover:-translate-y-0.5"
            style={{ boxShadow: "none" }}
          >
            {c.ctaPrimary}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href="https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-[13px] border-[1.5px] border-ergo-200 text-ergo-800 font-semibold text-[0.84rem] hover:border-ergo-950 hover:bg-ergo-950/[0.02] transition-all duration-300"
          >
            {c.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}
