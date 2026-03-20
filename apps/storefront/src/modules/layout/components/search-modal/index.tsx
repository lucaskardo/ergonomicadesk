"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useLang } from "@lib/i18n/context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface SearchResult {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  price?: string
}

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const lang = useLang()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<number | undefined>(undefined)

  const placeholder = lang === "en" ? "Search products..." : "Buscar productos..."
  const noResults = lang === "en" ? "No products found" : "No se encontraron productos"

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(async () => {
      setLoading(true)
      try {
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""
        const url = `${BACKEND_URL}/store/products?q=${encodeURIComponent(query)}&limit=8`
        const res = await fetch(url, {
          headers: {
            "x-publishable-api-key": publishableKey,
          },
        })
        if (!res.ok) throw new Error("Search failed")
        const data = await res.json()
        const products = data.products ?? []
        setResults(
          products.map((p: any) => ({
            id: p.id,
            title: p.title,
            handle: p.handle,
            thumbnail: p.thumbnail ?? null,
            price: p.variants?.[0]?.calculated_price?.calculated_amount
              ? `$${(p.variants[0].calculated_price.calculated_amount / 100).toFixed(2)}`
              : undefined,
          }))
        )
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timeoutRef.current)
  }, [query])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ui-border-base">
          <svg
            className="w-5 h-5 text-ui-fg-muted flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 outline-none text-sm text-ui-fg-base placeholder-ui-fg-muted bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-ui-fg-muted hover:text-ui-fg-base text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results */}
        {query.trim() && (
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="px-4 py-6 text-center text-sm text-ui-fg-muted">
                {lang === "en" ? "Searching..." : "Buscando..."}
              </div>
            ) : results.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-ui-fg-muted">
                {noResults}
              </div>
            ) : (
              <ul>
                {results.map((result) => (
                  <li key={result.id} className="border-b border-ui-border-base last:border-0">
                    <LocalizedClientLink
                      href={`/products/${result.handle}`}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-ui-bg-subtle transition-colors"
                    >
                      <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-ui-bg-subtle">
                        {result.thumbnail ? (
                          <img
                            src={result.thumbnail}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-ui-bg-subtle" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ui-fg-base truncate">
                          {result.title}
                        </p>
                        {result.price && (
                          <p className="text-sm text-ui-fg-subtle">{result.price}</p>
                        )}
                      </div>
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchModal
