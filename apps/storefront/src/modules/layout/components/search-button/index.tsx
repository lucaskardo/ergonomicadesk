"use client"

import { useState } from "react"
import SearchModal from "@modules/layout/components/search-modal"
import { useLang } from "@lib/i18n/context"

const SearchButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const lang = useLang()

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-ui-fg-base transition-colors flex items-center gap-1 text-ui-fg-subtle"
        aria-label={lang === "en" ? "Search" : "Buscar"}
        data-testid="nav-search-button"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

export default SearchButton
