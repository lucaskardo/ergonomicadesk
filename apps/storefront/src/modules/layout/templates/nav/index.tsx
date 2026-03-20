import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getLang } from "@lib/i18n"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import SearchButton from "@modules/layout/components/search-button"
import AnnouncementBar from "@modules/layout/components/announcement-bar"

// Category nav links (bilingual)
const NAV_CATEGORIES = [
  { handle: "standing-desks", es: "Standing Desks", en: "Standing Desks" },
  { handle: "office", es: "Oficina", en: "Office" },
  { handle: "chairs", es: "Sillas", en: "Chairs" },
  { handle: "storage", es: "Almacenamiento", en: "Storage" },
  { handle: "accessories", es: "Accesorios", en: "Accessories" },
]

export default async function Nav() {
  const [regions, locales, currentLocale, lang] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
    getLang(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <AnnouncementBar />
      <header className="relative mx-auto border-b duration-200 bg-white border-ui-border-base">
        {/* Main nav row */}
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-16 text-small-regular">
          {/* Left: hamburger (mobile) + category links (desktop) */}
          <div className="flex items-center gap-x-6 h-full">
            <div className="h-full">
              <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
            </div>
            {/* Desktop category links */}
            <div className="hidden large:flex items-center gap-x-4 h-full">
              {NAV_CATEGORIES.map((cat) => (
                <LocalizedClientLink
                  key={cat.handle}
                  href={`/categories/${cat.handle}`}
                  className="hover:text-ui-fg-base transition-colors whitespace-nowrap text-xs font-medium"
                >
                  {lang === "en" ? cat.en : cat.es}
                </LocalizedClientLink>
              ))}
              <LocalizedClientLink
                href="/store"
                className="hover:text-ui-fg-base transition-colors whitespace-nowrap text-xs font-medium"
              >
                {lang === "en" ? "Collections" : "Colecciones"}
              </LocalizedClientLink>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center h-full">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base tracking-tight font-semibold"
              data-testid="nav-store-link"
            >
              Ergonómica
            </LocalizedClientLink>
          </div>

          {/* Right: Search + Language + Cart */}
          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <SearchButton />
            <div className="hidden small:flex items-center gap-x-4 h-full">
              <LanguageSwitcher />
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Carrito (0)
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
