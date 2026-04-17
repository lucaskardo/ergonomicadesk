"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

const sortOptions = [
  { value: "created_at", es: "Más reciente", en: "Newest" },
  { value: "price_asc", es: "Precio: menor → mayor", en: "Price: Low → High" },
  { value: "price_desc", es: "Precio: mayor → menor", en: "Price: High → Low" },
]

export default function InlineSortSelect({
  sortBy,
  lang,
}: {
  sortBy: string
  lang: "es" | "en"
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sortBy", e.target.value)
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-ergo-600 whitespace-nowrap">
        {lang === "en" ? "Sort:" : "Ordenar:"}
      </span>
      <select
        value={sortBy}
        onChange={handleChange}
        className="text-sm border border-ergo-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white cursor-pointer"
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {lang === "en" ? o.en : o.es}
          </option>
        ))}
      </select>
    </div>
  )
}
