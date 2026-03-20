"use client"

import { useLang } from "@lib/i18n/context"

const AnnouncementBar = () => {
  const lang = useLang()
  const message =
    lang === "en"
      ? "Free shipping on orders over $99 in Panama City"
      : "Envío gratis en pedidos mayores a $99 en Ciudad de Panamá"

  return (
    <div className="bg-teal-600 text-white text-sm text-center py-2 px-4">
      {message}
    </div>
  )
}

export default AnnouncementBar
