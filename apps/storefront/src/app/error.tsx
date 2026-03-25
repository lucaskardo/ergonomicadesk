"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // TODO: Install @sentry/nextjs and configure with DSN for production error tracking
    console.error("Unhandled error:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h2 className="text-2xl font-bold text-ergo-950 mb-4">Algo salió mal</h2>
      <p className="text-ergo-400 text-center max-w-md mb-6">
        Ha ocurrido un error inesperado. Por favor intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-ergo-sky-dark text-white font-semibold hover:bg-ergo-sky transition-colors"
      >
        Intentar de nuevo
      </button>
    </div>
  )
}
