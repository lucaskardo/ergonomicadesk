const SkeletonProductPreview = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full bg-ergo-100 rounded-lg" />
      <div className="flex justify-between mt-3 px-1 gap-2">
        <div className="w-3/5 h-4 bg-ergo-100 rounded" />
        <div className="w-1/5 h-4 bg-ergo-100 rounded" />
      </div>
      <div className="mt-1.5 px-1">
        <div className="w-1/4 h-3 bg-ergo-100 rounded" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview
