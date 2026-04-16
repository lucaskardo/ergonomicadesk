import { revalidatePath } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"
import { env } from "@lib/util/env"

type WebhookPayload = {
  _type?: string
  slug?: { current?: string }
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      env.SANITY_REVALIDATE_SECRET,
      true // delay to allow CDN to update
    )

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 })
    }

    if (!body?._type) {
      return new Response("Missing _type in body", { status: 400 })
    }

    const { _type, slug } = body

    // EN URLs are served by the same ES route via proxy rewrite,
    // so invalidating the ES path invalidates both /pa/X and /pa/en/X.
    switch (_type) {
      case "homepage":
        revalidatePath("/[countryCode]", "page")
        break

      case "siteSettings":
      case "headerNav":
      case "footerNav":
      case "announcementBar":
        revalidatePath("/[countryCode]", "layout")
        break

      case "blogPost":
        if (slug?.current) {
          revalidatePath(`/[countryCode]/blog/${slug.current}`, "page")
        }
        revalidatePath("/[countryCode]/blog", "page")
        break

      default:
        break
    }

    return NextResponse.json({ revalidated: true, type: _type, slug: slug?.current })
  } catch (err) {
    console.error("Sanity revalidate error:", err)
    return new Response((err as Error).message, { status: 500 })
  }
}
