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
            <a href="https://wa.me/50769533776" target="_blank" rel="noopener noreferrer">
              {lang === "en" ? "Contact via WhatsApp" : "Contacto por WhatsApp"}
            </a>
          </li>
          <li>
            <LocalizedClientLink href="/returns">
              {lang === "en" ? "Returns & Exchanges" : "Devoluciones y cambios"}
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
