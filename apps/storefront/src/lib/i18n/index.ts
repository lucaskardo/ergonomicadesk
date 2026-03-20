import esTranslations from "./translations/es.json"
import enTranslations from "./translations/en.json"

export type Lang = "es" | "en"

type Translations = typeof esTranslations

export function getTranslations(lang: Lang): Translations {
  return lang === "en" ? enTranslations : esTranslations
}

export async function getLang(): Promise<Lang> {
  const { headers } = await import("next/headers")
  const h = await headers()
  const lang = h.get("x-lang")
  return lang === "en" ? "en" : "es"
}

export async function getCanonicalPath(): Promise<string> {
  const { headers } = await import("next/headers")
  const h = await headers()
  return h.get("x-canonical-path") || "/"
}
