"use client"

import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  const isPrimary = variant === "primary" || variant === null
  const baseClasses = "w-full inline-flex items-center justify-center gap-2 font-semibold text-[0.92rem] py-4 px-6 transition-colors disabled:cursor-not-allowed"
  const variantClasses = isPrimary
    ? "bg-ergo-sky-dark hover:bg-ergo-sky disabled:bg-ergo-200 disabled:text-ergo-400 text-white"
    : "bg-white border border-ergo-200 text-ergo-950 hover:border-ergo-600"

  return (
    <button
      type="submit"
      className={`${baseClasses} ${variantClasses} ${className || ""}`}
      disabled={pending}
      data-testid={dataTestId}
    >
      {pending ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  )
}
