"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { useRouter, useParams } from "next/navigation"
import { useLang } from "@lib/i18n/context"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { trackSearch, trackSelectItem, trackEvent, trackViewItemList } from "@lib/tracking"
import { productPath } from "@lib/util/routes"

interface SearchResult {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  price?: string
  variants?: Array<{ sku?: string; id?: string }>
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
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "pa"
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
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
      setActiveIndex(-1)
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
        const meiliHost = process.env.NEXT_PUBLIC_MEILISEARCH_HOST
        const meiliKey = process.env.NEXT_PUBLIC_MEILISEARCH_API_KEY

        let products: any[] = []

        if (meiliHost) {
          // Use Meilisearch directly for instant search
          const meiliRes = await fetch(`${meiliHost}/indexes/products/search`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(meiliKey ? { Authorization: `Bearer ${meiliKey}` } : {}),
            },
            body: JSON.stringify({
              q: query,
              limit: 8,
              attributesToRetrieve: ["id", "title", "handle", "thumbnail", "variants"],
            }),
          })
          if (meiliRes.ok) {
            const meiliData = await meiliRes.json()
            products = meiliData.hits || []
          }
        }

        // Fallback to Medusa API if Meilisearch not configured or returned empty
        if (products.length === 0) {
          const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ""
          const url = `${BACKEND_URL}/store/products?q=${encodeURIComponent(query)}&limit=8`
          const res = await fetch(url, {
            headers: { "x-publishable-api-key": publishableKey },
          })
          if (res.ok) {
            const data = await res.json()
            products = data.products ?? []
          }
        }

        const mapped = products.map((p: any) => ({
          id: p.id,
          title: p.title,
          handle: p.handle,
          thumbnail: p.thumbnail ?? null,
          variants: p.variants,
          price: p.variants?.[0]?.calculated_price?.calculated_amount
            ? `$${(p.variants[0].calculated_price.calculated_amount / 100).toFixed(2)}`
            : undefined,
        }))
        setResults(mapped)
        setActiveIndex(-1)
        trackSearch(query, products.length)
        if (products.length > 0) {
          trackViewItemList(mapped, "search_results")
        } else {
          trackEvent("search_zero_results", { search_term: query })
        }
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => window.clearTimeout(timeoutRef.current)
  }, [query])

  const navigateToResult = useCallback(
    (result: SearchResult, index: number) => {
      trackSelectItem(
        { id: result.id, title: result.title, variants: result.variants },
        "search_results",
        index
      )
      const path = lang === "en"
        ? `/${countryCode}/en${productPath(result.handle)}`
        : `/${countryCode}${productPath(result.handle)}`
      onClose()
      router.push(path)
    },
    [lang, countryCode, router, onClose]
  )

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        if (activeIndex >= 0 && results.length > 0) {
          navigateToResult(results[activeIndex], activeIndex)
        } else if (query.trim()) {
          const storePath = lang === "en"
            ? `/${countryCode}/en/store?q=${encodeURIComponent(query.trim())}`
            : `/${countryCode}/store?q=${encodeURIComponent(query.trim())}`
          onClose()
          router.push(storePath)
        }
        return
      }
      if (results.length === 0) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
    }
    if (isOpen) document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose, results, activeIndex, navigateToResult])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[108px] px-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-elevated overflow-hidden">
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
              type="button"
              onClick={() => setQuery("")}
              aria-label={lang === "en" ? "Clear search" : "Borrar búsqueda"}
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
              <ul role="listbox">
                {results.map((result, index) => (
                  <li key={result.id} className="border-b border-ui-border-base last:border-0" role="option" aria-selected={index === activeIndex}>
                    <LocalizedClientLink
                      href={productPath(result.handle)}
                      onClick={() => {
                        trackSelectItem({ id: result.id, title: result.title, variants: result.variants }, "search_results", index)
                        onClose()
                      }}
                      className={`flex items-center gap-3 px-4 py-3 transition-colors ${index === activeIndex ? "bg-ui-bg-subtle" : "hover:bg-ui-bg-subtle"}`}
                    >
                      <div className="w-12 h-12 flex-shrink-0 rounded-base overflow-hidden bg-ui-bg-subtle">
                        {result.thumbnail ? (
                          <Image
                            src={result.thumbnail}
                            alt={result.title}
                            width={48}
                            height={48}
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
