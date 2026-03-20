import { retrieveCart } from "@lib/data/cart"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View your shopping cart",
  robots: { index: false },
}

export default async function CartEn() {
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  return <CartTemplate cart={cart} />
}
