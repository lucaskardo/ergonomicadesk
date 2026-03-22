import { notFound } from "next/navigation"
import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
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

  const subcategories = category.category_children ?? []

  return (
    <div className="flex flex-col py-6 content-container gap-6" data-testid="category-container">
      {/* Top row: H1 + breadcrumb */}
      <div className="flex flex-wrap items-baseline gap-2 text-2xl-semi">
        {parents.map((parent) => (
          <span key={parent.id} className="text-ui-fg-subtle">
            <LocalizedClientLink
              className="hover:text-black"
              href={`/categories/${parent.handle}`}
            >
              {parent.name}
            </LocalizedClientLink>
            {" /"}
          </span>
        ))}
        <h1 data-testid="category-page-title">{category.name}</h1>
      </div>

      {category.description && (
        <p className="text-base-regular text-gray-600">{category.description}</p>
      )}

      {/* Subcategory pills */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subcategories.map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={`/categories/${c.handle}`}
              className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
            >
              {c.name}
            </LocalizedClientLink>
          ))}
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
        />
      </Suspense>
    </div>
  )
}
