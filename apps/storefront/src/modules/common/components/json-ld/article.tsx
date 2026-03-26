type ArticleJsonLdProps = {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  authorName: string
  image?: string
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName,
  image,
}: ArticleJsonLdProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: "https://ergonomicadesk.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Ergonómica",
      url: "https://ergonomicadesk.com",
      logo: {
        "@type": "ImageObject",
        url: "https://ergonomicadesk.com/logo.png",
      },
    },
  }

  if (image) {
    schema.image = image
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
