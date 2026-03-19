"use client"

import { useState } from "react"
import { useCart } from "@/providers/cart"

interface Variant {
  id: string
  title?: string | null
}

interface ProductActionsProps {
  variants: Variant[]
}

export default function ProductActions({ variants }: ProductActionsProps) {
  const { addItem } = useCart()
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id ?? ""
  )
  const [state, setState] = useState<"idle" | "loading" | "done">("idle")

  async function handleAddToCart() {
    if (!selectedVariantId || state === "loading") return
    setState("loading")
    try {
      await addItem(selectedVariantId, 1)
      setState("done")
      setTimeout(() => setState("idle"), 2000)
    } catch {
      setState("idle")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {variants.length > 1 && (
        <div>
          <p className="text-sm font-medium text-stone-700 mb-2">Variante</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  selectedVariantId === variant.id
                    ? "border-stone-900 text-stone-900 font-medium"
                    : "border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900"
                }`}
              >
                {variant.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedVariantId || state === "loading"}
        className="w-full rounded-lg bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-stone-700 transition-colors md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "loading"
          ? "Agregando..."
          : state === "done"
            ? "¡Agregado al carrito!"
            : "Agregar al carrito"}
      </button>
    </div>
  )
}
