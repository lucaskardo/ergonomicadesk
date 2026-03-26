/**
 * Distributed rate limiter.
 *
 * Uses Redis (ioredis) when REDIS_URL is available — works correctly across
 * multiple instances (e.g. Railway horizontal scaling).
 * Falls back to an in-memory Map when Redis is not configured (dev / single instance).
 *
 * Pattern: sliding fixed-window with INCR + EXPIRE.
 *   - INCR key            → atomically increment attempt counter
 *   - EXPIRE key seconds  → set TTL only on the first increment (NX flag)
 *   - Returns count → compare to maxAttempts
 *
 * Interface:
 *   checkRateLimit(key, maxAttempts?, windowMs?) → Promise<boolean>
 *     true  = request is allowed
 *     false = rate limit exceeded, reject with 429
 */

import { Redis } from "ioredis"

const DEFAULT_WINDOW_MS = 60_000 // 1 minute
const DEFAULT_MAX_ATTEMPTS = 5

// ── In-memory fallback ────────────────────────────────────────────────────────

type Entry = { count: number; resetAt: number }
const memStore = new Map<string, Entry>()

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of memStore) {
    if (now > entry.resetAt) memStore.delete(key)
  }
}, 300_000)

function memCheckRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = memStore.get(key)
  if (!entry || now > entry.resetAt) {
    memStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxAttempts) return false
  entry.count++
  return true
}

// ── Redis client ──────────────────────────────────────────────────────────────

let redis: Redis | null = null
let redisReady = false

function getRedis(): Redis | null {
  if (redisReady) return redis
  redisReady = true
  const url = process.env.REDIS_URL
  if (!url) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limiter] REDIS_URL is not set in production — rate limiting is in-memory only. " +
        "This will not work correctly across multiple instances."
      )
    }
    return null
  }
  try {
    redis = new Redis(url, {
      lazyConnect: false,
      enableReadyCheck: true,
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
    })
    redis.on("error", () => {
      // Suppress unhandled errors — rate limiter falls back to memory on failure
    })
  } catch {
    redis = null
  }
  return redis
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function checkRateLimit(
  key: string,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  windowMs = DEFAULT_WINDOW_MS
): Promise<boolean> {
  const client = getRedis()
  if (!client) return memCheckRateLimit(key, maxAttempts, windowMs)

  try {
    const windowSecs = Math.ceil(windowMs / 1000)
    // INCR is atomic — safe under concurrency / multiple instances
    const count = await client.incr(key)
    if (count === 1) {
      // First request in window — set expiry (NX ensures we don't reset an existing TTL)
      await client.expire(key, windowSecs, "NX")
    }
    return count <= maxAttempts
  } catch {
    // Redis unavailable — fall through to in-memory
    return memCheckRateLimit(key, maxAttempts, windowMs)
  }
}
