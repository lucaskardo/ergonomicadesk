import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { listCategories } from "@lib/data/categories"
import { getLang } from "@lib/i18n"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InlineSortSelect from "@modules/store/components/inline-sort-select"

import PaginatedProductsCountWrapper from "./paginated-products-count-wrapper"
import StoreHeading from "@modules/store/components/store-heading"

// Spanish display names for known handles
const CAT_ES: Record<string, string> = {
  "standing-desks": "Standing Desks",
  office: "Oficina",
  chairs: "Sillas",
  storage: "Almacenamiento",
  accessories: "Accesorios",
}

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categoryId,
  q,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryId?: string
  q?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const lang = await getLang()

  // Fetch top-level categories for horizontal pills
  const allCategories = await listCategories()
  const parentCategories = allCategories.filter(
    (c: any) => !c.parent_category_id && !c.parent_category
  )

  // Expand categoryId to include children (same logic as CategoryTemplate)
  let resolvedCategoryIds: string[] | undefined
  if (categoryId) {
    const cat = allCategories.find((c: any) => c.id === categoryId)
    resolvedCategoryIds = [
      categoryId,
      ...(cat?.category_children?.map((c: any) => c.id) ?? []),
    ]
  } else if (q && q.length >= 3) {
    // Category-name search: if q matches a category name, filter by that category
    const qLower = q.toLowerCase()
    const matchingCat = parentCategories.find((cat: any) => {
      const esName = (CAT_ES[cat.handle ?? ""] ?? cat.name ?? "").toLowerCase()
      const enName = (cat.name ?? "").toLowerCase()
      return esName.includes(qLower) || qLower.includes(esName) ||
             enName.includes(qLower) || qLower.includes(enName)
    })
    if (matchingCat) {
      resolvedCategoryIds = [
        matchingCat.id,
        ...(matchingCat.category_children?.map((c: any) => c.id) ?? []),
      ]
    }
  }

  return (
    <div className="flex flex-col py-8 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 gap-6" data-testid="category-container">
      {/* Top row: heading */}
      <StoreHeading />

      {/* Category filter pills — square corners */}
      <div className="flex flex-wrap gap-2">
        <LocalizedClientLink
          href="/store"
          className={`px-4 py-2 text-[0.82rem] font-semibold transition-colors border ${
            !categoryId
              ? "bg-ergo-950 text-white border-ergo-950"
              : "border-ergo-200/80 text-ergo-600 hover:border-ergo-600 hover:text-ergo-950"
          }`}
        >
          {lang === "en" ? "All" : "Todos"}
        </LocalizedClientLink>
        {parentCategories
          .sort((a: any, b: any) => (a.rank ?? 0) - (b.rank ?? 0))
          .map((cat: any) => {
            const label = lang === "en" ? cat.name : (CAT_ES[cat.handle ?? ""] ?? cat.name)
            const isActive = categoryId === cat.id
            return (
              <LocalizedClientLink
                key={cat.id}
                href={`/store?category_id=${cat.id}`}
                className={`px-4 py-2 text-[0.82rem] font-semibold transition-colors border ${
                  isActive
                    ? "bg-ergo-950 text-white border-ergo-950"
                    : "border-ergo-200/80 text-ergo-600 hover:border-ergo-600 hover:text-ergo-950"
                }`}
              >
                {label}
              </LocalizedClientLink>
            )
          })}
      </div>

      {/* Sort row */}
      <div className="flex items-center">
        <InlineSortSelect sortBy={sort} lang={lang} />
      </div>

      {/* Product grid (includes search input) */}
      <Suspense fallback={<SkeletonProductGrid />}>
        <PaginatedProductsCountWrapper
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
          categoryId={resolvedCategoryIds}
          q={resolvedCategoryIds && !categoryId ? undefined : q}
          initialQuery={q}
        />
      </Suspense>
    </div>
  )
}

export default StoreTemplate
