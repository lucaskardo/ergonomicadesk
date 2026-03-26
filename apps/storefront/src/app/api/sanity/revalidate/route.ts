import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { parseBody } from "next-sanity/webhook"

type WebhookPayload = {
  _type?: string
  slug?: { current?: string }
}

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
      true // delay to allow CDN to update
    )

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 })
    }

    if (!body?._type) {
      return new Response("Missing _type in body", { status: 400 })
    }

    const { _type, slug } = body

    switch (_type) {
      case "homepage":
        revalidatePath("/[countryCode]", "page")
        revalidatePath("/[countryCode]/en", "page")
        break

      case "siteSettings":
      case "headerNav":
      case "footerNav":
      case "announcementBar":
        // These are in every page via layout
        revalidatePath("/[countryCode]", "layout")
        revalidatePath("/[countryCode]/en", "layout")
        break

      case "blogPost":
        if (slug?.current) {
          revalidatePath(`/[countryCode]/blog/${slug.current}`, "page")
          revalidatePath(`/[countryCode]/en/blog/${slug.current}`, "page")
        }
        // Also revalidate blog index
        revalidatePath("/[countryCode]/blog", "page")
        revalidatePath("/[countryCode]/en/blog", "page")
        break

      default:
        // Unknown type — no-op
        break
    }

    return NextResponse.json({ revalidated: true, type: _type, slug: slug?.current })
  } catch (err) {
    console.error("Sanity revalidate error:", err)
    return new Response((err as Error).message, { status: 500 })
  }
}
