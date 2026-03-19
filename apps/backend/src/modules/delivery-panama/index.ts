import { Module } from "@medusajs/framework/utils"
import DeliveryPanamaService from "./service"

export const DELIVERY_PANAMA_MODULE = "delivery_panama"

export default Module(DELIVERY_PANAMA_MODULE, {
  service: DeliveryPanamaService,
})
