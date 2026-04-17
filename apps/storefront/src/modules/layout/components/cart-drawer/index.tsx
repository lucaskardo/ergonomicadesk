"use client"

import { Dialog, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useLang } from "@lib/i18n/context"
import { getTranslations } from "@lib/i18n"
import { Fragment, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { trackViewCart } from "@lib/tracking"
import { productPath } from "@lib/util/routes"

type CartDrawerProps = {
  cart?: HttpTypes.StoreCart | null
}

const CartDrawer = ({ cart: cartState }: CartDrawerProps) => {
  const lang = useLang()
  const t = getTranslations(lang)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  // Open drawer immediately when product-actions fires ergo:cart:added
  useEffect(() => {
    if (pathname.includes("/cart")) return
    const handler = () => {
      setIsOpen(true)
      if (cartState) trackViewCart(cartState)
      const timer = setTimeout(() => setIsOpen(false), 5000)
      return () => clearTimeout(timer)
    }
    window.addEventListener("ergo:cart:added", handler)
    return () => window.removeEventListener("ergo:cart:added", handler)
  }, [pathname, cartState])

  // Also sync when cart prop updates (catches qty changes and deletes)
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      itemRef.current = totalItems
    } else {
      itemRef.current = totalItems
    }
  }, [totalItems, pathname])

  const open = () => {
    setIsOpen(true)
    if (cartState) trackViewCart(cartState)
  }
  const close = () => setIsOpen(false)

  return (
    <>
      {/* Cart trigger button */}
      <button
        onClick={open}
        className="hover:text-ui-fg-base flex items-center gap-1 relative"
        data-testid="nav-cart-link"
        aria-label={t.nav.cart}
      >
        <span>{t.nav.cart}</span>
        <span className="font-medium">({totalItems})</span>
      </button>

      {/* Drawer */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={close} className="relative z-[100]">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-fast"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-fast"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm"
              aria-hidden="true"
            />
          </Transition.Child>

          {/* Slide-in panel */}
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-spring duration-base"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-soft duration-fast"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-elevated flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ergo-100">
                <Dialog.Title className="text-lg font-semibold text-ui-fg-base">
                  {t.nav.cart}
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-normal text-ui-fg-subtle">
                      ({totalItems})
                    </span>
                  )}
                </Dialog.Title>
                <button
                  onClick={close}
                  className="p-1.5 rounded-base hover:bg-ergo-100 text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
                  aria-label="Close cart"
                >
                  <XMark className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              {cartState && cartState.items?.length ? (
                <>
                  {/* Items list */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 no-scrollbar">
                    {cartState.items
                      .sort((a, b) =>
                        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 pb-5 border-b border-ergo-100 last:border-0"
                          data-testid="cart-item"
                        >
                          {/* Thumbnail */}
                          <LocalizedClientLink
                            href={productPath(item.product_handle || "")}
                            onClick={close}
                            className="shrink-0"
                          >
                            <div className="w-20 h-24 rounded-lg overflow-hidden bg-ui-bg-subtle">
                              <Thumbnail
                                thumbnail={item.thumbnail}
                                images={item.variant?.product?.images}
                                size="square"
                              />
                            </div>
                          </LocalizedClientLink>

                          {/* Details */}
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex flex-col min-w-0">
                                <LocalizedClientLink
                                  href={productPath(item.product_handle || "")}
                                  onClick={close}
                                  className="text-sm font-medium text-ui-fg-base hover:text-ergo-sky-dark transition-colors line-clamp-2"
                                  data-testid="product-link"
                                >
                                  {item.product_title || item.title}
                                </LocalizedClientLink>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                />
                                {/* Bundle discount: show original price strikethrough + discount */}
                                {(item.metadata as any)?.bundle_discount_pct && (
                                  <div className="mt-1">
                                    <span className="text-xs text-ui-fg-muted line-through">
                                      {convertToLocale({
                                        amount: (item.metadata as any).original_price_cents ?? 0,
                                        currency_code: cartState.currency_code,
                                      })}
                                    </span>
                                    <span className="text-xs text-ergo-success font-medium ml-1.5">
                                      {(item.metadata as any).bundle_discount_pct}% desc.{" "}
                                      {convertToLocale({
                                        amount: item.subtotal ?? 0,
                                        currency_code: cartState.currency_code,
                                      })}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span
                                className="text-xs text-ui-fg-subtle"
                                data-testid="cart-item-quantity"
                              >
                                {t.cart.quantity}: {item.quantity}
                              </span>
                              <DeleteButton
                                id={item.id}
                                item={item}
                                currencyCode={cartState.currency_code}
                                className="text-xs text-ergo-400 hover:text-red-500 transition-colors"
                                data-testid="cart-item-remove-button"
                              >
                                {t.cart.remove}
                              </DeleteButton>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Footer with totals + CTA */}
                  <div className="border-t border-ergo-100 px-6 py-5 space-y-4 bg-ergo-bg">
                    {/* Free shipping nudge */}
                    {subtotal < 10000 && (
                      <div className="text-xs text-ui-fg-subtle bg-ergo-sky-50 border border-ergo-sky-light rounded-lg px-3 py-2">
                        {lang === "es" ? (
                          <>
                            Agrega{" "}
                            <span className="font-semibold text-ergo-sky-dark">
                              {convertToLocale({
                                amount: 10000 - subtotal,
                                currency_code: cartState.currency_code,
                              })}
                            </span>{" "}
                            más para envío gratis en Ciudad de Panamá
                          </>
                        ) : (
                          <>
                            Add{" "}
                            <span className="font-semibold text-ergo-sky-dark">
                              {convertToLocale({
                                amount: 10000 - subtotal,
                                currency_code: cartState.currency_code,
                              })}
                            </span>{" "}
                            more for free delivery in Panama City
                          </>
                        )}
                      </div>
                    )}
                    {subtotal >= 10000 && (
                      <div className="text-xs text-ergo-sky-dark bg-ergo-sky-50 border border-ergo-sky-light rounded-lg px-3 py-2 font-medium">
                        {lang === "es"
                          ? "¡Envío gratis en Ciudad de Panamá!"
                          : "Free delivery in Panama City!"}
                      </div>
                    )}

                    {/* Subtotal */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-ui-fg-subtle">
                        {t.cart.subtotal_excl_taxes}
                      </span>
                      <span
                        className="text-sm font-semibold text-ui-fg-base"
                        data-testid="cart-subtotal"
                        data-value={subtotal}
                      >
                        {convertToLocale({
                          amount: subtotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>

                    {/* CTA buttons */}
                    <div className="flex flex-col gap-2">
                      <LocalizedClientLink
                        href="/cart"
                        onClick={close}
                        prefetch={true}
                        className="w-full py-3 px-4 bg-ergo-sky-dark hover:bg-ergo-sky text-white text-sm font-semibold rounded-lg text-center transition-colors"
                        data-testid="go-to-cart-button"
                      >
                        {t.cart.go_to_cart}
                      </LocalizedClientLink>
                      <button
                        onClick={close}
                        className="w-full py-2.5 px-4 border border-ergo-200 hover:border-ergo-300 text-ui-fg-base text-sm rounded-lg text-center transition-colors"
                      >
                        {lang === "es"
                          ? "Seguir comprando"
                          : "Continue shopping"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-ergo-100 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-8 h-8 text-ergo-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-base font-medium text-ui-fg-base mb-1">
                      {t.cart.empty}
                    </p>
                    <p className="text-sm text-ui-fg-subtle">
                      {lang === "es"
                        ? "Explora nuestros productos y encuentra tu escritorio ideal."
                        : "Explore our products and find your ideal desk setup."}
                    </p>
                  </div>
                  <LocalizedClientLink
                    href="/store"
                    onClick={close}
                    className="mt-2 py-2.5 px-6 bg-ergo-sky-dark hover:bg-ergo-sky text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    {t.store.all_products}
                  </LocalizedClientLink>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default CartDrawer
