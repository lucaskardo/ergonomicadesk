import { NextRequest, NextResponse } from "next/server"

const EXPECTED_HOSTNAME = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL).hostname
  : "ergonomicadesk.com"

/**
 * Validates a Cloudflare Turnstile token.
 *
 * Graceful degradation in development: if TURNSTILE_SECRET_KEY is not set,
 * returns success so checkout works normally in local dev.
 *
 * Fail-closed in production: if TURNSTILE_SECRET_KEY is missing, returns 503
 * to prevent checkout from proceeding without bot protection.
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  const isDev = process.env.NODE_ENV !== "production"

  if (!secretKey) {
    if (isDev) {
      // Dev: skip verification so checkout works without Cloudflare configured
      return NextResponse.json({ success: true })
    }
    // Production: fail closed — bot protection must be configured
    console.error("[turnstile-verify] TURNSTILE_SECRET_KEY is not set in production — rejecting request")
    return NextResponse.json(
      { success: false, error: "Bot protection not configured" },
      { status: 503 }
    )
  }

  let token: string | undefined
  try {
    const body = await req.json()
    token = body?.token
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }

  if (!token || typeof token !== "string") {
    return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 })
  }

  const params = new URLSearchParams()
  params.append("secret", secretKey)
  params.append("response", token)

  let result: { success: boolean; hostname?: string }
  try {
    const cfRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    )
    result = await cfRes.json()
  } catch {
    return NextResponse.json(
      { success: false, error: "Verification service unavailable" },
      { status: 502 }
    )
  }

  if (!result.success) {
    return NextResponse.json({ success: false, error: "Challenge failed" }, { status: 403 })
  }

  // Validate hostname to prevent token reuse across sites
  if (result.hostname && result.hostname !== EXPECTED_HOSTNAME) {
    console.warn(
      `[turnstile-verify] Hostname mismatch: expected ${EXPECTED_HOSTNAME}, got ${result.hostname}`
    )
    return NextResponse.json({ success: false, error: "Token hostname mismatch" }, { status: 403 })
  }

  return NextResponse.json({ success: true })
}
