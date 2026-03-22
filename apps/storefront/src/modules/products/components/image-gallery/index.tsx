"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const filteredImages = images.filter((img) => Boolean(img.url))

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevDisabled(!emblaApi.canScrollPrev())
    setNextDisabled(!emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect).on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect).off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  if (!filteredImages.length) return null

  // Single image
  if (filteredImages.length === 1) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ergo-100">
        <Image
          src={filteredImages[0].url}
          priority
          className="object-cover"
          alt="Product image 1"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {/* Vertical thumbnail strip — desktop left side */}
      <div className="hidden small:flex flex-col gap-2 w-[72px] flex-shrink-0">
        {filteredImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => scrollTo(index)}
            aria-label={`View image ${index + 1}`}
            className={`relative w-[72px] h-[72px] overflow-hidden flex-shrink-0 transition-all border-2 ${
              index === selectedIndex
                ? "border-ergo-sky-dark opacity-100"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes="72px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image + carousel */}
      <div className="flex-1">
        {/* Main carousel */}
        <div className="relative overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-[3/4] w-full flex-shrink-0 overflow-hidden bg-ergo-100"
              >
                <Image
                  src={image.url}
                  priority={index <= 1}
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                disabled={prevDisabled}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/85 hover:bg-white flex items-center justify-center transition-all disabled:opacity-30"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                disabled={nextDisabled}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/85 hover:bg-white flex items-center justify-center transition-all disabled:opacity-30"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Mobile dots */}
          {filteredImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 small:hidden">
              {filteredImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 transition-all ${
                    i === selectedIndex
                      ? "bg-white w-4"
                      : "bg-white/60 w-1.5 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile horizontal thumbnail strip */}
        {filteredImages.length > 1 && (
          <div className="flex small:hidden gap-2 mt-3 overflow-x-auto">
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => scrollTo(index)}
                aria-label={`View image ${index + 1}`}
                className={`relative w-14 h-14 flex-shrink-0 overflow-hidden border-2 transition-all ${
                  index === selectedIndex
                    ? "border-ergo-sky-dark opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
