import { retrieveCart } from "@lib/data/cart"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLang } from "@lib/i18n"

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return {
    title: lang === "en" ? "Shopping Cart" : "Carrito",
    description:
      lang === "en"
        ? "View your shopping cart"
        : "Ver tu carrito de compras",
    robots: { index: false },
  }
}

export default async function Cart() {
  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  return <CartTemplate cart={cart} />
}
