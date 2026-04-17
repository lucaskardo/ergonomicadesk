import { Metadata } from "next"
import Link from "next/link"
import { headers } from "next/headers"

export const metadata: Metadata = {
  title: "404",
  description: "Page not found",
  robots: { index: false },
}

export default async function NotFound() {
  const headersList = await headers()
  const lang = headersList.get("x-lang") === "en" ? "en" : "es"
  const isEn = lang === "en"

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <p className="text-caption uppercase tracking-[0.14em] text-ergo-sky mb-4">
        {isEn ? "Error 404" : "Error 404"}
      </p>
      <h1 className="font-display text-h1 text-ergo-950 mb-4">
        {isEn ? "This page doesn't exist" : "Esta página no existe"}
      </h1>
      <p className="text-ergo-600 max-w-md mb-8 leading-relaxed">
        {isEn
          ? "The link may be broken or the page may have moved. Head back home, or keep browsing the store."
          : "El enlace puede estar roto o la página movida. Volvé al inicio o seguí explorando la tienda."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/pa"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-ergo-sky-dark hover:bg-ergo-sky text-white font-semibold text-sm transition-colors duration-fast ease-out-soft"
        >
          {isEn ? "Go home" : "Ir al inicio"}
        </Link>
        <Link
          href="/pa/store"
          className="inline-flex items-center gap-2 px-7 py-3.5 border border-ergo-200 hover:border-ergo-950 text-ergo-800 font-semibold text-sm transition-colors duration-fast ease-out-soft"
        >
          {isEn ? "Browse store" : "Ver tienda"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
