import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

type Props = {
  data: HttpTypes.AdminOrder
}

const OrderCustomerInfoWidget = ({ data: order }: Props) => {
  const addr = order.shipping_address

  const fullName = [addr?.first_name, addr?.last_name].filter(Boolean).join(" ")
  const addressLine = [addr?.address_1, addr?.city, addr?.province, addr?.postal_code, addr?.country_code?.toUpperCase()]
    .filter(Boolean)
    .join(", ")

  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h2" className="text-ui-fg-base text-sm font-semibold">
          Información del Cliente
        </Heading>
      </div>

      <div className="px-6 py-4 flex flex-col gap-3">
        {fullName && (
          <div className="grid grid-cols-[120px_1fr] gap-x-2">
            <Text className="text-ui-fg-subtle text-sm">Nombre</Text>
            <Text className="text-ui-fg-base text-sm font-medium">{fullName}</Text>
          </div>
        )}

        {order.email && (
          <div className="grid grid-cols-[120px_1fr] gap-x-2">
            <Text className="text-ui-fg-subtle text-sm">Email</Text>
            <Text className="text-ui-fg-base text-sm break-all">{order.email}</Text>
          </div>
        )}

        {addr?.phone && (
          <div className="grid grid-cols-[120px_1fr] gap-x-2">
            <Text className="text-ui-fg-subtle text-sm">Teléfono</Text>
            <Text className="text-ui-fg-base text-sm">{addr.phone}</Text>
          </div>
        )}

        {addressLine && (
          <div className="grid grid-cols-[120px_1fr] gap-x-2">
            <Text className="text-ui-fg-subtle text-sm">Dirección</Text>
            <Text className="text-ui-fg-base text-sm">{addressLine}</Text>
          </div>
        )}

        {!fullName && !order.email && !addr?.phone && !addressLine && (
          <Text className="text-ui-fg-subtle text-sm italic">Sin información de contacto</Text>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default OrderCustomerInfoWidget
