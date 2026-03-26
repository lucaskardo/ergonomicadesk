import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { getPostBySlug, getAllPosts } from "@/content/blog/posts"
import { getLang } from "@lib/i18n"
import { BreadcrumbJsonLd } from "@modules/common/components/json-ld/breadcrumb"
import { ArticleJsonLd } from "@modules/common/components/json-ld/article"
import { FAQPageJsonLd } from "@modules/common/components/json-ld/faq"
import { blogPath, canonicalUrl } from "@lib/util/routes"
import { buildMetadata } from "@lib/util/metadata"
import { sanityFetch } from "@/sanity/lib/live"
import { BLOG_POST_QUERY, BLOG_SLUGS_QUERY, BLOG_POSTS_QUERY } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"
import BlogPortableText from "@modules/blog/components/portable-text"

type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}

// ─── generateStaticParams ──────────────────────────────────────────────────
export async function generateStaticParams() {
  // Merge Sanity slugs + static slugs
  const [sanityResult] = await Promise.all([
    sanityFetch({ query: BLOG_SLUGS_QUERY }).catch(() => ({ data: null })),
  ])

  const sanitySlugs: string[] =
    sanityResult?.data && Array.isArray(sanityResult.data)
      ? sanityResult.data.map((d: { slug: string }) => d.slug).filter(Boolean)
      : []

  const staticSlugs = getAllPosts().map((p) => p.slug)
  const allSlugs = Array.from(new Set([...sanitySlugs, ...staticSlugs]))
  return allSlugs.map((slug) => ({ slug }))
}

