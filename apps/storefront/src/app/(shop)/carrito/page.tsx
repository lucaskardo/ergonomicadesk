"use client"

import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/providers/cart"

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function CarritoPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart()

  if (isLoading) {
    return (
      <div className="bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-8 w-48 rounded bg-stone-100 animate-pulse mb-8" />
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const items = cart?.items ?? []

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-semibold text-stone-900 mb-8">
            Tu carrito
          </h1>
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              className="text-stone-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 10a4 4 0 01-8 0"
              />
            </svg>
            <p className="text-stone-500 text-base">Tu carrito está vacío.</p>
            <Link
              href="/productos"
              className="mt-2 inline-block rounded-lg bg-stone-900 px-6 py-3 text-sm font-semibold text-white hover:bg-stone-700 transition-colors"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotalCents = cart?.subtotal ?? 0
  const itbmsAmount = Math.round(subtotalCents * 0.07)
  const estimatedTotal = subtotalCents + itbmsAmount

  return (
    <div className="bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-semibold text-stone-900 mb-8">
          Tu carrito
        </h1>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Items list */}
          <div className="flex-1 flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-stone-200 p-4"
              >
                {/* Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                  {item.thumbnail ? (
                    <Image
                      src={item.thumbnail}
                      alt={item.title ?? ""}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-2 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-stone-900 line-clamp-2">
                      {item.title}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="shrink-0 text-stone-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Eliminar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1
                            ? updateItem(item.id, item.quantity - 1)
                            : removeItem(item.id)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        <span className="text-lg leading-none">−</span>
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-300 text-stone-600 hover:border-stone-900 hover:text-stone-900 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </div>

                    {/* Line price */}
                    <p className="text-sm font-semibold text-stone-900">
                      {item.subtotal != null
                        ? formatPrice(item.subtotal)
                        : formatPrice(item.unit_price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="rounded-xl border border-stone-200 p-6 flex flex-col gap-4">
              <h2 className="text-base font-semibold text-stone-900">
                Resumen del pedido
              </h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between items-center text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <span>ITBMS</span>
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium">
                      7%
                    </span>
                  </div>
                  <span>{formatPrice(itbmsAmount)}</span>
                </div>
                <div className="border-t border-stone-200 pt-3 flex justify-between font-semibold text-stone-900">
                  <span>Total estimado</span>
                  <span>{formatPrice(estimatedTotal)}</span>
                </div>
              </div>

              <p className="text-xs text-stone-400">
                El envío se calcula al finalizar el pedido.
              </p>

              <Link
                href="/checkout"
                className="w-full rounded-lg bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white text-center hover:bg-stone-700 transition-colors"
              >
                Proceder al checkout
              </Link>

              <Link
                href="/productos"
                className="text-center text-sm text-stone-500 hover:text-stone-800 transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
