const attempts = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000 // 1 minute
const MAX_ATTEMPTS = 5   // 5 attempts per minute per cart

export function checkRateLimit(cartId: string): boolean {
  const now = Date.now()
  const entry = attempts.get(cartId)

  if (!entry || now > entry.resetAt) {
    attempts.set(cartId, { count: 1, resetAt: now + WINDOW_MS })
    return true // allowed
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false // blocked
  }

  entry.count++
  return true // allowed
}

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of attempts) {
    if (now > entry.resetAt) attempts.delete(key)
  }
}, 300_000)
