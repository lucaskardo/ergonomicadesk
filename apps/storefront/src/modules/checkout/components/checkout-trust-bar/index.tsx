const items = {
  es: [{ icon: "🔒", text: "Pago seguro SSL" }],
  en: [{ icon: "🔒", text: "Secure SSL payment" }],
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
