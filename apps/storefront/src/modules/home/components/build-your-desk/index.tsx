import Link from "next/link"

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)
const SilentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
  </svg>
)
const WeightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 5v14M18 5v14" /><rect x="2" y="8" width="4" height="8" rx="1" />
    <rect x="18" y="8" width="4" height="8" rx="1" /><line x1="6" y1="12" x2="18" y2="12" />
  </svg>
)

const CONTENT = {
  es: {
    pretitle: "Standing Desks",
    title: "Arma Tu Escritorio",
    titleAccent: "Ideal",
    description:
      "Escoge entre 8 bases motorizadas y más de 60 combinaciones de sobres de melamina y madera natural. Pantalla táctil con 3 memorias, tecnología anticolisión y hasta 5 años de garantía.",
    steps: [
      { label: "1. Elige base" },
      { label: "2. Elige sobre" },
      { label: "3. Lo armamos" },
    ],
    features: [
      { Icon: ZapIcon, label: "Velocidad hasta 38mm/s" },
      { Icon: SilentIcon, label: "Ultra silencioso <48dB" },
      { Icon: WeightIcon, label: "Hasta 200kg de capacidad" },
    ],
    cta: "Ver Bases y Sobres",
  },
  en: {
    pretitle: "Standing Desks",
    title: "Build Your Ideal",
    titleAccent: "Standing Desk",
    description:
      "Choose from 8 motorized frames and over 60 combinations of melamine and natural wood tops. Touch screen with 3 presets, anti-collision technology and up to 5 years warranty.",
    steps: [
      { label: "1. Choose frame" },
      { label: "2. Choose top" },
      { label: "3. We assemble" },
    ],
    features: [
      { Icon: ZapIcon, label: "Speed up to 38mm/s" },
      { Icon: SilentIcon, label: "Ultra-quiet <48dB" },
      { Icon: WeightIcon, label: "Up to 200kg capacity" },
    ],
    cta: "View Frames & Tops",
  },
}

export default function BuildYourDesk({
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
    <section className="relative overflow-hidden bg-ergo-950" style={{ padding: "clamp(56px, 7vw, 96px) 0" }}>
      {/* Radial gradient accents */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 65% 40%, rgba(91,192,235,0.08) 0%, transparent 55%), radial-gradient(ellipse at 30% 70%, rgba(20,184,166,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            className="font-display font-bold text-white leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
          >
            {c.title}{" "}
            <span className="text-ergo-sky">{c.titleAccent}</span>
          </h2>
          <p className="text-ergo-400 text-[0.9rem] mt-2" style={{ maxWidth: 480, margin: "8px auto 0" }}>
            {c.description}
          </p>
        </div>

        {/* 2-column layout */}
        <div
          className="grid gap-12 items-start"
          style={{ gridTemplateColumns: "1.3fr 1fr" }}
        >
          {/* Left: SVG scene */}
          <div
            className="relative aspect-[16/10] overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "32px",
            }}
          >
            {/* Desk SVG illustration */}
            <svg viewBox="0 0 560 350" className="w-full h-full" fill="none">
              {/* Floor */}
              <rect x="0" y="310" width="560" height="40" fill="rgba(255,255,255,0.03)" />
              {/* Desk legs */}
              <rect x="120" y="200" width="14" height="110" fill="rgba(91,192,235,0.25)" />
              <rect x="426" y="200" width="14" height="110" fill="rgba(91,192,235,0.25)" />
              {/* Cross bar */}
              <rect x="120" y="270" width="320" height="6" fill="rgba(91,192,235,0.15)" />
              {/* Motor unit */}
              <rect x="126" y="220" width="14" height="40" fill="rgba(91,192,235,0.4)" rx="0" />
              <rect x="420" y="220" width="14" height="40" fill="rgba(91,192,235,0.4)" rx="0" />
              {/* Desktop surface */}
              <rect x="90" y="188" width="380" height="16" fill="rgba(160,136,107,0.7)" />
              <rect x="86" y="184" width="388" height="8" fill="rgba(160,136,107,0.5)" />
              {/* Monitor */}
              <rect x="220" y="90" width="120" height="80" fill="rgba(255,255,255,0.06)" stroke="rgba(91,192,235,0.3)" strokeWidth="1.5" />
              <rect x="270" y="170" width="20" height="18" fill="rgba(255,255,255,0.05)" />
              <rect x="255" y="185" width="50" height="5" fill="rgba(91,192,235,0.2)" />
              {/* Screen content */}
              <rect x="232" y="102" width="96" height="58" fill="rgba(91,192,235,0.05)" />
              <line x1="240" y1="118" x2="310" y2="118" stroke="rgba(91,192,235,0.3)" strokeWidth="1" />
              <line x1="240" y1="128" x2="295" y2="128" stroke="rgba(91,192,235,0.2)" strokeWidth="1" />
              {/* Keyboard */}
              <rect x="195" y="192" width="100" height="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              {/* Mouse */}
              <rect x="308" y="193" width="26" height="16" rx="0" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              {/* Control panel */}
              <rect x="108" y="192" width="52" height="12" fill="rgba(91,192,235,0.15)" stroke="rgba(91,192,235,0.3)" strokeWidth="1" />
              <circle cx="120" cy="198" r="3" fill="rgba(91,192,235,0.6)" />
              <circle cx="132" cy="198" r="3" fill="rgba(255,255,255,0.2)" />
              <circle cx="144" cy="198" r="3" fill="rgba(255,255,255,0.2)" />
              {/* Up/down indicator */}
              <text x="280" y="82" textAnchor="middle" fill="rgba(91,192,235,0.6)" fontSize="10" fontFamily="system-ui">▲ 75cm</text>
            </svg>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-col gap-5">
            {/* Step indicators */}
            <div className="flex items-center gap-2 flex-wrap">
              {c.steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-ergo-sky-dark/20 border border-ergo-sky-dark/30">
                    <span className="text-[0.75rem] font-medium text-ergo-sky">{step.label}</span>
                  </div>
                  {i < c.steps.length - 1 && (
                    <span className="text-ergo-600 text-xs">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* Feature list */}
            <ul className="flex flex-col gap-3">
              {c.features.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-[0.84rem] text-ergo-300">
                  <span className="text-ergo-sky flex-shrink-0">
                    <Icon />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={`${base}/categories/standing-desks`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-ergo-sky-dark text-white font-semibold text-[0.84rem] tracking-[0.01em] hover:bg-ergo-sky transition-all duration-300 mt-2 self-start"
            >
              {c.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
