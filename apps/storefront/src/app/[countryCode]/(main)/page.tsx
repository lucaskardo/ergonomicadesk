import { getLang } from "@lib/i18n"
import Homepage from "@modules/home/templates/homepage"
import { SITE_URL } from "@lib/util/routes"
import { buildMetadata } from "@lib/util/metadata"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  return buildMetadata({
    title: "Escritorios Standing y Sillas Ergonómicas en Panamá",
    description:
      "Tienda de muebles de oficina ergonómicos en Panamá. Escritorios eléctricos de altura ajustable, sillas ergonómicas, accesorios. Envío gratis en Ciudad de Panamá. Garantía 1-5 años.",
    countryCode,
    lang: "es",
    path: "/",
    image: `${SITE_URL}/images/hero-homepage.png`,
  })
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const lang = await getLang()
  return <Homepage countryCode={countryCode} lang={lang} />
}
