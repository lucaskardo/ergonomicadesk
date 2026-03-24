"use client"

import { useState, useMemo, useTransition } from "react"
import { addToCart } from "@lib/data/cart"
import { useParams, useRouter } from "next/navigation"

/* ─── DESK TOPS ───
   Only 3 sizes of melamine tops available.
   Dimensions: width × depth in cm.
*/
const TOPS = [
  { label: "120×60cm", w: 120, h: 60, price: 129 },
  { label: "150×75cm", w: 150, h: 75, price: 159 },
  { label: "180×75cm", w: 180, h: 75, price: 189 },
] as const

/* Real melamine colors available */
const TOP_COLORS = [
  { id: "white",  label: "Blanco",        labelEn: "White",       hex: "#E8E4DD" },
  { id: "black",  label: "Negro",         labelEn: "Black",       hex: "#2B2B2B" },
  { id: "oak",    label: "Roble Natural", labelEn: "Natural Oak", hex: "#C4A97D" },
  { id: "walnut", label: "Nogal",         labelEn: "Walnut",      hex: "#6B4E3D" },
  { id: "grey",   label: "Gris",          labelEn: "Grey",        hex: "#9E9E9E" },
  { id: "maple",  label: "Arce",          labelEn: "Maple",       hex: "#D4B896" },
] as const

/* Frame options */
const FRAMES = [
  { id: "single", label: "Single Motor", labelEn: "Single Motor", price: 299 },
  { id: "double", label: "Dual Motor",   labelEn: "Dual Motor",   price: 399 },
] as const

const FRAME_COLORS = [
  { id: "black", label: "Negro", labelEn: "Black", hex: "#2A2A2A" },
  { id: "white", label: "Blanco", labelEn: "White", hex: "#D8D8D8" },
] as const

/* Accessories */
const ACCESSORIES = [
  { id: "monitor-single", label: "Brazo monitor single", labelEn: "Single monitor arm", price: 69 },
  { id: "monitor-dual",   label: "Brazo monitor dual",   labelEn: "Dual monitor arm",   price: 129 },
  { id: "cabinet",        label: "Archivador 3 gavetas", labelEn: "3-drawer cabinet",   price: 149 },
  { id: "laptop-stand",   label: "Soporte laptop",       labelEn: "Laptop stand",       price: 39 },
  { id: "desk-pad",       label: "Desk pad",             labelEn: "Desk pad",           price: 29 },
] as const

