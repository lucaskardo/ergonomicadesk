"use client"

import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { Fragment, useState } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LanguageSwitcher from "../language-switcher"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { useLang } from "@lib/i18n/context"
import { categoryPath } from "@lib/util/routes"

type SanityNavLink = { _key?: string; labelEs?: string; labelEn?: string; handle?: string }

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
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
  const lang = useLang()

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  const mainLinks = [
    { label: lang === "en" ? "Home" : "Inicio", href: "/" },
    { label: lang === "en" ? "Store" : "Tienda", href: "/store" },
    { label: lang === "en" ? "Cart" : "Carrito", href: "/cart" },
  ]

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

  return (
    <div className="h-full flex items-center">
      {/* Hamburger trigger */}
      <button
        data-testid="nav-menu-button"
        onClick={open}
        className="h-full flex items-center px-1 transition-colors hover:text-ui-fg-base focus:outline-none"
        aria-label={lang === "en" ? "Open menu" : "Abrir menú"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Slide-in drawer */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={close} className="relative z-[100]">
          {/* Backdrop */}
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

          {/* Panel slides in from left */}
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
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-gray-950 text-white flex flex-col shadow-xl"
              data-testid="nav-menu-popup"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <span className="text-sm font-medium text-white/60 uppercase tracking-widest">
                  {lang === "en" ? "Menu" : "Menú"}
                </span>
                <button
                  onClick={close}
                  data-testid="close-menu-button"
                  aria-label="Close menu"
                  className="p-1 rounded hover:bg-white/10 transition-colors"
                >
                  <XMark className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 overflow-y-auto px-6 py-8">
                {/* Main links */}
                <ul className="flex flex-col gap-1 mb-8">
                  {mainLinks.map(({ label, href }) => (
                    <li key={href}>
                      <LocalizedClientLink
                        href={href}
                        className="flex items-center py-2 text-2xl font-medium text-white hover:text-teal-400 transition-colors"
                        onClick={close}
                      >
                        {label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="border-t border-white/10 mb-6" />

                {/* Category links */}
                <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-3">
                  {lang === "en" ? "Categories" : "Categorías"}
                </p>
                <ul className="flex flex-col gap-1">
                  {categoryLinks.map(({ label, href }) => (
                    <li key={href}>
                      <LocalizedClientLink
                        href={href}
                        className="flex items-center py-2 text-base text-white/80 hover:text-teal-400 transition-colors"
                        onClick={close}
                      >
                        {label}
                      </LocalizedClientLink>
                    </li>
                  ))}
                  <li>
                    <LocalizedClientLink
                      href="/store"
                      className="flex items-center py-2 text-base text-white/80 hover:text-teal-400 transition-colors"
                      onClick={close}
                    >
                      {lang === "en" ? "All Collections" : "Todas las Colecciones"}
                    </LocalizedClientLink>
                  </li>
                </ul>
              </nav>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-white/10 flex flex-col gap-4">
                <LanguageSwitcher />
                <p className="text-xs text-white/30">
                  © 2026 Ergonómica. Panamá.
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
