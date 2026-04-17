import Image from "next/image"
import Link from "next/link"
import { urlFor } from "@/sanity/lib/image"

type Localized = { es?: string; en?: string }
type HeroSanityData = {
  label?: Localized
  title?: Localized
  titleAccent?: Localized
  subtitle?: Localized
  ctaPrimary?: { text?: Localized; href?: string }
  ctaSecondary?: { text?: Localized; href?: string }
  backgroundImage?: {
    asset?: { _id: string; url: string }
    alt?: string
    hotspot?: unknown
    crop?: unknown
  }
}

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
  sanityData,
}: {
  lang: "es" | "en"
  countryCode: string
  sanityData?: HeroSanityData
}) {
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`
  const defaults = CONTENT[lang]
  const c = {
    label: sanityData?.label?.[lang] ?? defaults.label,
    title: sanityData?.title?.[lang] ?? defaults.title,
    titleAccent: sanityData?.titleAccent?.[lang] ?? defaults.titleAccent,
    subtitle: sanityData?.subtitle?.[lang] ?? defaults.subtitle,
    ctaPrimary: sanityData?.ctaPrimary?.text?.[lang] ?? defaults.ctaPrimary,
    ctaPrimaryHref: sanityData?.ctaPrimary?.href ?? `${base}/store`,
    ctaSecondary: sanityData?.ctaSecondary?.text?.[lang] ?? defaults.ctaSecondary,
    ctaSecondaryHref: (() => {
      const MAPS_URL = "https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z"
      const href = sanityData?.ctaSecondary?.href ?? MAPS_URL
      // Sanity may have stale wa.me links — coerce showroom CTAs to Google Maps
      return href.includes("wa.me") ? MAPS_URL : href
    })(),
  }

  const heroImageUrl =
    sanityData?.backgroundImage?.asset
      ? urlFor(sanityData.backgroundImage).width(1920).height(1080).fit("crop").url()
      : null

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: "clamp(480px, 80vh, 720px)",
        background: heroImageUrl
          ? undefined
          : "linear-gradient(135deg, #F3EDE5 0%, #E8E0D5 40%, #DDD4C8 100%)",
      }}
    >
      {/* Background image from Sanity */}
      {heroImageUrl && (
        <Image
          src={heroImageUrl}
          alt={sanityData?.backgroundImage?.alt ?? ""}
          fill
          className="object-cover"
          priority
        />
      )}

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
          background: heroImageUrl
            ? "linear-gradient(to right, rgba(28,28,26,0.75) 0%, rgba(28,28,26,0.45) 42%, rgba(28,28,26,0.10) 68%, transparent 100%)"
            : "linear-gradient(to right, rgba(243,237,229,0.94) 0%, rgba(243,237,229,0.65) 42%, rgba(243,237,229,0.15) 68%, transparent 100%)",
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
            className={`text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${heroImageUrl ? "text-ergo-sky" : "text-ergo-sky-dark"}`}
          >
            {c.label}
          </span>
        </div>

        {/* H1 */}
        <h1
          className={`font-display font-extrabold leading-[1.06] tracking-tight ${heroImageUrl ? "text-white" : "text-ergo-950"}`}
          style={{
            fontSize: "clamp(2.4rem, 4.8vw, 3.8rem)",
            maxWidth: 560,
            letterSpacing: "-0.03em",
          }}
        >
          {c.title}{" "}
          <span className="text-ergo-sky">{c.titleAccent}</span>
        </h1>

        {/* Subtitle */}
        <p
          className={`leading-relaxed mt-5 ${heroImageUrl ? "text-white/75" : "text-ergo-400"}`}
          style={{ maxWidth: 400, fontSize: "0.98rem" }}
        >
          {c.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mt-8">
          <Link
            href={c.ctaPrimaryHref}
            className="inline-flex items-center gap-2 px-8 py-4 bg-ergo-sky-dark text-white font-semibold text-[0.84rem] tracking-[0.01em] hover:bg-ergo-sky transition duration-base hover:-translate-y-0.5"
            style={{ boxShadow: "none" }}
          >
            {c.ctaPrimary}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <a
            href={c.ctaSecondaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-7 py-[13px] border-[1.5px] font-semibold text-[0.84rem] transition duration-base ${
              heroImageUrl
                ? "border-white/30 text-white hover:border-white hover:bg-white/10"
                : "border-ergo-200 text-ergo-800 hover:border-ergo-950 hover:bg-ergo-950/[0.02]"
            }`}
          >
            {c.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  )
}
