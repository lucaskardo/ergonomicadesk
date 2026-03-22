import Link from "next/link"

export default function Hero({
  lang,
  countryCode,
}: {
  lang: "es" | "en"
  countryCode: string
}) {
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`

  const content =
    lang === "en"
      ? {
          pretitle: "Home Office Next Level",
          title: "Standing Desks & Ergonomic\nChairs in Panama",
          subtitle:
            "Free delivery, professional assembly included and up to 5 year warranty. Visit our showroom in Coco del Mar.",
          cta_primary: "Browse Products",
        }
      : {
          pretitle: "Home Office a Otro Nivel",
          title: "Escritorios Elevables y Sillas\nErgonómicas en Panamá",
          subtitle:
            "Envío gratis, ensamblaje profesional incluido y hasta 5 años de garantía. Visítanos en nuestro showroom en Coco del Mar.",
          cta_primary: "Explorar Productos",
        }

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Text — 60% */}
          <div className="flex-1 md:w-3/5">
            <span className="inline-flex items-center rounded-full bg-teal-50 text-teal-700 px-3 py-1 text-xs font-medium mb-3">
              🇵🇦 {lang === "en" ? "#1 in Panama" : "#1 en Panamá"}
            </span>
            <p className="text-sm uppercase tracking-widest text-teal-600 font-semibold">
              {content.pretitle}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight whitespace-pre-line">
              {content.title}
            </h1>
            <p className="mt-5 text-lg text-gray-600 max-w-lg leading-relaxed">
              {content.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href={`${base}/store`}
                className="inline-flex justify-center items-center px-10 py-4 text-base bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
              >
                {content.cta_primary}
              </Link>
              <a
                href="https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center px-8 py-3 border-2 border-gray-300 hover:border-teal-600 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                {lang === "en" ? "Visit Showroom" : "Visitar Showroom"}
              </a>
            </div>
          </div>

          {/* Hero image placeholder — 40% */}
          <div className="w-full md:w-2/5">
            <div className="aspect-[4/3] bg-gradient-to-br from-teal-50 via-gray-50 to-white rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <p className="text-gray-400 text-sm">{lang === "en" ? "Hero image coming soon" : "Imagen principal próximamente"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
