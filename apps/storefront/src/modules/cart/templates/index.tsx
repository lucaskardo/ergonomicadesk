import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import Divider from "@modules/common/components/divider"
import CartTracker from "../components/cart-tracker"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
}: {
  cart: HttpTypes.StoreCart | null
}) => {
  return (
    <div className="py-12">
      <CartTracker cart={cart} />
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-8 gap-y-8">
            <div className="flex flex-col bg-white p-6 lg:p-10 gap-y-6">
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-12">
                {cart && cart.region && (
                  <>
                    <div className="bg-white p-6 lg:p-10">
                      <Summary cart={cart as any} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
