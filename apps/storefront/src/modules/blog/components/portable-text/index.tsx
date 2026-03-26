"use client"

import { PortableText, type PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"

type PortableTextValue = Parameters<typeof PortableText>[0]["value"]

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const imageUrl = urlFor(value).width(720).url()
      return (
        <figure className="my-8">
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-base">
            <Image
              src={imageUrl}
              alt={value.alt || ""}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-[0.78rem] text-ergo-400 mt-2 text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href ?? "#"
      const isExternal = href.startsWith("http")
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-ergo-sky hover:underline"
        >
          {children}
        </a>
      )
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-display font-bold text-ergo-950 mt-8 mb-3 text-[1.3rem] leading-snug">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display font-bold text-ergo-950 mt-6 mb-2 text-[1.1rem] leading-snug">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-semibold text-ergo-950 mt-4 mb-1 text-[1rem]">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-ergo-600 leading-relaxed text-[0.93rem] my-3">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside my-3 space-y-1 text-[0.93rem] text-ergo-600">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside my-3 space-y-1 text-[0.93rem] text-ergo-600">
        {children}
      </ol>
    ),
  },
}

export default function BlogPortableText({ value }: { value: PortableTextValue }) {
  return <PortableText value={value} components={components} />
}
