import { Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import PurchaseTracker from "@modules/order/components/purchase-tracker"
import { getLang } from "@lib/i18n"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const lang = await getLang()

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <PurchaseTracker order={order} />
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-4"
          >
            <span>{lang === "en" ? "Thank you!" : "¡Gracias!"}</span>
            <span>
              {lang === "en"
                ? "Your order was placed successfully."
                : "Tu orden fue procesada exitosamente."}
            </span>
          </Heading>
          <OrderDetails order={order} lang={lang} />
          <Heading level="h2" className="flex flex-row text-3xl-regular">
            {lang === "en" ? "Summary" : "Resumen"}
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} lang={lang} />
          <PaymentDetails order={order} lang={lang} />
          <Help lang={lang} />
        </div>
      </div>
    </div>
  )
}
