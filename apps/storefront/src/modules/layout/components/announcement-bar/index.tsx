"use client"

import { useLang } from "@lib/i18n/context"

type Localized = { es?: string; en?: string }
type AnnouncementBarSanityData = {
  visible?: boolean
  text?: {
    prefix?: Localized
    highlight?: Localized
    suffix?: Localized
  }
  link?: string
}

const AnnouncementBar = ({ sanityData }: { sanityData?: AnnouncementBarSanityData }) => {
  const lang = useLang()

  if (sanityData?.visible === false) return null

  const prefix = sanityData?.text?.prefix?.[lang] ??
    (lang === "en" ? "Free shipping in Panama City — " : "Envío gratis en Ciudad de Panamá — ")
  const highlight = sanityData?.text?.highlight?.[lang] ??
    (lang === "en" ? "Orders over $99" : "Pedidos mayores a $99")
  const suffix = sanityData?.text?.suffix?.[lang] ??
    (lang === "en" ? " get free delivery + assembly" : " tienen envío y ensamblaje gratuito")

  const inner = (
    <div className="bg-ergo-950 text-ergo-300 text-center py-2.5 px-4 text-[0.72rem] font-medium tracking-wide">
      {prefix}
      <strong className="text-ergo-sky font-semibold">{highlight}</strong>
      {suffix}
    </div>
  )

  return sanityData?.link ? (
    <a href={sanityData.link} className="block">{inner}</a>
  ) : inner
}

export default AnnouncementBar
