"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useLang } from "@lib/i18n/context"

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const lang = useLang()

  // LanguageSwitcher toggles between /pa/[rest] ↔ /pa/en/[rest] by parsing
  // the current pathname. This is intentional: the route manifest builds paths
  // to specific pages, while the switcher preserves the user's current page
  // and only swaps the language prefix. A route manifest helper for this
  // would need to parse the pathname anyway, so direct parsing is simpler.
  //
  // pathname example: /pa/store or /pa/en/store
  // Parse: /[countryCode]/[en/]?[rest]
  const parts = pathname.split("/")
  // parts[0] = "", parts[1] = countryCode, parts[2] = "en" or first page segment
  const countryCode = parts[1] || "pa"

  let esPath: string
  let enPath: string

  if (lang === "en") {
    // Currently on English: /pa/en/store → ES is /pa/store
    const restParts = parts.slice(3) // after countryCode + "en"
    esPath = `/${countryCode}${restParts.length ? "/" + restParts.join("/") : ""}`
    enPath = pathname
  } else {
    // Currently on Spanish: /pa/store → EN is /pa/en/store
    const restParts = parts.slice(2) // after countryCode
    esPath = pathname
    enPath = `/${countryCode}/en${restParts.length ? "/" + restParts.join("/") : ""}`
  }

  return (
    <div className="flex items-center gap-x-1 text-sm">
      <Link
        href={esPath}
        className={
          lang === "es"
            ? "text-ui-fg-base font-semibold"
            : "text-ui-fg-subtle hover:text-ui-fg-base"
        }
      >
        ES
      </Link>
      <span className="text-ui-fg-muted">|</span>
      <Link
        href={enPath}
        className={
          lang === "en"
            ? "text-ui-fg-base font-semibold"
            : "text-ui-fg-subtle hover:text-ui-fg-base"
        }
      >
        EN
      </Link>
    </div>
  )
}
