"use client"

import { useState, useMemo } from "react"
import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"

/* ─── FRAMES ─── */
const FRAMES = [
  { id: "single",  label: "Single Motor",   labelEn: "Single Motor",   skuPrefix: "frame-single", price: 305 },
  { id: "double",  label: "Dual Motor",     labelEn: "Dual Motor",     skuPrefix: "frame-double", price: 399 },
  { id: "3stage",  label: "Dual Motor X",   labelEn: "Dual Motor X",   skuPrefix: "frame-3stage", price: 499 },
  { id: "L",       label: "Base en L",      labelEn: "L-Shape Frame",  skuPrefix: "frame-l",      price: 699 },
] as const

const FRAME_COLORS = [
  { id: "bl", label: "Negro", labelEn: "Black", hex: "#2A2A2A" },
  { id: "wh", label: "Blanco", labelEn: "White", hex: "#D8D8D8" },
] as const

/* ─── TOPS — Melamina ─── */
const TOP_SIZES = [
  { label: "120×60cm", w: 120, h: 60, sizeKey: "120" },
  { label: "150×75cm", w: 150, h: 75, sizeKey: "150" },
  { label: "180×75cm", w: 180, h: 75, sizeKey: "180" },
] as const

const MELA_COLORS = [
  { id: "white",    label: "White Matte",  labelEn: "White Matte",  hex: "#E8E4DD" },
  { id: "black",    label: "Black Matte",  labelEn: "Black Matte",  hex: "#2B2B2B" },
  { id: "pecan",    label: "Pecan",        labelEn: "Pecan",        hex: "#8B6914" },
  { id: "oakli",    label: "Oak Linen",    labelEn: "Oak Linen",    hex: "#C4A97D" },
  { id: "charcoal", label: "Charcoal",     labelEn: "Charcoal",     hex: "#4A4A4A" },
  { id: "ash",      label: "Ash",          labelEn: "Ash",          hex: "#B8AFA6" },
  { id: "darkoak",  label: "Dark Oak",     labelEn: "Dark Oak",     hex: "#6B4E3D" },
] as const

const MELA_PRICE: Record<string, number> = { "120": 129, "150": 159, "180": 189 }

/* ─── TOPS — Madera Natural ─── */
const WOOD_TYPES = [
  { id: "teca",         label: "Teca",          labelEn: "Teak",          hex: "#A0522D" },
  { id: "acacia-block", label: "Acacia Block",  labelEn: "Acacia Block",  hex: "#8B7355" },
] as const

const WOOD_PRICE: Record<string, number> = { "120": 249, "150": 299, "180": 349 }

/* ─── ACCESSORIES ─── */
const ACCESSORIES = [
  { id: "arm-single",       label: "Brazo monitor single",       labelEn: "Single monitor arm",      sku: "stand-arm-single-bl",         price: 69 },
  { id: "arm-double",       label: "Brazo monitor doble",        labelEn: "Dual monitor arm",        sku: "stand-arm-double-bl",         price: 129 },
  { id: "arm-heavy",        label: "Brazo monitor heavy duty",   labelEn: "Heavy duty monitor arm",  sku: "stand-arm-heavy-single-bl",   price: 89 },
  { id: "cabinet-slim-bl",  label: "Archivador slim negro",      labelEn: "Slim cabinet black",      sku: "cabinet-3drawer-slim-bl",     price: 179 },
  { id: "cabinet-slim-wh",  label: "Archivador slim blanco",     labelEn: "Slim cabinet white",      sku: "cabinet-3drawer-slim-wh",     price: 179 },
  { id: "cabinet-comp-bl",  label: "Archivador compacto negro",  labelEn: "Compact cabinet black",   sku: "cabinet-3drawer-comp-bl",     price: 149 },
  { id: "cabinet-comp-wh",  label: "Archivador compacto blanco", labelEn: "Compact cabinet white",   sku: "cabinet-3drawer-comp-wh",     price: 149 },
  { id: "laptop-stand",     label: "Soporte laptop ajustable",   labelEn: "Adjustable laptop stand", sku: "stand-laptop-adjus-sl",       price: 39 },
  { id: "tablet-stand",     label: "Soporte tablet grande",      labelEn: "Large tablet stand",      sku: "stand-tablet-adjus-large-bl", price: 35 },
  { id: "desk-pad",         label: "Desk pad eco leather",       labelEn: "Eco leather desk pad",    sku: "pad-ecoleather-80x40-bl",     price: 29 },
] as const

