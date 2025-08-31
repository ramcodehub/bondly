export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-56 bg-muted animate-pulse rounded" />
      <div className="rounded-md border p-4 space-y-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted animate-pulse rounded" />
        ))}
      </div>
    </div>
  )
}


