"use client"

import { useState } from "react"

const CONTENT = {
  es: {
    heading: "Mantente al día con",
    headingAccent: "Ergonómica",
    subtitle: "Recibe lanzamientos, promociones exclusivas y tips de ergonomía directamente en tu correo.",
    placeholder: "tu@email.com",
    cta: "Suscribirse",
    success: "¡Gracias! Te avisaremos con lo mejor.",
    note: "Sin spam. Darte de baja cuando quieras.",
  },
  en: {
    heading: "Stay updated with",
    headingAccent: "Ergonómica",
    subtitle: "Receive launches, exclusive promotions and ergonomics tips directly in your inbox.",
    placeholder: "your@email.com",
    cta: "Subscribe",
    success: "Thanks! We'll keep you in the loop.",
    note: "No spam. Unsubscribe anytime.",
  },
}

type Localized = { es?: string; en?: string }
type NewsletterSanityData = {
  heading?: Localized
  headingAccent?: Localized
  subtitle?: Localized
  placeholder?: Localized
  buttonText?: Localized
}

export default function Newsletter({
  lang,
  sanityData,
}: {
  lang: "es" | "en"
  sanityData?: NewsletterSanityData
}) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const defaults = CONTENT[lang]
  const c = {
    heading: sanityData?.heading?.[lang] ?? defaults.heading,
    headingAccent: sanityData?.headingAccent?.[lang] ?? defaults.headingAccent,
    subtitle: sanityData?.subtitle?.[lang] ?? defaults.subtitle,
    placeholder: sanityData?.placeholder?.[lang] ?? defaults.placeholder,
    cta: sanityData?.buttonText?.[lang] ?? defaults.cta,
    success: defaults.success,
    note: defaults.note,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="bg-white border-t border-b border-ergo-200/60">
      <div className="max-w-[540px] mx-auto px-5 py-14 lg:py-16 flex flex-col items-center text-center">
        <h2
          className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)", letterSpacing: "-0.02em" }}
        >
          {c.heading}{" "}
          <span style={{ color: "#2A8BBF" }}>{c.headingAccent}</span>
        </h2>
        <p className="text-[0.88rem] text-ergo-400 mt-2">{c.subtitle}</p>

        {submitted ? (
          <p className="mt-8 font-semibold text-[0.9rem]" style={{ color: "#2A8BBF" }}>{c.success}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-5 flex w-full gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.placeholder}
              required
              className="flex-1 px-5 py-3.5 border border-ergo-200 text-ergo-950 text-[0.84rem] placeholder-ergo-300 focus:outline-none focus:border-ergo-sky transition-colors bg-ergo-bg"
            />
            <button
              type="submit"
              className="px-7 py-3.5 bg-ergo-sky-dark text-white font-semibold text-[0.84rem] hover:bg-ergo-sky transition-colors duration-300 flex-shrink-0"
            >
              {c.cta}
            </button>
          </form>
        )}

        <p className="mt-3 text-[0.72rem] text-ergo-400">{c.note}</p>
      </div>
    </section>
  )
}
