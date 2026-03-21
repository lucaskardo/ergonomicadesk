"use client"

import { useLang } from "@lib/i18n/context"

export default function StoreHeading() {
  const lang = useLang()
  return (
    <h1 className="text-2xl font-semibold text-ui-fg-base mb-4">
      {lang === "en" ? "All Products" : "Todos los Productos"}
    </h1>
  )
}
