import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export default async function ProductRedirectEN({ params }: Props) {
  const { countryCode, handle } = await params
  redirect(`/${countryCode}/en/productos/${handle}`)
}
