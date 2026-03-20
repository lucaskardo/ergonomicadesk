"use client"

import { createContext, useContext } from "react"
import type { Lang } from "./index"

const LangContext = createContext<Lang>("es")

export function LangProvider({
  lang,
  children,
}: {
  lang: Lang
  children: React.ReactNode
}) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function useLang(): Lang {
  return useContext(LangContext)
}
