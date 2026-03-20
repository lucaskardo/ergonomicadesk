import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import CategorySidebar from "@modules/store/components/category-sidebar"
import { listCategories } from "@lib/data/categories"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categoryId,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryId?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch top-level categories for sidebar
  const allCategories = await listCategories()
  const parentCategories = allCategories.filter(
    (c: any) => !c.parent_category_id && !c.parent_category
  )

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container gap-6"
      data-testid="category-container"
    >
      {/* Sidebar */}
      <div className="small:min-w-[200px] small:max-w-[220px] w-full">
        <div className="flex flex-col gap-8">
          <CategorySidebar
            categories={parentCategories}
            activeCategoryId={categoryId}
          />
          <RefinementList sortBy={sort} />
        </div>
      </div>

      {/* Product grid */}
      <div className="w-full">
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            categoryId={categoryId}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
