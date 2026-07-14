import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatCurrency, formatNumber } from "@/utils"

interface StatCardProps {
  title: string
  value: number
  type?: "currency" | "number" | "percent"
  icon: LucideIcon
  trend?: "up" | "down"
  trendValue?: string
  colorClass?: string
}

export function StatCard({
  title,
  value,
  type = "number",
  icon: Icon,
  trend,
  trendValue,
  colorClass,
}: StatCardProps) {
  const formatted =
    type === "currency"
      ? formatCurrency(value)
      : type === "percent"
        ? `${value.toFixed(1)}%`
        : formatNumber(value)

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", colorClass)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn("rounded-lg p-2", colorClass ? "bg-white/20" : "bg-primary/10")}>
            <Icon className={cn("h-5 w-5", colorClass ? "text-white" : "text-primary")} />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{formatted}</p>
          {trend && (
            <div className="mt-1 flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={trend === "up" ? "text-emerald-500" : "text-red-500"}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
