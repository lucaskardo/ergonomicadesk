const PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ctwa_clid",
]
const COOKIE = "_ergo_utm"

export function captureUtmParams() {
  if (typeof window === "undefined") return
  const sp = new URLSearchParams(window.location.search)
  const data: Record<string, string> = {}
  let found = false
  PARAMS.forEach((p) => {
    const v = sp.get(p)
    if (v) {
      data[p] = v
      found = true
    }
  })
  if (found) {
    data.landing_page = window.location.pathname
    data.referrer = document.referrer || ""
    data.timestamp = new Date().toISOString()
    const w = window.innerWidth
    data.device_type = w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop"
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${30 * 86400}; SameSite=Lax`
  }
  // Track session pages (always)
  try {
    const existing = document.cookie.match(/_ergo_pages=(\d+)/)
    const count = existing ? parseInt(existing[1]) + 1 : 1
    document.cookie = `_ergo_pages=${count}; path=/; max-age=${86400}; SameSite=Lax`
  } catch {
    // ignore
  }
}

export function getStoredUtm(): Record<string, string> | null {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp(`${COOKIE}=([^;]+)`))
  if (m) {
    try {
      return JSON.parse(decodeURIComponent(m[1]))
    } catch {
      return null
    }
  }
  return null
}

export function getSessionPages(): string {
  if (typeof document === "undefined") return "0"
  const m = document.cookie.match(/_ergo_pages=(\d+)/)
  return m ? m[1] : "0"
}

export function getViewedProducts(): string[] {
  if (typeof document === "undefined") return []
  const m = document.cookie.match(/_ergo_viewed=([^;]+)/)
  if (m) {
    try {
      return JSON.parse(decodeURIComponent(m[1]))
    } catch {
      return []
    }
  }
  return []
}
