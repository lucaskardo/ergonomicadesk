/**
 * Sanity seed script — populates CMS with hardcoded data from the storefront.
 *
 * Run:
 *   cd apps/storefront
 *   SANITY_API_TOKEN=<write-token> npx tsx scripts/sanity-seed.ts
 *
 * Requires a Sanity API token with Editor or Administrator permissions.
 * Get it from: manage.sanity.io → project → API → Tokens → Add API token
 */

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "7b580fxk",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-03-18",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

async function seed() {
  console.log("🌱 Seeding Sanity...")

  // ── Site Settings ──────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    brandName: "Ergonómica",
    whatsapp: "50769533776",
    phone: "+507 6953-3776",
    email: "hola@ergonomicadesk.com",
    address: { es: "Calle 79 Este 14, Coco del Mar, Panamá", en: "Calle 79 Este 14, Coco del Mar, Panama" },
    hours: { es: "Lun–Vie 12PM–6PM · Sáb 9AM–12PM", en: "Mon–Fri 12PM–6PM · Sat 9AM–12PM" },
    socialLinks: {
      instagram: "https://www.instagram.com/ergonomicadesk/",
      facebook: "https://www.facebook.com/ergonomicadesks/",
      tiktok: "https://www.tiktok.com/@ergonomicadesk",
    },
  })
  console.log("✅ siteSettings")

  // ── Announcement Bar ──────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "announcementBar",
    _type: "announcementBar",
    visible: true,
    text: {
      prefix: { es: "Envío gratis en Ciudad de Panamá — ", en: "Free shipping in Panama City — " },
      highlight: { es: "Pedidos mayores a $99", en: "Orders over $99" },
      suffix: { es: " tienen envío y ensamblaje gratuito", en: " get free delivery + assembly" },
    },
  })
  console.log("✅ announcementBar")

  // ── Header Nav ────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "headerNav",
    _type: "headerNav",
    links: [
      { _key: "standing-desks", labelEs: "Standing Desks", labelEn: "Standing Desks", handle: "standing-desks" },
      { _key: "office", labelEs: "Oficina", labelEn: "Office", handle: "office" },
      { _key: "chairs", labelEs: "Sillas", labelEn: "Chairs", handle: "chairs" },
      { _key: "storage", labelEs: "Almacenamiento", labelEn: "Storage", handle: "storage" },
      { _key: "accessories", labelEs: "Accesorios", labelEn: "Accessories", handle: "accessories" },
    ],
  })
  console.log("✅ headerNav")

  // ── Footer Nav ────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "footerNav",
    _type: "footerNav",
    columns: [
      {
        _key: "products",
        titleEs: "Productos",
        titleEn: "Products",
        links: [
          { _key: "standing-desks", labelEs: "Standing Desks", labelEn: "Standing Desks", href: "/categories/standing-desks" },
          { _key: "chairs", labelEs: "Sillas", labelEn: "Chairs", href: "/categories/chairs" },
          { _key: "accessories", labelEs: "Accesorios", labelEn: "Accessories", href: "/categories/accessories" },
          { _key: "storage", labelEs: "Almacenamiento", labelEn: "Storage", href: "/categories/storage" },
        ],
      },
      {
        _key: "support",
        titleEs: "Soporte",
        titleEn: "Support",
        links: [
          { _key: "faq", labelEs: "Preguntas frecuentes", labelEn: "FAQ", href: "/faq" },
          { _key: "deliveries", labelEs: "Entregas", labelEn: "Deliveries", href: "/returns" },
          { _key: "returns", labelEs: "Devoluciones", labelEn: "Returns", href: "/returns" },
          { _key: "warranty", labelEs: "Garantía", labelEn: "Warranty", href: "/warranty" },
        ],
      },
      {
        _key: "company",
        titleEs: "Empresa",
        titleEn: "Company",
        links: [
          { _key: "showroom", labelEs: "Showroom", labelEn: "Showroom", href: "https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z" },
          { _key: "blog", labelEs: "Blog", labelEn: "Blog", href: "/blog" },
          { _key: "contact", labelEs: "Contacto", labelEn: "Contact", href: "https://wa.me/50769533776" },
        ],
      },
    ],
  })
  console.log("✅ footerNav")

  // ── Homepage (page builder) ────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    sections: [
      {
        _key: "hero-1",
        _type: "heroSection",
        label: { es: "Standing Desks & Ergonomía · Panamá", en: "Standing Desks & Ergonomics · Panama" },
        title: { es: "Espacios de trabajo que impulsan tu", en: "Workspaces that boost your" },
        titleAccent: { es: "productividad", en: "productivity" },
        subtitle: {
          es: "Standing desks, sillas ergonómicas y accesorios premium. Envío gratis + ensamblaje incluido en Ciudad de Panamá.",
          en: "Standing desks, ergonomic chairs and premium accessories. Free shipping + assembly included in Panama City.",
        },
        ctaPrimary: { text: { es: "Explorar Productos", en: "Browse Products" }, href: "/store" },
        ctaSecondary: { text: { es: "Visitar Showroom", en: "Visit Showroom" }, href: "https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z" },
      },
      {
        _key: "trust-1",
        _type: "trustBarSection",
        items: [
          { _key: "t1", emoji: "🚚", title: { es: "Envío Gratis >$99", en: "Free Shipping >$99" }, subtitle: { es: "Ciudad de Panamá", en: "Panama City" } },
          { _key: "t2", emoji: "🔧", title: { es: "Ensamblaje Incluido", en: "Assembly Included" }, subtitle: { es: "En todos los muebles", en: "On all furniture" } },
          { _key: "t3", emoji: "🛡️", title: { es: "Hasta 5 Años Garantía", en: "Up to 5yr Warranty" }, subtitle: { es: "En productos seleccionados", en: "On selected products" } },
          { _key: "t4", emoji: "💬", title: { es: "Soporte Directo", en: "Direct Support" }, subtitle: { es: "WhatsApp 24/7", en: "WhatsApp 24/7" } },
        ],
      },
      { _key: "categories-1", _type: "categoryGridSection", heading: { es: "Categorías", en: "Categories" } },
      {
        _key: "featured-1",
        _type: "featuredProductsSection",
        heading: { es: "Los Más", en: "Best" },
        headingAccent: { es: "Vendidos", en: "Sellers" },
      },
      { _key: "build-1", _type: "buildYourDeskSection", heading: { es: "Arma tu escritorio", en: "Build your desk" }, visible: true },
      {
        _key: "testimonials-1",
        _type: "testimonialsSection",
        heading: { es: "Lo que dicen", en: "What our" },
        headingAccent: { es: "nuestros clientes", en: "customers say" },
        subtitle: { es: "Más de 500 oficinas equipadas en Panamá", en: "500+ offices outfitted across Panama" },
        reviews: [
          { _key: "r1", quote: { es: "Excelente calidad y el ensamblaje fue profesional. Mi standing desk llegó perfectamente embalado y lo instalaron en menos de una hora.", en: "Excellent quality and the assembly was professional. My standing desk arrived perfectly packaged and was installed in under an hour." }, author: "Carlos M.", role: { es: "Arquitecto", en: "Architect" } },
          { _key: "r2", quote: { es: "Las sillas ergonómicas son increíbles. Trabajo desde casa y mi espalda ya no me molesta. Totalmente recomendado.", en: "The ergonomic chairs are amazing. I work from home and my back no longer bothers me. Totally recommended." }, author: "Valeria R.", role: { es: "Diseñadora UX", en: "UX Designer" } },
          { _key: "r3", quote: { es: "Compré el escritorio ejecutivo para nuestra oficina y quedamos encantados. Gran relación calidad-precio y el servicio al cliente es excelente.", en: "I bought the executive desk for our office and we are delighted. Great value for money and the customer service is excellent." }, author: "Roberto S.", role: { es: "Director Financiero", en: "CFO" } },
        ],
        stats: [
          { _key: "s1", value: "500+", label: { es: "Clientes", en: "Clients" } },
          { _key: "s2", value: "5.0", label: { es: "Google Rating", en: "Google Rating" } },
          { _key: "s3", value: "15K", label: { es: "Seguidores IG", en: "IG Followers" } },
          { _key: "s4", value: "5", label: { es: "Años en Panamá", en: "Years in Panama" } },
        ],
      },
      {
        _key: "b2b-1",
        _type: "ctaImageSection",
        label: { es: "Para Empresas", en: "For Businesses" },
        title: { es: "Equipá a Tu Equipo Para", en: "Equip Your Team to" },
        titleAccent: { es: "Rendir al Máximo", en: "Perform at Their Best" },
        subtitle: { es: "Diseñamos e instalamos espacios de trabajo ergonómicos completos para oficinas, coworkings y espacios comerciales.", en: "We design and install complete ergonomic workspaces for offices, coworkings and commercial spaces." },
        cta: { text: { es: "Solicitar Cotización", en: "Request a Quote" }, href: "https://wa.me/50769533776?text=Hola,%20estoy%20interesado%20en%20una%20cotización%20corporativa" },
        stats: [
          { _key: "b2b-s1", value: "25%", label: { es: "más productividad promedio", en: "avg. productivity increase" } },
          { _key: "b2b-s2", value: "$3–6", label: { es: "retorno por cada $1 invertido", en: "return per $1 invested" } },
        ],
        imagePosition: "right",
        theme: "dark",
      },
      { _key: "blog-1", _type: "blogPreviewSection", heading: { es: "Del Blog", en: "From the Blog" }, postCount: 4 },
      {
        _key: "showroom-1",
        _type: "ctaImageSection",
        label: { es: "Coco del Mar, Panamá", en: "Coco del Mar, Panama" },
        title: { es: "Visita nuestro", en: "Visit our" },
        titleAccent: { es: "showroom", en: "showroom" },
        subtitle: { es: "Calle 79 Este 14, Coco del Mar · Lun–Vie 12–6PM · Sáb 9–12PM", en: "Calle 79 Este 14, Coco del Mar · Mon–Fri 12–6PM · Sat 9–12PM" },
        cta: { text: { es: "Agendar visita", en: "Book a visit" }, href: "https://wa.me/50769533776?text=Hola,%20quiero%20visitar%20el%20showroom" },
        imagePosition: "left",
        theme: "light",
      },
      {
        _key: "newsletter-1",
        _type: "newsletterSection",
        heading: { es: "Mantente al día con", en: "Stay updated with" },
        headingAccent: { es: "Ergonómica", en: "Ergonómica" },
        subtitle: { es: "Recibe lanzamientos, promociones exclusivas y tips de ergonomía directamente en tu correo.", en: "Receive launches, exclusive promotions and ergonomics tips directly in your inbox." },
        placeholder: { es: "tu@email.com", en: "your@email.com" },
        buttonText: { es: "Suscribirse", en: "Subscribe" },
      },
    ],
  })
  console.log("✅ homepage")

  // ── Blog posts ─────────────────────────────────────────────────────────────
  const blogPosts = [
    {
      _id: "blog-como-elegir-standing-desk",
      slug: "como-elegir-standing-desk",
      title: "Cómo elegir el standing desk perfecto para ti",
      description: "Guía completa para elegir tu standing desk ideal. Comparamos motores, tamaños, y funcionalidades.",
      tag: "Guía",
      readTime: "8 min",
      publishedAt: "2026-03-15T00:00:00Z",
      author: "Ergonómica",
      lang: "es",
      keywords: ["standing desk", "escritorio de pie", "ergonomía", "home office", "Panamá"],
    },
    {
      _id: "blog-errores-productividad-home-office",
      slug: "errores-productividad-home-office",
      title: "5 errores que están matando tu productividad en el home office",
      description: "Descubre los errores más comunes de ergonomía que afectan tu productividad y cómo solucionarlos.",
      tag: "Ergonomía",
      readTime: "6 min",
      publishedAt: "2026-03-10T00:00:00Z",
      author: "Ergonómica",
      lang: "es",
      keywords: ["productividad", "home office", "ergonomía", "errores", "silla ergonómica"],
    },
  ]

  for (const post of blogPosts) {
    await client.createOrReplace({
      _id: post._id,
      _type: "blogPost",
      slug: { _type: "slug", current: post.slug },
      title: post.title,
      description: post.description,
      tag: post.tag,
      readTime: post.readTime,
      publishedAt: post.publishedAt,
      author: post.author,
      lang: post.lang,
      keywords: post.keywords,
      content: [
        {
          _type: "block",
          _key: `intro-${post._id}`,
          style: "normal",
          children: [{ _type: "span", _key: "span-1", text: post.description, marks: [] }],
          markDefs: [],
        },
      ],
    })
    console.log(`✅ blogPost: ${post.slug}`)
  }

  console.log("\n✨ Seed complete! Open /studio to see your content.")
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
