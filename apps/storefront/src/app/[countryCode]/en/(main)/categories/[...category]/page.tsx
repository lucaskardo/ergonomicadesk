import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; category: string[] }>
}

export default async function CategoryRedirectEN({ params }: Props) {
  const { countryCode, category } = await params
  redirect(`/${countryCode}/en/categorias/${category.join("/")}`)
}
