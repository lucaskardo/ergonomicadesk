import Link from "next/link"

const categories = [
  {
    title: "Sillas Ergonómicas",
    description:
      "Soporte lumbar ajustable, apoyabrazos 4D y asiento adaptable para jornadas largas.",
    href: "/productos?cat=sillas",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 12h14M12 5v14M5 19h14"
        />
      </svg>
    ),
  },
  {
    title: "Escritorios de Pie",
    description:
      "Cambia de posición en segundos. Cuida tu espalda y aumenta tu productividad.",
    href: "/productos?cat=escritorios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <rect x="2" y="14" width="20" height="3" rx="1" />
        <path
          strokeLinecap="round"
          d="M7 17v3M17 17v3M5 14V7a1 1 0 011-1h12a1 1 0 011 1v7"
        />
      </svg>
    ),
  },
  {
    title: "Accesorios",
    description:
      "Soportes de monitor, teclados, reposamuñecas y todo para tu setup ideal.",
    href: "/productos?cat=accesorios",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path strokeLinecap="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
              Tu oficina merece mejor ergonomía
            </h1>
            <p className="mt-5 text-base md:text-lg text-stone-300 leading-relaxed">
              Muebles y accesorios diseñados para que trabajar muchas horas no
              te pase factura. Entregas en todo Panamá.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center rounded-lg bg-white text-stone-900 px-6 py-3 text-sm font-semibold hover:bg-stone-100 transition-colors"
              >
                Ver catálogo
              </Link>
              <Link
                href="/guias"
                className="inline-flex items-center justify-center rounded-lg border border-stone-600 text-white px-6 py-3 text-sm font-medium hover:border-stone-400 transition-colors"
              >
                Guías ergonómicas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-xl font-semibold text-stone-900 mb-8">
            Explora por categoría
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex flex-col gap-4 rounded-xl border border-stone-200 bg-white p-6 hover:border-stone-400 hover:shadow-sm transition-all"
              >
                <span className="text-stone-600 group-hover:text-stone-900 transition-colors">
                  {cat.icon}
                </span>
                <div>
                  <h3 className="font-semibold text-stone-900">{cat.title}</h3>
                  <p className="mt-1.5 text-sm text-stone-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