// Monitor arms are mutually exclusive (you pick one type or none)
const MONITOR_ARM_IDS = ["arm-single", "arm-double", "arm-heavy"]
// Cabinets are mutually exclusive (pick one or none)
const CABINET_IDS = ["cabinet-slim-bl", "cabinet-slim-wh", "cabinet-comp-bl", "cabinet-comp-wh"]

/* ─── SVG DESK SCENE ─── */
function DeskScene({
  topSizeIdx,
  topHex,
  frameHex,
  accs,
}: {
  topSizeIdx: number
  topHex: string
  frameHex: string
  accs: string[]
}) {
  const top = TOP_SIZES[topSizeIdx]
  const maxW = 320
  const scale = top.w / 180
  const deskW = maxW * scale
  const deskDepth = 14 * (top.h / 75)
  const deskX = (600 - deskW) / 2
  const deskY = 228
  const legL = deskX + 10
  const legR = deskX + deskW - 15

  const hasMonArm = accs.some((a) => MONITOR_ARM_IDS.includes(a))
  const hasDualMon = accs.includes("arm-double")
  const hasCabinet = accs.some((a) => CABINET_IDS.includes(a))
  const hasLaptop = accs.includes("laptop-stand")
  const hasDeskPad = accs.includes("desk-pad")

  return (
    <svg viewBox="0 0 600 380" xmlns="http://www.w3.org/2000/svg" className="w-full"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <line x1="20" y1="340" x2="580" y2="340" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
      {/* Cabinet */}
      <g opacity={hasCabinet ? 1 : 0} style={{ transition: "opacity .4s" }}>
        <rect x={deskX - 65} y="250" width="55" height="86" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.08)" strokeWidth="1" rx="1" />
        <line x1={deskX - 60} y1="278" x2={deskX - 15} y2="278" stroke="rgba(255,255,255,.06)" />
        <line x1={deskX - 60} y1="306" x2={deskX - 15} y2="306" stroke="rgba(255,255,255,.06)" />
        <circle cx={deskX - 37} cy="264" r="2" fill="rgba(255,255,255,.12)" />
        <circle cx={deskX - 37} cy="292" r="2" fill="rgba(255,255,255,.12)" />
        <circle cx={deskX - 37} cy="320" r="2" fill="rgba(255,255,255,.12)" />
      </g>
      {/* Desk legs */}
      <rect x={legL} y={deskY + deskDepth} width="5" height="96" fill={frameHex} style={{ transition: "fill .4s" }} />
      <rect x={legR} y={deskY + deskDepth} width="5" height="96" fill={frameHex} style={{ transition: "fill .4s" }} />
      <rect x={legL - 6} y="333" width="17" height="4" fill="rgba(255,255,255,.08)" rx="1" />
      <rect x={legR - 6} y="333" width="17" height="4" fill="rgba(255,255,255,.08)" rx="1" />
      {/* Desk pad */}
      {hasDeskPad && (
        <rect x={deskX + 20} y={deskY - 2} width={deskW - 40} height={deskDepth - 2}
          fill="rgba(255,255,255,.05)" rx="1" style={{ transition: "opacity .4s" }} />
      )}
      {/* Desk surface */}
      <rect x={deskX} y={deskY} width={deskW} height={deskDepth} fill={topHex} rx="1"
        style={{ transition: "fill .4s, width .5s ease, x .5s ease" }} />
      <rect x={deskX} y={deskY} width={deskW} height={2} fill="rgba(255,255,255,.08)"
        style={{ transition: "width .5s ease, x .5s ease" }} />
      {/* Laptop stand */}
      <g opacity={hasLaptop ? 1 : 0} style={{ transition: "opacity .4s" }}>
        <rect x={deskX + deskW - 80} y={deskY - 10} width="50" height="3" fill="rgba(255,255,255,.12)" rx="1" />
        <rect x={deskX + deskW - 60} y={deskY - 28} width="10" height="18" fill="rgba(255,255,255,.1)" />
        <rect x={deskX + deskW - 85} y={deskY - 42} width="60" height="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.1)" strokeWidth="1" rx="1" />
      </g>
      {/* Monitor arm (single or heavy) */}
      <g opacity={hasMonArm && !hasDualMon ? 1 : 0} style={{ transition: "opacity .4s" }}>
        <rect x={deskX + deskW * 0.3} y={deskY} width="8" height="12" fill="rgba(255,255,255,.15)" />
        <rect x={deskX + deskW * 0.3 + 2} y={deskY - 58} width="4" height="58" fill="rgba(255,255,255,.12)" />
        <rect x={deskX + deskW * 0.3 + 4} y={deskY - 58} width="55" height="3" fill="rgba(255,255,255,.12)" />
        <rect x={deskX + deskW * 0.3 + 14} y={deskY - 100} width="90" height="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="1" rx="2" />
        <rect x={deskX + deskW * 0.3 + 19} y={deskY - 96} width="80" height="47" fill="rgba(91,192,235,.04)" rx="1" />
      </g>
      {/* Monitor arm dual */}
      <g opacity={hasDualMon ? 1 : 0} style={{ transition: "opacity .4s" }}>
        <rect x={deskX + deskW * 0.45} y={deskY} width="8" height="12" fill="rgba(255,255,255,.15)" />
        <rect x={deskX + deskW * 0.45 + 2} y={deskY - 66} width="4" height="66" fill="rgba(255,255,255,.12)" />
        <rect x={deskX + deskW * 0.45 - 56} y={deskY - 66} width="60" height="3" fill="rgba(255,255,255,.12)" />
        <rect x={deskX + deskW * 0.45 + 6} y={deskY - 66} width="60" height="3" fill="rgba(255,255,255,.12)" />
        <rect x={deskX + deskW * 0.45 - 96} y={deskY - 110} width="90" height="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="1" rx="2" />
        <rect x={deskX + deskW * 0.45 - 91} y={deskY - 106} width="80" height="47" fill="rgba(91,192,235,.04)" rx="1" />
        <rect x={deskX + deskW * 0.45 + 16} y={deskY - 110} width="90" height="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="1" rx="2" />
        <rect x={deskX + deskW * 0.45 + 21} y={deskY - 106} width="80" height="47" fill="rgba(91,192,235,.04)" rx="1" />
      </g>
      {/* Keyboard + mouse */}
      <rect x={deskX + deskW * 0.25} y={deskY - 8} width={deskW * 0.22} height="6" fill="rgba(255,255,255,.06)" rx="1" />
      <ellipse cx={deskX + deskW * 0.55} cy={deskY - 5} rx="8" ry="5" fill="rgba(255,255,255,.05)" />
      {/* Dimension label */}
      <text x={deskX + deskW / 2} y="370" textAnchor="middle" fill="rgba(255,255,255,.25)" fontSize="10"
        fontFamily="General Sans,sans-serif" letterSpacing="0.5">{TOP_SIZES[topSizeIdx].label}</text>
    </svg>
  )
}

