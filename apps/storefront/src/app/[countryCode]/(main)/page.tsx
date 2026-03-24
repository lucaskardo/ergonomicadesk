import { Metadata } from "next"
import { getLang } from "@lib/i18n"
import Homepage from "@modules/home/templates/homepage"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await params
  const baseUrl = `https://ergonomicadesk.com/${countryCode}`
  return {
    title: "Ergonómica | Escritorios Standing y Sillas Ergonómicas en Panamá",
    description:
      "Tienda de muebles de oficina ergonómicos en Panamá. Escritorios eléctricos de altura ajustable, sillas ergonómicas, accesorios. Envío gratis en Ciudad de Panamá. Garantía 1-5 años.",
    alternates: {
      canonical: `${baseUrl}/`,
      languages: {
        es: `${baseUrl}/`,
        en: `${baseUrl}/en/`,
        "x-default": `${baseUrl}/`,
      },
    },
    openGraph: {
      title: "Ergonómica | Muebles de Oficina Ergonómicos en Panamá",
      description:
        "Escritorios standing, sillas ergonómicas y accesorios para home office. Envío gratis en Ciudad de Panamá.",
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const lang = await getLang()
  return <Homepage countryCode={countryCode} lang={lang} />
}
