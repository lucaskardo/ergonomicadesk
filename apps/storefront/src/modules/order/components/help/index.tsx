import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = ({ lang = "es" }: { lang?: "es" | "en" }) => {
  return (
    <div className="mt-6">
      <Heading className="text-base-semi">
        {lang === "en" ? "Need help?" : "¿Necesitas ayuda?"}
      </Heading>
      <div className="text-base-regular my-2">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact">
              {lang === "en" ? "Contact" : "Contacto"}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/devoluciones">
              {lang === "en" ? "Returns & Exchanges" : "Devoluciones y cambios"}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
