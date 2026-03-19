"use client"

import { createContext, useContext } from "react"

const RegionContext = createContext<string | undefined>(undefined)

export function RegionProvider({ children }: { children: React.ReactNode }) {
  return (
    <RegionContext.Provider value={process.env.NEXT_PUBLIC_MEDUSA_REGION_ID}>
      {children}
    </RegionContext.Provider>
  )
}

export function useRegion(): string | undefined {
  return useContext(RegionContext)
}