/* ─── SVG DESK SCENE ─── */
function DeskScene({
  topIdx,
  topColor,
  frameColor,
  accs,
}: {
  topIdx: number
  topColor: string
  frameColor: string
  accs: string[]
}) {
  const top = TOPS[topIdx]
  const tc = TOP_COLORS.find((c) => c.id === topColor)!
  const fc = FRAME_COLORS.find((c) => c.id === frameColor)!

  // Scale desk proportionally — 180cm is full width reference, smaller shrink
  const maxW = 320
  const scale = top.w / 180
  const deskW = maxW * scale
  const deskDepth = 14 * (top.h / 75)
  const deskX = (600 - deskW) / 2
  const deskY = 228

  const legL = deskX + 10
  const legR = deskX + deskW - 15

  const hasMonSingle = accs.includes("monitor-single")
  const hasMonDual = accs.includes("monitor-dual")
  const hasCabinet = accs.includes("cabinet")
  const hasLaptop = accs.includes("laptop-stand")
  const hasDeskPad = accs.includes("desk-pad")

  return (
    <svg
      viewBox="0 0 600 380"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Floor */}
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
      <rect x={legL} y={deskY + deskDepth} width="5" height="96" fill={fc.hex} style={{ transition: "fill .4s" }} />
      <rect x={legR} y={deskY + deskDepth} width="5" height="96" fill={fc.hex} style={{ transition: "fill .4s" }} />
      <rect x={legL - 6} y="333" width="17" height="4" fill="rgba(255,255,255,.08)" rx="1" />
      <rect x={legR - 6} y="333" width="17" height="4" fill="rgba(255,255,255,.08)" rx="1" />

      {/* Desk pad */}
      {hasDeskPad && (
        <rect
          x={deskX + 20} y={deskY - 2} width={deskW - 40} height={deskDepth - 2}
          fill="rgba(255,255,255,.05)" rx="1" style={{ transition: "opacity .4s" }}
        />
      )}

      {/* Desk surface */}
      <rect
        x={deskX} y={deskY} width={deskW} height={deskDepth}
        fill={tc.hex} rx="1"
        style={{ transition: "fill .4s, width .5s ease, x .5s ease" }}
      />
      <rect
        x={deskX} y={deskY} width={deskW} height={2}
        fill="rgba(255,255,255,.08)"
        style={{ transition: "width .5s ease, x .5s ease" }}
      />

      {/* Laptop stand */}
      <g opacity={hasLaptop ? 1 : 0} style={{ transition: "opacity .4s" }}>
        <rect x={deskX + deskW - 80} y={deskY - 10} width="50" height="3" fill="rgba(255,255,255,.12)" rx="1" />
        <rect x={deskX + deskW - 60} y={deskY - 28} width="10" height="18" fill="rgba(255,255,255,.1)" />
        <rect x={deskX + deskW - 85} y={deskY - 42} width="60" height="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.1)" strokeWidth="1" rx="1" />
        <rect x={deskX + deskW - 80} y={deskY - 40} width="50" height="10" fill="rgba(91,192,235,.06)" rx="1" />
      </g>

      {/* Monitor arm single */}
      <g opacity={hasMonSingle ? 1 : 0} style={{ transition: "opacity .4s" }}>
        <rect x={deskX + deskW * 0.3} y={deskY} width="8" height="12" fill="rgba(255,255,255,.15)" />
        <rect x={deskX + deskW * 0.3 + 2} y={deskY - 58} width="4" height="58" fill="rgba(255,255,255,.12)" />
        <rect x={deskX + deskW * 0.3 + 4} y={deskY - 58} width="55" height="3" fill="rgba(255,255,255,.12)" />
        <rect x={deskX + deskW * 0.3 + 14} y={deskY - 100} width="90" height="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="1" rx="2" />
        <rect x={deskX + deskW * 0.3 + 19} y={deskY - 96} width="80" height="47" fill="rgba(91,192,235,.04)" rx="1" />
      </g>

      {/* Monitor arm dual */}
      <g opacity={hasMonDual ? 1 : 0} style={{ transition: "opacity .4s" }}>
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
      <text
        x={deskX + deskW / 2} y="370" textAnchor="middle"
        fill="rgba(255,255,255,.25)" fontSize="10"
        fontFamily="General Sans,sans-serif" letterSpacing="0.5"
      >
        {TOPS[topIdx].label}
      </text>
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

  const [topIdx, setTopIdx] = useState(1)       // 150×75 default
  const [topColor, setTopColor] = useState("oak")
  const [frameIdx, setFrameIdx] = useState(0)    // single motor
  const [frameColor, setFrameColor] = useState("black")
  const [accs, setAccs] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [addedFeedback, setAddedFeedback] = useState(false)

  const frame = FRAMES[frameIdx]
  const top = TOPS[topIdx]

  const accTotal = accs.reduce((sum, id) => {
    const a = ACCESSORIES.find((x) => x.id === id)
    return sum + (a?.price ?? 0)
  }, 0)
  const total = frame.price + top.price + accTotal

  const toggleAcc = (id: string) => {
    if (id === "monitor-single" || id === "monitor-dual") {
      setAccs((prev) => {
        const without = prev.filter((a) => a !== "monitor-single" && a !== "monitor-dual")
        return prev.includes(id) ? without : [...without, id]
      })
    } else {
      setAccs((prev) =>
        prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
      )
    }
  }

  const cartItems = useMemo(() => {
    const items: { name: string; nameEn: string; price: number }[] = []
    const fc = FRAME_COLORS.find((c) => c.id === frameColor)!
    const tc = TOP_COLORS.find((c) => c.id === topColor)!

    items.push({
      name: `Base ${frame.label} ${fc.label}`,
      nameEn: `${frame.labelEn} Frame ${fc.labelEn}`,
      price: frame.price,
    })
    items.push({
      name: `Sobre Melamina ${top.label} ${tc.label}`,
      nameEn: `Melamine Top ${top.label} ${tc.labelEn}`,
      price: top.price,
    })
    accs.forEach((id) => {
      const a = ACCESSORIES.find((x) => x.id === id)!
      items.push({ name: a.label, nameEn: a.labelEn, price: a.price })
    })
    return items
  }, [frameIdx, frameColor, topIdx, topColor, accs, frame, top])

  /* Add to Cart — adds each individual SKU as a line item.
     NOTE: variantId lookup will be wired when inventory is imported.
     For now shows the UX flow. */
  const handleAddToCart = async () => {
    setIsAdding(true)
    setAddedFeedback(false)

    // TODO: Replace with real variant ID lookups from Medusa
    // Each item in cartItems maps to a real SKU/variant
    // e.g. "frame-single-bl" → variant_id, "top-mela-oak-150" → variant_id
    // For each item: await addToCart({ variantId, quantity: 1, countryCode })
    await new Promise((r) => setTimeout(r, 800))

    setIsAdding(false)
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 3000)
  }

  return (
    <section className="bg-ergo-950" style={{ padding: "clamp(56px, 7vw, 96px) 0" }}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            className="font-display font-bold text-white leading-[1.1]"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
          >
            {lang === "es" ? (
              <>Arma tu <span className="text-ergo-sky">standing desk</span></>
            ) : (
              <>Build your <span className="text-ergo-sky">standing desk</span></>
            )}
          </h2>
          <p className="text-ergo-400 text-[0.9rem] mt-2 max-w-[520px] mx-auto">
            {lang === "es"
              ? "Configura base, sobre y accesorios — precios reales, dimensiones exactas."
              : "Configure frame, top and accessories — real prices, exact dimensions."}
          </p>
        </div>

        {/* 2-col: scene + controls. Stack on mobile. */}
        <div className="grid gap-8 items-start lg:gap-10" style={{ gridTemplateColumns: "1.3fr 1fr" }}>
          {/* LEFT — SVG scene + summary */}
          <div className="relative">
            <DeskScene topIdx={topIdx} topColor={topColor} frameColor={frameColor} accs={accs} />

            {/* Price badge */}
            <div
              className="absolute top-4 right-4 px-4 py-3 text-center"
              style={{ background: "rgba(91,192,235,.12)", backdropFilter: "blur(4px)" }}
            >
              <div className="text-[0.65rem] font-semibold text-ergo-400 uppercase tracking-widest">Total</div>
              <div className="text-xl font-bold text-white font-display">${total}</div>
            </div>

            {/* Config summary */}
            <div className="mt-3 px-4 py-3" style={{ background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.05)" }}>
              <div className="text-[0.67rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Tu configuración" : "Your configuration"}
              </div>
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-1.5"
                  style={{ borderBottom: i < cartItems.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none" }}>
                  <span className="text-[0.78rem] text-ergo-300">{lang === "es" ? item.name : item.nameEn}</span>
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
            {/* Frame */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Base" : "Frame"}
              </div>
              <div className="flex flex-wrap gap-2">
                {FRAMES.map((f, i) => (
                  <button key={f.id} onClick={() => setFrameIdx(i)}
                    className={`px-4 py-2 text-[0.8rem] font-medium border transition-all duration-150 ${
                      frameIdx === i
                        ? "bg-ergo-sky-dark border-ergo-sky text-white"
                        : "bg-transparent border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}>
                    {lang === "es" ? f.label : f.labelEn}
                    <span className="text-ergo-sky ml-1.5 text-[0.72rem]">${f.price}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                {FRAME_COLORS.map((c) => (
                  <button key={c.id} onClick={() => setFrameColor(c.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium border transition-all duration-150 ${
                      frameColor === c.id
                        ? "border-ergo-sky text-white"
                        : "border-ergo-800 text-ergo-400 hover:border-ergo-500"
                    }`}>
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.hex }} />
                    {lang === "es" ? c.label : c.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Top size */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Sobre — Tamaño" : "Desktop — Size"}
              </div>
              <div className="flex flex-wrap gap-2">
                {TOPS.map((s, i) => (
                  <button key={s.label} onClick={() => setTopIdx(i)}
                    className={`px-4 py-2 text-[0.8rem] font-medium border transition-all duration-150 ${
                      topIdx === i
                        ? "bg-ergo-sky-dark border-ergo-sky text-white"
                        : "bg-transparent border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}>
                    {s.label}
                    <span className="text-ergo-sky ml-1.5 text-[0.72rem]">${s.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Top color */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Color del sobre" : "Desktop color"}
              </div>
              <div className="flex flex-wrap gap-2">
                {TOP_COLORS.map((col) => (
                  <button key={col.id} onClick={() => setTopColor(col.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[0.78rem] font-medium border transition-all duration-150 ${
                      topColor === col.id
                        ? "border-ergo-sky text-white"
                        : "border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}>
                    <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-white/10" style={{ background: col.hex }} />
                    {lang === "es" ? col.label : col.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <div className="text-[0.72rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Accesorios" : "Accessories"}
              </div>
              <div className="flex flex-col gap-1.5">
                {ACCESSORIES.map((a) => {
                  const isActive = accs.includes(a.id)
                  return (
                    <div key={a.id} className="flex items-center justify-between py-2.5 px-1 border-b border-ergo-900/60">
                      <span className="text-[0.82rem] text-ergo-300">
                        {lang === "es" ? a.label : a.labelEn}
                        <span className="text-ergo-500 ml-1.5">+${a.price}</span>
                      </span>
                      <button
                        onClick={() => toggleAcc(a.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                          isActive ? "bg-ergo-sky-dark" : "bg-ergo-800"
                        }`}
                        aria-pressed={isActive}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          isActive ? "translate-x-5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Total + Add to Cart CTA */}
            <div className="flex items-center justify-between pt-3 gap-4">
              <div>
                <div className="text-[0.68rem] text-ergo-500 uppercase tracking-widest">
                  {lang === "es" ? "Total del setup" : "Setup total"}
                </div>
                <div className="text-2xl font-bold text-white font-display">${total}</div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`inline-flex items-center gap-2 px-6 py-3.5 font-semibold text-[0.84rem] transition-all duration-200 ${
                  addedFeedback
                    ? "bg-emerald-600 text-white"
                    : "bg-ergo-sky-dark text-white hover:bg-ergo-sky"
                } disabled:opacity-60`}
              >
                {isAdding ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeLinecap="round" />
                  </svg>
                ) : addedFeedback ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                )}
                {isAdding
                  ? (lang === "es" ? "Agregando..." : "Adding...")
                  : addedFeedback
                  ? (lang === "es" ? "¡Agregado!" : "Added!")
                  : (lang === "es" ? "Agregar al carrito" : "Add to cart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
