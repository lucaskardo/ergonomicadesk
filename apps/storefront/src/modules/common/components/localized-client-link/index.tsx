"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"
import { useLang } from "@lib/i18n/context"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code
 * and language in the url, without having to explicitly pass them as props.
 */
const LocalizedClientLink = ({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: () => void
  passHref?: true
  [x: string]: any
}) => {
  const { countryCode } = useParams()
  const lang = useLang()
  const langPrefix = lang === "en" ? "/en" : ""

  return (
    <Link href={`/${countryCode}${langPrefix}${href}`} {...props}>
      {children}
    </Link>
  )
}

export default LocalizedClientLink
