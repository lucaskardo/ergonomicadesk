import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug, getAllPosts } from "@/content/blog/posts"
import { getLang } from "@lib/i18n"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { SITE_URL, blogPath, alternateUrls } from "@lib/util/routes"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, slug } = await props.params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const path = blogPath(slug)
  return {
    title: `${post.title} | Ergonómica Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_URL}/${countryCode}${path}`,
      languages: alternateUrls(countryCode, path),
    },
  }
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage(props: Props) {
  const { countryCode, slug } = await props.params
  const post = getPostBySlug(slug)
  if (!post) return notFound()

  return (
    <>
    <BreadcrumbJsonLd items={[
      { name: "Home", url: `${SITE_URL}/${countryCode}` },
      { name: "Blog", url: `${SITE_URL}/${countryCode}/blog` },
      { name: post.title, url: `${SITE_URL}/${countryCode}/blog/${slug}` },
    ]} />
    <article className="max-w-[720px] mx-auto px-4 sm:px-6 py-14 lg:py-20">
      <Link
        href={`/${countryCode}/blog`}
        className="text-ergo-sky text-[0.8rem] font-medium hover:underline"
      >
        ← Blog
      </Link>
      <div className="mt-6">
        <span className="text-[0.65rem] uppercase tracking-[0.12em] text-ergo-sky font-semibold">
          {post.tag}
        </span>
        <h1
          className="font-display font-bold text-ergo-950 mt-2 leading-[1.1] tracking-tight"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
        >
          {post.title}
        </h1>
        <p className="text-ergo-400 text-[0.84rem] mt-3">{post.description}</p>
        <div className="flex items-center gap-3 mt-4 text-[0.75rem] text-ergo-400">
          <span>{post.author}</span>
          <span>·</span>
          <span>{post.readTime}</span>
          <span>·</span>
          <span>{post.publishedAt}</span>
        </div>
      </div>
      {/* dangerouslySetInnerHTML is safe here: post.content is static HTML
          authored in src/content/blog/posts.ts (committed to the repo).
          There is no user-generated content or external CMS involved. */}
      <div
        className="mt-10 prose prose-ergo max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
    </>
  )
}
