"use client"

import { useEffect, useState } from "react"

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? Math.min(window.scrollY / total, 1) : 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 h-[2.5px] z-[9999] pointer-events-none bg-gradient-to-r from-ergo-sky to-ergo-sky-dark"
      style={{
        width: "100%",
        transformOrigin: "left",
        transform: `scaleX(${progress})`,
        transition: "transform 0.08s linear",
      }}
    />
  )
}
