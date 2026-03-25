const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",   // Google Ads cross-device
  "wbraid",   // Google Ads web-to-app
  "fbclid",
  "ctwa_clid",
]
const FIRST_TOUCH_COOKIE = "_ergo_ft"
const LAST_TOUCH_COOKIE = "_ergo_lt"
const SESSION_COOKIE = "_ergo_sid"
const LEAD_COOKIE = "_ergo_lid"
const PAGES_COOKIE = "_ergo_pages"
const VIEWED_COOKIE = "_ergo_viewed"

// Legacy cookie name for backwards compat with placeOrder()
const LEGACY_UTM_COOKIE = "_ergo_utm"

function generateId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function setCookie(name: string, value: string, maxAgeDays: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeDays * 86400}; SameSite=Lax`
}

function getCookie(name: string): string | null {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`))
  return m ? decodeURIComponent(m[1]) : null
}

function parseCookie<T>(name: string): T | null {
  const raw = getCookie(name)
  if (!raw) return null
  try { return JSON.parse(raw) as T } catch { return null }
}

export function captureUtmParams() {
  if (typeof window === "undefined") return

  // ── Session ID — expires after 30min inactivity (new cookie = new session)
  let sessionId = getCookie(SESSION_COOKIE)
  if (!sessionId) {
    sessionId = generateId()
  }
  setCookie(SESSION_COOKIE, sessionId, 0.0208) // ~30 min

  // ── Lead ID — persists 180 days (stable across sessions)
  let leadId = getCookie(LEAD_COOKIE)
  if (!leadId) {
    leadId = generateId()
  }
  setCookie(LEAD_COOKIE, leadId, 180)

  // ── Capture UTM + context from URL
  const sp = new URLSearchParams(window.location.search)
  const touchData: Record<string, string> = {}
  let hasUtm = false

  UTM_PARAMS.forEach((p) => {
    const v = sp.get(p)
    if (v) {
      touchData[p] = v
      hasUtm = true
    }
  })

  // Always capture context with touch data
  if (hasUtm) {
    touchData.landing_page = window.location.pathname
    touchData.referrer = document.referrer || ""
    touchData.timestamp = new Date().toISOString()
    touchData.session_id = sessionId
    const w = window.innerWidth
    touchData.device_type = w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop"

    // Capture Meta cookies
    const fbp = getCookie("_fbp")
    const fbc = getCookie("_fbc")
    if (fbp) touchData._fbp = fbp
    if (fbc) touchData._fbc = fbc

    // ── First touch — set ONCE, never overwrite
    const existingFt = parseCookie<Record<string, string>>(FIRST_TOUCH_COOKIE)
    if (!existingFt) {
      setCookie(FIRST_TOUCH_COOKIE, JSON.stringify(touchData), 180)
    }

    // ── Last touch — always overwrite
    setCookie(LAST_TOUCH_COOKIE, JSON.stringify(touchData), 30)

    // Legacy cookie for placeOrder() backwards compat
    setCookie(LEGACY_UTM_COOKIE, JSON.stringify(touchData), 30)
  }

  // ── Page count (always increment)
  try {
    const existing = getCookie(PAGES_COOKIE)
    const count = existing ? parseInt(existing) + 1 : 1
    setCookie(PAGES_COOKIE, String(count), 1)
  } catch { /* ignore */ }
}

// ── Public getters ──

export function getStoredUtm(): Record<string, string> | null {
  return parseCookie<Record<string, string>>(LAST_TOUCH_COOKIE)
    || parseCookie<Record<string, string>>(LEGACY_UTM_COOKIE)
}

export function getFirstTouch(): Record<string, string> | null {
  return parseCookie<Record<string, string>>(FIRST_TOUCH_COOKIE)
}

export function getLastTouch(): Record<string, string> | null {
  return parseCookie<Record<string, string>>(LAST_TOUCH_COOKIE)
}

export function getSessionId(): string | null {
  if (typeof document === "undefined") return null
  return getCookie(SESSION_COOKIE)
}

export function getLeadId(): string | null {
  if (typeof document === "undefined") return null
  return getCookie(LEAD_COOKIE)
}

export function getSessionPages(): string {
  if (typeof document === "undefined") return "0"
  return getCookie(PAGES_COOKIE) || "0"
}

export function getViewedProducts(): string[] {
  if (typeof document === "undefined") return []
  const raw = parseCookie<string[]>(VIEWED_COOKIE)
  return raw || []
}

export function getMetaCookies(): { fbp: string | null; fbc: string | null } {
  if (typeof document === "undefined") return { fbp: null, fbc: null }
  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
  }
}
