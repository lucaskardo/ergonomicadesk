import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ countryCode: string; category: string[] }>
}

export default async function CategoryRedirect({ params }: Props) {
  const { countryCode, category } = await params
  redirect(`/${countryCode}/categorias/${category.join("/")}`)
}
