"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"

export default function StoreSearch({
  initialQuery,
  totalCount,
}: {
  initialQuery?: string
  totalCount?: number
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(initialQuery ?? "")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateQuery = useCallback(
    (q: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (q) {
        params.set("q", q)
      } else {
        params.delete("q")
      }
      params.delete("page")
      router.push(pathname + "?" + params.toString())
    },
    [pathname, router, searchParams]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateQuery(value)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value])

  return (
    <div className="flex flex-col gap-y-2 mb-6">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full border border-ergo-200 rounded-base px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
        />
        {value && (
          <button
            onClick={() => setValue("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ergo-400 hover:text-ergo-600 text-lg leading-none"
            aria-label="Limpiar búsqueda"
          >
            ×
          </button>
        )}
      </div>
      {value && totalCount !== undefined && (
        <p className="text-xs text-ergo-600">
          {totalCount} resultado{totalCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  )
}
