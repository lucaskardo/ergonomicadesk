import { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ergonomicadesk.com"
const BACKEND_URL = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

async function getProducts(): Promise<Array<{ handle: string; updated_at: string }>> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/products?limit=300&fields=handle,updated_at`, {
      headers: { "x-publishable-api-key": API_KEY },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const { products } = await res.json()
    return products || []
  } catch { return [] }
}

async function getCategories(): Promise<Array<{ handle: string; updated_at: string }>> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/product-categories?limit=100&fields=handle,updated_at`, {
      headers: { "x-publishable-api-key": API_KEY },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const { product_categories } = await res.json()
    return product_categories || []
  } catch { return [] }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const categories = await getCategories()

  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/store", priority: 0.9 },
    { path: "/faq", priority: 0.6 },
    { path: "/returns", priority: 0.4 },
    { path: "/terms", priority: 0.3 },
    { path: "/privacy", priority: 0.3 },
    { path: "/warranty", priority: 0.5 },
    { path: "/catalog", priority: 0.8 },
  ]

  const entries: MetadataRoute.Sitemap = []

  // Static pages — ES and EN
  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}/pa${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.priority >= 0.8 ? "daily" : "weekly",
      priority: page.priority,
      alternates: {
        languages: {
          es: `${SITE_URL}/pa${page.path}`,
          en: `${SITE_URL}/pa/en${page.path}`,
        },
      },
    })
  }

  // Products
  for (const product of products) {
    entries.push({
      url: `${SITE_URL}/pa/productos/${product.handle}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          es: `${SITE_URL}/pa/productos/${product.handle}`,
          en: `${SITE_URL}/pa/en/productos/${product.handle}`,
        },
      },
    })
  }

  // Categories
  for (const cat of categories) {
    entries.push({
      url: `${SITE_URL}/pa/categorias/${cat.handle}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          es: `${SITE_URL}/pa/categorias/${cat.handle}`,
          en: `${SITE_URL}/pa/en/categorias/${cat.handle}`,
        },
      },
    })
  }

  return entries
}
