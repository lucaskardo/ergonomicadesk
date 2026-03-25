import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"
import { fetchWithTimeout } from "@lib/util/fetch-safe"

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL) {
    console.error("Middleware: MEDUSA_BACKEND_URL not set")
    return regionMap
  }

  // Return cached if fresh
  if (
    regionMap.size > 0 &&
    regionMapUpdated > Date.now() - 3600 * 1000
  ) {
    return regionMap
  }

  try {
    const response = await fetchWithTimeout(
      `${BACKEND_URL}/store/regions`,
      {
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
        timeout: 5000,
      }
    )

    const json = await response.json()

    if (!response.ok) {
      throw new Error(json.message || `HTTP ${response.status}`)
    }

    const { regions } = json

    if (!regions?.length) {
      console.warn("Middleware: No regions returned from Medusa")
      return regionMap
    }

    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })
    regionMapCache.regionMapUpdated = Date.now()

    return regionMapCache.regionMap
  } catch (err) {
    console.error("Middleware: Failed to fetch regions:", err instanceof Error ? err.message : err)
    return regionMap.size > 0 ? regionMap : new Map()
  }
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL."
      )
    }
  }
}

// ── 301 Redirect Map (old site → new site) ──────────────────────────────────

const CATEGORY_REDIRECTS: Record<string, string> = {
  "/categories": "/store",
  "/categories/desks": "/categorias/standing-desks",
  "/categories/seating": "/categorias/sillas",
  "/categories/stands": "/categorias/accesorios",
  "/categories/accesories": "/categorias/accesorios",
  "/categories/hubs_adapters": "/store",
  "/categories/keyboard_mouse": "/categorias/accesorios",
  "/categories/chargers": "/store",
  "/categories/sound": "/store",
  "/categories/health": "/categorias/accesorios",
  "/categories/decoration": "/store",
  "/categories/monitors": "/store",
}

const SUBCATEGORY_REDIRECTS: Record<string, string> = {
  "/subcategories/desk_frames": "/categorias/standing-desks",
  "/subcategories/table_tops": "/categorias/standing-desks",
  "/subcategories/monitor_arms": "/categorias/accesorios",
  "/subcategories/laptop_stands": "/categorias/accesorios",
  "/subcategories/tablet_stands": "/categorias/accesorios",
  "/subcategories/headphone_stands": "/categorias/accesorios",
  "/subcategories/phone_stands": "/categorias/accesorios",
  "/subcategories/cpu_stands": "/categorias/accesorios",
  "/subcategories/monitor_risers": "/categorias/accesorios",
  "/subcategories/anti_fatigue_mats": "/categorias/accesorios",
  "/subcategories/pads": "/categorias/accesorios",
  "/subcategories/cabinets": "/categorias/almacenamiento",
  "/subcategories/lighting": "/categorias/accesorios",
  "/subcategories/cable_management": "/categorias/accesorios",
  "/subcategories/balance_boards": "/categorias/accesorios",
  "/subcategories/under_desk_drawer": "/categorias/almacenamiento",
  "/subcategories/foot_rest": "/categorias/accesorios",
  "/subcategories/wrist_rests": "/categorias/accesorios",
  "/subcategories/desk_casters": "/categorias/accesorios",
}

const PAGE_REDIRECTS: Record<string, string> = {
  "/blog": "/blog",
  "/faq": "/faq",
  "/policies/delivery": "/returns",
  "/policies/cancellation": "/returns",
  "/policies/privacy": "/privacy",
  "/policies/terms": "/terms",
  "/signin": "/store",
  "/signup": "/store",
  "/cart": "/cart",
}

