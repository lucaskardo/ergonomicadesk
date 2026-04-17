import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getLang } from "@lib/i18n"
import { categoryPath } from "@lib/util/routes"
import { StoreRegion } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import SearchButton from "@modules/layout/components/search-button"
import AnnouncementBar from "@modules/layout/components/announcement-bar"
import Logo from "@modules/common/components/logo"
import { sanityFetch } from "@/sanity/lib/live"
import { ANNOUNCEMENT_BAR_QUERY, HEADER_NAV_QUERY } from "@/sanity/lib/queries"

type NavCategoryItem = { _key?: string; handle?: string; labelEs?: string; labelEn?: string }

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

  const [announcementResult, headerNavResult] = await Promise.all([
    sanityFetch({ query: ANNOUNCEMENT_BAR_QUERY }).catch(() => ({ data: null })),
    sanityFetch({ query: HEADER_NAV_QUERY }).catch(() => ({ data: null })),
  ])

  const announcementData = announcementResult?.data ?? undefined
  const headerNavLinks = headerNavResult?.data?.links ?? undefined

  const navCategories: NavCategoryItem[] =
    headerNavLinks && (headerNavLinks as NavCategoryItem[]).length > 0
      ? (headerNavLinks as NavCategoryItem[])
      : NAV_CATEGORIES.map((c) => ({ _key: c.handle, labelEs: c.es, labelEn: c.en, handle: c.handle }))

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <AnnouncementBar sanityData={announcementData} />
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
            {/* Mobile burger — visible below 1024px */}
            <div className="lg:hidden h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                sanityNavLinks={headerNavLinks}
              />
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

            {/* Desktop nav — 4 items + CTA, visible from 1024px */}
            <div className="hidden lg:flex items-center gap-x-1 h-full ml-8">
              {/* Productos with hover dropdown */}
              <div className="relative h-full flex items-center group">
                <button
                  className="flex items-center gap-1 px-4 h-full text-[0.85rem] font-medium text-ergo-700 hover:text-ergo-950 transition-colors"
                  aria-haspopup="true"
                  data-testid="nav-productos-button"
                >
                  {lang === "en" ? "Products" : "Productos"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                <div
                  className="absolute top-full left-0 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition duration-fast bg-white shadow-2xl border border-ergo-100 min-w-[260px] py-3 z-50"
                  data-testid="nav-productos-dropdown"
                >
                  {navCategories.map((cat) => (
                    <LocalizedClientLink
                      key={cat.handle ?? cat._key}
                      href={cat.handle ? categoryPath(cat.handle) : "#"}
                      className="flex items-center px-5 py-2.5 text-[0.88rem] text-ergo-700 hover:text-ergo-950 hover:bg-ergo-bg transition-colors min-h-[40px]"
                    >
                      {lang === "en" ? (cat.labelEn ?? cat.labelEs ?? "") : (cat.labelEs ?? "")}
                    </LocalizedClientLink>
                  ))}
                  <div className="border-t border-ergo-100 mt-2 pt-2">
                    <LocalizedClientLink
                      href="/store"
                      className="flex items-center px-5 py-2.5 text-[0.88rem] font-semibold text-ergo-sky-dark hover:text-ergo-sky transition-colors min-h-[40px]"
                    >
                      {lang === "en" ? "View all products →" : "Ver tienda completa →"}
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>

              <LocalizedClientLink
                href="/comercial"
                className="flex items-center px-4 h-full text-[0.85rem] font-medium text-ergo-700 hover:text-ergo-950 transition-colors"
                data-testid="nav-link-comercial"
              >
                {lang === "en" ? "Commercial" : "Comercial"}
              </LocalizedClientLink>

              <LocalizedClientLink
                href="/showroom"
                className="flex items-center px-4 h-full text-[0.85rem] font-medium text-ergo-700 hover:text-ergo-950 transition-colors"
                data-testid="nav-link-showroom"
              >
                Showroom
              </LocalizedClientLink>

              <a
                href={"https://wa.me/50769533776?text=" + encodeURIComponent(lang === "en" ? "Hi! I'd like to know more about Ergonómica." : "¡Hola! Me gustaría saber más sobre Ergonómica.")}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 inline-flex items-center gap-2 bg-ergo-sky-dark hover:bg-ergo-sky text-white font-semibold text-[0.82rem] px-5 py-2.5 transition-colors min-h-[40px]"
                data-testid="nav-cotizar-cta"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                {lang === "en" ? "Quote" : "Cotizar"}
              </a>
            </div>
          </div>

          {/* Right: Search + Language + Cart */}
          <div className="flex items-center gap-x-1 h-full">
            <SearchButton />
            <div className="hidden lg:flex items-center h-full">
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
