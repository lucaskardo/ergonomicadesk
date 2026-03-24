export type BlogPost = {
  slug: string
  title: string
  description: string
  content: string // HTML string
  tag: string
  readTime: string
  publishedAt: string
  author: string
  keywords: string[]
  image?: string
  lang: "es" | "en"
}

export const posts: BlogPost[] = [
  {
    slug: "como-elegir-standing-desk",
    title: "Cómo elegir el standing desk perfecto para ti",
    description:
      "Guía completa para elegir tu standing desk ideal. Comparamos motores, tamaños, y funcionalidades.",
    content: `
      <h2>¿Por qué un standing desk?</h2>
      <p>Estar sentado más de 8 horas al día aumenta el riesgo de problemas cardiovasculares, dolor de espalda y fatiga crónica. Un standing desk te permite alternar entre estar sentado y de pie durante el día.</p>
      <h2>Qué buscar en un standing desk</h2>
      <h3>1. Motor</h3>
      <p>Los escritorios de doble motor son más rápidos y silenciosos. Busca velocidades de al menos 38mm/s y niveles de ruido menores a 48dB.</p>
      <h3>2. Capacidad de peso</h3>
      <p>Si planeas tener dos monitores, laptop y accesorios, necesitas al menos 120kg de capacidad. Nuestros modelos soportan hasta 200kg.</p>
      <h3>3. Memorias de altura</h3>
      <p>Las memorias te permiten guardar tus alturas favoritas. 3 memorias es el estándar — una para sentado, una para de pie, y una extra.</p>
      <h3>4. Tamaño del sobre</h3>
      <p>120cm es suficiente para un monitor. 150cm para dual monitor. 180cm si necesitas espacio extra para documentos.</p>
      <h2>Nuestra recomendación</h2>
      <p>Para la mayoría de usuarios, un escritorio de doble motor con sobre de 150x75cm en melamina es la mejor relación calidad-precio.</p>
    `,
    tag: "Guía",
    readTime: "8 min",
    publishedAt: "2026-03-15",
    author: "Ergonómica",
    keywords: [
      "standing desk",
      "escritorio de pie",
      "ergonomía",
      "home office",
      "Panamá",
    ],
    lang: "es",
  },
  {
    slug: "errores-productividad-home-office",
    title: "5 errores que están matando tu productividad en el home office",
    description:
      "Descubre los errores más comunes de ergonomía que afectan tu productividad y cómo solucionarlos.",
    content: `
      <h2>Error #1: Monitor a la altura incorrecta</h2>
      <p>Tu monitor debe estar a la altura de tus ojos. Si miras hacia abajo, tu cuello sufre. Un brazo de monitor ajustable resuelve esto al instante.</p>
      <h2>Error #2: Silla sin soporte lumbar</h2>
      <p>Una silla sin soporte lumbar fuerza tu espalda baja. Invierte en una silla ergonómica con ajuste lumbar independiente.</p>
      <h2>Error #3: No alternar entre sentado y de pie</h2>
      <p>Incluso con la mejor silla, estar sentado 8 horas seguidas es dañino. Alterna cada 30-45 minutos con un standing desk.</p>
      <h2>Error #4: Iluminación inadecuada</h2>
      <p>La luz directa en la pantalla causa fatiga visual. Usa un ScreenBar que ilumine solo tu escritorio sin reflejos.</p>
      <h2>Error #5: Escritorio desordenado</h2>
      <p>El desorden visual reduce la concentración. Usa organizadores de cables y un desk pad para mantener todo limpio.</p>
    `,
    tag: "Ergonomía",
    readTime: "6 min",
    publishedAt: "2026-03-10",
    author: "Ergonómica",
    keywords: [
      "productividad",
      "home office",
      "ergonomía",
      "errores",
      "silla ergonómica",
    ],
    lang: "es",
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getAllPosts(lang?: "es" | "en"): BlogPost[] {
  if (lang) return posts.filter((p) => p.lang === lang)
  return posts
}
