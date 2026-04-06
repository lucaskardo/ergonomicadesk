"use client"

import { useEffect, useRef, useState } from "react"

type Animation = "fade-up" | "fade-in" | "slide-in-left" | "slide-in-right" | "scale-in"

const TRANSFORMS: Record<Animation, string> = {
  "fade-up": "translateY(24px)",
  "fade-in": "none",
  "slide-in-left": "translateX(-32px)",
  "slide-in-right": "translateX(32px)",
  "scale-in": "scale(0.95)",
}

export default function ScrollAnimate({
  animation = "fade-up",
  delay = 0,
  duration = 700,
  className = "",
  children,
}: {
  animation?: Animation
  delay?: number
  duration?: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) {
      setInView(true)
      return
    }

    setMounted(true)

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transform = TRANSFORMS[animation]
  const shouldAnimate = mounted && !inView

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shouldAnimate ? 0 : 1,
        transform: shouldAnimate ? transform : "none",
        transition: inView
          ? `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
          : "none",
      }}
    >
      {children}
    </div>
  )
}
