import { NextRequest, NextResponse } from "next/server"

/**
 * Validates a Cloudflare Turnstile token.
 *
 * Graceful degradation: if TURNSTILE_SECRET_KEY is not set (dev / pre-Cloudflare),
 * returns success immediately so checkout continues to work normally.
 */
export async function POST(req: NextRequest) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  // Graceful degradation — no secret key means Turnstile is not configured
  if (!secretKey) {
    return NextResponse.json({ success: true })
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

  let result: { success: boolean }
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

  return NextResponse.json({ success: true })
}
