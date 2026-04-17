"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useLang } from "@lib/i18n/context"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"

// Spanish display names for known category handles
const CAT_ES: Record<string, string> = {
  "standing-desks": "Standing Desks",
  office: "Oficina",
  chairs: "Sillas",
  storage: "Almacenamiento",
  accessories: "Accesorios",
  // sub-categories (keep DB names if already in Spanish)
}

type CategorySidebarProps = {
  categories: HttpTypes.StoreProductCategory[]
  activeCategoryId?: string
}

const CategorySidebar = ({ categories, activeCategoryId }: CategorySidebarProps) => {
  const lang = useLang()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpand = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const setCategory = useCallback(
    (catId: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (catId) {
        params.set("category_id", catId)
      } else {
        params.delete("category_id")
      }
      params.delete("page")
      router.push(`${pathname}?${params.toString()}`)
    },
    [pathname, router, searchParams]
  )

  const getCatLabel = (cat: HttpTypes.StoreProductCategory) => {
    if (lang !== "en") {
      return CAT_ES[cat.handle ?? ""] ?? cat.name
    }
    return cat.name
  }

  return (
    <div className="flex flex-col gap-1 text-sm">
      <p className="font-semibold text-ui-fg-base mb-2 uppercase text-xs tracking-widest">
        {lang === "en" ? "Categories" : "Categorías"}
      </p>

      {/* All products */}
      <button
        onClick={() => setCategory(null)}
        className={`text-left px-2 py-1 rounded-base transition-colors ${
          !activeCategoryId
            ? "bg-ui-bg-interactive text-white font-medium"
            : "text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle"
        }`}
      >
        {lang === "en" ? "All products" : "Todos los productos"}
      </button>

      {/* Parent categories */}
      {categories
        .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
        .map((cat) => {
          const children = (cat as any).category_children as
            | HttpTypes.StoreProductCategory[]
            | undefined
          const hasChildren = children && children.length > 0
          const isExpanded = expanded.has(cat.id)
          const isActive = activeCategoryId === cat.id

          return (
            <div key={cat.id}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCategory(cat.id)}
                  className={`flex-1 text-left px-2 py-1 rounded-base transition-colors ${
                    isActive
                      ? "bg-ui-bg-interactive text-white font-medium"
                      : "text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle"
                  }`}
                >
                  {getCatLabel(cat)}
                  {cat.products && cat.products.length > 0 && (
                    <span className="ml-1 text-ui-fg-muted text-xs">
                      ({(cat.products as any[]).length})
                    </span>
                  )}
                </button>
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(cat.id)}
                    className="p-1 text-ui-fg-muted hover:text-ui-fg-base"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    <span
                      className="inline-block transition-transform duration-fast"
                      style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
                    >
                      ▶
                    </span>
                  </button>
                )}
              </div>

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="ml-4 mt-1 flex flex-col gap-0.5">
                  {children!
                    .sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))
                    .map((child) => {
                      const childActive = activeCategoryId === child.id
                      return (
                        <button
                          key={child.id}
                          onClick={() => setCategory(child.id)}
                          className={`text-left px-2 py-1 rounded-base transition-colors ${
                            childActive
                              ? "bg-ui-bg-interactive text-white font-medium"
                              : "text-ui-fg-subtle hover:text-ui-fg-base hover:bg-ui-bg-subtle"
                          }`}
                        >
                          {child.name}
                          {child.products && child.products.length > 0 && (
                            <span className="ml-1 text-ui-fg-muted text-xs">
                              ({(child.products as any[]).length})
                            </span>
                          )}
                        </button>
                      )
                    })}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default CategorySidebar