// Products with same SKU — direct redirect
// Products with discontinued SKUs — redirect to closest equivalent
const PRODUCT_REDIRECT_PATTERNS: Array<{
  match: RegExp | string
  target: string
}> = [
  // Discontinued monitor arms → single arm
  { match: /^\/products\/stand-arm-alum-/, target: "/productos/stand-arm-single-bl" },
  // All old laptop stands → adjustable laptop stand
  { match: /^\/products\/stand-laptop-x-/, target: "/productos/stand-laptop-adjus-sl" },
  { match: /^\/products\/stand-laptop-vertical-/, target: "/productos/stand-laptop-adjus-sl" },
  { match: /^\/products\/stand-laptop-clasic-/, target: "/productos/stand-laptop-adjus-sl" },
  { match: /^\/products\/stand-laptop-360-/, target: "/productos/stand-laptop-adjus-sl" },
  { match: /^\/products\/stand-laptop-tilt-/, target: "/productos/stand-laptop-adjus-sl" },
  // Old melamine tops (old sizes 121/152/182) → consolidated product
  { match: /^\/products\/top-mela-.*-(121|152|182)$/, target: "/productos/sobre-melamina" },
  // Discontinued chairs → chairs category
  { match: /^\/products\/chair-parser-/, target: "/categorias/sillas" },
  { match: /^\/products\/chair-ajax-/, target: "/categorias/sillas" },
  // Discontinued monitors → store
  { match: /^\/products\/monitor-/, target: "/store" },
  // Discontinued hubs/chargers/sound/decoration → store
  { match: /^\/products\/hub-/, target: "/store" },
  { match: /^\/products\/adapter-/, target: "/store" },
  { match: /^\/products\/charge-/, target: "/store" },
  { match: /^\/products\/sound-/, target: "/store" },
  { match: /^\/products\/decor-/, target: "/store" },
  { match: /^\/products\/light-/, target: "/store" },
  // Stool → chairs category
  { match: /^\/products\/stool-/, target: "/categorias/sillas" },
  // Wrist rests (discontinued) → accesorios
  { match: /^\/products\/wrist-rest-/, target: "/categorias/accesorios" },
  // Phone stands (discontinued) → accesorios
  { match: /^\/products\/stand-phone-/, target: "/categorias/accesorios" },
  // Monitor risers (discontinued) → accesorios
  { match: /^\/products\/stand-riser-/, target: "/categorias/accesorios" },
]

function getOldSiteRedirect(pathname: string): string | null {
  // 1. Exact match: categories
  if (CATEGORY_REDIRECTS[pathname]) return CATEGORY_REDIRECTS[pathname]
  // 2. Exact match: subcategories
  if (SUBCATEGORY_REDIRECTS[pathname]) return SUBCATEGORY_REDIRECTS[pathname]
  // 3. Exact match: pages
  if (PAGE_REDIRECTS[pathname]) return PAGE_REDIRECTS[pathname]
  // 4. Product patterns (discontinued → closest equivalent)
  for (const pattern of PRODUCT_REDIRECT_PATTERNS) {
    if (pattern.match instanceof RegExp) {
      if (pattern.match.test(pathname)) return pattern.target
    } else if (pathname === pattern.match) {
      return pattern.target
    }
  }
  // 5. Products with same SKU: /products/{sku} → /productos/{sku}
  const productMatch = pathname.match(/^\/products\/([a-z0-9-]+)$/)
  if (productMatch) {
    return `/productos/${productMatch[1]}`
  }
  // 6. Catch-all for old site patterns
  if (pathname.startsWith("/categories/") || pathname.startsWith("/subcategories/")) {
    return "/store"
  }
  return null
}

export async function middleware(request: NextRequest) {
  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  let cacheIdCookie = request.cookies.get("_medusa_cache_id")

  let cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)

  if (!regionMap || regionMap.size === 0) {
    return new NextResponse("Service temporarily unavailable. Please refresh.", { status: 503 })
  }

  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  // ── 301 Redirects for old site URLs ────────────────────────────────────────
  const oldRedirect = getOldSiteRedirect(request.nextUrl.pathname)
  if (oldRedirect) {
    const countryPrefix = countryCode || "pa"
    const newUrl = `${request.nextUrl.origin}/${countryPrefix}${oldRedirect}`
    return NextResponse.redirect(newUrl, { status: 301 })
  }

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  // Detect language from URL: /[countryCode]/en/... → English
  const pathParts = request.nextUrl.pathname.split("/")
  const lang = urlHasCountryCode && pathParts[2] === "en" ? "en" : "es"

  // Compute the canonical path (without countryCode and lang prefix)
  const pathAfterCountry = lang === "en"
    ? "/" + pathParts.slice(3).join("/")
    : "/" + pathParts.slice(2).join("/")
  const canonicalPath = pathAfterCountry === "/" ? "/" : pathAfterCountry.replace(/\/$/, "") || "/"

  if (urlHasCountryCode && cacheIdCookie) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-lang", lang)
    requestHeaders.set("x-canonical-path", canonicalPath)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  if (urlHasCountryCode && !cacheIdCookie) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-lang", lang)
    requestHeaders.set("x-canonical-path", canonicalPath)
    response = NextResponse.next({ request: { headers: requestHeaders } })
    response.cookies.set("_medusa_cache_id", cacheId, {
      maxAge: 60 * 60 * 24,
    })
    return response
  }

  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  } else if (!urlHasCountryCode && !countryCode) {
    return new NextResponse(
      "No valid regions configured. Please set up regions with countries in your Medusa Admin.",
      { status: 500 }
    )
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
