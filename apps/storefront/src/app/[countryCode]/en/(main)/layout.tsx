import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { withTimeout } from "@lib/util/fetch-safe"
import { LangProvider } from "@lib/i18n/context"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"
import WhatsAppButton from "@modules/common/components/whatsapp-button"
import UtmCapture from "@modules/layout/components/utm-capture"
import ScrollProgress from "@modules/layout/components/scroll-progress"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function EnPageLayout(props: { children: React.ReactNode }) {
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

  return (
    <LangProvider lang="en">
      <ScrollProgress />
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}
      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer />
      <WhatsAppButton />
      <UtmCapture />
    </LangProvider>
  )
}
