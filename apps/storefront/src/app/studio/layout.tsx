import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: { index: false },
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
