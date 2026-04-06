import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { categoryPath } from "@lib/util/routes"
import InlineSortSelect from "@modules/store/components/inline-sort-select"
import StoreSearch from "@modules/store/components/store-search"
import { HttpTypes } from "@medusajs/types"
import { getLang } from "@lib/i18n"

export default async function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  q,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  q?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const lang = await getLang()

  if (!category || !countryCode) notFound()

  // Collect all category IDs: parent + all children
  const allCategoryIds = [
    category.id,
    ...(category.category_children?.map((c) => c.id) ?? []),
  ]

  // Breadcrumb parents
  const parents = [] as HttpTypes.StoreProductCategory[]
  const getParents = (cat: HttpTypes.StoreProductCategory) => {
    if (cat.parent_category) {
      parents.push(cat.parent_category)
      getParents(cat.parent_category)
    }
  }
  getParents(category)

  // If current category has children, show them.
  // If not but it has a parent, show siblings (parent's children) so user can keep browsing.
  const subcategories = category.category_children?.length
    ? category.category_children
    : (category.parent_category?.category_children ?? [])

  const isShowingSiblings = !category.category_children?.length && !!category.parent_category

  return (
    <div className="flex flex-col py-8 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 gap-6" data-testid="category-container">
      {/* Breadcrumb */}
      {parents.length > 0 && (
        <div className="flex items-center gap-1.5 text-[0.75rem] text-ergo-400">
          {parents.reverse().map((parent, i) => (
            <span key={parent.id} className="flex items-center gap-1.5">
              <LocalizedClientLink
                className="hover:text-ergo-sky-dark transition-colors"
                href={categoryPath(parent.handle)}
              >
                {parent.name}
              </LocalizedClientLink>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </span>
          ))}
          <span className="text-ergo-600 font-medium">{category.name}</span>
        </div>
      )}

      {/* H1 */}
      <div>
        <h1
          className="font-display font-bold text-ergo-950 leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)", letterSpacing: "-0.02em" }}
          data-testid="category-page-title"
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="text-[0.88rem] text-ergo-400 mt-2">{category.description}</p>
        )}
      </div>

      {/* Subcategory pills */}
      {subcategories.length > 0 && (
        <div className="flex flex-col gap-3">
          {isShowingSiblings && category.parent_category && (
            <LocalizedClientLink
              href={categoryPath(category.parent_category.handle)}
              className="text-[0.78rem] text-ergo-400 hover:text-ergo-sky-dark transition-colors flex items-center gap-1 self-start"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {lang === "en" ? "Back to" : "Volver a"} {category.parent_category.name}
            </LocalizedClientLink>
          )}
          <div className="flex flex-wrap gap-2">
            {subcategories
              .sort((a: any, b: any) => (a.rank ?? 0) - (b.rank ?? 0))
              .map((c) => {
                const isActive = c.id === category.id
                return (
                  <LocalizedClientLink
                    key={c.id}
                    href={categoryPath(c.handle)}
                    className={`px-4 py-2 text-[0.82rem] font-semibold border transition-colors ${
                      isActive
                        ? "bg-ergo-950 text-white border-ergo-950"
                        : "border-ergo-200/80 text-ergo-600 hover:border-ergo-600 hover:text-ergo-950"
                    }`}
                  >
                    {c.name}
                  </LocalizedClientLink>
                )
              })}
          </div>
        </div>
      )}

      {/* Search + Sort row */}
      <div className="flex flex-col small:flex-row gap-3 items-start small:items-center justify-between">
        <Suspense fallback={null}>
          <StoreSearch initialQuery={q} />
        </Suspense>
        <InlineSortSelect sortBy={sort} lang={lang} />
      </div>

      {/* Product grid */}
      <Suspense
        fallback={
          <SkeletonProductGrid numberOfProducts={category.products?.length ?? 8} />
        }
      >
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          categoryId={allCategoryIds}
          countryCode={countryCode}
          q={q}
          listName={`category_${category.handle}`}
        />
      </Suspense>
    </div>
  )
}
