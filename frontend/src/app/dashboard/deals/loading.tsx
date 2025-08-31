export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 bg-muted animate-pulse rounded" />
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-80 flex-shrink-0 space-y-2">
            <div className="h-5 w-24 bg-muted animate-pulse rounded" />
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="h-20 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}


