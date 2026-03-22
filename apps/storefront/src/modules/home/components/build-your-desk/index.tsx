import Link from "next/link"

const ZapIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const VolumeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
)

const DumbbellIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 5v14M18 5v14" />
    <rect x="2" y="8" width="4" height="8" rx="1" />
    <rect x="18" y="8" width="4" height="8" rx="1" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
)

export default function BuildYourDesk({
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
          pretitle: "Standing Desks",
          title: "Build Your Ideal\nStanding Desk",
          description:
            "Choose from 8 motorized frames and over 60 combinations of melamine and natural wood tops. Touch screen with 3 presets, anti-collision technology and up to 5 years warranty.",
          features: [
            { Icon: ZapIcon, label: "Speed up to 38mm/s" },
            { Icon: VolumeOffIcon, label: "Ultra-quiet <48dB" },
            { Icon: DumbbellIcon, label: "Up to 200kg capacity" },
          ],
          cta: "View Frames & Tops",
          placeholder: "Standing desk photo",
        }
      : {
          pretitle: "Standing Desks",
          title: "Arma Tu Escritorio\nde Pie Ideal",
          description:
            "Escoge entre 8 bases motorizadas y más de 60 combinaciones de sobres de melamina y madera natural. Pantalla táctil con 3 memorias, tecnología anticolisión y hasta 5 años de garantía.",
          features: [
            { Icon: ZapIcon, label: "Velocidad hasta 38mm/s" },
            { Icon: VolumeOffIcon, label: "Ultra silencioso <48dB" },
            { Icon: DumbbellIcon, label: "Hasta 200kg de capacidad" },
          ],
          cta: "Ver Bases y Sobres",
          placeholder: "Foto de standing desk",
        }

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          {/* Text */}
          <div className="flex-1">
            <p className="text-sm uppercase tracking-widest text-teal-600 font-semibold">
              {content.pretitle}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 leading-tight whitespace-pre-line">
              {content.title}
            </h2>

            {/* 3-step visual flow */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="4" y="10" width="16" height="4" rx="1" />
                    <path d="M8 14v6M16 14v6" />
                  </svg>
                </span>
                <span className="text-gray-700">
                  {lang === "en" ? "1. Choose frame" : "1. Elige base"}
                </span>
              </div>
              <span className="text-gray-300">→</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="8" width="20" height="4" rx="1" />
                  </svg>
                </span>
                <span className="text-gray-700">
                  {lang === "en" ? "2. Choose top" : "2. Elige sobre"}
                </span>
              </div>
              <span className="text-gray-300">→</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-600">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                  </svg>
                </span>
                <span className="text-gray-700">
                  {lang === "en" ? "3. We assemble" : "3. Lo armamos"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed max-w-lg">
              {content.description}
            </p>
            <ul className="mt-6 space-y-3">
              {content.features.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-teal-600">
                    <Icon />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <Link
              href={`${base}/categories/standing-desks`}
              className="mt-8 inline-flex items-center px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {content.cta}
            </Link>
          </div>

          {/* Image placeholder */}
          <div className="flex-1 w-full">
            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">{content.placeholder}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
