const SkeletonProductPreview = () => {
  return (
    <div>
      <div className="aspect-[4/5] w-full animate-shimmer rounded-lg" />
      <div className="flex justify-between mt-3 px-1 gap-2">
        <div className="w-3/5 h-4 animate-shimmer rounded-soft" />
        <div className="w-1/5 h-4 animate-shimmer rounded-soft" />
      </div>
      <div className="mt-1.5 px-1">
        <div className="w-1/4 h-3 animate-shimmer rounded-soft" />
      </div>
    </div>
  )
}

export default SkeletonProductPreview
