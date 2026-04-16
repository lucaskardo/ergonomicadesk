"use client"

import { HttpTypes } from "@medusajs/types"
import React from "react"
import { useLang } from "@lib/i18n/context"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const lang = useLang()
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[0.78rem] font-semibold text-ergo-800">
        {lang === "en" ? `Select ${title}` : `Selecciona ${title}`}
        {current && (
          <span className="font-normal text-ergo-400 ml-1.5">— {current}</span>
        )}
      </span>
      <div className="flex flex-wrap gap-2" data-testid={dataTestId}>
        {filteredOptions.map((v) => (
          <button
            onClick={() => updateOption(option.id, v)}
            key={v}
            className={`px-4 py-2.5 border text-[0.82rem] font-semibold transition-all duration-200 ${
              v === current
                ? "border-ergo-sky-dark text-ergo-sky-dark bg-ergo-sky-50"
                : "border-ergo-200/80 text-ergo-600 bg-white hover:border-ergo-600 hover:text-ergo-950"
            }`}
            disabled={disabled}
            data-testid="option-button"
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}

export default OptionSelect
