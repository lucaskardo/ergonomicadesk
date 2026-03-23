"use client"

import { Suspense, lazy } from "react"
import { HttpTypes } from "@medusajs/types"

const NmiPaymentSectionLazy = lazy(() => import("../nmi-payment-section"))

function NmiLoadingFallback() {
  return (
    <div className="flex flex-col gap-4">
      <div className="border border-ui-border-base rounded-lg p-4">
        <p className="text-sm font-medium text-ui-fg-base mb-3">Datos de Tarjeta</p>
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-ui-bg-subtle rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-ui-bg-subtle rounded" />
            <div className="h-10 bg-ui-bg-subtle rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NmiPaymentWrapper({
  cart,
  session,
  notReady,
}: {
  cart: HttpTypes.StoreCart
  session: any
  notReady: boolean
}) {
  return (
    <Suspense fallback={<NmiLoadingFallback />}>
      <NmiPaymentSectionLazy cart={cart} session={session} notReady={notReady} />
    </Suspense>
  )
}
