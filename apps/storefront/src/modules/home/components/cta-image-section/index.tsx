import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

type SanityImage = {
  asset?: { _id: string; url: string }
  alt?: string
  hotspot?: { x: number; y: number }
  crop?: unknown
}

type Localized = { es?: string; en?: string }

type Stat = { _key?: string; value?: string; label?: Localized }

type CtaImageData = {
  label?: Localized
  title?: Localized
  titleAccent?: Localized
  subtitle?: Localized
  image?: SanityImage
  cta?: { text?: Localized; href?: string }
  stats?: Stat[]
  imagePosition?: "left" | "right"
  theme?: "light" | "dark"
}

export default function CtaImageSection({
  lang,
  data,
}: {
  lang: "es" | "en"
  data: CtaImageData
}) {
  const isDark = data.theme !== "light"
  const imageRight = data.imagePosition !== "left"

  const label = data.label?.[lang]
  const title = data.title?.[lang]
  const titleAccent = data.titleAccent?.[lang]
  const subtitle = data.subtitle?.[lang]
  const ctaText = data.cta?.text?.[lang]
  const ctaHref = data.cta?.href
  const stats = data.stats ?? []

  const imageUrl =
    data.image?.asset
      ? urlFor(data.image).width(900).height(660).fit("crop").url()
      : null

  const bg = isDark ? "bg-ergo-950" : "bg-ergo-50"
  const textColor = isDark ? "text-white" : "text-ergo-950"
  const subColor = isDark ? "text-ergo-300" : "text-ergo-500"
  const labelColor = isDark ? "text-ergo-sky" : "text-ergo-sky-dark"

  const content = (
    <div className={`flex flex-col justify-center px-8 py-12 lg:px-16 lg:py-16 ${isDark ? "" : ""}`}>
      {label && (
        <span className={`text-[0.65rem] uppercase tracking-[0.14em] font-semibold mb-3 ${labelColor}`}>
          {label}
        </span>
      )}
      {(title || titleAccent) && (
        <h2
          className={`font-display font-bold leading-[1.05] tracking-tight mb-4 ${textColor}`}
          style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)" }}
        >
          {title}{" "}
          {titleAccent && (
            <span className={isDark ? "text-ergo-sky" : "text-ergo-sky-dark"}>{titleAccent}</span>
          )}
        </h2>
      )}
      {subtitle && (
        <p className={`text-[0.92rem] leading-relaxed mb-6 max-w-[480px] ${subColor}`}>{subtitle}</p>
      )}

      {stats.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-[360px]">
          {stats.map((stat, i) => (
            <div key={stat._key ?? i}>
              <p className={`font-display font-bold text-[1.6rem] leading-none ${isDark ? "text-ergo-sky" : "text-ergo-sky-dark"}`}>
                {stat.value}
              </p>
              <p className={`text-[0.72rem] mt-1 ${subColor}`}>{stat.label?.[lang]}</p>
            </div>
          ))}
        </div>
      )}

      {ctaText && ctaHref && (
        <a
          href={ctaHref}
          target={ctaHref.startsWith("http") ? "_blank" : undefined}
          rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`inline-flex items-center gap-2 text-[0.875rem] font-semibold px-6 py-3 transition-colors w-fit ${
            isDark
              ? "bg-ergo-sky text-white hover:bg-ergo-sky-hover"
              : "bg-ergo-950 text-white hover:bg-ergo-800"
          } rounded-base`}
        >
          {ctaText}
        </a>
      )}
    </div>
  )

  const image = imageUrl ? (
    <div className="relative min-h-[320px] lg:min-h-full overflow-hidden">
      <Image
        src={imageUrl}
        alt={data.image?.alt || ""}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  ) : (
    <div className={`min-h-[320px] ${isDark ? "bg-ergo-900" : "bg-ergo-100"}`} />
  )

  return (
    <section className={`${bg} section-y`}>
      <div className="max-w-[1360px] mx-auto overflow-hidden rounded-lg m-4 lg:m-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
          {imageRight ? (
            <>
              {content}
              {image}
            </>
          ) : (
            <>
              {image}
              {content}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