/* ─── MAIN COMPONENT ─── */
export default function BuildYourDesk({
  lang,
  countryCode: _countryCode,
}: {
  lang: "es" | "en"
  countryCode: string
}) {
  const params = useParams()
  const countryCode = (params.countryCode as string) || _countryCode
  const router = useRouter()

  // Top type: "melamina" | "madera"
  const [topType, setTopType] = useState<"melamina" | "madera">("melamina")
  const [topSizeIdx, setTopSizeIdx] = useState(1) // 150×75 default
  const [melaColor, setMelaColor] = useState("oakli")
  const [woodType, setWoodType] = useState("teca")
  const [frameIdx, setFrameIdx] = useState(0) // single motor
  const [frameColor, setFrameColor] = useState("bl")
  const [accs, setAccs] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const frame = FRAMES[frameIdx]
  const topSize = TOP_SIZES[topSizeIdx]
  const topPrice = topType === "melamina"
    ? (MELA_PRICE[topSize.sizeKey] ?? 159)
    : (WOOD_PRICE[topSize.sizeKey] ?? 299)

  const topHex = topType === "melamina"
    ? (MELA_COLORS.find((c) => c.id === melaColor)?.hex ?? "#C4A97D")
    : (WOOD_TYPES.find((w) => w.id === woodType)?.hex ?? "#A0522D")

  const frameHex = FRAME_COLORS.find((c) => c.id === frameColor)?.hex ?? "#2A2A2A"

  const accTotal = accs.reduce((sum, id) => {
    const a = ACCESSORIES.find((x) => x.id === id)
    return sum + (a?.price ?? 0)
  }, 0)
  const total = frame.price + topPrice + accTotal

  const toggleAcc = (id: string) => {
    // Monitor arms mutually exclusive
    if (MONITOR_ARM_IDS.includes(id)) {
      setAccs((prev) => {
        const without = prev.filter((a) => !MONITOR_ARM_IDS.includes(a))
        return prev.includes(id) ? without : [...without, id]
      })
    // Cabinets mutually exclusive
    } else if (CABINET_IDS.includes(id)) {
      setAccs((prev) => {
        const without = prev.filter((a) => !CABINET_IDS.includes(a))
        return prev.includes(id) ? without : [...without, id]
      })
    } else {
      setAccs((prev) =>
        prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
      )
    }
  }

  // Build SKU list for cart
  const cartSkus = useMemo(() => {
    const items: { sku: string; name: string; nameEn: string; price: number }[] = []
    const fc = FRAME_COLORS.find((c) => c.id === frameColor)!

    // Frame
    items.push({
      sku: `${frame.skuPrefix}-${frameColor}`,
      name: `${frame.label} ${fc.label}`,
      nameEn: `${frame.labelEn} ${fc.labelEn}`,
      price: frame.price,
    })

    // Top
    if (topType === "melamina") {
      const mc = MELA_COLORS.find((c) => c.id === melaColor)!
      items.push({
        sku: `top-mela-${melaColor}-${topSize.sizeKey}`,
        name: `Sobre Melamina ${mc.label} ${topSize.label}`,
        nameEn: `Melamine Top ${mc.labelEn} ${topSize.label}`,
        price: topPrice,
      })
    } else {
      const wt = WOOD_TYPES.find((w) => w.id === woodType)!
      items.push({
        sku: `top-${woodType}-${topSize.sizeKey}`,
        name: `Sobre ${wt.label} ${topSize.label}`,
        nameEn: `${wt.labelEn} Top ${topSize.label}`,
        price: topPrice,
      })
    }

    // Accessories
    accs.forEach((id) => {
      const a = ACCESSORIES.find((x) => x.id === id)!
      items.push({ sku: a.sku, name: a.label, nameEn: a.labelEn, price: a.price })
    })

    return items
  }, [frameIdx, frameColor, topType, topSizeIdx, melaColor, woodType, accs, frame, topSize, topPrice])

  // Add each SKU to cart individually
  const handleAddToCart = async () => {
    setIsAdding(true)
    setAddedFeedback(false)

    try {
      // Fetch all products to find variant IDs by SKU
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/products?limit=300&fields=variants.id,variants.sku`,
        {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
          cache: "no-store",
        }
      )

      if (!response.ok) throw new Error("Failed to fetch products")

      const { products } = await response.json()

      // Build SKU → variant_id map
      const skuMap = new Map<string, string>()
      for (const product of products) {
        for (const variant of product.variants || []) {
          if (variant.sku) skuMap.set(variant.sku, variant.id)
        }
      }

      // Add each item to cart
      for (const item of cartSkus) {
        const variantId = skuMap.get(item.sku)
        if (variantId) {
          await addToCart({ variantId, quantity: 1, countryCode })
        } else {
          console.warn(`SKU not found in Medusa: ${item.sku}`)
        }
      }

      router.refresh()
      setAddedFeedback(true)
      setTimeout(() => setAddedFeedback(false), 3000)
    } catch (error) {
      console.error("Failed to add desk config to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  const es = lang === "es"

  return (
    <section className="bg-ergo-950" style={{ padding: "clamp(56px, 7vw, 96px) 0" }}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="font-display font-bold text-white leading-[1.1]"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}>
            {es ? <>Arma tu <span className="text-ergo-sky">standing desk</span></> : <>Build your <span className="text-ergo-sky">standing desk</span></>}
          </h2>
          <p className="text-ergo-400 text-[0.9rem] mt-2 max-w-[520px] mx-auto">
            {es ? "Configura base, sobre y accesorios — cada componente se agrega individualmente al carrito." : "Configure frame, top and accessories — each component is added individually to your cart."}
          </p>
        </div>

        <div className="grid gap-8 items-start lg:gap-10" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
          {/* LEFT — SVG + summary */}
          <div className="relative">
            <DeskScene topSizeIdx={topSizeIdx} topHex={topHex} frameHex={frameHex} accs={accs} />
            {/* Price badge */}
            <div className="absolute top-4 right-4 px-4 py-3 text-center" style={{ background: "rgba(91,192,235,.12)", backdropFilter: "blur(4px)" }}>
              <div className="text-[0.65rem] font-semibold text-ergo-400 uppercase tracking-widest">Total</div>
              <div className="text-xl font-bold text-white font-display">${total}</div>
            </div>
            {/* Config summary */}
            <div className="mt-3 px-4 py-3" style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)" }}>
              <div className="text-[0.67rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {es ? "Tu configuración" : "Your configuration"}
              </div>
              {cartSkus.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1.5"
                  style={{ borderBottom: i < cartSkus.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                  <span className="text-[0.78rem] text-ergo-300">{es ? item.name : item.nameEn}</span>
                  <span className="text-[0.78rem] text-ergo-400 font-medium">${item.price}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 mt-1" style={{ borderTop: "1px solid rgba(255,255,255,.08)" }}>
                <span className="text-[0.82rem] text-white font-semibold">Total</span>
                <span className="text-[0.82rem] text-white font-bold">${total}</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Controls */}
          <div className="flex flex-col gap-5">
            {/* Frame type */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">{es ? "Base" : "Frame"}</div>
              <div className="flex flex-wrap gap-2">
                {FRAMES.map((f, i) => (
                  <button key={f.id} onClick={() => setFrameIdx(i)}
                    className={`px-3 py-2 text-[0.78rem] font-medium border transition-all duration-150 ${
                      frameIdx === i ? "bg-ergo-sky-dark border-ergo-sky text-white" : "bg-transparent border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}>
                    {es ? f.label : f.labelEn}
                    <span className="text-ergo-sky ml-1 text-[0.7rem]">${f.price}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {FRAME_COLORS.map((c) => (
                  <button key={c.id} onClick={() => setFrameColor(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium border transition-all duration-150 ${
                      frameColor === c.id ? "border-ergo-sky text-white" : "border-ergo-800 text-ergo-400 hover:border-ergo-500"
                    }`}>
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.hex }} />
                    {es ? c.label : c.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Top type toggle */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">{es ? "Tipo de sobre" : "Top type"}</div>
              <div className="flex gap-2">
                {(["melamina", "madera"] as const).map((t) => (
                  <button key={t} onClick={() => setTopType(t)}
                    className={`px-4 py-2 text-[0.78rem] font-medium border transition-all duration-150 ${
                      topType === t ? "bg-ergo-sky-dark border-ergo-sky text-white" : "bg-transparent border-ergo-800 text-ergo-400 hover:border-ergo-500"
                    }`}>
                    {t === "melamina" ? (es ? "Melamina" : "Melamine") : (es ? "Madera Natural" : "Natural Wood")}
                  </button>
                ))}
              </div>
            </div>

            {/* Top size */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">{es ? "Tamaño" : "Size"}</div>
              <div className="flex flex-wrap gap-2">
                {TOP_SIZES.map((s, i) => (
                  <button key={s.sizeKey} onClick={() => setTopSizeIdx(i)}
                    className={`px-4 py-2 text-[0.78rem] font-medium border transition-all duration-150 ${
                      topSizeIdx === i ? "bg-ergo-sky-dark border-ergo-sky text-white" : "bg-transparent border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}>
                    {s.label}
                    <span className="text-ergo-sky ml-1 text-[0.7rem]">
                      ${topType === "melamina" ? MELA_PRICE[s.sizeKey] : WOOD_PRICE[s.sizeKey]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top color/wood */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {topType === "melamina" ? (es ? "Color" : "Color") : (es ? "Madera" : "Wood")}
              </div>
              <div className="flex flex-wrap gap-2">
                {topType === "melamina" ? (
                  MELA_COLORS.map((col) => (
                    <button key={col.id} onClick={() => setMelaColor(col.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-[0.76rem] font-medium border transition-all duration-150 ${
                        melaColor === col.id ? "border-ergo-sky text-white" : "border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                      }`}>
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/10" style={{ background: col.hex }} />
                      {es ? col.label : col.labelEn}
                    </button>
                  ))
                ) : (
                  WOOD_TYPES.map((w) => (
                    <button key={w.id} onClick={() => setWoodType(w.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-[0.76rem] font-medium border transition-all duration-150 ${
                        woodType === w.id ? "border-ergo-sky text-white" : "border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                      }`}>
                      <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/10" style={{ background: w.hex }} />
                      {es ? w.label : w.labelEn}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">{es ? "Accesorios" : "Accessories"}</div>
              <div className="flex flex-col gap-1">
                {ACCESSORIES.map((a) => {
                  const isActive = accs.includes(a.id)
                  return (
                    <div key={a.id} className="flex items-center justify-between py-2 px-1 border-b border-ergo-900/60">
                      <span className="text-[0.8rem] text-ergo-300">
                        {es ? a.label : a.labelEn}
                        <span className="text-ergo-500 ml-1.5">+${a.price}</span>
                      </span>
                      <button onClick={() => toggleAcc(a.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${isActive ? "bg-ergo-sky-dark" : "bg-ergo-800"}`}
                        aria-pressed={isActive}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isActive ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Total + Add to Cart */}
            <div className="flex items-center justify-between pt-3 gap-4">
              <div>
                <div className="text-[0.68rem] text-ergo-500 uppercase tracking-widest">{es ? "Total del setup" : "Setup total"}</div>
                <div className="text-2xl font-bold text-white font-display">${total}</div>
              </div>
              <button onClick={handleAddToCart} disabled={isAdding}
                className={`inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-[0.84rem] transition-all duration-200 ${
                  addedFeedback ? "bg-emerald-600 text-white" : "bg-ergo-sky-dark text-white hover:bg-ergo-sky"
                } disabled:opacity-60`}>
                {isAdding ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                  </svg>
                ) : addedFeedback ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                )}
                {isAdding ? (es ? "Agregando..." : "Adding...") : addedFeedback ? (es ? "¡Agregado!" : "Added!") : (es ? "Agregar al carrito" : "Add to cart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
