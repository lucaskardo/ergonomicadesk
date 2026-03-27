import { MetadataRoute } from "next"
import { SITE_URL, productPath, categoryPath, collectionPath, blogPath, commercialPath, alternateUrls } from "@lib/util/routes"

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

async function getCollections(): Promise<Array<{ handle: string; updated_at: string }>> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/collections?limit=100&fields=handle,updated_at`, {
      headers: { "x-publishable-api-key": API_KEY },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const { collections } = await res.json()
    return collections || []
  } catch { return [] }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const categories = await getCategories()
  const collections = await getCollections()

  const staticPages = [
    { path: "", priority: 1.0 },
    { path: "/store", priority: 0.9 },
    { path: "/faq", priority: 0.6 },
    { path: "/returns", priority: 0.4 },
    { path: "/terms", priority: 0.3 },
    { path: "/privacy", priority: 0.3 },
    { path: "/warranty", priority: 0.5 },
    { path: "/catalog", priority: 0.8 },
    { path: "/showroom", priority: 0.6 },
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
    const path = productPath(product.handle)
    entries.push({
      url: `${SITE_URL}/pa${path}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: alternateUrls("pa", path),
      },
    })
  }

  // Categories
  for (const cat of categories) {
    const path = categoryPath(cat.handle)
    entries.push({
      url: `${SITE_URL}/pa${path}`,
      lastModified: cat.updated_at ? new Date(cat.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: alternateUrls("pa", path),
      },
    })
  }

  // Collections
  for (const col of collections) {
    const path = collectionPath(col.handle)
    entries.push({
      url: `${SITE_URL}/pa${path}`,
      lastModified: col.updated_at ? new Date(col.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: alternateUrls("pa", path),
      },
    })
  }

  // Comercial pages
  const commercialSlugs = ["oficinas", "educacion", "horeca", "salud"]
  entries.push({
    url: `${SITE_URL}/pa/comercial`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: { languages: alternateUrls("pa", "/comercial") },
  })
  for (const slug of commercialSlugs) {
    const path = commercialPath(slug)
    entries.push({
      url: `${SITE_URL}/pa${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: alternateUrls("pa", path) },
    })
  }

  // Blog posts — sourced from src/content/blog/posts.ts
  const { getAllPosts } = await import("@/content/blog/posts")
  const blogSlugs = getAllPosts().map((p) => p.slug)
  for (const slug of blogSlugs) {
    const path = blogPath(slug)
    entries.push({
      url: `${SITE_URL}/pa${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: alternateUrls("pa", path),
      },
    })
  }

  return entries
}
