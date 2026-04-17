import { clx } from "@medusajs/ui"

const Divider = ({ className }: { className?: string }) => (
  <div
    className={clx("h-px w-full border-b border-ergo-200 mt-1", className)}
  />
)

export default Divider
