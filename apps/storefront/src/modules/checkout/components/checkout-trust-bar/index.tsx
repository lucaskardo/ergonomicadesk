const items = {
  es: [
    { icon: "🔒", text: "Pago seguro con cifrado 256-bit" },
    { icon: "🛡️", text: "Garantía 1–5 años" },
    { icon: "🚚", text: "Envío y armado gratis" },
    { icon: "↩️", text: "Devolución en 7 días" },
  ],
  en: [
    { icon: "🔒", text: "256-bit secure payment" },
    { icon: "🛡️", text: "1–5 year warranty" },
    { icon: "🚚", text: "Free delivery + assembly" },
    { icon: "↩️", text: "7-day returns" },
  ],
}

export default function CheckoutTrustBar({ lang = "es" }: { lang?: "es" | "en" }) {
  return (
    <div className="w-full border-b border-ui-border-base bg-ui-bg-subtle">
      <div className="content-container flex flex-wrap justify-center gap-x-6 gap-y-2 py-3">
        {items[lang].map((item) => (
          <div key={item.text} className="flex items-center gap-1.5 text-xs text-ui-fg-subtle whitespace-nowrap">
            <span>{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
