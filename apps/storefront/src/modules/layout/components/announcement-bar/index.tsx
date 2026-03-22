"use client"

import { useLang } from "@lib/i18n/context"

const AnnouncementBar = () => {
  const lang = useLang()
  const highlight =
    lang === "en" ? "Orders over $99" : "Pedidos mayores a $99"
  const prefix =
    lang === "en" ? "Free shipping in Panama City — " : "Envío gratis en Ciudad de Panamá — "
  const suffix =
    lang === "en" ? " get free delivery + assembly" : " tienen envío y ensamblaje gratuito"

  return (
    <div className="bg-ergo-950 text-ergo-300 text-center py-2.5 px-4 text-[0.72rem] font-medium tracking-wide">
      {prefix}
      <strong className="text-ergo-sky font-semibold">{highlight}</strong>
      {suffix}
    </div>
  )
}

export default AnnouncementBar
