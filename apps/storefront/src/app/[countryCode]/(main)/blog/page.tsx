import { Metadata } from "next"
import Link from "next/link"
import { getAllPosts } from "@/content/blog/posts"
import { getLang } from "@lib/i18n"
import { SITE_URL } from "@lib/util/routes"

export async function generateMetadata(
  props: { params: Promise<{ countryCode: string }> }
): Promise<Metadata> {
  const { countryCode } = await props.params
  const baseUrl = `${SITE_URL}/${countryCode}`
  return {
    title: "Blog | Ergonómica",
    description:
      "Guías, tips y consejos para tu home office y espacio de trabajo ergonómico.",
    alternates: {
      canonical: `${baseUrl}/blog`,
      languages: {
        es: `${baseUrl}/blog`,
        en: `${baseUrl}/en/blog`,
        "x-default": `${baseUrl}/blog`,
      },
    },
  }
}

export default async function BlogPage(
  props: { params: Promise<{ countryCode: string }> }
) {
  const { countryCode } = await props.params
  const lang = await getLang()
  const allPosts = getAllPosts(lang)

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-14 lg:py-24">
      <h1
        className="font-display font-bold text-ergo-950 tracking-tight"
        style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)" }}
      >
        Blog
      </h1>
      <p className="text-ergo-400 text-[0.88rem] mt-2 mb-10">
        {lang === "en"
          ? "Guides, tips and advice for your workspace"
          : "Guías, tips y consejos para tu espacio de trabajo"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/${countryCode}/blog/${post.slug}`}
            className="group bg-ergo-950 p-6 flex flex-col min-h-[260px] transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="text-[0.6rem] uppercase tracking-[0.12em] text-ergo-sky font-semibold">
              {post.tag}
            </span>
            <h2 className="font-display font-bold text-white text-[1rem] leading-[1.25] mt-2.5 flex-1">
              {post.title}
            </h2>
            <p
              className="text-[0.68rem] mt-auto pt-4"
              style={{ color: "rgba(91,192,235,0.5)" }}
            >
              {post.readTime} · {post.publishedAt}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
