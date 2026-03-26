// GROQ queries for Sanity data fetching.
// All projections are explicit — never use bare `...` expansions.

// ─── Shared fragments ────────────────────────────────────────────────────────

const localizedStringFragment = `{ es, en }`
const localizedTextFragment = `{ es, en }`
const ctaFragment = `{ text ${localizedStringFragment}, href }`
const imageFragment = `{ asset->{ _id, url }, alt, hotspot, crop }`
const statFragment = `{ value, label ${localizedStringFragment} }`

// ─── Homepage page builder ───────────────────────────────────────────────────

export const HOMEPAGE_QUERY = `
  *[_id == "homepage"][0]{
    "sections": sections[]{
      _key,
      _type,

      _type == "heroSection" => {
        label ${localizedStringFragment},
        title ${localizedStringFragment},
        titleAccent ${localizedStringFragment},
        subtitle ${localizedTextFragment},
        "ctaPrimary": ctaPrimary ${ctaFragment},
        "ctaSecondary": ctaSecondary ${ctaFragment},
        backgroundImage ${imageFragment}
      },

      _type == "trustBarSection" => {
        "items": items[]{
          _key,
          emoji,
          title ${localizedStringFragment},
          subtitle ${localizedStringFragment}
        }
      },

      _type == "categoryGridSection" => {
        heading ${localizedStringFragment}
      },

      _type == "featuredProductsSection" => {
        heading ${localizedStringFragment},
        headingAccent ${localizedStringFragment}
      },

      _type == "buildYourDeskSection" => {
        heading ${localizedStringFragment},
        visible
      },

      _type == "testimonialsSection" => {
        heading ${localizedStringFragment},
        headingAccent ${localizedStringFragment},
        subtitle ${localizedTextFragment},
        "reviews": reviews[]{
          _key,
          quote ${localizedTextFragment},
          author,
          role ${localizedStringFragment}
        },
        "stats": stats[]{ _key, ${statFragment} }
      },

      _type == "ctaImageSection" => {
        label ${localizedStringFragment},
        title ${localizedStringFragment},
        titleAccent ${localizedStringFragment},
        subtitle ${localizedTextFragment},
        image ${imageFragment},
        "cta": cta ${ctaFragment},
        "stats": stats[]{ _key, ${statFragment} },
        imagePosition,
        theme
      },

      _type == "blogPreviewSection" => {
        heading ${localizedStringFragment},
        postCount
      },

      _type == "newsletterSection" => {
        heading ${localizedStringFragment},
        headingAccent ${localizedStringFragment},
        subtitle ${localizedTextFragment},
        placeholder ${localizedStringFragment},
        buttonText ${localizedStringFragment}
      }
    }
  }
`

// ─── Blog posts ──────────────────────────────────────────────────────────────

export const BLOG_POSTS_QUERY = `
  *[_type == "blogPost" && lang == $lang]
  | order(publishedAt desc){
    _id,
    "slug": slug.current,
    title,
    description,
    tag,
    readTime,
    publishedAt,
    author,
    lang,
    "mainImage": mainImage ${imageFragment}
  }
`

export const BLOG_POST_QUERY = `
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    "slug": slug.current,
    title,
    description,
    content,
    tag,
    readTime,
    publishedAt,
    author,
    keywords,
    lang,
    "mainImage": mainImage ${imageFragment},
    "faqs": faqs[]{ _key, q, a }
  }
`

export const BLOG_SLUGS_QUERY = `
  *[_type == "blogPost" && defined(slug.current)]{
    "slug": slug.current
  }
`

// ─── Site settings ───────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = `
  *[_id == "siteSettings"][0]{
    brandName,
    whatsapp,
    phone,
    email,
    address ${localizedStringFragment},
    hours ${localizedStringFragment},
    socialLinks { instagram, facebook, tiktok }
  }
`

// ─── Announcement bar ─────────────────────────────────────────────────────────

export const ANNOUNCEMENT_BAR_QUERY = `
  *[_id == "announcementBar"][0]{
    visible,
    "text": text {
      prefix ${localizedStringFragment},
      highlight ${localizedStringFragment},
      suffix ${localizedStringFragment}
    },
    link
  }
`

// ─── Header navigation ────────────────────────────────────────────────────────

export const HEADER_NAV_QUERY = `
  *[_id == "headerNav"][0]{
    "links": links[]{
      _key,
      labelEs,
      labelEn,
      handle
    }
  }
`

// ─── Footer navigation ────────────────────────────────────────────────────────

export const FOOTER_NAV_QUERY = `
  *[_id == "footerNav"][0]{
    "columns": columns[]{
      _key,
      titleEs,
      titleEn,
      "links": links[]{
        _key,
        labelEs,
        labelEn,
        href
      }
    }
  }
`
