import { getBaseURL } from "@lib/util/env"
import { GoogleTagManager } from "@next/third-parties/google"
import { Metadata } from "next"
import { headers } from "next/headers"
import { SanityLive } from "@/sanity/lib/live"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const headersList = await headers()
  const lang = headersList.get("x-lang") || "es"

  return (
    <html lang={lang} data-mode="light">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&f[]=cabinet-grotesk@500,700,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="relative">{props.children}</main>
        <SanityLive />
      </body>
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
    </html>
  )
}
