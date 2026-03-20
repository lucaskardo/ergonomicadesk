import { getTranslations } from "@lib/i18n"
import { LangProvider } from "@lib/i18n/context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayoutEn({
  children,
}: {
  children: React.ReactNode
}) {
  const t = getTranslations("en")

  return (
    <LangProvider lang="en">
      <div className="w-full bg-white relative small:min-h-screen">
        <div className="h-16 bg-white border-b">
          <nav className="flex h-full items-center content-container justify-between">
            <LocalizedClientLink
              href="/en/cart"
              className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase flex-1 basis-0"
              data-testid="back-to-cart-link"
            >
              <ChevronDown className="rotate-90" size={16} />
              <span className="mt-px hidden small:block txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                {t.checkout.back_to_cart}
              </span>
              <span className="mt-px block small:hidden txt-compact-plus text-ui-fg-subtle hover:text-ui-fg-base">
                {t.checkout.back}
              </span>
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/en"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base font-semibold tracking-tight"
              data-testid="store-link"
            >
              Ergonómica
            </LocalizedClientLink>
            <div className="flex-1 basis-0" />
          </nav>
        </div>
        <div className="relative" data-testid="checkout-container">
          {children}
        </div>
      </div>
    </LangProvider>
  )
}
