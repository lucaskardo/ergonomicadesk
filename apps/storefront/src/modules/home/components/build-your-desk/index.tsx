"use client"

import { useState } from "react"
import Link from "next/link"

const SIZES = [
  { label: "120cm", price: 449 },
  { label: "140cm", price: 499 },
  { label: "160cm", price: 549 },
  { label: "180cm", price: 599 },
]

const COLORS = [
  { label: "Roble", labelEn: "Oak", hex: "#A0886B" },
  { label: "Nogal", labelEn: "Walnut", hex: "#6B5D4F" },
  { label: "Negro", labelEn: "Black", hex: "#2A2A2A" },
  { label: "Blanco", labelEn: "White", hex: "#E0D8CC" },
]

const MONITORS = [
  { key: "none", labelEs: "Ninguno", labelEn: "None", price: 0 },
  { key: "single", labelEs: "Single +$69", labelEn: "Single +$69", price: 69 },
  { key: "double", labelEs: "Dual +$129", labelEn: "Dual +$129", price: 129 },
]

const ACCESSORIES = [
  { key: "cabinet", labelEs: "Archivador 3 gavetas", labelEn: "3-drawer cabinet", price: 149 },
  { key: "laptopStand", labelEs: "Soporte laptop", labelEn: "Laptop stand", price: 39 },
  { key: "deskPad", labelEs: "Desk pad", labelEn: "Desk pad", price: 29 },
  { key: "chair", labelEs: "Silla ergonómica", labelEn: "Ergonomic chair", price: 389 },
]

