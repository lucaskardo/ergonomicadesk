"use client"

import { useLang } from "@lib/i18n/context"
import { useParams } from "next/navigation"
import Link from "next/link"

const StandingDeskIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="22" width="32" height="4" rx="1" />
    <rect x="12" y="26" width="3" height="16" />
    <rect x="33" y="26" width="3" height="16" />
    <path d="M24 22V8" />
    <path d="M20 12l4-4 4 4" />
  </svg>
)

const ChairIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 30V14a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v16" />
    <rect x="12" y="30" width="24" height="4" rx="2" />
    <path d="M18 34v8M30 34v8" />
    <path d="M14 42h6M28 42h6" />
  </svg>
)

const DeskIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="16" width="36" height="5" rx="1" />
    <path d="M10 21v16M38 21v16" />
    <rect x="10" y="26" width="12" height="8" rx="1" />
  </svg>
)

const CabinetIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="6" width="28" height="36" rx="2" />
    <line x1="10" y1="24" x2="38" y2="24" />
    <circle cx="24" cy="16" r="1.5" fill="currentColor" />
    <circle cx="24" cy="32" r="1.5" fill="currentColor" />
  </svg>
)

const AccessoryIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="14" width="28" height="18" rx="3" />
    <path d="M18 32v4M30 32v4" />
    <line x1="15" y1="36" x2="33" y2="36" />
    <rect x="20" y="20" width="8" height="5" rx="1" />
  </svg>
)

const CATEGORIES = [
  { handle: "standing-desks", Icon: StandingDeskIcon, es: "Standing Desks", en: "Standing Desks", price: "$280" },
  { handle: "chairs", Icon: ChairIcon, es: "Sillas", en: "Chairs", price: "$180" },
  { handle: "office", Icon: DeskIcon, es: "Oficina", en: "Office", price: "$240" },
  { handle: "storage", Icon: CabinetIcon, es: "Almacenamiento", en: "Storage", price: "$160" },
  { handle: "accessories", Icon: AccessoryIcon, es: "Accesorios", en: "Accessories", price: "$25" },
]

const CategoryGrid = () => {
  const lang = useLang()
  const { countryCode } = useParams()
  const langPrefix = lang === "en" ? "/en" : ""
  const base = `/${countryCode}${langPrefix}`

  const fromLabel = lang === "en" ? "From" : "Desde"

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(({ handle, Icon, es, en, price }) => (
            <Link
              key={handle}
              href={`${base}/categories/${handle}`}
              className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 group"
            >
              <div className="flex justify-center text-teal-600 group-hover:scale-110 transition-transform duration-200">
                <Icon />
              </div>
              <p className="font-semibold text-gray-900 mt-3 text-sm">
                {lang === "en" ? en : es}
              </p>
              <p className="text-sm text-teal-600 font-medium mt-1">
                {fromLabel} {price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
