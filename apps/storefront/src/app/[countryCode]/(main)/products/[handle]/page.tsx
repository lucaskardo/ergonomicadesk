import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export default async function ProductRedirect({ params }: Props) {
  const { countryCode, handle } = await params
  redirect(`/${countryCode}/productos/${handle}`)
}
