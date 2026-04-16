import { NextResponse } from "next/server"
import { SITE_URL, categoryPath, collectionPath, PATHS } from "@lib/util/routes"
import { env } from "@lib/util/env"

const BACKEND_URL = env.MEDUSA_BACKEND_URL
const API_KEY = env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const COUNTRY = "pa"

export async function GET() {
  const base = `${SITE_URL}/${COUNTRY}`

  let categories: Array<{ handle: string; name: string }> = []
  try {
    const res = await fetch(
      `${BACKEND_URL}/store/product-categories?limit=100&fields=handle,name`,
      { headers: { "x-publishable-api-key": API_KEY }, next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      categories = data.product_categories || []
    }
  } catch {}

  let collections: Array<{ handle: string; title: string }> = []
  try {
    const res = await fetch(
      `${BACKEND_URL}/store/collections?limit=100&fields=handle,title`,
      { headers: { "x-publishable-api-key": API_KEY }, next: { revalidate: 3600 } }
    )
    if (res.ok) {
      const data = await res.json()
      collections = data.collections || []
    }
  } catch {}

  const lines: string[] = [
    `# Ergonómica — Muebles de Oficina Ergonómicos en Panamá`,
    ``,
    `> Tienda online de escritorios standing, sillas ergonómicas y accesorios de oficina en Panamá. Envío gratis y ensamblaje en Ciudad de Panamá para compras mayores a $100. Garantía de 1-5 años. Precios en USD. WhatsApp: +507 6953-3776.`,
    ``,
    `Ergonómica vende muebles ergonómicos de oficina para home office y oficinas corporativas en Panamá. Checkout como invitado (no requiere cuenta). Impuesto ITBMS 7% incluido al checkout.`,
    ``,
    `## Páginas principales`,
    `- [Catálogo completo](${base}${PATHS.store}): Todos los productos`,
    `- [Catálogo de categorías](${base}${PATHS.catalog})`,
    `- [Blog](${base}${PATHS.blog}): Guías y consejos de ergonomía`,
    `- [Showroom](${base}/showroom): Visítanos en Coco del Mar`,
    ``,
  ]

  if (categories.length > 0) {
    lines.push(`## Categorías`)
    for (const cat of categories) {
      lines.push(`- [${cat.name}](${base}${categoryPath(cat.handle)})`)
    }
    lines.push(``)
  }

  if (collections.length > 0) {
    lines.push(`## Colecciones`)
    for (const col of collections) {
      lines.push(`- [${col.title}](${base}${collectionPath(col.handle)})`)
    }
    lines.push(``)
  }

  lines.push(
    `## Políticas`,
    `- [Preguntas frecuentes](${base}${PATHS.faq}): Envío, garantía, ensamblaje, pagos`,
    `- [Garantía](${base}${PATHS.warranty}): Política de garantía 1-5 años según producto`,
    `- [Devoluciones](${base}${PATHS.returns}): Política de devolución de 7 días`,
    `- [Términos y condiciones](${base}${PATHS.terms}): Términos legales`,
    `- [Privacidad](${base}${PATHS.privacy}): Política de privacidad`,
    ``,
    `## Información de contacto`,
    `- WhatsApp: +507 6953-3776`,
    `- Email: ventas@ergonomicadesk.com`,
    `- Dirección: Calle 79 Este 14, Coco del Mar, Ciudad de Panamá, Panamá`,
    `- Horario: Lunes-Viernes 12:00-18:00, Sábado 9:00-12:00`,
  )

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  })
}