export default function BuildYourDesk({
  lang,
  countryCode,
}: {
  lang: "es" | "en"
  countryCode: string
}) {
  const [sizeIdx, setSizeIdx] = useState(2) // 160cm default
  const [colorHex, setColorHex] = useState("#A0886B")
  const [monKey, setMonKey] = useState("none")
  const [accessories, setAccessories] = useState<Record<string, boolean>>({
    cabinet: false,
    laptopStand: false,
    deskPad: false,
    chair: false,
  })

  const deskPrice = SIZES[sizeIdx].price
  const monPrice = MONITORS.find((m) => m.key === monKey)?.price ?? 0
  const accPrice = ACCESSORIES.reduce(
    (sum, a) => sum + (accessories[a.key] ? a.price : 0),
    0
  )
  const total = deskPrice + monPrice + accPrice

  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`
  const ctaHref =
    lang === "en"
      ? `${base}/categories/standing-desks`
      : `${base}/categorias/standing-desks`

  const toggleAcc = (key: string) =>
    setAccessories((prev) => ({ ...prev, [key]: !prev[key] }))

  const chairOpacity = accessories.chair ? 1 : 0.3
  const cabinetOpacity = accessories.cabinet ? 1 : 0
  const deskPadOpacity = accessories.deskPad ? 1 : 0
  const laptopOpacity = accessories.laptopStand ? 1 : 0
  const monSingleOpacity = monKey === "single" ? 1 : 0
  const monDoubleOpacity = monKey === "double" ? 1 : 0

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
              <>Arma tu <span className="text-ergo-sky">workspace</span> ideal</>
            ) : (
              <>Build your ideal <span className="text-ergo-sky">workspace</span></>
            )}
          </h2>
          <p className="text-ergo-400 text-[0.9rem] mt-2 max-w-[480px] mx-auto">
            {lang === "es"
              ? "Combina escritorio, silla y accesorios. Visualiza tu setup y obtén precio de paquete."
              : "Combine desk, chair and accessories. Visualize your setup and get a bundle price."}
          </p>
        </div>

        {/* 2-col layout */}
        <div className="grid gap-10 items-start" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
          {/* SVG scene */}
          <div className="relative">
            <svg
              viewBox="0 0 600 380"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <line x1="20" y1="340" x2="580" y2="340" stroke="rgba(255,255,255,.06)" strokeWidth="1" />
              {/* Chair */}
              <g opacity={chairOpacity} style={{ transition: "opacity .4s" }}>
                <ellipse cx="460" cy="336" rx="38" ry="6" fill="rgba(255,255,255,.06)" />
                <line x1="460" y1="330" x2="460" y2="280" stroke="rgba(255,255,255,.12)" strokeWidth="3" />
                <rect x="430" y="260" width="60" height="12" fill="rgba(255,255,255,.1)" />
                <rect x="438" y="200" width="44" height="58" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <rect x="444" y="188" width="32" height="14" fill="rgba(255,255,255,.06)" />
              </g>
              {/* Cabinet */}
              <g opacity={cabinetOpacity} style={{ transition: "opacity .4s" }}>
                <rect x="50" y="250" width="55" height="86" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
                <line x1="55" y1="278" x2="100" y2="278" stroke="rgba(255,255,255,.06)" />
                <line x1="55" y1="306" x2="100" y2="306" stroke="rgba(255,255,255,.06)" />
                <circle cx="77" cy="264" r="2" fill="rgba(255,255,255,.12)" />
                <circle cx="77" cy="292" r="2" fill="rgba(255,255,255,.12)" />
                <circle cx="77" cy="320" r="2" fill="rgba(255,255,255,.12)" />
              </g>
              {/* Desk legs */}
              <rect x="130" y="240" width="5" height="96" fill="rgba(255,255,255,.12)" />
              <rect x="410" y="240" width="5" height="96" fill="rgba(255,255,255,.12)" />
              <rect x="124" y="333" width="17" height="4" fill="rgba(255,255,255,.08)" />
              <rect x="404" y="333" width="17" height="4" fill="rgba(255,255,255,.08)" />
              {/* Desk pad */}
              <rect
                x="140" y="226" width="266" height="12"
                fill="rgba(255,255,255,.05)"
                opacity={deskPadOpacity}
                style={{ transition: "opacity .4s" }}
              />
              {/* Desk surface */}
              <rect
                x="120" y="228" width="306" height="14"
                fill={colorHex}
                style={{ transition: "fill .4s" }}
              />
              {/* Laptop stand */}
              <g opacity={laptopOpacity} style={{ transition: "opacity .4s" }}>
                <rect x="310" y="218" width="50" height="3" fill="rgba(255,255,255,.12)" />
                <rect x="330" y="200" width="10" height="18" fill="rgba(255,255,255,.1)" />
                <rect x="305" y="186" width="60" height="14" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <rect x="310" y="188" width="50" height="10" fill="rgba(91,192,235,.06)" />
              </g>
              {/* Monitor arm single */}
              <g opacity={monSingleOpacity} style={{ transition: "opacity .4s" }}>
                <rect x="196" y="228" width="8" height="12" fill="rgba(255,255,255,.15)" />
                <rect x="198" y="170" width="4" height="58" fill="rgba(255,255,255,.12)" />
                <rect x="200" y="170" width="55" height="3" fill="rgba(255,255,255,.12)" />
                <rect x="210" y="128" width="90" height="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <rect x="215" y="132" width="80" height="47" fill="rgba(91,192,235,.04)" />
              </g>
              {/* Monitor arm double */}
              <g opacity={monDoubleOpacity} style={{ transition: "opacity .4s" }}>
                <rect x="246" y="228" width="8" height="12" fill="rgba(255,255,255,.15)" />
                <rect x="248" y="162" width="4" height="66" fill="rgba(255,255,255,.12)" />
                <rect x="188" y="162" width="60" height="3" fill="rgba(255,255,255,.12)" />
                <rect x="252" y="162" width="60" height="3" fill="rgba(255,255,255,.12)" />
                <rect x="148" y="118" width="90" height="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <rect x="153" y="122" width="80" height="47" fill="rgba(91,192,235,.04)" />
                <rect x="262" y="118" width="90" height="55" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.1)" strokeWidth="1" />
                <rect x="267" y="122" width="80" height="47" fill="rgba(91,192,235,.04)" />
              </g>
              {/* Keyboard */}
              <rect x="180" y="218" width="80" height="8" fill="rgba(255,255,255,.06)" />
              <ellipse cx="280" cy="222" rx="10" ry="6" fill="rgba(255,255,255,.05)" />
              {/* Price badge */}
              <g transform="translate(490,20)">
                <rect width="90" height="50" fill="rgba(91,192,235,.12)" />
                <text x="45" y="20" textAnchor="middle" fill="rgba(255,255,255,.4)" fontSize="8" fontWeight="600" fontFamily="General Sans,sans-serif" letterSpacing=".5">DESDE</text>
                <text x="45" y="38" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Cabinet Grotesk,sans-serif">${total}</text>
              </g>
            </svg>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5">
            {/* Size */}
            <div>
              <div className="text-[0.75rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Tamaño" : "Size"}
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSizeIdx(i)}
                    className={`px-4 py-2 text-[0.8rem] font-medium border transition-all duration-150 ${
                      sizeIdx === i
                        ? "bg-ergo-sky-dark border-ergo-sky text-white"
                        : "bg-transparent border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <div className="text-[0.75rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Color" : "Color"}
              </div>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((col) => (
                  <button
                    key={col.hex}
                    onClick={() => setColorHex(col.hex)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[0.8rem] font-medium border transition-all duration-150 ${
                      colorHex === col.hex
                        ? "border-ergo-sky text-white"
                        : "border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: col.hex }} />
                    {lang === "es" ? col.label : col.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Monitor arm */}
            <div>
              <div className="text-[0.75rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                Monitor arm
              </div>
              <div className="flex flex-wrap gap-2">
                {MONITORS.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMonKey(m.key)}
                    className={`px-4 py-2 text-[0.8rem] font-medium border transition-all duration-150 ${
                      monKey === m.key
                        ? "bg-ergo-sky-dark border-ergo-sky text-white"
                        : "bg-transparent border-ergo-800 text-ergo-400 hover:border-ergo-500 hover:text-ergo-200"
                    }`}
                  >
                    {lang === "es" ? m.labelEs : m.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessories */}
            <div>
              <div className="text-[0.75rem] font-semibold text-ergo-400 uppercase tracking-widest mb-2">
                {lang === "es" ? "Accesorios" : "Accessories"}
              </div>
              <div className="flex flex-col gap-2">
                {ACCESSORIES.map((a) => (
                  <div key={a.key} className="flex items-center justify-between py-2 border-b border-ergo-900">
                    <span className="text-[0.82rem] text-ergo-300">
                      {lang === "es" ? a.labelEs : a.labelEn}
                      <span className="text-ergo-500 ml-1">+${a.price}</span>
                    </span>
                    <button
                      onClick={() => toggleAcc(a.key)}
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${
                        accessories[a.key] ? "bg-ergo-sky-dark" : "bg-ergo-800"
                      }`}
                      aria-pressed={accessories[a.key]}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                          accessories[a.key] ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total + CTA */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-[0.72rem] text-ergo-500 uppercase tracking-widest">
                  {lang === "es" ? "Total del setup" : "Setup total"}
                </div>
                <div className="text-2xl font-bold text-white font-display">${total}</div>
              </div>
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 px-6 py-3 bg-ergo-sky-dark text-white font-semibold text-[0.84rem] hover:bg-ergo-sky transition-colors duration-200"
              >
                {lang === "es" ? "Configurar" : "Configure"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
