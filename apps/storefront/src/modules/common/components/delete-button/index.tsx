import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { trackRemoveFromCart } from "@lib/tracking"

const DeleteButton = ({
  id,
  item,
  currencyCode,
  children,
  className,
}: {
  id: string
  item?: any
  currencyCode?: string
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async (lineId: string) => {
    setIsDeleting(true)
    if (item && currencyCode) {
      trackRemoveFromCart(item, currencyCode)
    }
    await deleteLineItem(lineId).catch((err) => {
      console.error("Failed to delete line item:", err)
    })
    setIsDeleting(false)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between text-small-regular",
        className
      )}
    >
      <button
        className="flex gap-x-1 text-ui-fg-subtle hover:text-ui-fg-base cursor-pointer"
        onClick={() => handleDelete(id)}
        disabled={isDeleting || isPending}
      >
        {isDeleting || isPending ? <Spinner className="animate-spin" /> : <Trash />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
