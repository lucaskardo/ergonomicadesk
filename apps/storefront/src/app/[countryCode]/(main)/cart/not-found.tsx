import { Metadata } from "next"
import { getLang } from "@lib/i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Cart",
  description: "Cart",
  robots: { index: false },
}

export default async function CartNotFound() {
  const lang = await getLang()
  const isEn = lang === "en"

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
      <h1 className="font-display text-h1 text-ergo-950 mb-4">
        {isEn ? "Cart not found" : "Carrito no encontrado"}
      </h1>
      <p className="text-ergo-600 max-w-md mb-8 leading-relaxed">
        {isEn
          ? "We couldn't find that cart. Clear your cookies and start a fresh session, or head back to the store."
          : "No pudimos encontrar ese carrito. Borrá cookies para empezar una sesión nueva, o volvé a la tienda."}
      </p>
      <LocalizedClientLink
        href="/store"
        className="inline-flex items-center gap-2 px-7 py-3.5 bg-ergo-sky-dark hover:bg-ergo-sky text-white font-semibold text-sm transition-colors duration-fast ease-out-soft"
      >
        {isEn ? "Browse store" : "Ver tienda"}
      </LocalizedClientLink>
    </div>
  )
}
