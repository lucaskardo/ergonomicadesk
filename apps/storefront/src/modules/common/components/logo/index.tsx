export default function Logo({
  size = 32,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 120"
      fill="none"
      className={className}
    >
      <circle cx="42" cy="18" r="16" stroke="#5BC0EB" strokeWidth="10" fill="none" />
      <path d="M10 42h50v12H24v14h32v12H24v14h36v12H10V42z" fill="currentColor" />
    </svg>
  )
}
