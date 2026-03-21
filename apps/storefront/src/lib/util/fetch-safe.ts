/**
 * Race a promise against a timeout. Returns fallback value on timeout or error.
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  opts: { ms?: number; fallback: T; label?: string }
): Promise<T> {
  const { ms = 5000, fallback, label = "fetch" } = opts

  let timer: ReturnType<typeof setTimeout>
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
  })

  try {
    const result = await Promise.race([promise, timeout])
    clearTimeout(timer!)
    return result
  } catch (err) {
    clearTimeout(timer!)
    if (process.env.NODE_ENV === "development") {
      console.warn(`[withTimeout] ${label}:`, err instanceof Error ? err.message : err)
    }
    return fallback
  }
}

/**
 * Fetch with AbortController timeout. Drop-in replacement for global fetch.
 */
export function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit & { timeout?: number }
): Promise<Response> {
  const ms = init?.timeout ?? 5000
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)

  return fetch(input, {
    ...init,
    signal: controller.signal,
  }).finally(() => clearTimeout(id))
}
