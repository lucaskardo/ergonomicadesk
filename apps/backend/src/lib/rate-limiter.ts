/**
 * In-memory rate limiter.
 *
 * Works for single-instance deployments (dev + single Railway service).
 * TODO (prod): Replace with Redis-based rate limiting so limits survive restarts
 *   and work correctly across multiple instances. Use ioredis + a sliding-window
 *   or fixed-window script (INCR + EXPIRE), or Cloudflare WAF rate-limit rules.
 *
 * Interface:
 *   checkRateLimit(key, maxAttempts?, windowMs?) → boolean
 *     true  = request is allowed
 *     false = rate limit exceeded, reject with 429
 */

type Entry = { count: number; resetAt: number }

const DEFAULT_WINDOW_MS = 60_000 // 1 minute
const DEFAULT_MAX_ATTEMPTS = 5

const store = new Map<string, Entry>()

// Cleanup stale entries every 5 minutes to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}, 300_000)

export function checkRateLimit(
  key: string,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  windowMs = DEFAULT_WINDOW_MS
): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true // allowed
  }

  if (entry.count >= maxAttempts) {
    return false // blocked
  }

  entry.count++
  return true // allowed
}
