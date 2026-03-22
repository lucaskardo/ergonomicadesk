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

export default function Newsletter({ lang }: { lang: "es" | "en" }) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const c = CONTENT[lang]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) setSubmitted(true)
  }

  return (
    <section className="bg-ergo-950 py-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-center text-center">
        <h2
          className="font-display font-bold text-white leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(1.5rem, 2.4vw, 2rem)", letterSpacing: "-0.02em" }}
        >
          {c.heading}{" "}
          <span className="text-ergo-sky">{c.headingAccent}</span>
        </h2>
        <p className="text-[0.9rem] text-ergo-400 mt-3" style={{ maxWidth: 440 }}>
          {c.subtitle}
        </p>

        {submitted ? (
          <p className="mt-8 text-ergo-sky font-semibold text-[0.9rem]">{c.success}</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full"
            style={{ maxWidth: 540 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={c.placeholder}
              required
              className="flex-1 px-4 py-3.5 bg-white/5 border border-white/10 text-white text-[0.88rem] placeholder-ergo-400 focus:outline-none focus:border-ergo-sky transition-colors"
            />
            <button
              type="submit"
              className="px-7 py-3.5 bg-ergo-sky-dark text-white font-semibold text-[0.84rem] hover:bg-ergo-sky transition-colors duration-300 flex-shrink-0"
            >
              {c.cta}
            </button>
          </form>
        )}

        <p className="mt-3 text-[0.72rem] text-ergo-600">{c.note}</p>
      </div>
    </section>
  )
}
