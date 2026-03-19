import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  handle: string
  title: string
  thumbnail: string | null
  priceCents: number | null
}

export default function ProductCard({
  handle,
  title,
  thumbnail,
  priceCents,
}: ProductCardProps) {
  const priceDisplay =
    priceCents != null ? `$${(priceCents / 100).toFixed(2)}` : null

  return (
    <Link href={`/productos/${handle}`} className="group flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-stone-100">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-stone-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path
                strokeLinecap="round"
                d="M3 9l4-4 4 4 4-4 4 4"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 flex flex-col gap-1.5">
        <h3 className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {priceDisplay != null ? (
            <>
              <span className="text-sm font-semibold text-stone-900">
                {priceDisplay}
              </span>
              <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] text-stone-500 font-medium">
                +ITBMS
              </span>
            </>
          ) : (
            <span className="text-sm text-stone-400">
              Precio no disponible
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
