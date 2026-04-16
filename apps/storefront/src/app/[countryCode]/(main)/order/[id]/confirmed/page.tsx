import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getLang } from "@lib/i18n"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return {
    title: lang === "en" ? "Order Confirmed" : "Pedido confirmado",
    description:
      lang === "en"
        ? "Your purchase was successful"
        : "Tu compra fue realizada exitosamente",
    robots: { index: false, follow: false },
  }
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    return notFound()
  }

  return <OrderCompletedTemplate order={order} />
}
