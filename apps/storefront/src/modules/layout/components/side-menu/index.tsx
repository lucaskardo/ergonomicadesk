"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import LanguageSwitcher from "../language-switcher"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { useLang } from "@lib/i18n/context"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const CATEGORY_LINKS = [
  { handle: "standing-desks", es: "Standing Desks", en: "Standing Desks" },
  { handle: "office", es: "Oficina", en: "Office" },
  { handle: "chairs", es: "Sillas", en: "Chairs" },
  { handle: "storage", es: "Almacenamiento", en: "Storage" },
  { handle: "accessories", es: "Accesorios", en: "Accessories" },
]

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()
  const lang = useLang()

  const mainLinks = [
    { label: lang === "en" ? "Home" : "Inicio", href: "/" },
    { label: lang === "en" ? "Store" : "Tienda", href: "/store" },
    { label: lang === "en" ? "Cart" : "Carrito", href: "/cart" },
  ]

  const categoryLinks = CATEGORY_LINKS.map((c) => ({
    label: lang === "en" ? c.en : c.es,
    href: `/categories/${c.handle}`,
  }))

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none hover:text-ui-fg-base"
                >
                  {lang === "en" ? "Menu" : "Menú"}
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/0 pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100 backdrop-blur-2xl"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 backdrop-blur-2xl"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm text-ui-fg-on-color m-2 backdrop-blur-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full bg-[rgba(3,7,18,0.5)] rounded-rounded justify-between p-6 overflow-y-auto"
                  >
                    <div className="flex justify-end" id="xmark">
                      <button data-testid="close-menu-button" onClick={close}>
                        <XMark />
                      </button>
                    </div>

                    <ul className="flex flex-col gap-4 items-start justify-start mt-4">
                      {/* Main links */}
                      {mainLinks.map(({ label, href }) => (
                        <li key={href}>
                          <LocalizedClientLink
                            href={href}
                            className="text-3xl leading-10 hover:text-ui-fg-disabled"
                            onClick={close}
                          >
                            {label}
                          </LocalizedClientLink>
                        </li>
                      ))}

                      {/* Divider */}
                      <li className="w-full border-t border-white/20 my-1" />

                      {/* Category links */}
                      {categoryLinks.map(({ label, href }) => (
                        <li key={href}>
                          <LocalizedClientLink
                            href={href}
                            className="text-xl leading-8 hover:text-ui-fg-disabled"
                            onClick={close}
                          >
                            {label}
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-y-6 mt-8">
                      <div className="flex justify-between items-center">
                        <LanguageSwitcher />
                      </div>
                      {!!locales?.length && (
                        <div
                          className="flex justify-between"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="flex justify-between txt-compact-small">
                        © 2026 Ergonómica. Panamá.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