// ─── generateMetadata ──────────────────────────────────────────────────────
export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, slug } = await props.params
  const lang = await getLang()

  // Try Sanity first
  const sanityResult = await sanityFetch({ query: BLOG_POST_QUERY, params: { slug } }).catch(
    () => ({ data: null })
  )
  const post = sanityResult?.data ?? getPostBySlug(slug)
  if (!post) return {}

  const imageUrl = (post as { mainImage?: { asset?: { url: string } } }).mainImage?.asset?.url

  return buildMetadata({
    title: post.title,
    description: post.description,
    countryCode,
    lang,
    path: blogPath(slug),
    keywords: post.keywords,
    image: imageUrl ?? (post as { image?: string }).image,
    suffix: "Ergonómica Blog",
  })
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function formatDate(dateStr: string, lang: "es" | "en") {
  const date = new Date(dateStr.slice(0, 10) + "T00:00:00")
  if (lang === "en") {
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }
  return date.toLocaleDateString("es-PA", { year: "numeric", month: "long", day: "numeric" })
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function BlogPostPage(props: Props) {
  const { countryCode, slug } = await props.params
  const lang = await getLang()

  // Try Sanity first
  const sanityResult = await sanityFetch({ query: BLOG_POST_QUERY, params: { slug } }).catch(
    () => ({ data: null })
  )
  const sanityPost = sanityResult?.data ?? null
  const staticPost = getPostBySlug(slug)

  if (!sanityPost && !staticPost) return notFound()

  // Normalize to display shape
  const isSanity = !!sanityPost
  const post = {
    slug,
    title: isSanity ? sanityPost.title : staticPost!.title,
    description: isSanity ? sanityPost.description : staticPost!.description,
    tag: isSanity ? sanityPost.tag : staticPost!.tag,
    readTime: isSanity ? sanityPost.readTime : staticPost!.readTime,
    publishedAt: (isSanity ? sanityPost.publishedAt : staticPost!.publishedAt).slice(0, 10),
    author: isSanity ? sanityPost.author : staticPost!.author,
    keywords: isSanity ? sanityPost.keywords : staticPost!.keywords,
    faqs: isSanity ? (sanityPost.faqs ?? []) : (staticPost!.faqs ?? []),
    imageUrl: isSanity && sanityPost.mainImage?.asset
      ? urlFor(sanityPost.mainImage).width(1440).height(720).fit("crop").url()
      : (staticPost?.image ?? null),
    portableContent: isSanity ? sanityPost.content : null,
    htmlContent: !isSanity ? staticPost!.content : null,
  }

  // Related posts
  const relatedSanityResult = sanityPost
    ? await sanityFetch({ query: BLOG_POSTS_QUERY, params: { lang } }).catch(() => ({ data: null }))
    : { data: null }

  type RelatedPost = { slug: string; title: string; description: string; tag?: string; readTime?: string; publishedAt: string }
  const relatedPosts: RelatedPost[] = (
    relatedSanityResult?.data && Array.isArray(relatedSanityResult.data)
      ? relatedSanityResult.data
          .filter((p: { slug: string }) => p.slug !== slug)
          .slice(0, 2)
          .map((p: { slug: string; title: string; description: string; tag?: string; readTime?: string; publishedAt: string }) => ({
            slug: p.slug,
            title: p.title,
            description: p.description,
            tag: p.tag,
            readTime: p.readTime,
            publishedAt: p.publishedAt.slice(0, 10),
          }))
      : getAllPosts(lang)
          .filter((p) => p.slug !== slug)
          .slice(0, 2)
          .map((p) => ({
            slug: p.slug,
            title: p.title,
            description: p.description,
            tag: p.tag,
            readTime: p.readTime,
            publishedAt: p.publishedAt,
          }))
  )

  const faqsForJsonLd = post.faqs.map((f: { q: string; a: string }) => ({ q: f.q, a: f.a }))

  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: "Home", url: canonicalUrl(countryCode, lang, "") },
        { name: "Blog", url: canonicalUrl(countryCode, lang, "/blog") },
        { name: post.title, url: canonicalUrl(countryCode, lang, blogPath(slug)) },
      ]} />
      <ArticleJsonLd
        headline={post.title}
        description={post.description}
        url={canonicalUrl(countryCode, lang, blogPath(slug))}
        datePublished={post.publishedAt}
        authorName={post.author}
        image={post.imageUrl ?? undefined}
      />
      {faqsForJsonLd.length > 0 && <FAQPageJsonLd faqs={faqsForJsonLd} />}

      <article className="max-w-[720px] mx-auto px-4 sm:px-6 py-14 lg:py-20">
        {/* Back link */}
        <Link
          href={`/${countryCode}/blog`}
          className="text-ergo-sky text-[0.8rem] font-medium hover:underline"
        >
          ← Blog
        </Link>

        {/* Hero image */}
        {post.imageUrl && (
          <div className="mt-6 w-full aspect-[2/1] relative overflow-hidden rounded-base">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
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
          <p className="text-ergo-400 text-[0.9rem] mt-3 leading-relaxed">
            {post.description}
          </p>

          {/* Author byline */}
          <div className="flex flex-wrap items-center gap-x-0 mt-4 text-[0.78rem] text-ergo-400">
            <span className="font-medium text-ergo-600">{post.author}</span>
            <span className="mx-2 text-ergo-200">|</span>
            <span>{post.readTime} {lang === "en" ? "read" : "lectura"}</span>
            <span className="mx-2 text-ergo-200">|</span>
            <span>{formatDate(post.publishedAt, lang)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-ergo-100" />

        {/* Content — Portable Text (Sanity) or HTML (static) */}
        <div className="mt-8 prose-ergo max-w-none">
          {post.portableContent ? (
            <BlogPortableText value={post.portableContent} />
          ) : post.htmlContent ? (
            /* dangerouslySetInnerHTML is safe here: post.htmlContent is static HTML
               authored in src/content/blog/posts.ts (committed to the repo).
               There is no user-generated content. */
            <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
          ) : null}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-12 bg-ergo-950 rounded-base p-6 sm:p-8">
          <p className="text-ergo-sky text-[0.65rem] uppercase tracking-[0.12em] font-semibold mb-2">
            {lang === "en" ? "Ready to upgrade your workspace?" : "¿Listo para mejorar tu espacio?"}
          </p>
          <h2 className="font-display font-bold text-white text-[1.2rem] leading-snug mb-4">
            {lang === "en"
              ? "Explore our ergonomic furniture for Panama"
              : "Explorá nuestro catálogo de mobiliario ergonómico"}
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${countryCode}/store`}
              className="inline-block bg-ergo-sky text-white text-[0.875rem] font-semibold px-5 py-2.5 rounded-base hover:bg-ergo-sky-hover transition-colors"
            >
              {lang === "en" ? "Browse products" : "Ver productos"}
            </Link>
            <a
              href="https://wa.me/50769533776"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-transparent border border-ergo-600 text-ergo-300 text-[0.875rem] font-medium px-5 py-2.5 rounded-base hover:border-ergo-sky hover:text-ergo-sky transition-colors"
            >
              {lang === "en" ? "Visit showroom" : "Visitar showroom"}
            </a>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-ergo-950 text-[1rem] mb-5 uppercase tracking-[0.06em]">
              {lang === "en" ? "More articles" : "Más artículos"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${countryCode}/blog/${related.slug}`}
                  className="group bg-ergo-950 p-5 flex flex-col min-h-[160px] transition-transform duration-300 hover:-translate-y-1"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.12em] text-ergo-sky font-semibold">
                    {related.tag}
                  </span>
                  <h3 className="font-display font-bold text-white text-[0.9rem] leading-snug mt-2 flex-1">
                    {related.title}
                  </h3>
                  <p className="text-[0.7rem] mt-3 text-ergo-400 line-clamp-2">
                    {related.description}
                  </p>
                  <p
                    className="text-[0.65rem] mt-3 pt-3 border-t border-ergo-800"
                    style={{ color: "rgba(91,192,235,0.5)" }}
                  >
                    {related.readTime} · {related.publishedAt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  )
}
