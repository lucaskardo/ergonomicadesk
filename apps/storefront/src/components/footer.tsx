import Link from "next/link"

const columns = [
  {
    title: "Empresa",
    links: [
      { href: "/nosotros", label: "Sobre nosotros" },
      { href: "/contacto", label: "Contacto" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Tienda",
    links: [
      { href: "/productos", label: "Todos los productos" },
      { href: "/productos?cat=sillas", label: "Sillas Ergonómicas" },
      { href: "/productos?cat=escritorios", label: "Escritorios de Pie" },
      { href: "/productos?cat=accesorios", label: "Accesorios" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/envios", label: "Envíos y entregas" },
      { href: "/devoluciones", label: "Devoluciones" },
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { href: "/guias", label: "Guías ergonómicas" },
      { href: "/guias/configuracion-oficina", label: "Configurar tu oficina" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            © {new Date().getFullYear()} Ergonómica Desk. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-stone-500">Panamá · USD</p>
        </div>
      </div>
    </footer>
  )
}
