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
