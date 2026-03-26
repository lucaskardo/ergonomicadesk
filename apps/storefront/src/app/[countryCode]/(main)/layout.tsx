import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { withTimeout } from "@lib/util/fetch-safe"
import { getLang } from "@lib/i18n"
import { LangProvider } from "@lib/i18n/context"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import WhatsAppButton from "@modules/common/components/whatsapp-button"
import UtmCapture from "@modules/layout/components/utm-capture"
import ScrollProgress from "@modules/layout/components/scroll-progress"
import { sanityFetch } from "@/sanity/lib/live"
import { FOOTER_NAV_QUERY } from "@/sanity/lib/queries"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await withTimeout(retrieveCustomer(), {
    fallback: null,
    label: "retrieveCustomer",
  })
  const cart = await withTimeout(retrieveCart(), {
    fallback: null,
    label: "retrieveCart",
  })
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const result = await withTimeout(listCartOptions(), {
      fallback: { shipping_options: [] as StoreCartShippingOption[] },
      label: "listCartOptions",
    })
    shippingOptions = result.shipping_options
  }

  const lang = await getLang()

  const footerNavResult = await sanityFetch({ query: FOOTER_NAV_QUERY }).catch(() => ({ data: null }))
  const footerColumns = footerNavResult?.data?.columns ?? undefined

  return (
    <LangProvider lang={lang}>
      <ScrollProgress />
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}
      {cart && (cart.items?.length ?? 0) > 0 && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer sanityColumns={footerColumns} />
      <WhatsAppButton />
      <UtmCapture />
    </LangProvider>
  )
}
