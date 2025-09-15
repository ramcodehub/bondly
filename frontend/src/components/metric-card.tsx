import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: keyof typeof Icons
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend = "neutral",
  className,
  ...props
}: MetricCardProps) {
  const Icon = Icons[icon] || Icons.layoutDashboard
  const TrendIcon = trend === "up" ? Icons.barChart3 : trend === "down" ? Icons.barChart3 : Icons.moreHorizontal
  
  return (
    <div
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-primary/10 p-2">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend !== "neutral" && (
            <div
              className={cn(
                "flex items-center rounded-full px-2 py-1 text-xs",
                trend === "up"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              )}
            >
              <TrendIcon className="mr-1 h-3 w-3" />
              {trend === "up" ? "↑" : "↓"}
            </div>
          )}
        </div>
        <p
          className={cn(
            "mt-4 text-sm",
            trend === "up"
              ? "text-green-600 dark:text-green-400"
              : trend === "down"
              ? "text-red-600 dark:text-red-400"
              : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  )
}