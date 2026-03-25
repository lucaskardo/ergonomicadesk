import { Metadata } from "next"
import { getLang } from "@lib/i18n"
import { SITE_URL, alternateUrls } from "@lib/util/routes"
import ShowroomCTA from "@modules/home/components/showroom-cta"

const SHOWROOM_PATH = "/showroom"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const lang = await getLang()
  const isEn = lang === "en"
  const baseUrl = `${SITE_URL}/${countryCode}`

  return {
    title: isEn
      ? "Showroom Panamá | Ergonómica — Coco del Mar"
      : "Showroom Panamá | Ergonómica — Coco del Mar",
    description: isEn
      ? "Visit our showroom in Coco del Mar, Panama City. Try our standing desks and ergonomic chairs before buying. Mon–Fri 12–6PM, Sat 9AM–12PM."
      : "Visítanos en nuestro showroom en Coco del Mar, Ciudad de Panamá. Prueba nuestros standing desks y sillas ergonómicas antes de comprar. Lun–Vie 12–18, Sáb 9–12.",
    alternates: {
      canonical: `${baseUrl}${SHOWROOM_PATH}`,
      languages: alternateUrls(countryCode, SHOWROOM_PATH),
    },
    openGraph: {
      title: isEn
        ? "Showroom Ergonómica — Coco del Mar, Panama City"
        : "Showroom Ergonómica — Coco del Mar, Ciudad de Panamá",
      description: isEn
        ? "Visit our showroom in Coco del Mar. Mon–Fri 12–6PM, Sat 9AM–12PM."
        : "Visítanos en Coco del Mar. Lun–Vie 12–18, Sáb 9–12.",
    },
  }
}

export default async function ShowroomPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  await params
  const lang = await getLang()

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: "Ergonómica",
    url: "https://ergonomicadesk.com",
    telephone: "+507-6953-3776",
    email: "ventas@ergonomicadesk.com",
    description:
      "Tienda de muebles ergonómicos de oficina en Panamá. Escritorios standing, sillas ergonómicas y accesorios.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Calle 79 Este 14",
      addressLocality: "Coco del Mar",
      addressRegion: "Ciudad de Panamá",
      addressCountry: "PA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 8.9936175,
      longitude: -79.499793,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "12:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "12:00",
      },
    ],
    hasMap: "https://www.google.com/maps/place/Ergonomica+Home+Office/@8.9936175,-79.499793,17z",
    sameAs: [
      "https://www.instagram.com/ergonomicadesk/",
      "https://www.facebook.com/ergonomicadesks/",
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <div className="py-10 px-4 sm:px-6">
        <div className="max-w-[1360px] mx-auto mb-8">
          <h1
            className="font-display font-bold text-ergo-950 tracking-tight"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)" }}
          >
            {lang === "en" ? "Visit Our Showroom" : "Visítanos en el Showroom"}
          </h1>
          <p className="text-ergo-400 text-[0.9rem] mt-2">
            {lang === "en"
              ? "Try our products before you buy. Personalized advice included."
              : "Prueba nuestros productos antes de comprar. Asesoría personalizada incluida."}
          </p>
        </div>
      </div>
      <ShowroomCTA lang={lang} />
    </>
  )
}
