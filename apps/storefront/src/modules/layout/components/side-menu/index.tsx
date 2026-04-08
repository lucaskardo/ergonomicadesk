"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLang } from "@lib/i18n/context"
import LanguageSwitcher from "@modules/layout/components/language-switcher"
import { categoryPath } from "@lib/util/routes"
import type { StoreRegion } from "@medusajs/types"
import type { Locale } from "@lib/data/locales"

type SanityNavLink = {
  _key?: string
  handle?: string
  labelEs?: string
  labelEn?: string
}

type SideMenuProps = {
  regions: StoreRegion[]
  locales: Locale[] | null
  currentLocale: string | null
  sanityNavLinks?: SanityNavLink[]
}

const CATEGORY_LINKS = [
  { handle: "standing-desks", es: "Standing Desks", en: "Standing Desks" },
  { handle: "office", es: "Oficina", en: "Office" },
  { handle: "chairs", es: "Sillas", en: "Chairs" },
  { handle: "storage", es: "Almacenamiento", en: "Storage" },
  { handle: "accessories", es: "Accesorios", en: "Accessories" },
]

const SideMenu = ({ regions, locales, currentLocale, sanityNavLinks }: SideMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [productosExpanded, setProductosExpanded] = useState(false)
  const lang = useLang()

  const open = () => setIsOpen(true)
  const close = () => {
    setIsOpen(false)
    setProductosExpanded(false)
  }

  const categoryLinks =
    sanityNavLinks && sanityNavLinks.length > 0
      ? sanityNavLinks.map((l) => ({
          label: lang === "en" ? (l.labelEn ?? "") : (l.labelEs ?? ""),
          href: l.handle ? categoryPath(l.handle) : "#",
        }))
      : CATEGORY_LINKS.map((c) => ({
          label: lang === "en" ? c.en : c.es,
          href: categoryPath(c.handle),
        }))

  const whatsappUrl = "https://wa.me/50769533776?text=" + encodeURIComponent(
    lang === "en"
      ? "Hi! I'd like to know more about Ergonómica."
      : "¡Hola! Me gustaría saber más sobre Ergonómica."
  )

  return (
    <div className="h-full flex items-center">
      {/* Hamburger trigger */}
      <button
        data-testid="nav-menu-button"
        onClick={open}
        className="h-full flex items-center px-1 transition-colors hover:text-ergo-950 focus:outline-none min-w-[44px] min-h-[44px] justify-center"
        aria-label={lang === "en" ? "Open menu" : "Abrir menú"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={close} className="relative z-[100]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/40"
              aria-hidden="true"
              data-testid="side-menu-backdrop"
            />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel
              className="fixed left-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white text-ergo-950 flex flex-col shadow-2xl"
              data-testid="nav-menu-popup"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-ergo-100">
                <span className="text-[0.7rem] font-semibold text-ergo-400 uppercase tracking-[0.16em]">
                  {lang === "en" ? "Menu" : "Menú"}
                </span>
                <button
                  onClick={close}
                  data-testid="close-menu-button"
                  aria-label={lang === "en" ? "Close menu" : "Cerrar menú"}
                  className="p-2 hover:bg-ergo-bg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <XMark className="w-5 h-5 text-ergo-950" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 py-6">
                {/* Productos accordion */}
                <div className="mb-2">
                  <button
                    onClick={() => setProductosExpanded((v) => !v)}
                    className="w-full flex items-center justify-between py-3 text-[1.05rem] font-semibold text-ergo-950 hover:text-ergo-sky-dark transition-colors min-h-[48px]"
                    aria-expanded={productosExpanded}
                    data-testid="drawer-productos-toggle"
                  >
                    <span>{lang === "en" ? "Products" : "Productos"}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      className={`transition-transform duration-200 ${productosExpanded ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {productosExpanded && (
                    <ul className="flex flex-col pl-3 mt-1 mb-3 border-l-2 border-ergo-100">
                      {categoryLinks.map(({ label, href }) => (
                        <li key={href}>
                          <LocalizedClientLink
                            href={href}
                            onClick={close}
                            className="flex items-center py-2.5 pl-4 text-[0.92rem] text-ergo-700 hover:text-ergo-sky-dark transition-colors min-h-[44px]"
                          >
                            {label}
                          </LocalizedClientLink>
                        </li>
                      ))}
                      <li>
                        <LocalizedClientLink
                          href="/store"
                          onClick={close}
                          className="flex items-center py-2.5 pl-4 text-[0.92rem] font-semibold text-ergo-sky-dark hover:text-ergo-sky transition-colors min-h-[44px]"
                        >
                          {lang === "en" ? "View all products →" : "Ver tienda completa →"}
                        </LocalizedClientLink>
                      </li>
                    </ul>
                  )}
                </div>

                <LocalizedClientLink
                  href="/comercial"
                  onClick={close}
                  className="flex items-center py-3 text-[1.05rem] font-semibold text-ergo-950 hover:text-ergo-sky-dark transition-colors min-h-[48px]"
                  data-testid="drawer-link-comercial"
                >
                  {lang === "en" ? "Commercial" : "Comercial"}
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/showroom"
                  onClick={close}
                  className="flex items-center py-3 text-[1.05rem] font-semibold text-ergo-950 hover:text-ergo-sky-dark transition-colors min-h-[48px]"
                  data-testid="drawer-link-showroom"
                >
                  Showroom
                </LocalizedClientLink>

                <div className="border-t border-ergo-100 my-5" />

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center gap-2.5 w-full bg-ergo-sky-dark hover:bg-ergo-sky text-white font-semibold text-[0.95rem] py-4 transition-colors min-h-[56px]"
                  data-testid="drawer-whatsapp-cta"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                  {lang === "en" ? "Chat on WhatsApp" : "Cotizar por WhatsApp"}
                </a>

                <div className="border-t border-ergo-100 mt-6 pt-5">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <LocalizedClientLink
                        href="/blog"
                        onClick={close}
                        className="flex items-center py-2 text-[0.85rem] text-ergo-500 hover:text-ergo-950 transition-colors min-h-[40px]"
                      >
                        Blog
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/warranty"
                        onClick={close}
                        className="flex items-center py-2 text-[0.85rem] text-ergo-500 hover:text-ergo-950 transition-colors min-h-[40px]"
                      >
                        {lang === "en" ? "Warranty & returns" : "Garantía y devoluciones"}
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                        href="/showroom"
                        onClick={close}
                        className="flex items-center py-2 text-[0.85rem] text-ergo-500 hover:text-ergo-950 transition-colors min-h-[40px]"
                      >
                        {lang === "en" ? "About us" : "Sobre nosotros"}
                      </LocalizedClientLink>
                    </li>
                  </ul>
                </div>
              </nav>

              <div className="px-6 py-5 border-t border-ergo-100 flex items-center justify-between gap-4 bg-ergo-bg">
                <LanguageSwitcher />
                <p className="text-[0.7rem] text-ergo-400">
                  © 2026 Ergonómica
                </p>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  )
}

export default SideMenu
