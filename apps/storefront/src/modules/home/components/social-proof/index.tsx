"use client"

import { useLang } from "@lib/i18n/context"

const SocialProof = () => {
  const lang = useLang()

  const stats =
    lang === "en"
      ? [
          { number: "15K+", label: "Instagram Followers" },
          { number: "500+", label: "Offices Outfitted" },
          { number: "5 Years", label: "In the Panamanian market" },
        ]
      : [
          { number: "15K+", label: "Seguidores en Instagram" },
          { number: "500+", label: "Oficinas Equipadas" },
          { number: "5 Años", label: "En el mercado panameño" },
        ]

  return (
    <section className="bg-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-3 divide-x divide-gray-200">
          {stats.map(({ number, label }) => (
            <div key={label} className="text-center px-4">
              <p className="text-3xl font-bold text-gray-900">{number}</p>
              <p className="mt-1 text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SocialProof
