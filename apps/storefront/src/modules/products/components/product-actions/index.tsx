"use client"

import { addToCart } from "@lib/data/cart"
import { trackAddToCart } from "@lib/tracking"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
  initialVariantId?: string
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
  initialVariantId,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [extendedWarranty, setExtendedWarranty] = useState(false)
  const countryCode = useParams().countryCode as string

  useEffect(() => {
    // Pre-select variant from initialVariantId (SKU URL) or single-variant product
    if (initialVariantId) {
      const variant = product.variants?.find((v) => v.id === initialVariantId)
      if (variant) {
        setOptions(optionsAsKeymap(variant.options) ?? {})
        return
      }
    }
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants, initialVariantId])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return
    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    if (!isValidVariant || !selectedVariant?.sku) return
    const productPath = pathname.includes("/en/") ? "en/products" : "productos"
    const targetUrl = `/${countryCode}/${productPath}/${product.handle}/${selectedVariant.sku}`
    if (pathname === targetUrl) return
    router.replace(targetUrl, { scroll: false })
  }, [selectedVariant, isValidVariant])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) return true
    return false
  }, [selectedVariant])

  const lang = pathname.includes("/en/") ? "en" : "es"

  const labels = lang === "en" ? {
    addToCart: "Add to cart",
    outOfStock: "Out of stock",
    selectVariant: "Select an option",
    quantity: "Qty",
    whatsapp: "Ask on WhatsApp",
    priceTrust: "Price does not include ITBMS",
    freeDelivery: "Free delivery + assembly on orders >$99 in Panama City",
  } : {
    addToCart: "Agregar al carrito",
    outOfStock: "Agotado",
    selectVariant: "Selecciona una opción",
    quantity: "Cant.",
    whatsapp: "Consultar por WhatsApp",
    priceTrust: "Precio no incluye ITBMS",
    freeDelivery: "Envío gratis + ensamblaje en pedidos >$99 en Ciudad de Panamá",
  }

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null
    setIsAdding(true)
    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
      metadata: extendedWarranty ? { extended_warranty: true, warranty_surcharge_pct: 33 } : undefined,
    })
    trackAddToCart(product, selectedVariant, quantity)
    router.refresh()
    setQuantity(1)
    setIsAdding(false)
  }

  const whatsappMessage = encodeURIComponent(
    lang === "en"
      ? `Hi! I'm interested in: ${product.title}`
      : `¡Hola! Estoy interesado en: ${product.title}`
  )

  return (
    <>
      <div className="flex flex-col gap-4" ref={actionsRef}>
        {/* Price block */}
        <div className="border-t border-b border-ergo-200/60 py-5 mt-3">
          <ProductPrice product={product} variant={selectedVariant} />
          <p className="text-[0.78rem] text-ergo-400 mt-1">
            {labels.priceTrust} ·{" "}
            <span className="font-semibold" style={{ color: "#14B8A6" }}>
              {labels.freeDelivery}
            </span>
          </p>
        </div>

        {/* Variant options */}
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-4">
            {(product.options || []).map((option) => (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={!!disabled || isAdding}
                />
              </div>
            ))}
            <Divider />
          </div>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-3">
          <span className="text-[0.78rem] font-semibold text-ergo-800">{labels.quantity}</span>
          <div className="flex items-center border border-ergo-200/80">
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center text-ergo-400 hover:text-ergo-950 hover:bg-ergo-100 transition-colors disabled:opacity-30"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <span className="w-10 text-sm font-semibold text-center text-ergo-950">{quantity}</span>
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center text-ergo-400 hover:text-ergo-950 hover:bg-ergo-100 transition-colors"
              onClick={() => setQuantity(quantity + 1)}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>
        </div>

        {/* Extended Warranty — show price rounded up to nearest dollar */}
        {(() => {
          const variantPriceCents = selectedVariant?.calculated_price?.calculated_amount ?? 0
          const warrantySurcharge = Math.ceil((variantPriceCents * 0.33) / 100) // cents → dollars, rounded up
          return (
            <div className="flex items-start gap-3 py-3 px-4 border border-ergo-200/60 bg-ergo-bg mt-4">
              <input
                type="checkbox"
                id="extended-warranty"
                checked={extendedWarranty}
                onChange={(e) => setExtendedWarranty(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-ergo-sky cursor-pointer"
                disabled={!selectedVariant}
              />
              <label htmlFor="extended-warranty" className="cursor-pointer">
                <span className="text-[0.84rem] font-semibold text-ergo-950">
                  {lang === "en" ? "Add Extended Warranty" : "Agregar Garantía Extendida"}
                  {selectedVariant && (
                    <span className="text-ergo-sky-dark ml-1">(+${warrantySurcharge})</span>
                  )}
                </span>
                <p className="text-[0.72rem] text-ergo-400 mt-0.5">
                  {lang === "en"
                    ? "Extends your warranty to 5 years. Covers motor, electronics and structure."
                    : "Extiende tu garantía a 5 años. Cubre motor, electrónica y estructura."}
                </p>
              </label>
            </div>
          )
        })()}

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock || !selectedVariant || !!disabled || isAdding || !isValidVariant
          }
          className="w-full h-14 font-semibold text-[0.92rem] tracking-[0.01em]"
          style={{
            background: "#2A8BBF",
            color: "white",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!isAdding && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          )}
          {!selectedVariant && !options
            ? labels.selectVariant
            : !inStock || !isValidVariant
            ? labels.outOfStock
            : labels.addToCart}
        </Button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/50769533776?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 flex items-center justify-center gap-2 font-semibold text-[0.85rem] text-white transition-all duration-300"
          style={{ background: "#25D366" }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {labels.whatsapp}
        </a>

        {/* Inline trust badges */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          {[
            { icon: "🚚", label: lang === "en" ? "Free shipping >$99" : "Envío gratis >$99" },
            { icon: "🔧", label: lang === "en" ? "Assembly included" : "Ensamblaje incluido" },
            { icon: "🛡", label: lang === "en" ? "Up to 5yr warranty" : "Hasta 5 años garantía" },
            { icon: "↩", label: lang === "en" ? "7-day returns" : "Devoluciones 7 días" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-3 py-2.5 bg-ergo-bg-warm text-[0.73rem] font-medium text-ergo-600">
              <span>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}
