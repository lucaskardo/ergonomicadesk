import ScrollAnimate from "@modules/common/components/scroll-animate"
import AnimatedCounter from "@modules/common/components/animated-counter"

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const CONTENT = {
  es: {
    heading: "Lo que dicen",
    headingAccent: "nuestros clientes",
    subtitle: "Más de 500 oficinas equipadas en Panamá",
    reviews: [
      {
        text: "Excelente calidad y el ensamblaje fue profesional. Mi standing desk llegó perfectamente embalado y lo instalaron en menos de una hora.",
        author: "Carlos M.",
        role: "Arquitecto",
        initials: "CM",
      },
      {
        text: "Las sillas ergonómicas son increíbles. Trabajo desde casa y mi espalda ya no me molesta. Totalmente recomendado.",
        author: "Valeria R.",
        role: "Diseñadora UX",
        initials: "VR",
      },
      {
        text: "Compré el escritorio ejecutivo para nuestra oficina y quedamos encantados. Gran relación calidad-precio y el servicio al cliente es excelente.",
        author: "Roberto S.",
        role: "Director Financiero",
        initials: "RS",
      },
    ],
    stats: [
      { number: "500+", label: "Clientes" },
      { number: "5.0", label: "Google Rating" },
      { number: "15K", label: "Seguidores IG" },
      { number: "5", label: "Años en Panamá" },
    ],
  },
  en: {
    heading: "What our",
    headingAccent: "customers say",
    subtitle: "500+ offices outfitted across Panama",
    reviews: [
      {
        text: "Excellent quality and the assembly was professional. My standing desk arrived perfectly packaged and was installed in under an hour.",
        author: "Carlos M.",
        role: "Architect",
        initials: "CM",
      },
      {
        text: "The ergonomic chairs are amazing. I work from home and my back no longer bothers me. Totally recommended.",
        author: "Valeria R.",
        role: "UX Designer",
        initials: "VR",
      },
      {
        text: "I bought the executive desk for our office and we are delighted. Great value for money and the customer service is excellent.",
        author: "Roberto S.",
        role: "CFO",
        initials: "RS",
      },
    ],
    stats: [
      { number: "500+", label: "Clients" },
      { number: "5.0", label: "Google Rating" },
      { number: "15K", label: "IG Followers" },
      { number: "5", label: "Years in Panama" },
    ],
  },
}

type Localized = { es?: string; en?: string }
type SocialProofSanityData = {
  heading?: Localized
  headingAccent?: Localized
  subtitle?: Localized
  reviews?: Array<{ _key?: string; quote?: Localized; author?: string; role?: Localized }>
  stats?: Array<{ _key?: string; value?: string; label?: Localized }>
}

export default function SocialProof({
  lang,
  sanityData,
}: {
  lang: "es" | "en"
  sanityData?: SocialProofSanityData
}) {
  const defaults = CONTENT[lang]
  const heading = sanityData?.heading?.[lang] ?? defaults.heading
  const headingAccent = sanityData?.headingAccent?.[lang] ?? defaults.headingAccent
  const subtitle = sanityData?.subtitle?.[lang] ?? defaults.subtitle

  const reviews =
    sanityData?.reviews && sanityData.reviews.length > 0
      ? sanityData.reviews.map((r) => ({
          text: r.quote?.[lang] ?? "",
          author: r.author ?? "",
          role: r.role?.[lang] ?? "",
          initials: (r.author ?? "")
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        }))
      : defaults.reviews

  const stats =
    sanityData?.stats && sanityData.stats.length > 0
      ? sanityData.stats.map((s) => ({ number: s.value ?? "", label: s.label?.[lang] ?? "" }))
      : defaults.stats

  const c = { heading, headingAccent, subtitle, reviews, stats }

  return (
    <section className="bg-ergo-bg-warm py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10">
          <h2
            className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
          >
            {c.heading}{" "}
            <span style={{ color: "#2A8BBF" }}>{c.headingAccent}</span>
          </h2>
          <p className="text-[0.88rem] text-ergo-400 mt-2">{c.subtitle}</p>
        </div>

        {/* 3-column review cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {c.reviews.map((review, rIdx) => (
            <ScrollAnimate key={review.author} animation="fade-up" delay={rIdx * 150}>
            <div
              className="bg-white border border-ergo-200/60 p-6 flex flex-col gap-4"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              {/* Quote */}
              <p className="text-[0.84rem] text-ergo-600 leading-relaxed flex-1">
                &ldquo;{review.text}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ergo-100 flex items-center justify-center text-[0.72rem] font-bold text-ergo-600">
                  {review.initials}
                </div>
                <div>
                  <p className="text-[0.82rem] font-semibold text-ergo-950">{review.author}</p>
                  <p className="text-[0.72rem] text-ergo-400">{review.role}</p>
                </div>
                {/* Google badge */}
                <div className="ml-auto flex items-center gap-1 text-[0.65rem] text-ergo-400 border border-ergo-200/60 px-2 py-1">
                  <svg width="10" height="10" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </div>
              </div>
            </div>
            </ScrollAnimate>
          ))}
        </div>

        {/* Stats bar */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 bg-ergo-bg-warm">
          {c.stats.map(({ number, label }, i) => (
            <div
              key={label}
              className={`text-center py-7 px-5 ${i < c.stats.length - 1 ? "border-r border-ergo-200" : ""}`}
            >
              <p
                className="font-display font-bold text-ergo-950"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
              >
                <AnimatedCounter value={number} />
              </p>
              <p className="text-[0.68rem] uppercase tracking-[0.08em] mt-0.5 text-ergo-600">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
