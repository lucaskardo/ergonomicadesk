import { Module } from "@medusajs/framework/utils"
import NmiPaymentModuleService from "./service"

export const NMI_PAYMENT_MODULE = "nmiPayment"

export default Module(NMI_PAYMENT_MODULE, {
  service: NmiPaymentModuleService,
})
