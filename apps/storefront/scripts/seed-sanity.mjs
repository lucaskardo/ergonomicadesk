/**
 * Sanity seed script (ESM) — seeds homepage, siteSettings, announcementBar.
 *
 * Run:
 *   cd apps/storefront && node scripts/seed-sanity.mjs
 *
 * Reads SANITY_API_READ_TOKEN from .env.local
 */

import { createClient } from "next-sanity"
import { readFileSync } from "fs"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Read token from .env.local
function readEnv() {
  try {
    const envPath = resolve(__dirname, "../.env.local")
    const content = readFileSync(envPath, "utf-8")
    const match = content.match(/^SANITY_API_READ_TOKEN=(.+)$/m)
    return match ? match[1].trim() : undefined
  } catch {
    return undefined
  }
}

const token = process.env.SANITY_API_READ_TOKEN || readEnv()

const client = createClient({
  projectId: "7b580fxk",
  dataset: "production",
  apiVersion: "2025-03-18",
  token,
  useCdn: false,
})

async function seed() {
  console.log("🌱 Seeding Sanity...")

  // ── Site Settings ────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    brandName: "Ergonómica",
    whatsapp: "+507 6953-3776",
    phone: "+507 6953-3776",
    email: "info@ergonomicadesk.com",
    address: { es: "Calle 79 Este 14, Coco del Mar", en: "Calle 79 Este 14, Coco del Mar" },
    hours: { es: "Lun–Vie 12–6PM · Sáb 9–12PM", en: "Mon–Fri 12–6PM · Sat 9–12PM" },
    socialLinks: {
      instagram: "https://www.instagram.com/ergonomicadesk/",
      facebook: "https://www.facebook.com/ergonomicadesks/",
      tiktok: "https://www.tiktok.com/@ergonomicadesk",
    },
  })
  console.log("✅ siteSettings")

  // ── Announcement Bar ─────────────────────────────────────────────────────
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

  // ── Homepage ─────────────────────────────────────────────────────────────
  await client.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    sections: [
      // 1. Hero
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
        ctaPrimary: { text: { es: "Explorar Productos", en: "Browse Products" }, href: "/pa/store" },
        ctaSecondary: { text: { es: "Visitar Showroom", en: "Visit Showroom" }, href: "https://wa.me/50769533776" },
      },
      // 2. Trust Bar
      {
        _key: "trust-1",
        _type: "trustBarSection",
        items: [
          { _key: "trust-shipping", emoji: "🚚", title: { es: "Envío Gratis >$99", en: "Free Shipping >$99" }, subtitle: { es: "Ciudad de Panamá", en: "Panama City" } },
          { _key: "trust-assembly", emoji: "🔧", title: { es: "Ensamblaje Incluido", en: "Assembly Included" }, subtitle: { es: "En todos los muebles", en: "On all furniture" } },
          { _key: "trust-warranty", emoji: "🛡️", title: { es: "Hasta 5 Años Garantía", en: "Up to 5yr Warranty" }, subtitle: { es: "En productos seleccionados", en: "On selected products" } },
          { _key: "trust-support", emoji: "💬", title: { es: "Soporte Directo", en: "Direct Support" }, subtitle: { es: "WhatsApp 24/7", en: "WhatsApp 24/7" } },
        ],
      },
      // 3. Category Grid
      {
        _key: "categories-1",
        _type: "categoryGridSection",
        heading: { es: "Explora nuestras categorías", en: "Explore our categories" },
      },
      // 4. Featured Products
      {
        _key: "featured-1",
        _type: "featuredProductsSection",
        heading: { es: "Los más", en: "Most" },
        headingAccent: { es: "vendidos", en: "popular" },
      },
      // 5. Build Your Desk
      {
        _key: "build-1",
        _type: "buildYourDeskSection",
        heading: { es: "Armá tu escritorio", en: "Build your desk" },
        visible: true,
      },
      // 6. Testimonials
      {
        _key: "testimonials-1",
        _type: "testimonialsSection",
        heading: { es: "Lo que dicen", en: "What our" },
        headingAccent: { es: "nuestros clientes", en: "customers say" },
        subtitle: { es: "Más de 500 oficinas equipadas en Panamá", en: "500+ offices outfitted across Panama" },
        reviews: [
          {
            _key: "review-1",
            quote: {
              es: "Excelente calidad y el ensamblaje fue profesional. Mi standing desk llegó perfectamente embalado y lo instalaron en menos de una hora.",
              en: "Excellent quality and the assembly was professional. My standing desk arrived perfectly packaged and was installed in under an hour.",
            },
            author: "Carlos M.",
            role: { es: "Arquitecto", en: "Architect" },
          },
          {
            _key: "review-2",
            quote: {
              es: "Las sillas ergonómicas son increíbles. Trabajo desde casa y mi espalda ya no me molesta. Totalmente recomendado.",
              en: "The ergonomic chairs are amazing. I work from home and my back doesn't bother me anymore. Totally recommended.",
            },
            author: "Valeria R.",
            role: { es: "Diseñadora UX", en: "UX Designer" },
          },
          {
            _key: "review-3",
            quote: {
              es: "Compré el escritorio ejecutivo para nuestra oficina y quedamos encantados. Gran relación calidad-precio y el servicio al cliente es excelente.",
              en: "I bought the executive desk for our office and we were delighted. Great value for money and the customer service is excellent.",
            },
            author: "Roberto S.",
            role: { es: "Director Financiero", en: "CFO" },
          },
        ],
        stats: [
          { _key: "stat-1", value: "500+", label: { es: "Clientes", en: "Clients" } },
          { _key: "stat-2", value: "5.0", label: { es: "Google Rating", en: "Google Rating" } },
          { _key: "stat-3", value: "15K", label: { es: "Seguidores IG", en: "IG Followers" } },
          { _key: "stat-4", value: "5", label: { es: "Años en Panamá", en: "Years in Panama" } },
        ],
      },
      // 7. B2B CTA
      {
        _key: "b2b-1",
        _type: "ctaImageSection",
        label: { es: "Para Empresas", en: "For Businesses" },
        title: { es: "Equipá a Tu Equipo Para Rendir al Máximo", en: "Equip Your Team to Perform at Their Best" },
        subtitle: {
          es: "Diseñamos e instalamos espacios de trabajo ergonómicos completos para oficinas, coworkings y espacios comerciales. Descuentos por volumen, asesoría personalizada y entrega e instalación incluida.",
          en: "We design and install complete ergonomic workspaces for offices, coworkings and commercial spaces. Volume discounts, personalized consulting and white-glove delivery included.",
        },
        cta: {
          text: { es: "Solicitar Cotización", en: "Request a Quote" },
          href: "https://wa.me/50769533776?text=Hola,%20estoy%20interesado%20en%20una%20cotización%20corporativa",
        },
        stats: [
          { _key: "b2b-stat-1", value: "25%", label: { es: "más productividad promedio", en: "avg. productivity increase" } },
          { _key: "b2b-stat-2", value: "$3–6", label: { es: "retorno por cada $1 invertido", en: "return per $1 invested" } },
        ],
        theme: "dark",
        imagePosition: "right",
      },
      // 8. Blog Preview
      {
        _key: "blog-1",
        _type: "blogPreviewSection",
        heading: { es: "Guías & Blog", en: "Guides & Blog" },
        postCount: 4,
      },
      // 9. Showroom CTA
      {
        _key: "showroom-1",
        _type: "ctaImageSection",
        label: { es: "Showroom Coco del Mar", en: "Coco del Mar Showroom" },
        title: { es: "Visita nuestro showroom", en: "Visit our showroom" },
        subtitle: {
          es: "Prueba cada producto antes de comprarlo. Nuestro equipo te asesora para la combinación perfecta.",
          en: "Try before you buy. Our team advises you on the perfect combination.",
        },
        cta: { text: { es: "Agenda una visita", en: "Book a visit" }, href: "https://wa.me/50769533776" },
        theme: "light",
        imagePosition: "left",
      },
      // 10. Newsletter
      {
        _key: "newsletter-1",
        _type: "newsletterSection",
        heading: { es: "Mantente al día con", en: "Stay updated with" },
        headingAccent: { es: "Ergonómica", en: "Ergonómica" },
        subtitle: {
          es: "Recibe lanzamientos, promociones exclusivas y tips de ergonomía directamente en tu correo.",
          en: "Receive launches, exclusive promotions and ergonomics tips directly in your inbox.",
        },
        placeholder: { es: "tu@email.com", en: "your@email.com" },
        buttonText: { es: "Suscribirse", en: "Subscribe" },
      },
    ],
  })
  console.log("✅ homepage (10 sections)")

  console.log("\n✨ Seed complete!")
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
