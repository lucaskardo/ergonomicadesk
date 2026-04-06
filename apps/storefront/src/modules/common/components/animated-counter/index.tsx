"use client"

import { useEffect, useRef, useState } from "react"

function parseValue(value: string): { target: number; suffix: string; decimals: number } {
  const match = value.match(/^([\d.]+)(.*)$/)
  if (!match) return { target: 0, suffix: value, decimals: 0 }

  const numStr = match[1]
  const suffix = match[2]
  const target = parseFloat(numStr)
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0

  return { target, suffix, decimals }
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export default function AnimatedCounter({
  value,
  duration = 1500,
  className = "",
}: {
  value: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(value)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) return

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          observer.unobserve(el)
          animate()
        }
      },
      { threshold: 0.15 }
    )

    const { target, suffix, decimals } = parseValue(value)

    function animate() {
      const start = performance.now()

      function frame(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeOutExpo(progress)
        const current = easedProgress * target

        if (decimals > 0) {
          setDisplayValue(current.toFixed(decimals) + suffix)
        } else {
          setDisplayValue(Math.round(current) + suffix)
        }

        if (progress < 1) {
          requestAnimationFrame(frame)
        }
      }

      setDisplayValue(decimals > 0 ? "0." + "0".repeat(decimals) + suffix : "0" + suffix)
      requestAnimationFrame(frame)
    }

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  )
}
