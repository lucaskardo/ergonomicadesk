import { getLang } from "@lib/i18n"
import Homepage from "@modules/home/templates/homepage"

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const lang = await getLang()
  return <Homepage countryCode={countryCode} lang={lang} />
}
