"use client"

import { useState } from "react"

type FAQItem = {
  _key: string
  question: { es?: string; en?: string }
  answer: { es?: string; en?: string }
}

export function FAQAccordion({ faqs, lang }: { faqs: FAQItem[]; lang: "es" | "en" }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col divide-y divide-ergo-100">
      {faqs.map((faq, i) => {
        const question = lang === "en" ? (faq.question.en ?? faq.question.es ?? "") : (faq.question.es ?? "")
        const answer = lang === "en" ? (faq.answer.en ?? faq.answer.es ?? "") : (faq.answer.es ?? "")
        const isOpen = openIndex === i

        return (
          <div key={faq._key}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left py-4 flex items-start justify-between gap-4 group"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-ergo-950 text-[0.88rem] leading-snug group-hover:text-ergo-sky transition-colors">
                {question}
              </span>
              <span className="flex-shrink-0 mt-0.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-ergo-400 transition-transform duration-fast ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="pb-4 text-ergo-500 text-[0.83rem] leading-relaxed pr-8">
                {answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
