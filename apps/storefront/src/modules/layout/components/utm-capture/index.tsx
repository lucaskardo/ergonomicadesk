"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { captureUtmParams } from "@lib/tracking/utm"

export default function UtmCapture() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    captureUtmParams()
  }, [pathname, searchParams])

  return null
}
