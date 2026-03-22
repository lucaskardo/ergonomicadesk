import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getLang } from "@lib/i18n"
import { StoreRegion } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import SearchButton from "@modules/layout/components/search-button"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import Logo from "@modules/common/components/logo"

const NAV_CATEGORIES = [
  { handle: "standing-desks", es: "Standing Desks", en: "Standing Desks" },
  { handle: "office", es: "Oficina", en: "Office" },
  { handle: "chairs", es: "Sillas", en: "Chairs" },
  { handle: "storage", es: "Almacenamiento", en: "Storage" },
  { handle: "accessories", es: "Accesorios", en: "Accessories" },
]

export default async function Nav() {
  let regions: StoreRegion[] = []
  let locales: Locale[] | null = null
  let currentLocale: string | null = null
  let lang: "es" | "en" = "es"

  try {
    const results = await Promise.all([
      listRegions().then((r: StoreRegion[]) => r),
      listLocales(),
      getLocale(),
      getLang(),
    ])
    regions = results[0] ?? []
    locales = results[1]
    currentLocale = results[2]
    lang = results[3]
  } catch (err) {
    console.error("Nav data fetch failed:", err instanceof Error ? err.message : err)
  }

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <AnnouncementBar />
      <header
        className="relative border-b border-ergo-200/60"
        style={{
          background: "rgba(248,250,251,0.88)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <nav className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16">

          {/* Left: Burger (mobile) + Logo + Desktop links */}
          <div className="flex items-center gap-x-3 h-full">
            {/* Mobile burger */}
            <div className="large:hidden h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>

            {/* Logo */}
            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2.5 text-ergo-950 hover:text-ergo-800 transition-colors"
              data-testid="nav-store-link"
            >
              <Logo size={28} />
              <span className="font-display font-extrabold text-[0.95rem] uppercase tracking-[0.06em] text-ergo-950">
                Ergonómica
              </span>
            </LocalizedClientLink>

            {/* Desktop category links — centered */}
            <div className="hidden large:flex items-center gap-x-8 h-full ml-8">
              {NAV_CATEGORIES.map((cat) => (
                <LocalizedClientLink
                  key={cat.handle}
                  href={`/categories/${cat.handle}`}
                  className="relative text-[0.82rem] font-medium text-ergo-400 hover:text-ergo-950 transition-colors whitespace-nowrap group"
                >
                  {lang === "en" ? cat.en : cat.es}
                  <span className="absolute -bottom-[1px] left-0 w-0 h-[1.5px] bg-ergo-sky group-hover:w-full transition-all duration-300" />
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                href="/store"
                className="relative text-[0.82rem] font-medium text-ergo-400 hover:text-ergo-950 transition-colors whitespace-nowrap group"
              >
                {lang === "en" ? "Collections" : "Colecciones"}
                <span className="absolute -bottom-[1px] left-0 w-0 h-[1.5px] bg-ergo-sky group-hover:w-full transition-all duration-300" />
              </LocalizedClientLink>
            </div>
          </div>

          {/* Right: Search + Language + Cart */}
          <div className="flex items-center gap-x-1 h-full">
            <SearchButton />
            <div className="hidden small:flex items-center h-full">
              <LanguageSwitcher />
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center justify-center w-9 h-9 text-ergo-600 hover:bg-ergo-bg-warm transition-colors"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
