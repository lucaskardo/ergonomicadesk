import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts } from "@/content/blog/posts"
import { getLang } from "@lib/i18n"
import { canonicalUrl, alternateUrls } from "@lib/util/routes"

export async function generateMetadata(
  props: { params: Promise<{ countryCode: string }> }
): Promise<Metadata> {
  const { countryCode } = await props.params
  const lang = await getLang()
  return {
    title: "Blog | Ergonómica",
    description:
      "Guías, tips y consejos para tu home office y espacio de trabajo ergonómico.",
    alternates: {
      canonical: canonicalUrl(countryCode, lang, "/blog"),
      languages: alternateUrls(countryCode, "/blog"),
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
            className="group flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1"
          >
            {/* Image or dark header */}
            {post.image ? (
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-ergo-950/30" />
                <span className="absolute top-3 left-3 text-[0.6rem] uppercase tracking-[0.12em] text-white bg-ergo-sky px-2 py-0.5 font-semibold rounded-soft">
                  {post.tag}
                </span>
              </div>
            ) : (
              <div className="bg-ergo-950 px-6 pt-6 pb-4 flex items-start">
                <span className="text-[0.6rem] uppercase tracking-[0.12em] text-ergo-sky font-semibold">
                  {post.tag}
                </span>
              </div>
            )}

            {/* Card body */}
            <div
              className={`flex flex-col flex-1 p-6 ${post.image ? "bg-white border border-ergo-100 border-t-0" : "bg-ergo-950"}`}
            >
              <h2
                className={`font-display font-bold text-[1rem] leading-[1.25] ${post.image ? "text-ergo-950" : "text-white"}`}
              >
                {post.title}
              </h2>
              <p
                className={`text-[0.82rem] mt-2 leading-relaxed line-clamp-2 flex-1 ${post.image ? "text-ergo-400" : "text-ergo-300"}`}
              >
                {post.description}
              </p>
              <p
                className="text-[0.68rem] mt-4 pt-4 border-t"
                style={{
                  color: post.image ? "#7B8BA5" : "rgba(91,192,235,0.5)",
                  borderColor: post.image ? "#E8ECF2" : "rgba(255,255,255,0.07)",
                }}
              >
                {post.readTime} · {post.publishedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
