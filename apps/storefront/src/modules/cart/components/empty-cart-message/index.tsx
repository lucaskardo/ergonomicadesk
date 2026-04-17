import { getLang } from "@lib/i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = async () => {
  const lang = await getLang()
  const isEn = lang === "en"

  return (
    <div
      className="py-24 sm:py-32 px-4 flex flex-col items-center justify-center text-center"
      data-testid="empty-cart-message"
    >
      <div className="w-16 h-16 rounded-full bg-ergo-100 flex items-center justify-center mb-6">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-ergo-600"
          aria-hidden="true"
        >
          <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
      </div>
      <h1 className="font-display text-h2 text-ergo-950 mb-3">
        {isEn ? "Your cart is empty" : "Tu carrito está vacío"}
      </h1>
      <p className="text-ergo-600 max-w-md mb-8 leading-relaxed">
        {isEn
          ? "Start with a standing desk, a chair that fits your workday, or an accessory that completes the setup. Free shipping + assembly in Panama City on orders over $99."
          : "Empieza con un standing desk, una silla que se ajuste a tu jornada, o un accesorio que complete tu setup. Envío gratis + ensamblaje en Ciudad de Panamá para pedidos > $99."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-ergo-sky-dark hover:bg-ergo-sky text-white font-semibold text-sm transition-colors duration-fast ease-out-soft"
        >
          {isEn ? "Browse products" : "Ver productos"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </LocalizedClientLink>
        <LocalizedClientLink
          href="/showroom"
          className="inline-flex items-center gap-2 px-7 py-3.5 border border-ergo-200 hover:border-ergo-950 text-ergo-800 font-semibold text-sm transition-colors duration-fast ease-out-soft"
        >
          {isEn ? "Visit the showroom" : "Visitar showroom"}
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
